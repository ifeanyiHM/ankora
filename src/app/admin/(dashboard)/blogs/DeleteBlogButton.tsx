"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBlogAction } from "./actions";

export function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="grid size-8 place-items-center rounded-full text-muted hover:bg-danger/10 hover:text-danger xl1:size-9 xl3:size-10"
        aria-label={`Delete ${title}`}
      >
        <Trash2 className="size-4 xl1:size-[1.1rem] xl3:size-5" />
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs xl1:gap-1.5 xl1:text-sm">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await deleteBlogAction(id);
          router.refresh();
        }}
        className="rounded-full bg-danger px-2.5 py-1 font-semibold text-white xl1:px-3 xl1:py-1.5"
      >
        {busy ? "..." : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full px-2 py-1 text-muted hover:bg-surface-2 xl1:px-2.5 xl1:py-1.5"
      >
        Cancel
      </button>
    </span>
  );
}
