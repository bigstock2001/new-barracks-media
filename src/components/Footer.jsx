import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="footerWrap">
      <footer className="container-card footer">
        <div className="footerLinks">
          <Link className="link small" href="/privacy">
            Privacy
          </Link>
          <Link className="link small" href="/terms">
            Terms of Service
          </Link>
          <Link className="link small" href="/copyright">
            Copyright
          </Link>
          <span className="small">© {year} Barracks Media Inc.</span>
        </div>

        <div className="social">
          {/* Replace these with your real links */}
          <a className="link small" href="#" target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a className="link small" href="#" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="link small" href="#" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a className="link small" href="#" target="_blank" rel="noreferrer">
            X
          </a>
        </div>
      </footer>
    </div>
  );
}
