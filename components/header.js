import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.overlay}>
        <span className={styles.logo}>Φ</span>
        <h2 className={styles.siteName}>Philodom</h2>
        <div className={styles.ctaDock}>
          <Link href="/chat" className={styles.cta}>Try beta</Link>
        </div>
      </div>
    </header>
  );
}
