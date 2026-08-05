import { CONTACT_LINKS } from "@/lib/constants";

export default function Contact() {
  return (
    <section id="contact" className="section section-contact">
      <span className="section-kicker">03 — Contact</span>
      <h2 className="h2">Let&rsquo;s talk</h2>

      <p className="contact-intro">
        Feel free to reach out if you&rsquo;d like to discuss projects, opportunities, or collaboration.
      </p>

      <div className="contact-actions">
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.id}
            className="contact-btn"
            href={link.href}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <div className="contact-btn__left">
              <div className="contact-btn__title">{link.title}</div>
              <div className="contact-btn__meta">{link.meta}</div>
            </div>
            <div className="contact-btn__right">↗</div>
          </a>
        ))}
      </div>
    </section>
  );
}
