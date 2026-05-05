export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">Popoyo, Nicaragua</div>
          <h1>Spa care at your villa.</h1>
          <p className="sub">Massage, hair, and nails. We come to you.</p>
          <div className="ctas">
            <a className="btn btn-primary" href="#book">Book</a>
            <a className="btn btn-secondary" href="#services">Services</a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1d6b7" />
          <stop offset="0.55" stopColor="#e7b89a" />
          <stop offset="1" stopColor="#c89580" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fdf0d9" />
          <stop offset="0.6" stopColor="#f1c9a8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f1c9a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a4b4a0" />
          <stop offset="1" stopColor="#6f7d66" />
        </linearGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7d0a8" />
          <stop offset="1" stopColor="#cba980" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#sky)" />
      <circle cx="200" cy="220" r="160" fill="url(#sun)" />
      <circle cx="200" cy="220" r="55" fill="#fdf0d9" opacity="0.85" />
      <path d="M0,300 Q200,290 400,300 L400,360 L0,360 Z" fill="url(#ocean)" opacity="0.85" />
      <path d="M0,355 Q80,348 160,355 T320,355 T400,353" stroke="#fdf8f0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M0,365 Q120,360 240,366 T400,365" stroke="#fdf8f0" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M0,360 Q200,375 400,360 L400,500 L0,500 Z" fill="url(#sand)" />

      <g opacity="0.9">
        <path d="M50,500 C48,420 52,360 55,300" stroke="#3b2a22" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <Frond cx={55} cy={300} angle={-95} flip={false} />
        <Frond cx={55} cy={300} angle={-50} flip={false} />
        <Frond cx={55} cy={300} angle={-15} flip={false} />
        <Frond cx={55} cy={300} angle={20} flip={false} />
        <Frond cx={55} cy={300} angle={50} flip={false} />
      </g>
      <g opacity="0.75">
        <path d="M345,500 C347,440 343,400 340,360" stroke="#3b2a22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <Frond cx={340} cy={360} angle={-100} flip={true} scale={0.7} />
        <Frond cx={340} cy={360} angle={-60} flip={true} scale={0.7} />
        <Frond cx={340} cy={360} angle={-20} flip={true} scale={0.7} />
        <Frond cx={340} cy={360} angle={25} flip={true} scale={0.7} />
      </g>

      <g transform="translate(200 430)">
        <Petal angle={-90} fill="#d68a6c" />
        <Petal angle={-55} fill="#c97a5b" />
        <Petal angle={-20} fill="#b86c4f" />
        <Petal angle={20} fill="#b86c4f" />
        <Petal angle={55} fill="#c97a5b" />
        <Petal angle={90} fill="#d68a6c" />
        <Petal angle={-35} fill="#e09a7d" scale={0.8} />
        <Petal angle={0} fill="#f1c9a8" scale={0.7} />
        <Petal angle={35} fill="#e09a7d" scale={0.8} />
        <ellipse cx="0" cy="-3" rx="6" ry="9" fill="#fdf0d9" opacity="0.95" />
      </g>
    </svg>
  );
}

function Frond({ cx, cy, angle, flip, scale = 1 }: { cx: number; cy: number; angle: number; flip: boolean; scale?: number }) {
  const sx = (flip ? -1 : 1) * scale;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${angle}) scale(${sx} ${scale})`}>
      <path d="M0,0 C20,-4 50,-8 90,-2 C70,-1 50,1 0,4 Z" fill="#3b2a22" opacity="0.85" />
    </g>
  );
}

function Petal({ angle, fill, scale = 1 }: { angle: number; fill: string; scale?: number }) {
  return (
    <g transform={`rotate(${angle}) scale(${scale})`}>
      <ellipse cx="0" cy="-22" rx="9" ry="24" fill={fill} />
    </g>
  );
}
