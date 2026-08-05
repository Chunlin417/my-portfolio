import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        {/* Left */}
        <div className="hero__content">
          <div className="pill">Full-Stack Developer — Next.js &amp; Supabase</div>

          <h1 className="hero__title">Hi, I&rsquo;m Chunlin He.</h1>

          <p className="hero__subtitle">
            I build full-stack products end to end — Next.js interfaces backed
            by real databases, auth, and APIs that hold up in production.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">
              View Experience
            </a>
            <a className="btn btn--ghost" href="#contact">
              Contact
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="hero__media">
          <Image
            src="/images/hero.jpg"
            alt="Chunlin He"
            className="hero__image"
            width={320}
            height={400}
            priority
          />
        </div>
      </div>
    </section>
  );
}
