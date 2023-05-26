"use client";

import { useState, Fragment, useRef } from "react";

interface Conversation {
  role: string;
  content: string;
}

export default async function Home() {
  const [value, setValue] = useState("");
  const [conservation, setConservation] = useState<Conversation[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const chatHistory = [...conservation, { role: "user", content: value }];
      const response = await fetch("/api/openAiChat", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ messages: chatHistory }),
      });
      const data = await response.json();
      setValue("");
      setConservation([
        ...chatHistory,
        { role: "assistant", content: data.result.choices[0].message.content },
      ]);
    }
  };
  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue("");
    setConservation([]);
  };
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center mt-40">
        <h1 className="text-xl">Hello, Im chatbot</h1>
      </div>
      <div className="flex items-center justify-center my-12">
        <p className="font-bold">Give me questions!</p>
        <input
          placeholder="type here"
          className="mx-2 w-full max-w-xs input input-bordered input-secondary"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleRefresh}>New converation</button>
        <div className="textarea">
          {conservation.map((item, index) => (
            <Fragment key={index}>
              <br />
              {item.role === "assistant" ? (
                <div className="chat chat-end">
                  <div className="chat-bubble-secondary chat-bubble">
                    <strong className="badge badge-primary">Siu</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              ) : (
                <div className="chat chat-end">
                  <div className="chat-bubble-primary chat-bubble">
                    <strong className="badge badge-primary">User</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
