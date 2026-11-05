"use client";

import { blogExtensions } from "@/lib/blog/extensions";
import { cn } from "@/lib/cn";
import type { BlogContent } from "@/types";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";
import { useState, type ReactNode } from "react";

export const EMPTY_DOC: BlogContent = { type: "doc", content: [{ type: "paragraph" }] };

const field =
  "h-10 min-w-0 flex-1 rounded-lg border border-ink/25 bg-white px-3 text-sm outline-none transition focus:border-green focus:ring-1 focus:ring-green xl1:h-11 xl1:text-base";
const smallBtn =
  "h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors xl1:h-11 xl1:text-base";

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the text selection inside the editor while a toolbar button is pressed.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-35 xl1:size-10",
        active ? "bg-green text-white" : "text-ink hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}

const Divider = () => <span aria-hidden className="mx-1 h-5 w-px bg-line" />;

/** Adds https:// to bare domains. Leaves mailto:, tel: and full URLs alone. */
function normalizeHref(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return null; // javascript:, data:, etc.
  return `https://${v}`;
}

function Toolbar({ editor }: { editor: Editor }) {
  const [panel, setPanel] = useState<"link" | "image" | null>(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [panelError, setPanelError] = useState<string | null>(null);

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const run = () => editor.chain().focus();

  function openPanel(kind: "link" | "image") {
    setPanelError(null);
    setAlt("");
    setUrl(kind === "link" ? ((editor.getAttributes("link").href as string | undefined) ?? "") : "");
    setPanel(kind);
  }

  function closePanel() {
    setPanel(null);
    setPanelError(null);
    editor.chain().focus().run();
  }

  function applyPanel() {
    if (panel === "link") {
      const href = normalizeHref(url);
      if (!href) return setPanelError("Enter a valid web address.");
      run().extendMarkRange("link").setLink({ href }).run();
    } else if (panel === "image") {
      const src = url.trim();
      let ok = false;
      try {
        ok = new URL(src).protocol === "https:";
      } catch {
        ok = false;
      }
      if (!ok) return setPanelError("Enter the full image URL, starting with https://");
      run().setImage({ src, alt: alt.trim() }).run();
    }
    closePanel();
  }

  return (
    <div className="sticky top-0 z-10 rounded-t-lg border-b border-line bg-white">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 xl1:p-2">
        <ToolButton label="Heading 2" active={s.h2} onClick={() => run().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Heading 3" active={s.h3} onClick={() => run().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <Divider />
        <ToolButton label="Bold" active={s.bold} onClick={() => run().toggleBold().run()}>
          <Bold className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Italic" active={s.italic} onClick={() => run().toggleItalic().run()}>
          <Italic className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Underline" active={s.underline} onClick={() => run().toggleUnderline().run()}>
          <Underline className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Strikethrough" active={s.strike} onClick={() => run().toggleStrike().run()}>
          <Strikethrough className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Inline code" active={s.code} onClick={() => run().toggleCode().run()}>
          <Code className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <Divider />
        <ToolButton label="Bulleted list" active={s.bullet} onClick={() => run().toggleBulletList().run()}>
          <List className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Numbered list" active={s.ordered} onClick={() => run().toggleOrderedList().run()}>
          <ListOrdered className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Quote" active={s.quote} onClick={() => run().toggleBlockquote().run()}>
          <Quote className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Divider line" onClick={() => run().setHorizontalRule().run()}>
          <Minus className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <Divider />
        <ToolButton label="Add link" active={s.link || panel === "link"} onClick={() => openPanel("link")}>
          <LinkIcon className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        {s.link && (
          <ToolButton label="Remove link" onClick={() => run().extendMarkRange("link").unsetLink().run()}>
            <Unlink className="size-4 xl1:size-[1.1rem]" />
          </ToolButton>
        )}
        <ToolButton label="Add image" active={panel === "image"} onClick={() => openPanel("image")}>
          <ImagePlus className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <Divider />
        <ToolButton label="Undo" disabled={!s.canUndo} onClick={() => run().undo().run()}>
          <Undo2 className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
        <ToolButton label="Redo" disabled={!s.canRedo} onClick={() => run().redo().run()}>
          <Redo2 className="size-4 xl1:size-[1.1rem]" />
        </ToolButton>
      </div>

      {panel && (
        <div className="border-t border-line bg-surface p-3 xl1:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyPanel();
                }
                if (e.key === "Escape") closePanel();
              }}
              placeholder={panel === "link" ? "https://example.com" : "https://… image URL"}
              aria-label={panel === "link" ? "Link address" : "Image URL"}
              className={cn(field, "basis-64")}
            />
            {panel === "image" && (
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyPanel();
                  }
                }}
                placeholder="Describe the image (alt text)"
                aria-label="Image description"
                className={cn(field, "basis-56")}
              />
            )}
            <button type="button" onClick={applyPanel} className={cn(smallBtn, "bg-green text-white hover:bg-green-dark")}>
              {panel === "link" ? "Apply link" : "Insert image"}
            </button>
            <button type="button" onClick={closePanel} className={cn(smallBtn, "text-muted hover:bg-surface-2")}>
              Cancel
            </button>
          </div>
          {panelError && (
            <p role="alert" className="mt-2 text-sm text-danger xl1:text-base">
              {panelError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function TiptapEditor({
  initialContent,
  onChange,
}: {
  initialContent: BlogContent;
  onChange: (content: BlogContent) => void;
}) {
  const editor = useEditor({
    extensions: [...blogExtensions, Placeholder.configure({ placeholder: "Start writing your post…" })],
    content: initialContent,
    // Next renders this component on the server first; Tiptap must wait for the browser.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "blog-prose min-h-[22rem] px-4 py-4 xl1:min-h-[28rem] xl1:px-6 xl1:py-6",
        "aria-label": "Post content",
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getJSON() as BlogContent),
  });

  return (
    <div className="rounded-lg border border-ink/25 bg-white transition focus-within:border-green focus-within:ring-1 focus-within:ring-green">
      {editor ? (
        <>
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="min-h-[26rem] animate-pulse rounded-lg bg-surface" aria-busy="true" />
      )}
    </div>
  );
}
