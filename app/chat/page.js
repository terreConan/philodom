"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import styles from "./page.module.css";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap" });
const PHILOSOPHERS = ["PLATO", "ARISTOTLE", "DESCARTES", "LOCKE", "KANT"];

const SUGGESTIONS = [
  { title: "What is the good life?", subtitle: "give your view and daily practices", text: "What is the good life? — give your view and daily practices" },
  { title: "Do humans have free will?", subtitle: "state your position with one concrete example", text: "Do humans have free will? — state your position with one concrete example" },
  { title: "What is justice?", subtitle: "apply your principles to a modern dilemma", text: "What is justice? — apply your principles to a modern dilemma" },
];

export default function ChatPage() {
  const [activePhilo, setActivePhilo] = useState(PHILOSOPHERS[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // { role:'user'|'assistant', text, philo, sources? }
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null); // which message was just copied
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  // auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // auto-size composer
  useEffect(() => {
    autoSizeComposer();
  }, [input]);

  function autoSizeComposer() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px"; // reset first
    const max = 180; // px cap (~6-8 lines)
    ta.style.height = Math.min(ta.scrollHeight, max) + "px";
    ta.style.overflowY = ta.scrollHeight > max ? "auto" : "hidden";
  }

  async function callApi(question, philo) {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        mode: "grounded",
        philosopher: philo.toLowerCase(),
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async function send(text) {
    const t = (text ?? input).trim();
    if (!t || loading) return;

    const philo = activePhilo;
    setMessages((m) => [...m, { role: "user", text: t, philo }]);
    setInput("");
    setLoading(true);

    try {
      const data = await callApi(t, philo);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer, philo, sources: data.sources || [] },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `Sorry—something went wrong.\n\n${String(e.message || e)}`, philo },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // --- message actions ---
  async function regenerateAt(index) {
    const msg = messages[index];
    const philo = msg?.philo || activePhilo;
    let userQ = null;
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === "user") { userQ = messages[i].text; break; }
    }
    if (!userQ || loading) return;

    setLoading(true);
    setMessages((m) => {
      const copy = [...m];
      copy[index] = { ...copy[index], text: "Regenerating…" };
      return copy;
    });
    try {
      const data = await callApi(userQ, philo);
      setMessages((m) => {
        const copy = [...m];
        copy[index] = { ...copy[index], text: data.answer, sources: data.sources || [] };
        return copy;
      });
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[index] = { ...copy[index], text: `Sorry—regeneration failed.\n\n${String(e.message || e)}` };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage(index) {
    try {
      await navigator.clipboard.writeText(messages[index].text || "");
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch {
      // ignore
    }
  }

  // sentence-bounded snippet or current selection
  function useAsFollowUp(index) {
    const bubble = document.getElementById(`bubble-${index}`);
    let selected = "";
    const sel = window.getSelection?.();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (bubble && bubble.contains(range.commonAncestorContainer)) {
        selected = sel.toString().trim();
      }
    }
    const base = selected || messages[index].text || "";
    const seed = sentenceBoundedSnippet(base, 280); // better than hard cut
    setInput(`About that: "${seed}"\n\n`);
    textareaRef.current?.focus();
  }

  function sentenceBoundedSnippet(s, max) {
    const clean = s.replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    // try to cut at the last punctuation before max
    const sub = clean.slice(0, max);
    const i = Math.max(sub.lastIndexOf(". "), sub.lastIndexOf("! "), sub.lastIndexOf("? "));
    const j = i > 0 ? i + 1 : sub.lastIndexOf(" ");
    return (j > 0 ? sub.slice(0, j) : sub).trim() + "…";
  }

  function onSubmit(e) {
    e.preventDefault();
    send();
  }

  const showSuggestions = input.length === 0 && messages.length === 0;

  return (
    <div className={`${styles.shell} ${dmSans.className}`}>
      {/* LEFT SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.brandRow}>
          <span className={styles.brandDot} />
          <Link href="/" className={styles.brand}>PHILODOM Φ</Link>
        </div>

        <button className={styles.newChatBtn} onClick={() => setMessages([])}>
          ＋ New Chat
        </button>

        <h1 className={styles.betaMark}>BETA MODE</h1>
      </aside>

      {/* CENTER COLUMN */}
      <section className={styles.center}>
        {/* TOP BAR – philosopher tabs */}
        <div className={styles.topbar}>
          <div className={styles.modelTabs} role="tablist" aria-label="Philosophers">
            {PHILOSOPHERS.map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={p === activePhilo}
                className={`${styles.modelTab} ${p === activePhilo ? styles.active : ""}`}
                onClick={() => setActivePhilo(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* CHAT SURFACE */}
        <div className={styles.chatSurface}>
          {messages.length === 0 && (
            <div className={styles.watermark}>
              <div className={styles.watermarkBig}>PHI</div>
              <div className={styles.watermarkSmall}>CHATBOT</div>
            </div>
          )}

          {/* messages */}
          <ul className={styles.messages}>
            {messages.map((m, i) => {
              const mine = m.role === "user";
              const avatarLabel = mine ? "You" : (m.philo || activePhilo || "PLATO");
              const avatarLetter = mine ? "U" : avatarLabel[0];

              return (
                <li key={i} className={`${styles.msgRow} ${mine ? styles.rowMine : styles.rowTheirs} ${styles.appear}`}>
                  <div
                    className={styles.avatar}
                    aria-label={avatarLabel}
                    title={avatarLabel}
                    data-philo={(mine ? "user" : (m.philo || "")).toLowerCase()}
                  >
                    {avatarLetter}
                  </div>

                  <div id={`bubble-${i}`} className={`${styles.bubble} ${mine ? styles.mine : (styles.theirs || "")}`}>
                    <div className={styles.bubbleText}>{m.text}</div>

                    {/* actions only for assistant */}
                    {!mine && (
                      <div className={styles.msgActions} role="group" aria-label="Message actions">
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => regenerateAt(i)}
                          disabled={loading}
                          aria-label="Regenerate this answer"
                          title="Regenerate"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                            <path d="M21 12a9 9 0 1 1-2.64-6.36" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path d="M21 3v6h-6" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>Regenerate</span>
                        </button>

                        <button
                          type="button"
                          className={`${styles.actionBtn} ${copiedIndex === i ? styles.actionSuccess : ""}`}
                          onClick={() => copyMessage(i)}
                          aria-label="Copy this answer"
                          title={copiedIndex === i ? "Copied!" : "Copy"}
                        >
                          {copiedIndex === i ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                              <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                              <path d="M9 9h11v11H9zM5 13H4V4h9v1" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          )}
                          <span>{copiedIndex === i ? "Copied!" : "Copy"}</span>
                        </button>

                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => useAsFollowUp(i)}
                          aria-label="Use as follow-up"
                          title="Use as follow-up"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                            <path d="M5 12h9M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>Follow-up</span>
                        </button>
                      </div>
                    )}

                    {!mine && m.sources?.length > 0 && (
                      <div className={styles.citations}>
                        <strong>Sources:</strong>{" "}
                        {m.sources.map((s, j) => (
                          <span key={j}>
                            {s.file}[{s.start}-{s.end}]{j < m.sources.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}

            {loading && (
              <li className={`${styles.msgRow} ${styles.rowTheirs}`}>
                <div className={styles.avatar} aria-hidden>⋯</div>
                <div className={`${styles.bubble} ${styles.theirs || ""}`}>
                  <div className={styles.typingRow} aria-live="polite">
                    <span className={styles.typingLabel}>Thinking</span>
                    <span className={styles.typingDots}>
                      <span className={styles.dot} />
                      <span className={styles.dot} />
                      <span className={styles.dot} />
                    </span>
                  </div>
                </div>
              </li>
            )}
            <li ref={endRef} />
          </ul>

          {/* bottom suggestions */}
          {showSuggestions && (
            <div className={styles.suggestBottom}>
              <div className={styles.ideaRow}>
                {SUGGESTIONS.map((s, idx) => (
                  <IdeaChip
                    key={idx}
                    title={s.title}
                    subtitle={s.subtitle}
                    onClick={() => setInput(s.text)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <form className={styles.inputBar} onSubmit={onSubmit}>
          <textarea
            ref={textareaRef}
            className={styles.inputTextarea}
            placeholder={`Message ${activePhilo}…`}
            aria-label="Message"
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className={styles.send} aria-label="Send" type="submit" disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 11.5l18-8-8 18-2.5-7-7.5-3z" stroke="currentColor" strokeWidth="2" fill="currentColor" />
            </svg>
          </button>
        </form>
      </section>
    </div>
  );
}

function IdeaChip({ title, subtitle, onClick }) {
  return (
    <button type="button" className={styles.idea} onClick={onClick}>
      <div className={styles.ideaTitle}>{title}</div>
      <div className={styles.ideaSub}>{subtitle}</div>
    </button>
  );
}
