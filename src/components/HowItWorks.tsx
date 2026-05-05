const STEPS = [
  {
    n: 1,
    title: "Choose your services",
    body:
      "Select one treatment or build a full villa spa day with massage, nails, hair, body care, and childcare.",
  },
  {
    n: 2,
    title: "Send your request",
    body:
      "Share your location, preferred date, time, and any notes through the booking form.",
  },
  {
    n: 3,
    title: "We confirm by WhatsApp",
    body:
      "We confirm provider availability, travel details, timing, and your deposit.",
  },
  {
    n: 4,
    title: "We come to you",
    body:
      "The team arrives with supplies, sets up calmly, and brings the spa experience to your villa or hotel.",
  },
];

export function HowItWorks() {
  return (
    <section id="how">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">How it works</div>
          <h2>Booking is simple</h2>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div key={s.n} className="step">
              <div className="num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
