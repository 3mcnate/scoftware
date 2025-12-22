import Link from "next/link";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import { z } from "zod/v4";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { JSONContent } from "@tiptap/core";
import { WaiverSignatureForm } from "../../../../../../components/waiver/waiver-signature-form";
import { getTripWaiverByTripAndType } from "@/data/waivers/get-trip-waiver";
import { createServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const waiverTypeSchema = z
  .enum(["participant", "driver"])
  .default("participant");

interface WaiverPageProps {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function WaiverPage({
  params,
  searchParams,
}: WaiverPageProps) {
  const { tripId } = await params;
  const { type } = await searchParams;

  const parsedType = waiverTypeSchema.safeParse(type);

  if (!parsedType.success) {
    return (
      <div className="w-full text-center">
        <p>
          Error: Invalid waiver type. Must specify type=participant or
          type=driver.
        </p>
      </div>
    );
  }

  const waiverType = parsedType.data;
  const supabase = await createServerClient();

  const [
    {
      data: { user },
    },
    waiver,
  ] = await Promise.all([
    supabase.auth.getUser(),
    getTripWaiverByTripAndType(tripId, waiverType),
  ]);

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!waiver) {
    return (
      <div className="w-full text-center">
        <p>Error - couldn&apos;t get waiver, please contact the guides</p>
      </div>
    );
  }

  const waiverHtml = generateHTML(waiver.content as JSONContent, [
    StarterKit,
    Underline,
    LinkExtension.configure({ openOnClick: false }),
  ]);

  return (
    <div className="max-w-3xl space-y-6 mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/participant/trips">Trips</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Waiver</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{waiver.title}</h1>
      </div>

      <div
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: waiverHtml }}
      />

      <WaiverSignatureForm tripId={tripId} waiverId={waiver.id} />
    </div>
  );
}
