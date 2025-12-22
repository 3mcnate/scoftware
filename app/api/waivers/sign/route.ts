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
	updateTicketWaiverFilepath,
} from "@/data/waivers/update-ticket-waiver";
import { createWaiverEvent } from "@/data/waivers/create-waiver-event";
import { isAdult } from "@/utils/date-time";
import { generateWaiverHTML } from "@/utils/tiptap";
import { JSONContent } from "@tiptap/core";
import {
	ACKNOWLEDGE_AND_ACCEPT_TEXT,
	ELECTRONIC_SIGNATURE_CONSENT_TEXT,
} from "@/components/waiver/waiver-checkbox-text";
import { getProfileName } from "@/data/profiles/get-profile";
import { userHasTicket } from "@/data/ticketes/user-has-ticket";
import { sanitizeObjectName } from "@/utils/storage";
import { getPublishedTrip } from "@/data/trips/get-published-trip";

const signWaiverSchema = z.object({
	fullLegalName: z.string().min(1, "Full legal name is required"),
	birthday: z.iso.date("Invalid birthday format").refine(
		(birthday) => isAdult(birthday),
		"Must be over 18 years old to sign waiver",
	),
	tripId: z.uuid("Invalid trip ID"),
	waiverId: z.uuid("Invalid waiver ID"),
});

interface PdfMetadata {
	title: string;
	profileName: string;
	email: string;
	userId: string;
	signedAt: string;
	ipAddress: string;
	userAgent: string;
	signatureId: string;
	fullLegalName: string;
	birthday: string;
}

async function generateWaiverPdf(
	htmlContent: string,
	metadata: PdfMetadata,
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

		const headerHtml = `
			<div style="margin-bottom: 32px; padding: 16px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 6px;">
				<h3 style="margin-bottom: 12px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #ccc; padding-bottom: 8px;">Document Signature Information</h3>
				<div style="font-size: 13px;">
					<div><span style="font-weight: 500;">Signed by:</span> ${metadata.profileName}</div>
					<div><span style="font-weight: 500;">Email:</span> ${metadata.email}</div>
					<div><span style="font-weight: 500;">User ID:</span> ${metadata.userId}</div>
					<div><span style="font-weight: 500;">Signed at:</span> ${metadata.signedAt}</div>
					<div><span style="font-weight: 500;">IP Address:</span> ${metadata.ipAddress}</div>
					<div style="grid-column: 1 / -1;"><span style="font-weight: 500;">Browser:</span> ${metadata.userAgent}</div>
					<div style="grid-column: 1 / -1;"><span style="font-weight: 500;">Signature ID:</span> ${metadata.signatureId}</div>
				</div>
			</div>
		`;

		const signatureHtml = `
			<div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #333;">
				<h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 600;">Acknowledgments</h3>
				<div style="margin-bottom: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
					<div style="display: flex; align-items: flex-start; gap: 8px;">
						<span style="font-size: 16px;">&#9745;</span>
						<span style="font-size: 14px; line-height: 1.5;">${ELECTRONIC_SIGNATURE_CONSENT_TEXT.trim()}</span>
					</div>
				</div>
				<div style="margin-bottom: 16px; padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
					<div style="display: flex; align-items: flex-start; gap: 8px;">
						<span style="font-size: 16px;">&#9745;</span>
						<span style="font-size: 14px; line-height: 1.5;">${ACKNOWLEDGE_AND_ACCEPT_TEXT.trim()}</span>
					</div>
				</div>
				<h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 600;">Signature</h3>
				<div style="margin-bottom: 12px;">
					<span style="font-weight: 500;">Full Legal Name:</span> ${metadata.fullLegalName}
				</div>
				<div style="margin-bottom: 12px;">
					<span style="font-weight: 500;">Date of Birth:</span> ${metadata.birthday}
				</div>
				<div style="margin-bottom: 12px;">
					<span style="font-weight: 500;">Signed At:</span> ${
			new Date(metadata.signedAt).toLocaleString("en-US", {
				timeZone: "America/Los_Angeles",
			})
		} Pacific Time
				</div>
				<div style="margin-top: 24px; font-style: italic; color: #666;">
					This document was electronically signed and is legally binding. Please save this document for your records.
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
					${headerHtml}
					<h1 style="margin-bottom: 24px; font-size: 24px; font-weight: 700;">${metadata.title}</h1>
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
	const signedAt = new Date().toISOString();

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

	const [waiver, hasTicket, publishedTrip, profileName] = await Promise.all([
		getTripWaiver(waiverId),
		userHasTicket(user.id, tripId),
		getPublishedTrip(tripId),
		getProfileName(user.id),
	]);

	if (!publishedTrip) {
		return NextResponse.json({ error: "Trip not found" }, { status: 404 });
	}

	if (!waiver) {
		return NextResponse.json({ error: "Waiver not found" }, { status: 404 });
	}

	if (waiver.trip_id !== tripId) {
		return NextResponse.json({ error: "Waiver does not belong to this trip" }, {
			status: 400,
		});
	}

	if (!hasTicket) {
		return NextResponse.json({ error: "No ticket found for this trip" }, {
			status: 404,
		});
	}

	if (!profileName) {
		return NextResponse.json({ error: "Profile not found" }, { status: 404 });
	}

	const isDriverWaiver = waiver.type === "driver";
	const ipAddress = request.headers.get("x-forwarded-for") ||
		request.headers.get("x-real-ip") || "unknown";
	const userAgent = request.headers.get("user-agent") || "unknown";
	const documentId = crypto.randomUUID().slice(-11);

	const filename = sanitizeObjectName(
		`WAIVER-${waiver.type}-${profileName}-${publishedTrip.name}-${documentId}`,
	);
	const filepath = `${user.id}/${filename}`.slice(0, 1024);

	const waiverEvent = await createWaiverEvent({
		event: "user_signed",
		user_id: user.id,
		trip_id: tripId,
		ip_address: ipAddress,
		user_agent: userAgent,
		file_path: filepath,
		created_at: signedAt
	});

	const waiverHtml = generateWaiverHTML(waiver.content as JSONContent);
	const pdfBuffer = await generateWaiverPdf(waiverHtml, {
		title: waiver.title,
		profileName,
		email: user.email ?? "unknown",
		userId: user.id,
		signedAt,
		ipAddress,
		userAgent,
		signatureId: waiverEvent.id,
		fullLegalName,
		birthday,
	});

	const serviceClient = await createServiceRoleClient();
	const { error: uploadError } = await serviceClient.storage
		.from("waivers")
		.upload(filepath, pdfBuffer, {
			contentType: "application/pdf",
			upsert: false,
		});

	if (uploadError) {
		console.error("Failed to upload waiver PDF:", uploadError);
		return NextResponse.json({ error: "Failed to save waiver document" }, {
			status: 500,
		});
	}

	await updateTicketWaiverFilepath(user.id, tripId, filepath, isDriverWaiver);

	return NextResponse.json({
		success: true,
		filepath,
	});
}
