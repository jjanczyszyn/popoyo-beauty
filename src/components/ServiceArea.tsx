import type { Config } from "../lib/booking";

type Props = { config: Config };

export function ServiceArea({ config }: Props) {
  return (
    <section id="area" className="tinted">
      <div className="container">
        <div className="section-head">
          <h2>Where we go</h2>
        </div>
        <div className="areas">
          {config.serviceAreas.map((a) => (
            <span key={a} className="pill">{a}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
