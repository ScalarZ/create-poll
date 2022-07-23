import { NextPage } from "next";
import { useRef, useState } from "react";

interface Props {
  link: string;
}

const LinkWindow: NextPage<Props> = ({ link }) => {
  const [toggle, setToggle] = useState(false);
  const [timeOut, setTimeOut] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyLink = () => {
    clearTimeout(timeOut);
    inputRef.current?.select();
    inputRef.current?.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(inputRef.current?.value || "");
    setToggle(true);
    setTimeOut(
      setTimeout(() => {
        setToggle(false);
      }, 1000)
    );
  };

  return (
    <div className="fixed p-4 min-h-full w-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-80">
      <div className="p-8 w-1/2 text-white bg-blue-900 rounded lg:w-full">
        <h2 className="mb-4 text-2xl text-center">
          Copy the poll link and start sharing it
        </h2>
        <div className="flex items-center sm:space-y-2 sm:flex-col">
          <input
            ref={inputRef}
            type="text"
            value={link}
            readOnly={true}
            placeholder="Type your title ..."
            className="p-3 text-xl text-white bg-gray-900 rounded pointer-events-none flex-grow"
          />
          <button
            className="relative ml-4 px-6 py-3.5 text-white bg-gray-900 rounded"
            onClick={handleCopyLink}
          >
            <span
              style={{
                transition: toggle ? "200ms ease-out" : "0s",
                transform: toggle
                  ? "translate(-50%, 0)"
                  : "translate(-50%, 100%)",
                opacity: toggle ? 100 : 0,
              }}
              className="absolute px-6 py-3 -top-16 left-1/2 bg-gray-700 after:content-[attr(data-toggle)] after:absolute after:p-2 after:-bottom-2 after:left-1/2 after:transform after:-translate-x-1/2 after:rotate-45 after:bg-gray-700"
            >
              Copied
            </span>
            Copy 🔗
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkWindow;
