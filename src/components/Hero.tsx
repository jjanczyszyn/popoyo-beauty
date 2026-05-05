export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">In-home spa · Popoyo, Nicaragua</div>
          <h1>Luxury spa care brought to your villa</h1>
          <p className="sub">
            Hair, nails, massage, and optional childcare in the Popoyo area,
            delivered to your villa, hotel, retreat, or beach house.
          </p>
          <div className="ctas">
            <a className="btn btn-primary" href="#book">
              Build your appointment
            </a>
            <a className="btn btn-secondary" href="#services">
              View services
            </a>
          </div>
          <div className="bullets">
            <span><span className="pip" /> In-home service</span>
            <span><span className="pip" /> Multi-service booking</span>
            <span><span className="pip" /> Family-friendly options</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true" />
      </div>
    </section>
  );
}
