import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
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
  const [createdBy, setCreatedBy] = useState("川元");

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
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
          <option value="川元">川元</option>
          <option value="馬場">馬場</option>
          <option value="雷鳥">雷鳥</option>
          <option value="鈴木">鈴木</option>
        </select>
        <button onClick={postNews}>近況を登録！</button>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
