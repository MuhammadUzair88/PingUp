import React, { useEffect, useState } from "react";
import { dummyRecentMessagesData } from "../assets/assets";
import { Link } from "react-router-dom";
import moment from "moment";
const RecentMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchRecentMessages = async () => {
    setMessages(dummyRecentMessagesData);
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  return (
    <div className="max-w-xs w-full bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow mt-4">
      <h1 className="font-semibold text-slate-800">Recent Messages</h1>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            key={index}
            className="flex items-start gap-2 py-2 hover:bg-slate-100 p-2"
          >
            <img
              src={message.from_user_id.profile_picture}
              className="w-8 h-8 rounded-full"
              alt=""
            />
            <div className="w-full">
              <div className=" flex justify-between items-center">
                <p className="font-medium">{message.from_user_id.full_name}</p>

                <p className="text-[10px] text-slate-400">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>
              <div className="flex justify-between mt-1">
                <p>{message.text ? message.text : "Media"}</p>
                {!message.seen && (
                  <p className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                    1
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
