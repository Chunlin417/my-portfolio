export default function About() {
  return (
    <section id="about" className="section section-about">
      <span className="section-kicker">02 — About</span>
      <h2 className="h2">How I work</h2>

      <p className="about-intro">
        I build products end to end — frontend, backend, and the database and auth layer in
        between. My experience spans education platforms, AI SaaS, and IoT systems, as both an
        individual contributor and a team lead.
      </p>

      <div className="capabilities">
        <div className="capability">
          <span className="capability__index">01</span>
          <h3 className="capability__title">Full-Stack Architecture</h3>
          <p className="capability__desc">
            Next.js and React frontends backed by real databases and RESTful APIs — not just UI.
          </p>
        </div>

        <div className="capability">
          <span className="capability__index">02</span>
          <h3 className="capability__title">Secure by Design</h3>
          <p className="capability__desc">
            Authentication, role-based access, and Row Level Security that hold up in production.
          </p>
        </div>

        <div className="capability">
          <span className="capability__index">03</span>
          <h3 className="capability__title">Shipping &amp; Leading</h3>
          <p className="capability__desc">
            From co-founding a live product to leading a team — comfortable owning a project end to end.
          </p>
        </div>
      </div>

      <p className="about-goal">
        Currently seeking full-stack or software developer roles where I can contribute to real-world products.
      </p>
    </section>
  );
}
