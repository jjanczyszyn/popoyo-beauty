const FAQS: Array<{ q: string; a: string }> = [
  { q: "Where do you go?", a: "Your villa, hotel, Airbnb, or retreat in Popoyo and nearby beaches." },
  { q: "How is it confirmed?", a: "We reply on WhatsApp once we check availability." },
  { q: "Deposit?", a: "50% to confirm. Balance after service." },
  { q: "Cancellation?", a: "Free up to 48 hours before. Within 48 hours the deposit may be kept." },
  { q: "Multiple services at once?", a: "Yes. Combine massage, hair, nails, body, and childcare in one request." },
  { q: "Childcare?", a: "Add-on while parents are in service. Parent stays on the property." },
];

export function Faq() {
  return (
    <section id="faq">
      <div className="container">
        <div className="section-head">
          <h2>FAQ</h2>
        </div>
        <div className="faq">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
