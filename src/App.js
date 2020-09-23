import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
import useSocket from "use-socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

const data = [];

export default function App() {
  const [initialMsg, setInitial] = useState(true);
  const [input, setInput] = useState("");
  const [words, setWords] = useState([]);
  const [socket] = useSocket("https://general-tub.glitch.me");

  socket.connect();

  useEffect(() => {
    const addMsg = (msg) => {
      let currentMsg = msg.split(" ").reverse().map(scrambble).join(" ");
      data.unshift(currentMsg);
      setWords([...data]);
    };

    // When initially joins
    socket.on("chat join", (msgs) => {
      msgs.forEach((msg) => {
        addMsg(msg);
      });
    });

    // When sends message
    socket.on("chat message", (msg) => {
      addMsg(msg);
    });
  }, [socket]);

  const clickHandler = () => {
    setInitial(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (input.trim() !== "") {
      socket.emit("chat message", input);

      setInput("");
    }
  };

  const scrambble = (word) => {
    const firstChar = word[0];
    const lastChar = word[word.length - 1];
    let restChar = word.slice(1, word.length - 1).split("");

    for (let i = 0; i < 100; i++) {
      const tempChar = restChar[i];
      const randomChar = Math.floor(Math.random() * restChar.length);
      restChar[i] = restChar[randomChar];
      restChar[randomChar] = tempChar;
    }

    return firstChar + restChar.join("") + lastChar;
  };

  return (
    <div className="app">
      <div
        className={
          initialMsg === true ? "popup-container" : "popup-container hide"
        }
        style={{
          display: "flex"
        }}
      >
        <div className="popup">
          <h2>Welcome to the "Different chat"</h2>
          <p>This chat is kinda different than you might be used before.</p>
          <p>Let's see if you figure out what's going on!</p>
          <p>
            So... Enjoy!{" "}
            <span role="img" aria-label="">
              😆
            </span>
          </p>
          <button onClick={clickHandler}>Start Chatting</button>
        </div>
      </div>
      <div className="messages-container">
        <ul className="messages">
          {words.map((word, idx) => (
            <li key={idx}>{word}</li>
          ))}
        </ul>
        <form onSubmit={submitHandler} className="send-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a message..."
            autoComplete="off"
          />
          <button type="submit">
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
