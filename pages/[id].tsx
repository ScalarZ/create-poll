import { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  onSnapshot,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { getCookie } from "../utilis/getCookie";
import { setCookie } from "../utilis/setCookie";
import { db } from "../utilis/firebaseClient";

type Tab = {
  id: string;
  tab: string;
  votes: number;
};

interface Props {
  id: string;
  title: string;
}

const PollPage: NextPage<Props> = (props) => {
  const [title] = useState(props.title);
  const [tabs, setTabs] = useState<Array<Tab>>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedId, setSelectedId] = useState("false");

  const handleVote = async (id: string, index: number) => {
    if (!hasVoted) {
      setTotalVotes((prevVotes) => prevVotes + 1);
      setTabs((prevTabs) => {
        prevTabs[index].votes += 1;
        return prevTabs;
      });
      setCookie("id", id, 1 / 24);
      setHasVoted(true);
      setSelectedId(id);

      const docTab = doc(db, "urls", props.id, "tabs", id);

      try {
        const data = await setDoc(
          docTab,
          {
            votes: tabs[index].votes + 1,
          },
          { merge: true }
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "urls", props.id, "tabs"),
      (querySnapshot) => {
        let tabs: Array<Tab> = [];
        let votes = 0;
        querySnapshot.forEach((doc) => {
          const typeDoc = doc.data() as Tab;

          tabs = [...tabs, { ...typeDoc, id: doc.id }];
          votes += doc.data().votes;
        });

        setTotalVotes(votes);
        setTabs(tabs);
      }
    );

    return () => {
      unsub();
    };
  }, [props]);

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(
        collection(db, "urls", props.id, "tabs")
      );

      let tabs: Array<Tab> = [];
      let votes = 0;

      querySnapshot.forEach((doc) => {
        const typeDoc = doc.data() as Tab;
        tabs = [...tabs, { ...typeDoc, id: doc.id }];
        votes += doc.data().votes;
      });

      setTotalVotes(votes);
      setTabs(tabs);

      const id = getCookie("id");

      if (id != "") {
        setHasVoted(true);
        setSelectedId(id);
      }
    };

    getData();
  }, [props]);

  return (
    <div className="p-8 min-h-screen bg-gray-900">
      <h1 className="mx-auto px-4 py-8 max-w-max text-8xl text-transparent bg-gradient-to-r font-bold from-cyan-500 to-blue-700 bg-clip-text sm:text-6xl">
        Poll
      </h1>
      <h2 className="mb-8 text-3xl text-white text-center">{title}</h2>

      <ul className="space-y-4 flex flex-col items-center">
        {tabs.map(({ id, tab, votes }, index) => (
          <li
            key={id}
            className={`p-4 w-1/2 flex border-2 ${
              selectedId === id ? "border-cyan-500" : "border-transparent"
            } flex-col space-y-2 text-xl text-white bg-slate-800 rounded cursor-pointer ${
              !hasVoted && "hover:border-cyan-500"
            } sm:w-full`}
            onClick={() => handleVote(id, index)}
          >
            <label className="flex justify-between cursor-pointer">
              <span>{tab}</span>
              <span>{votes}</span>
            </label>
            <progress
              max={totalVotes}
              value={votes}
              className="h-2 w-full bg-white appearance-none"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const urlID = params?.id;

  const q = query(collection(db, "urls"), where("urlID", "==", urlID));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.size) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  let id = "";
  let title = "";
  let time = 0;
  querySnapshot.forEach((doc) => {
    id = doc.id;
    title = doc.data()?.title;
    time = doc.data()?.end_at - Timestamp.now().seconds;
  });

  if (time <= 0) {
    await deleteDoc(doc(db, "urls", id));
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
      title,
    },
  };
};

export default PollPage;
