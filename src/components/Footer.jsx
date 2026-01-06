export default function Footer() {
  return (
    <footer style={{ padding: "24px 0", opacity: 0.85 }}>
      <div className="container-card section">
        <p className="p">
          © {new Date().getFullYear()} Barracks Media Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
