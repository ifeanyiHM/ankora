import "server-only";

import type { BlogContent } from "@/types";
import { generateHTML } from "@tiptap/html/server";
import { blogExtensions } from "./extensions";

const MAX_CONTENT_BYTES = 500_000;

const ALLOWED_NODES = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
  "image",
]);
const ALLOWED_MARKS = new Set(["bold", "italic", "underline", "strike", "code", "link"]);
const BLOCK_NODES = new Set(["paragraph", "heading", "listItem", "blockquote", "codeBlock", "horizontalRule"]);

interface RawNode {
  type?: unknown;
  text?: unknown;
  attrs?: Record<string, unknown>;
  marks?: { type?: unknown; attrs?: Record<string, unknown> }[];
  content?: unknown;
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeHref(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    return ["https:", "http:", "mailto:", "tel:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

/** Returns an error message for the first thing that isn't allowed, or null. */
function checkNode(node: RawNode, depth: number): string | null {
  if (depth > 20) return "The post is nested too deeply.";
  if (typeof node.type !== "string" || !ALLOWED_NODES.has(node.type)) {
    return `Unsupported content: ${String(node.type)}.`;
  }
  if (node.type === "image" && !isHttpsUrl(node.attrs?.src)) {
    return "Images must use a full https:// URL.";
  }
  for (const mark of node.marks ?? []) {
    if (typeof mark.type !== "string" || !ALLOWED_MARKS.has(mark.type)) {
      return `Unsupported formatting: ${String(mark.type)}.`;
    }
    if (mark.type === "link" && !isSafeHref(mark.attrs?.href)) {
      return "A link has an unsafe or invalid address.";
    }
  }
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      if (!child || typeof child !== "object") return "The post content is malformed.";
      const error = checkNode(child as RawNode, depth + 1);
      if (error) return error;
    }
  }
  return null;
}

export type ContentCheck =
  | { ok: true; content: BlogContent }
  | { ok: false; error: string };

/**
 * Validates a Tiptap document received from the browser. Never trust the client: this
 * whitelists node and mark types, requires https images and safe link protocols, then
 * proves the document renders against the real schema before anything is saved.
 */
export function validateBlogContent(input: unknown): ContentCheck {
  if (!input || typeof input !== "object" || (input as RawNode).type !== "doc") {
    return { ok: false, error: "The post content is missing or malformed." };
  }
  if (JSON.stringify(input).length > MAX_CONTENT_BYTES) {
    return { ok: false, error: "This post is too long. Split it into two posts." };
  }
  const error = checkNode(input as RawNode, 0);
  if (error) return { ok: false, error };
  try {
    generateHTML(input as never, blogExtensions);
  } catch {
    return { ok: false, error: "The post content could not be read. Try reloading the editor." };
  }
  return { ok: true, content: input as BlogContent };
}

/** HTML for the public page. Built from the schema, so it is safe to inject. */
export function renderBlogHtml(content: BlogContent): string {
  try {
    return generateHTML(content as never, blogExtensions);
  } catch {
    return "";
  }
}

/** Plain text of a document, with a space between blocks. Used for excerpts and reading time. */
export function blogContentToText(content: BlogContent): string {
  const parts: string[] = [];
  const walk = (node: RawNode) => {
    if (node.type === "text" && typeof node.text === "string") parts.push(node.text);
    if (node.type === "hardBreak") parts.push(" ");
    if (Array.isArray(node.content)) {
      for (const child of node.content) walk(child as RawNode);
    }
    if (typeof node.type === "string" && BLOCK_NODES.has(node.type)) parts.push(" ");
  };
  walk(content as RawNode);
  return parts.join("").replace(/\s+/g, " ").trim();
}

/**
 * Text for an auto-generated summary: the body paragraphs only, so a heading or list item never gets
 * glued onto a sentence. Falls back to all text for posts that have no plain paragraphs.
 */
export function excerptSourceText(content: BlogContent): string {
  const paragraphs = (content.content ?? [])
    .filter((node) => node.type === "paragraph")
    .map((node) => blogContentToText({ type: "doc", content: [node] }))
    .filter(Boolean);
  return paragraphs.length ? paragraphs.join(" ") : blogContentToText(content);
}

export function hasImage(content: BlogContent): boolean {
  const find = (node: RawNode): boolean =>
    node.type === "image" || (Array.isArray(node.content) && node.content.some((c) => find(c as RawNode)));
  return find(content as RawNode);
}

export function readingMinutes(text: string): number {
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

export function makeExcerpt(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
