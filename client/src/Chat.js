import React, { useEffect, useState } from "react";
import SrcollToBottom from "react-scroll-to-bottom";
// import useScrollToBottom from "react-scroll-to-bottom/lib/hooks/useScrollToBottom";

const Chat = ({ socket, room, username }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage, // 여기서 이거 메세지 빼고 다 자동으로 들어가
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      //   아! 위에서 날짜 불러올꺼니까 기다린 다음에 처리해 달라는 의미인듯
      await socket.emit("send_message", messageData);
      // console.log(messageData);
      setMessageList((list) => [...list, messageData]);
      setcurrentMessage("");
    }
  };
  useEffect(() => {
    socket.on("first_messages", (data) => {
      console.log(data);
    });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("받은데이터");
      console.log(data);
      console.log(username);
      console.log(data.author);

      setMessageList((list) => [...list, data]);
    });
    //이쪽에 이상이 있는거같아
  }, [socket]);

  useEffect(() => {
    socket.on("first_messages", (Messages) => {
      console.log(Messages);
      Messages.forEach((message) => {
        setMessageList((list) => [...list, message]);
      });
    });
  }, []);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>carping</p>
      </div>
      <div className="chat-body">
        <SrcollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </SrcollToBottom>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setcurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
