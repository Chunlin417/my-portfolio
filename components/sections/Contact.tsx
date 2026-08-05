export default function Contact() {
  return (
    <section id="contact" className="section section-contact">
      <h2 className="h2">Contact</h2>

      <p className="contact-intro">
        Feel free to reach out if you&rsquo;d like to discuss projects, opportunities, or collaboration.
      </p>

      <div className="contact-actions">
        <a className="contact-btn" href="mailto:hechunlin417@gmail.com">
          <div className="contact-btn__left">
            <div className="contact-btn__title">Email</div>
            <div className="contact-btn__meta">hechunlin417@gmail.com</div>
          </div>
          <div className="contact-btn__right">↗</div>
        </a>

        <a
          className="contact-btn"
          href="https://github.com/Chunlin417"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="contact-btn__left">
            <div className="contact-btn__title">GitHub</div>
            <div className="contact-btn__meta">github.com/Chunlin417</div>
          </div>
          <div className="contact-btn__right">↗</div>
        </a>

        <a
          className="contact-btn"
          href="https://www.linkedin.com/in/chunlin-he-961637380/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="contact-btn__left">
            <div className="contact-btn__title">LinkedIn</div>
            <div className="contact-btn__meta">linkedin.com/in/chunlin-he</div>
          </div>
          <div className="contact-btn__right">↗</div>
        </a>
      </div>
    </section>
  );
}
