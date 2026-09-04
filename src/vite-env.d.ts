/// <reference types="vite/client" />

// Vite's client types cover most media assets; PDFs need an explicit module
// declaration so `import resume from "...pdf"` resolves to a URL string.
declare module "*.pdf" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_NOWPLAYING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
