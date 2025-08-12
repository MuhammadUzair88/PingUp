import React, { useEffect, useState } from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [connectionData, setConnectionData] = useState([]);

  const fetchData = async () => {
    setConnectionData(dummyConnectionsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 justify-center p-5">
      <h1 className="font-bold text-[#0F172B] text-2xl md:text-3xl">
        Messages
      </h1>
      <p className="text-lg">Talk to your friends and family</p>
      {connectionData.map((connection, index) => (
        <div
          key={index}
          className="w-full max-w-xl  flex flex-col justify-center shadow bg-white p-5"
        >
          <div className="flex gap-1 items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <img
                  src={connection.profile_picture}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div>
                  <h1 className="text-sm">{connection.full_name}</h1>
                  <h1 className="text-xs font-light text-gray-500">
                    @{connection.username}
                  </h1>
                </div>
              </div>
              <h1 className="text-sm ">{connection.bio}</h1>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <button
                onClick={() => navigate(`/messages/${connection._id}`)}
                className=""
              >
                <MessageCircle size={18} />
              </button>
              <button
                onClick={() => navigate(`/profile/${connection._id}`)}
                className=""
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
