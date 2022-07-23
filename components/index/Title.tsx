import { NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}

const Title: NextPage<Props> = ({ title, setTitle }) => {
  return (
    <>
      <input
        type="text"
        value={title}
        placeholder="Type your title ..."
        className="p-3 w-1/2 text-xl text-white bg-slate-800 rounded sm:w-full"
        onChange={(e) => setTitle(e.target.value)}
      />
    </>
  );
};

export default Title;
