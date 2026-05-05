type Props = { whatsappLink: string };

export function Header({ whatsappLink }: Props) {
  return (
    <header className="site-header">
      <div className="container row">
        <a href="#top" className="brand">
          Popoyo<span className="dot">.</span>Beauty
        </a>
        <nav className="nav">
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#packages">Packages</a>
            <a href="#how">How it works</a>
            <a href="#book">Book</a>
          </div>
          <a className="btn btn-primary" href={whatsappLink} target="_blank" rel="noreferrer">
            Book on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
