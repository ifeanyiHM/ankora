import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

/**
 * The single list of Tiptap extensions for blog posts.
 *
 * The admin editor and the server-side renderer (content.ts) both import this,
 * so what an admin sees while writing is exactly what the schema allows on the
 * public page. Anything not listed here (scripts, iframes, raw HTML) cannot be
 * stored or rendered.
 */
export const blogExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["mailto", "tel"],
      HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
    },
  }),
  Image.configure({
    inline: false,
    HTMLAttributes: { loading: "lazy", decoding: "async" },
  }),
];
