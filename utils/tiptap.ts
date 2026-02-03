import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { JSONContent } from "@tiptap/core";

export function generateWaiverHTML(content: JSONContent) {
	return generateHTML(content, [
		StarterKit,
		Underline,
		Link,
		TextAlign.configure({ types: ["heading", "paragraph"] }),
		Highlight.configure({ multicolor: true }),
		Subscript,
		Superscript,
		Color,
		TextStyle,
	]);
}
