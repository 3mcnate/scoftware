import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import { JSONContent } from "@tiptap/core";

export function generateWaiverHTML(content: JSONContent) {
	return generateHTML(content, [
		StarterKit,
		Underline,
		LinkExtension.configure({ openOnClick: false }),
	]);
}
