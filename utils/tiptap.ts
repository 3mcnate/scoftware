import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { JSONContent } from "@tiptap/core";

export function generateWaiverHTML(content: JSONContent) {
	return generateHTML(content, [
		StarterKit,
	]);
}
