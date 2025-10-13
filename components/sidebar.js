import Link from "next/link";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <div className={styles.logo}>Φ Philodom</div>
          
          <div className={styles.divider} />
          {/* <li><Link href="/auth/login">Log In</Link></li>
          <li><Link href="/auth/signup">Sign Up</Link></li>
          <li><Link href="/auth/setting">⚙ Setting</Link></li>

          <div className={styles.divider} /> */}

          <li><Link href="/chat">Beta Mode</Link></li>
        </ul>
      </nav>
      <div className={styles.bottom}>
        <a href="/contact">Contact Us</a>
      </div>
    </aside>
  );
}
