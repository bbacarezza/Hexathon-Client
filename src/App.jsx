import React from "react";
import background from "./screen-app.png";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import io from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://localhost:4000");

const App = () => {
  const [recording, setRecording] = useState(false);
  const speecher = new SpeechSynthesisUtterance();

  const { transcript, resetTranscript } = useSpeechRecognition({
    continuous: true,
  });

  const [messages, setMessages] = useState("");

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("mensaje", message);
      setMessages(message);
    });

    return () => {
      socket.off("message", (message) => {
        console.log("mensaje", message);
        setMessages([...messages, { body: message }]);
      });
    };
  }, []);

  useEffect(() => {
    speecher.text = messages;
    speechSynthesis.speak(speecher);
  }, [messages]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  const onMouseDown = (e) => {
    e.preventDefault();
    SpeechRecognition.startListening();
    setRecording(true);
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    SpeechRecognition.stopListening();
    console.log("mensaje emitido");
    socket.emit("message", transcript);
    setRecording(false);
  };

  return (
    <div className=" bg-slate-200 mx-0 my-0 h-screen relative	">
      <image src={background} className="h-24 w-4/12" />
      <div>
        <h1 className="shadow-md bg-slate-700 p-2 rounded-md text-white absolute right-20 bottom-1">
          {transcript}
        </h1>
        <h1 className="shadow-md bg-slate-700 p-2 rounded-md text-white absolute right-2 bottom-20">
          {messages}
        </h1>
        <div className=" absolute bottom-2 right-2">
          <button
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className=" h-16 w-16 rounded-full bg-white relative shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={[
                " w-10 h-10 align-middle absolute left-[15%] top-[15%] ",
                recording ? " text-red-500" : " text-blue-500",
              ]}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default App;
