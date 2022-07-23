import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Tab from "../components/index/Tab";
import Title from "../components/index/Title";
import { batch, db } from "../utilis/firebaseClient";
import LinkWindow from "../components/index/LinkWindow";

const Home: NextPage = () => {
  const [title, setTitle] = useState("");
  const [tabs, setTabs] = useState<Array<string>>(["", ""]);
  const [link, setLink] = useState("");
  const [showLink, setShowLink] = useState(false);

  const generateLinkID = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      id += charset.charAt(Math.floor(Math.random() * n));
    }
    return id;
  };

  const generateUrl = async () => {
    const urlID = generateLinkID();
    const id = uuidv4();

    try {
      const urlDoc = doc(db, "urls", id);
      await setDoc(urlDoc, {
        start_at: Timestamp.now().seconds,
        end_at: Timestamp.now().seconds + 60 * 60,
        title,
        urlID,
      });
    } catch (e) {
      console.log(e);
    }

    tabs.forEach((tab) => {
      const tabDoc = doc(db, "urls", id, "tabs", uuidv4());
      batch.set(tabDoc, {
        votes: 0,
        tab,
      });
    });

    await batch.commit();
    setLink(window.location.href + urlID);
    setShowLink(true);
  };

  useEffect(() => {});
  return (
    <div className="px-8 min-h-screen bg-gray-900">
      <Head>
        <title>Create Poll</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mx-auto px-4 py-16 max-w-max text-8xl text-transparent bg-gradient-to-r font-bold from-cyan-500 to-blue-700 bg-clip-text sm:text-6xl">
        Create Poll
      </h1>

      <div className="text-center">
        <Title title={title} setTitle={setTitle} />
      </div>

      <div className="mx-auto my-8 w-4/5 h-[1px] bg-slate-600  sm:w-full" />

      <ul className="text-center space-y-4">
        {tabs.map((tab, index) => (
          <li key={index}>
            <Tab value={tab} index={index} setTabs={setTabs} />
          </li>
        ))}
      </ul>

      <div className="mt-4 text-center space-x-4">
        <button
          className="px-6 py-2 text-white bg-blue-900 rounded"
          onClick={() => setTabs((prevTabs) => [...prevTabs, ""])}
        >
          Add
        </button>
        <button
          className="px-6 py-2 text-white bg-blue-900 rounded"
          onClick={generateUrl}
        >
          Create
        </button>
      </div>

      {showLink && <LinkWindow link={link} />}
    </div>
  );
};

export default Home;
