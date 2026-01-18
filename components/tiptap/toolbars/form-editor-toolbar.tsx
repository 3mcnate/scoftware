"use client";

import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToolbarProvider } from "./toolbar-provider";
import { Editor } from "@tiptap/core";
import { HeadingsToolbar } from "./headings";
import { BoldToolbar } from "./bold";
import { ItalicToolbar } from "./italic";
import { UnderlineToolbar } from "./underline";
import { LinkToolbar } from "./link";
import { BulletListToolbar } from "./bullet-list";
import { OrderedListToolbar } from "./ordered-list";
import { AlignmentTooolbar } from "./alignment";
import { ImagePlaceholderToolbar } from "./image-placeholder-toolbar";
import { ColorHighlightToolbar } from "./color-and-highlight";
import { cn } from "@/lib/utils";

interface FormEditorToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

/**
 * A simplified toolbar for form-based rich text editing.
 * Includes essential formatting: headings, bold, italic, underline, colors, links, lists, alignment, and images.
 */
export function FormEditorToolbar({ editor, disabled }: FormEditorToolbarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-20 w-full border-b bg-muted/50",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <ToolbarProvider editor={editor}>
        <TooltipProvider>
          <ScrollArea className="h-fit py-1">
            <div className="flex items-center gap-0.5 px-2">
              {/* Text Structure */}
              <HeadingsToolbar />
              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Basic Formatting */}
              <BoldToolbar />
              <ItalicToolbar />
              <UnderlineToolbar />
              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Colors */}
              <ColorHighlightToolbar />
              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Link */}
              <LinkToolbar />
              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Lists */}
              <BulletListToolbar />
              <OrderedListToolbar />
              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Alignment */}
              <AlignmentTooolbar />
              <Separator orientation="vertical" className="mx-1 h-6" />

              {/* Image */}
              <ImagePlaceholderToolbar />
            </div>
            <ScrollBar className="hidden" orientation="horizontal" />
          </ScrollArea>
        </TooltipProvider>
      </ToolbarProvider>
    </div>
  );
}
