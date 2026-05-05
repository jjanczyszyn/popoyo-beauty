const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Do you come to my villa or hotel?",
    a: "Yes. Popoyo Beauty is an in-home service. We come to your villa, hotel, Airbnb, retreat center, or beach house.",
  },
  {
    q: "Can I book multiple services at once?",
    a: "Yes. You can combine massage, nails, hair, body treatments, and childcare in one request.",
  },
  {
    q: "Is the appointment confirmed automatically?",
    a: "No. Your request is confirmed by WhatsApp after we verify provider availability, travel time, and the final total.",
  },
  {
    q: "Do you offer childcare?",
    a: "Yes, childcare may be available as an add-on while parents receive services. A parent or guardian must remain on the property.",
  },
  {
    q: "Do you serve groups or retreats?",
    a: "Yes. Retreats, weddings, surf groups, and family villa days can be quoted manually.",
  },
  {
    q: "Do you bring everything?",
    a: "Yes. The provider brings the core supplies needed for the service. For massage, confirm whether a massage table is included or whether the client needs space for setup.",
  },
  {
    q: "What should I prepare?",
    a: "A clean, shaded, quiet area with enough room for the service. For massage, a space where a table can fit. For nails or hair, good light and a chair or table are helpful.",
  },
  {
    q: "Can I request a specific time?",
    a: "Yes. You can request a preferred time. Final timing depends on provider availability and travel route.",
  },
  {
    q: "What if I am sunburned?",
    a: "Tell us before booking. Some services may need to be adapted. For strong sunburn, deep pressure, exfoliation, or heat may not be appropriate.",
  },
  {
    q: "Do you offer prenatal massage?",
    a: "Yes, if an appropriate provider is available. Please share your pregnancy stage and any medical considerations before confirmation.",
  },
];

export function Faq() {
  return (
    <section id="faq">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">FAQ</div>
          <h2>Good things to know</h2>
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
