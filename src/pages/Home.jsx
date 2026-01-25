export default function Home() {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        {/* Left */}
        <div className="hero__content">
          <div className="pill">Frontend Developer · React</div>

          <h1 className="hero__title">Hi, I’m Chunlin He.</h1>

          <p className="hero__subtitle">
            Building production-ready frontend interfaces
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">View Projects</a>
            <a className="btn btn--ghost" href="#contact">Contact</a>

          </div>
        </div>

        {/* Right */}
        <div className="hero__media">
          <img
            src="/images/hero.jpg"
            alt="Chunlin He"
            className="hero__image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
