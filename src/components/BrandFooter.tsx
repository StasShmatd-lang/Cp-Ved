const INSTAGRAM =
  'https://www.instagram.com/st.shmidt?mdxt=emx1MzR3dmN0MmZx&utm_source=qr'

export function BrandFooter() {
  return (
    <footer className="brand-footer">
      <a
        className="brand-footer__link"
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram Stanislav Shmidt"
      >
        <img
          className="brand-footer__logo"
          src="/brand/logo.png"
          alt="Shmidt"
          width={160}
          height={90}
        />
        <span className="brand-footer__ig">instagram.com/st.shmidt</span>
      </a>
    </footer>
  )
}
