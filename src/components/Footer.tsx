import type { Config } from "../lib/booking";

type Props = { config: Config; whatsappLink: string };

export function Footer({ config, whatsappLink }: Props) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-row">
          <span className="brand-foot">{config.businessName}</span>
          <span className="dotsep">·</span>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            WhatsApp {config.whatsappDisplay}
          </a>
          {config.instagramUrl && (
            <>
              <span className="dotsep">·</span>
              <a href={config.instagramUrl} target="_blank" rel="noreferrer">
                {config.instagramHandle}
              </a>
            </>
          )}
        </div>
        <div className="legal">
          © {new Date().getFullYear()} · Popoyo, Nicaragua
        </div>
      </div>
    </footer>
  );
}
