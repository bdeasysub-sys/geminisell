"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

export function CopyLinkButton({ value }: { value: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status === "idle") return;

    const timeout = window.setTimeout(() => setStatus("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function handleCopy() {
    try {
      await copyToClipboard(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  const copied = status === "copied";

  return (
    <button
      className="btn btn-secondary checkout-copy-button"
      type="button"
      onClick={handleCopy}
      aria-live="polite"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {status === "failed" ? "Copy Failed" : copied ? "Copied" : "Copy Link"}
    </button>
  );
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard copy failed.");
  }
}
