"use client";

import { useRef, useState } from "react";

const BRANCH_NUMBER = "+917411321690";

export default function Contact() {
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const planRef = useRef(null);
  const messageRef = useRef(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRequestCallback = () => {
    const name = nameRef.current?.value.trim() ?? "";
    const phone = phoneRef.current?.value.trim() ?? "";
    const plan = planRef.current?.value.trim() ?? "";
    const message = messageRef.current?.value.trim() ?? "";

    const text =
      `Hello Holy Queen,\n\n` +
      `I would like to request a callback.\n\n` +
      (name ? `Name: ${name}\n` : "") +
      (phone ? `Phone: ${phone}\n` : "") +
      (plan ? `Interested Plan: ${plan}\n` : "") +
      (message ? `Message: ${message}\n` : "") +
      `\nPlease get in touch at your earliest convenience. Thank you!`;

    const encodedText = encodeURIComponent(text);
    const waNumber = BRANCH_NUMBER.replace(/\D/g, "");

    // 1. Open WhatsApp
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
    window.open(waUrl, "_blank");

    // 2. Trigger SMS (opens native SMS app on mobile; silently ignored on desktop)
    setTimeout(() => {
      const smsUrl = `sms:${BRANCH_NUMBER}?body=${encodedText}`;
      window.location.href = smsUrl;
    }, 800);

    // Show confirmation banner
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 5000);
  };

  return (
    <section className="contact section" id="contact">
      <div className="section-heading reveal">
        <span className="eyebrow">Contact &amp; Inquiry</span>
        <h2>Begin with a conversation, then invest with clarity.</h2>
      </div>
      <div className="contact-grid">
        <form className="contact-form reveal">
          <label>
            Name <input type="text" placeholder="Your name" ref={nameRef} />
          </label>
          <label>
            Phone <input type="tel" placeholder="+91" ref={phoneRef} />
          </label>
          <label>
            Interested Plan{" "}
            <input
              type="text"
              placeholder="FD, QCC, Pension..."
              ref={planRef}
            />
          </label>
          <label>
            Message{" "}
            <textarea
              placeholder="Tell us what you want to plan"
              ref={messageRef}
            ></textarea>
          </label>
          <button
            className="button primary"
            type="button"
            onClick={handleRequestCallback}
          >
            Request Callback
          </button>
          {showConfirmation && (
            <div className="form-confirmation" role="status">
              Opening WhatsApp and SMS. Your request is being sent.
            </div>
          )}
        </form>
        <aside className="contact-panel reveal">
          <div>
            <span>Phone</span>
            <a href="tel:+917411321690">+91-7411321690</a>
          </div>
          <div>
            <span>Email</span>
            <a href="mailto:Holyqueen2026@gmail.com">
              Holyqueen2026@gmail.com
            </a>
          </div>
          <div>
            <span>WhatsApp</span>
            <a href="https://wa.me/917411321690">Message Branch</a>
          </div>
        </aside>
      </div>
    </section>
  );
}
