import toast, { type ToastOptions } from "react-hot-toast";
import { profile } from "../data/profile";
import resumePdf from "../assets/documents/Ananay_Resume.pdf";

export const toastOptions: ToastOptions = {
  position: "bottom-center",
  style: {
    border: "1px solid var(--border-subtle)",
    borderRadius: "14px",
    background: "var(--bg-elevated)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    boxShadow: "var(--shadow-lg)",
  },
};

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Clipboard copy failed");
}

export async function copyProfileEmail() {
  try {
    await copyText(profile.email);
    toast("Email copied", { ...toastOptions, icon: "📧" });
  } catch {
    toast.error(`Copy failed. Email me at ${profile.email}.`, toastOptions);
  }
}

export function downloadResume() {
  const link = document.createElement("a");
  link.href = resumePdf;
  link.download = profile.resumeFileName;
  link.click();
}

export function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
