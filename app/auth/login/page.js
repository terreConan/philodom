"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // 1) Custom client‑side checks
    if (!email.includes("@")) {
      setError("Please include an '@' in the email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // 2) Call your login API
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Invalid credentials.");
      return;
    }

    // 3) Only on success do we navigate
    router.push("/dashboard");
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Φ Philodom
        </Link>
      </header>

      <div className={styles.mainArea}>
        <div className={styles.card}>
          <h1>Sign In</h1>
          <p className={styles.subtitle}>
            Enter your details to sign in to your account
          </p>

          <form noValidate onSubmit={handleSubmit} className={styles.form}>
            <label>
              Email
              <input
                type="text"
                placeholder="username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit">Sign In</button>
          </form>

          <p className={styles.bottomText}>
            Don’t have an account?{" "}
            <Link href="/auth/signup" className={styles.link}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
