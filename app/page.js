/* eslint-disable react/no-unescaped-entities */
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Image from "next/image";
import Link from "next/link";
import politicsImg from "../components/imgs/politics.jpg";
import chatImg from "/components/imgs/chat.png"
import styles from "./page.module.css";

export default function BrandGuidelines() {
  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainColumn}>
        <Header />

        <main className={styles.content}>
          <h1 className={styles.title}>Philosophy + Freedom</h1>
          <section className={styles.body}>
            <p>
              Much of our access to philosophy is limited through older texts and philosophers who have existed before our time.
            </p>
            <p>
              At its core, Philodom is a way to directly chat with history's philosophers, made through AI. While the responses are solely based off of philosophers' legacies, Philodom is a way to alleviate some of our curiosities with those that have touched our hearts.
            </p>
          </section>
        </main>

        <div className={styles.divider} />
        
        <main className={`${styles.content} ${styles.split}`}>
          <figure className={styles.media}>
          <Image
            fill
            src={politicsImg}
            alt="Politics illustration"
            priority
          />
          </figure>

          <section className={styles.body}>
            <h1 className={styles.title}><span style={{color:"skyblue"}}>01</span> Strategy</h1>
            <br/>
            <p>
              Philodom utilizes RAG to adopt philsophers' historical texts into their responses.
              <br/>
              RAG "combines the strengths of pre-trained language models and information retrieval systems" (Anaconda).
            </p>
            <p>
              For instance, Aristotle's works are referenced from The Internet Classics Archive, from <i>Metaphysics</i> to <i>Politics</i>.
              Philodom will retrieve relevant facts from this corpus and generate an answer inspired by those facts.
            </p>
          </section>
        </main>

        <div className={styles.divider} />

        <main className={`${styles.content} ${styles.splitRight}`}>
          <section className={styles.body}>
            <h1 className={styles.title}><span style={{color:"orange"}}>02</span>  Workspace</h1>
            <br/>
            <p>
              In its beta mode, Philodom supports philosphers such as Aristotle, Plato, Descartes, and more; they can be swapped on the upper header.
            </p>
            <p>
              ** Results may not be perfect and may not fully represent the philosopher's thoughts at times.
            </p>
          </section>

          <figure className={styles.mediaRight}>
            <Image
              fill
              src={chatImg}
              alt="Chat illustration"
              priority
            />
          </figure>
        </main>

        <div className={styles.divider} />

        <h1 className={styles.title} style={{textAlign: "center", marginBottom: "3rem"}}>Try Beta Mode</h1>
        <Link href="/chat" className={styles.cta}>Try beta</Link>
      </div>
    </div>
  );
}
