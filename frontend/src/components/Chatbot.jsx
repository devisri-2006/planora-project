import { useState } from "react";


function Chatbot() {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);


  const sendMessage = async () => {

    if (!message.trim()) {
      return;
    }


    const userMessage = message;


    setMessages([
      ...messages,
      {
        sender: "user",
        text: userMessage
      }
    ]);


    setMessage("");


    try {

      const response = await fetch(
        "http://127.0.0.1:8000/chat/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: userMessage
          })
        }
      );


      const data = await response.json();


      setMessages(prev => [

        ...prev,

        {
          sender: "ai",
          text: data.response
        }

      ]);

    }

    catch (error) {

      console.error(error);

      setMessages(prev => [

        ...prev,

        {
          sender: "ai",
          text: "Unable to connect to PLANORA AI."
        }

      ]);

    }

  };


  return (

    <div className="chatbot">

      <h3>
        🤖 PLANORA AI Assistant
      </h3>


      <div className="chat-messages">

        {messages.length === 0 && (

          <p className="chat-placeholder">
            Ask me anything about your event...
          </p>

        )}


        {messages.map((item, index) => (

          <div
            key={index}
            className={
              item.sender === "user"
                ? "message user-message"
                : "message ai-message"
            }
          >

            {item.text}

          </div>

        ))}

      </div>


      <div className="chat-input">

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask PLANORA..."
        />


        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>

  );
}


export default Chatbot;