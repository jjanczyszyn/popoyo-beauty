import type { Config } from "../lib/booking";

type Props = { config: Config };

export function ServiceArea({ config }: Props) {
  return (
    <section id="area" className="tinted">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Service area</div>
          <h2>We come to you</h2>
        </div>
        <div className="areas">
          {config.serviceAreas.map((a) => (
            <span key={a} className="pill">{a}</span>
          ))}
        </div>
        <p style={{ textAlign: "center", maxWidth: 680, margin: "0 auto", color: "var(--espresso-soft)" }}>
          We serve Popoyo and nearby beach communities. If your villa is remote
          or access is difficult, send your location and we'll confirm whether a
          travel fee applies.
        </p>
        {config.locationShareUrl && (
          <p style={{ textAlign: "center", marginTop: 18 }}>
            <a className="btn btn-secondary" href={config.locationShareUrl} target="_blank" rel="noreferrer">
              Find us on Google Maps
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
