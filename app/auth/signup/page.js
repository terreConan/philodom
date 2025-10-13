"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function SignupPage() {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // 1) client‐side validation
    if (!email.includes("@")) {
      setError("Please include an '@' in the email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // 2) call your signup API
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Sign up failed.");
      return;
    }

    // 3) on success, send them to Log In
    router.push("/login");
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
          <h1>Sign Up</h1>
          <p className={styles.subtitle}>
            Enter your details to create your account
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

            <label>
              Confirm Password
              <input
                type="password"
                placeholder="confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </label>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit">Create Account</button>
          </form>

          <p className={styles.bottomText}>
            Already have an account?{" "}
            <Link href="/auth/login" className={styles.link}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
