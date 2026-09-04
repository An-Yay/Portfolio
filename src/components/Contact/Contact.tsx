import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { profile, socials } from "../../data/profile";
import useReducedMotion from "../../hooks/useReducedMotion";
import useSound from "../../hooks/useSound";
import { inView, pick, rise } from "../../utils/motion";
import SectionHeader from "../ui/SectionHeader";
import resumePdf from "../../assets/documents/Ananay_Resume.pdf";
import "./Contact.scss";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

const toastStyle = {
  border: "1px solid var(--border-subtle)",
  borderRadius: "14px",
  background: "var(--bg-elevated)",
  color: "var(--text-primary)",
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  boxShadow: "var(--shadow-lg)",
};

export default function Contact() {
  const reduced = useReducedMotion();
  const playClick = useSound();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please tell me your name.";
    if (!values.email.trim()) {
      next.email = "An email address lets me reply.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = "That email address doesn't look right.";
    }
    if (!values.message.trim()) {
      next.message = "Add a short message so I know what this is about.";
    } else if (values.message.trim().length < 10) {
      next.message = "A little more detail would help.";
    }
    return next;
  };

  const update = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move focus to the first field with a problem.
      const firstKey = Object.keys(found)[0];
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
        ?.focus();
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      toast.error(
        "Email isn't configured yet. Please reach out directly instead.",
        { position: "bottom-center", style: toastStyle }
      );
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: values.name,
          reply_to: values.email,
          message: values.message,
        },
        PUBLIC_KEY
      );
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
      toast.success("Message sent. I'll get back to you soon.", {
        position: "bottom-center",
        style: toastStyle,
      });
    } catch {
      setStatus("idle");
      toast.error(
        `Couldn't send that. Email me directly at ${profile.email}.`,
        { position: "bottom-center", style: toastStyle }
      );
    }
  };

  const copyEmail = () => {
    playClick();
    void navigator.clipboard.writeText(profile.email);
    toast("Email copied", {
      icon: "📧",
      position: "bottom-center",
      style: toastStyle,
    });
  };

  return (
    <section className="contact" aria-labelledby="contact-heading">
      <span className="section-anchor" id="contact" aria-hidden="true" />

      <div className="container">
        <SectionHeader
          eyebrow="Contact"
          title="Let's build something worth shipping."
          description={`${profile.availability} about agentic AI, platform work, or anything technically interesting. Based in ${profile.location}.`}
          headingId="contact-heading"
        />

        <div className="contact__grid">
          <motion.form
            className="contact__form"
            ref={formRef}
            onSubmit={onSubmit}
            variants={pick(rise(0, 24), reduced)}
            {...inView}
            noValidate
          >
            <div className="contact__field">
              <label className="contact__label" htmlFor="contact-name">
                Name
              </label>
              <input
                className={`contact__input${errors.name ? " has-error" : ""}`}
                id="contact-name"
                name="name"
                type="text"
                value={values.name}
                onChange={update("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                autoComplete="name"
                required
              />
              {errors.name && (
                <p className="contact__error" id="contact-name-error" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="contact__field">
              <label className="contact__label" htmlFor="contact-email">
                Email
              </label>
              <input
                className={`contact__input${errors.email ? " has-error" : ""}`}
                id="contact-email"
                name="email"
                type="email"
                value={values.email}
                onChange={update("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "contact-email-error" : undefined
                }
                autoComplete="email"
                required
              />
              {errors.email && (
                <p
                  className="contact__error"
                  id="contact-email-error"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="contact__field">
              <label className="contact__label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                className={`contact__input contact__textarea${
                  errors.message ? " has-error" : ""
                }`}
                id="contact-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={update("message")}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                required
              />
              {errors.message && (
                <p
                  className="contact__error"
                  id="contact-message-error"
                  role="alert"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="contact__submit"
              disabled={status === "sending"}
              onMouseDown={playClick}
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>

            <p className="contact__status" role="status" aria-live="polite">
              {status === "sent" ? "Message sent. Thanks for reaching out." : ""}
            </p>
          </motion.form>

          <motion.aside
            className="contact__side"
            variants={pick(rise(0.08, 24), reduced)}
            {...inView}
          >
            <div className="contact__card">
              <h3 className="contact__card-title">Direct</h3>
              <button
                type="button"
                className="contact__email"
                onClick={copyEmail}
              >
                <span>{profile.email}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M9 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H9Zm0 2h8v10H9V5ZM5 7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2h-2v0H5V7Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Copy email address</span>
              </button>

              <a
                className="contact__resume"
                href={resumePdf}
                download={profile.resumeFileName}
                onMouseDown={playClick}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1Z"
                    fill="currentColor"
                  />
                </svg>
                Download resume
              </a>
            </div>

            <div className="contact__card">
              <h3 className="contact__card-title">Elsewhere</h3>
              <ul className="contact__socials">
                {socials.map((social) => (
                  <li key={social.id}>
                    <a
                      className="contact__social"
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      onMouseDown={playClick}
                    >
                      <span className="contact__social-label">
                        {social.label}
                      </span>
                      <span className="contact__social-handle">
                        {social.handle}
                      </span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M7 17L17 7M17 7H9M17 7v8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
