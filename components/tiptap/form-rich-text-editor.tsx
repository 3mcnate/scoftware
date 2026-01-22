"use client";

import { useEffect } from "react";
import "./tiptap.css";
import { cn } from "@/lib/utils";
import { ImageExtension } from "@/components/tiptap/extensions/image";
import { ImagePlaceholder } from "@/components/tiptap/extensions/image-placeholder";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { FormEditorToolbar } from "@/components/tiptap/toolbars/form-editor-toolbar";
import { FloatingToolbar } from "@/components/tiptap/extensions/floating-toolbar";
import {
  uploadTripPicture,
  getTripPictureUrl,
} from "@/data/client/storage/trip-pictures";
import type { ImageUploadFn } from "@/hooks/use-image-upload";

interface CreateExtensionsOptions {
  placeholder?: string;
  uploadFn?: ImageUploadFn;
}

const createExtensions = ({ placeholder, uploadFn }: CreateExtensionsOptions) => [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Placeholder.configure({
    emptyNodeClass: "is-editor-empty",
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case "heading":
          return `Heading ${node.attrs.level}`;
        default:
          return placeholder ?? "Start writing...";
      }
    },
    includeChildren: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-primary underline underline-offset-4 hover:text-primary/80",
    },
  }),
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  ImageExtension,
  ImagePlaceholder.configure({
    uploadFn,
  }),
  Typography,
];

export interface FormRichTextEditorProps {
  /** Current HTML content value */
  value?: string;
  /** Called when content changes with HTML string */
  onChange?: (html: string) => void;
  /** Called when editor loses focus */
  onBlur?: () => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Additional class names for the container */
  className?: string;
  /** Additional class names for the editor content area */
  editorClassName?: string;
  /** Minimum height for the editor */
  minHeight?: string;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Whether to show the floating toolbar on text selection (desktop) */
  showFloatingToolbar?: boolean;
  /** Trip ID for uploading images to the trip_pictures storage bucket */
  tripId?: string;
}

/**
 * A rich text editor component designed for use in forms.
 * Supports text formatting (bold, italic, underline), headings, colors, links, and images.
 * Outputs HTML content suitable for blog-style rendering.
 *
 * @example
 * // With react-hook-form
 * <Controller
 *   name="content"
 *   control={control}
 *   render={({ field }) => (
 *     <FormRichTextEditor
 *       value={field.value}
 *       onChange={field.onChange}
 *       onBlur={field.onBlur}
 *       placeholder="Write your blog post..."
 *     />
 *   )}
 * />
 */
export function FormRichTextEditor({
  value = "",
  onChange,
  onBlur,
  placeholder,
  className,
  editorClassName,
  minHeight = "300px",
  disabled = false,
  showFloatingToolbar = true,
  tripId,
}: FormRichTextEditorProps) {
  // Create upload function if tripId is provided
  const uploadFn: ImageUploadFn | undefined = tripId
    ? async (file: File) => {
        const path = await uploadTripPicture(tripId, file);
        return getTripPictureUrl(path);
      }
    : undefined;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createExtensions({ placeholder, uploadFn }) as Extension[],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg max-w-full focus:outline-none p-4 lg:p-0 [&_p]:text-sm",
          disabled && "opacity-50 cursor-not-allowed"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md border bg-background",
        disabled && "pointer-events-none",
        className
      )}
    >
      <FormEditorToolbar editor={editor} disabled={disabled} />
      {showFloatingToolbar && <FloatingToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className={cn(
          "w-full cursor-text overflow-y-auto",
          editorClassName
        )}
        style={{ minHeight }}
      />
    </div>
  );
}

/**
 * Read-only renderer for displaying rich text content created by the editor.
 * Use this component to render blog posts or other content.
 *
 * @example
 * <RichTextContent content={post.content} className="my-article" />
 */
export function RichTextContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-sm sm:prose lg:prose-lg max-w-full",
        // Apply tiptap styles
        "[&_h1]:scroll-m-20 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight",
        "[&_h2]:scroll-m-20 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:scroll-m-20 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight",
        "[&_h4]:scroll-m-20 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:tracking-tight",
        "[&_p]:leading-7 [&_p]:mt-4",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
        "[&_ul]:ml-6 [&_ul]:list-disc [&_ol]:ml-6 [&_ol]:list-decimal",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_img]:rounded-md [&_img]:my-6",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
