import Link from "next/link";

export default function Navigation() {
  return (
    <header className="nav">
      <div className="navInner">
        <Link href="/" className="brand" aria-label="Barracks Media Home">
          Barracks Media
        </Link>

        <nav className="navLinks" aria-label="Primary">
          <Link href="/services">Services</Link>
          <Link href="/network">Network</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </header>
  );
}
