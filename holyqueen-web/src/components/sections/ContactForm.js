"use client";

import { useRef, useState } from "react";
import { site } from "@/content/site";

export default function ContactForm() {
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const planRef = useRef(null);
  const messageRef = useRef(null);
  const trapRef = useRef(null);
  const [status, setStatus] = useState("");

  const handleRequestCallback = () => {
    if (trapRef.current?.value) return; // honeypot
    const name = nameRef.current?.value.trim() ?? "";
    const phone = phoneRef.current?.value.trim() ?? "";
    const plan = planRef.current?.value.trim() ?? "";
    const message = messageRef.current?.value.trim() ?? "";

    if (!name || !phone) {
      setStatus("Please add your name and phone number so we can call you back.");
      return;
    }

    const text =
      `Hello ${site.shortName},\n\nI would like to request a callback.\n\n` +
      `Name: ${name}\nPhone: ${phone}\n` +
      (plan ? `Interested plan: ${plan}\n` : "") +
      (message ? `Message: ${message}\n` : "") +
      `\nPlease get in touch at your earliest convenience. Thank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${site.whatsapp}?text=${encoded}`, "_blank");
    setTimeout(() => {
      window.location.href = `sms:${site.phone}?body=${encoded}`;
    }, 800);
    setStatus("Opening WhatsApp and SMS — your request is being sent.");
  };

  return (
    <form className="contact-form reveal" aria-label="Callback request">
      <label>
        Name
        <input type="text" placeholder="Your name" ref={nameRef} required />
      </label>
      <label>
        Phone
        <input
          type="tel"
          inputMode="tel"
          placeholder="+91"
          ref={phoneRef}
          required
        />
      </label>
      <label>
        Interested plan
        <input type="text" placeholder="FD, QCC, Pension…" ref={planRef} />
      </label>
      <label>
        Message
        <textarea
          placeholder="Tell us what you want to plan"
          ref={messageRef}
        ></textarea>
      </label>
      <input
        className="honeypot"
        ref={trapRef}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        placeholder="Leave this empty"
      />
      <button
        className="button primary"
        type="button"
        onClick={handleRequestCallback}
      >
        Request callback
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
