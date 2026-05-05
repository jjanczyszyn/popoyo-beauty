import type { Config } from "../lib/booking";

type Props = { config: Config; whatsappLink: string };

export function Footer({ config, whatsappLink }: Props) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="grid">
          <div>
            <h4>{config.businessName}</h4>
            <p>
              In-home hair, nails, massage, body rituals, and optional
              childcare for villas, hotels, and retreats in the Popoyo area.
            </p>
          </div>
          <div>
            <h4>Service area</h4>
            <ul>
              {config.serviceAreas.slice(0, 6).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  WhatsApp {config.whatsappDisplay}
                </a>
              </li>
              {config.instagramUrl && (
                <li>
                  <a href={config.instagramUrl} target="_blank" rel="noreferrer">
                    Instagram {config.instagramHandle}
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h4>Payment methods</h4>
            <ul>
              {config.paymentMethods
                .filter((m) => m.enabled)
                .map((m) => (
                  <li key={m.id}>{m.label}</li>
                ))}
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} {config.businessName} · Popoyo, Nicaragua</span>
          <span>{config.cancellationPolicy.split(".")[0]}.</span>
        </div>
      </div>
    </footer>
  );
}
