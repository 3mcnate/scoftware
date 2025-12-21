import Link from "next/link"
import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import LinkExtension from "@tiptap/extension-link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { JSONContent } from "@tiptap/core"
import { WaiverSignatureForm } from "../../../../../../components/waiver/waiver-signature-form"

const tiptapContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Assumption of Risk" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I understand and acknowledge that outdoor activities, including but not limited to hiking, camping, and wilderness exploration, involve ",
        },
        {
          type: "text",
          text: "inherent risks",
          marks: [{ type: "bold" }],
        },
        {
          type: "text",
          text: ". These risks may include, but are not limited to: adverse weather conditions, difficult terrain, wildlife encounters, physical exertion, and potential equipment failure. ",
        },
        {
          type: "text",
          text: "I voluntarily assume all risks",
          marks: [{ type: "bold" }, { type: "underline" }],
        },
        {
          type: "text",
          text: " associated with participating in this trip.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Release of Liability" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "In consideration of being permitted to participate in this trip, I hereby ",
        },
        {
          type: "text",
          text: "release, waive, discharge, and covenant not to sue",
          marks: [{ type: "bold" }],
        },
        {
          type: "text",
          text: " the trip organizers, leaders, volunteers, and affiliated organizations from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury that may be sustained by me during my participation.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Medical Authorization" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I authorize trip leaders and medical personnel to obtain or provide ",
        },
        {
          type: "text",
          text: "emergency medical care",
          marks: [{ type: "italic" }],
        },
        {
          type: "text",
          text: " for me if I am unable to make decisions for myself. I understand that I am responsible for any costs associated with such medical care. I confirm that I have disclosed all relevant medical conditions, allergies, and medications in my ",
        },
        {
          type: "text",
          text: "participant profile",
          marks: [
            {
              type: "link",
              attrs: {
                href: "/participant/profile",
                target: "_self",
              },
            },
          ],
        },
        {
          type: "text",
          text: ".",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Code of Conduct Agreement" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I agree to follow all instructions given by trip leaders, respect fellow participants and the natural environment, ",
        },
        {
          type: "text",
          text: "refrain from the use of alcohol or illegal substances",
          marks: [{ type: "underline" }],
        },
        {
          type: "text",
          text: " during the trip, and maintain responsible behavior at all times. I understand that violation of these guidelines may result in ",
        },
        {
          type: "text",
          text: "removal from the trip without refund",
          marks: [{ type: "bold" }],
        },
        {
          type: "text",
          text: ".",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Photo and Media Release" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "I grant permission to use photographs, videos, or other media taken during this trip for promotional, educational, or documentation purposes. I understand that my image may be used in social media, websites, newsletters, or other marketing materials without compensation. For questions about our media policy, please review our ",
        },
        {
          type: "text",
          text: "privacy policy",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://example.com/privacy",
                target: "_blank",
              },
            },
          ],
        },
        {
          type: "text",
          text: ".",
        },
      ],
    },
  ],
}

interface WaiverPageProps {
  params: Promise<{ tripId: string }>
}
// TODO: query params for driver/participant waiver
export default async function WaiverPage({ params }: WaiverPageProps) {
  const { tripId } = await params

  const waiverHtml = generateHTML(tiptapContent, [
    StarterKit,
    Underline,
    LinkExtension.configure({ openOnClick: false }),
  ])

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
        <h1 className="text-2xl font-bold text-foreground">Participant Waiver</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: waiverHtml }}
          />
        </CardContent>
      </Card>

      <WaiverSignatureForm tripId={tripId} />
    </div>
  )
}
