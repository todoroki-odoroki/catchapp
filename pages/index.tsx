import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { db } from "../libs/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

type News = {
  content: string;
  createdBy: string;
  createdAt: Date;
};

const Home: NextPage = () => {
  const [content, setContent] = useState("");
  const [createdBy, setCreatedBy] = useState("kawa");

  const postNews = async () => {
    try {
      const news: News = {
        content,
        createdBy,
        createdAt: new Date(),
      };
      const ref = doc(collection(db, 'colNews'))
      await setDoc(ref, news)
      alert("近況を登録しました！");
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    setContent(e.target.value);
  };

  const handleChangeSelect = (e: any) => {
    setCreatedBy(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Catch App</title>
        <meta name="description" content="Share your life update!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>近況教えて！</h1>
        <textarea
          className={styles.description}
          cols={20} rows={5}
          onBlur={handleChange}
        ></textarea>
        <select
          className={styles.card}
          onChange={handleChangeSelect}
        >
          <option value="kawa">川元</option>
          <option value="baba">馬場</option>
          <option value="rai">雷鳥</option>
          <option value="suzu">鈴木</option>
        </select>
        <button onClick={postNews}>近況を登録！</button>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
