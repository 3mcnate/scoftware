import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import {
	createServerClient,
	createServiceRoleClient,
} from "@/utils/supabase/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { getTripWaiver } from "@/data/waivers/get-trip-waiver";
import {
	getTicketByUserAndTrip,
	updateTicketWaiverFilepath,
} from "@/data/waivers/update-ticket-waiver";
import { createWaiverEvent } from "@/data/waivers/create-waiver-event";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import { isAdult } from "@/utils/date-time";

const signWaiverSchema = z.object({
	fullLegalName: z.string().min(1, "Full legal name is required"),
	birthday: z.iso.date("Invalid birthday format").refine(
		(birthday) => isAdult(birthday),
		"Must be over 18 years old to sign waiver",
	),
	tripId: z.uuid("Invalid trip ID"),
	waiverId: z.uuid("Invalid waiver ID"),
});

async function generateWaiverPdf(
	htmlContent: string,
	fullLegalName: string,
	birthday: string,
	signedAt: string,
): Promise<Buffer> {
	const isLocal = process.env.NEXT_PUBLIC_ENV === "development";

	let browser;

	if (isLocal) {
		browser = await puppeteer.launch({
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
			headless: true,
			executablePath: process.env.CHROME_EXECUTABLE_PATH ||
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
		});
	} else {
		browser = await puppeteer.launch({
			args: chromium.args,
			executablePath: await chromium.executablePath(),
			headless: true,
		});
	}

	try {
		const page = await browser.newPage();

		const signatureHtml = `
			<div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #333;">
				<h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 600;">Signature</h3>
				<div style="margin-bottom: 12px;">
					<span style="font-weight: 500;">Full Legal Name:</span> ${fullLegalName}
				</div>
				<div style="margin-bottom: 12px;">
					<span style="font-weight: 500;">Date of Birth:</span> ${birthday}
				</div>
				<div style="margin-bottom: 12px;">
					<span style="font-weight: 500;">Signed At:</span> ${signedAt}
				</div>
				<div style="margin-top: 24px; font-style: italic; color: #666;">
					This document was electronically signed and is legally binding.
				</div>
			</div>
		`;

		const fullHtml = `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="UTF-8">
					<style>
						body {
							font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
							line-height: 1.6;
							padding: 40px;
							max-width: 800px;
							margin: 0 auto;
						}
						h1, h2, h3 {
							color: #333;
						}
						p {
							margin-bottom: 1em;
						}
						ul, ol {
							margin-bottom: 1em;
							padding-left: 2em;
						}
					</style>
				</head>
				<body>
					${htmlContent}
					${signatureHtml}
				</body>
			</html>
		`;

		await page.setContent(fullHtml, { waitUntil: "networkidle0" });

		const pdfBuffer = await page.pdf({
			format: "A4",
			margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
			printBackground: true,
		});

		return Buffer.from(pdfBuffer);
	} finally {
		await browser.close();
	}
}

export async function POST(request: NextRequest) {
	const supabase = await createServerClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const parseResult = signWaiverSchema.safeParse(body);

	if (!parseResult.success) {
		return NextResponse.json(
			{ error: "Invalid request", details: parseResult.error.issues },
			{ status: 400 },
		);
	}

	const { fullLegalName, birthday, tripId, waiverId } = parseResult.data;

	const waiver = await getTripWaiver(waiverId);
	if (!waiver) {
		return NextResponse.json({ error: "Waiver not found" }, { status: 404 });
	}

	if (waiver.trip_id !== tripId) {
		return NextResponse.json({ error: "Waiver does not belong to this trip" }, {
			status: 400,
		});
	}

	const ticket = await getTicketByUserAndTrip(user.id, tripId);
	if (!ticket) {
		return NextResponse.json({ error: "No ticket found for this trip" }, {
			status: 404,
		});
	}

	const isDriverWaiver = waiver.type === "driver";

	const signedAt = new Date().toISOString();

	const waiverHtml = generateHTML(waiver.content as JSONContent, [
		StarterKit,
		Underline,
		LinkExtension.configure({ openOnClick: false }),
	]);
	const pdfBuffer = await generateWaiverPdf(
		waiverHtml,
		fullLegalName,
		birthday,
		signedAt,
	);

	const documentId = crypto.randomUUID();
	const filepath = `${user.id}/${documentId}`;

	const serviceClient = await createServiceRoleClient();
	const { error: uploadError } = await serviceClient.storage
		.from("waivers")
		.upload(filepath, pdfBuffer, {
			contentType: "application/pdf",
			upsert: false,
		});

	if (uploadError) {
		console.error("Failed to upload waiver PDF:", uploadError);
		return NextResponse.json({ error: "Failed to upload waiver document" }, {
			status: 500,
		});
	}

	const ipAddress = request.headers.get("x-forwarded-for") ||
		request.headers.get("x-real-ip") || "unknown";
	const userAgent = request.headers.get("user-agent") || "unknown";

	await Promise.all([
		updateTicketWaiverFilepath(user.id, tripId, filepath, isDriverWaiver),
		createWaiverEvent({
			event: "user_signed",
			user_id: user.id,
			trip_id: tripId,
			ip_address: ipAddress,
			user_agent: userAgent,
			file_path: filepath,
		}),
	]);

	return NextResponse.json({
		success: true,
		filepath,
	});
}
