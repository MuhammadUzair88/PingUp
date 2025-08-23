import React, { useEffect, useState } from "react";
import { Plus, UserPlus, Search, MessageCircle } from "lucide-react";
import { useUser2 } from "../context/UserContext";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const Discover = () => {
  const { userData, FetchCurrentUser } = useUser2();
  const currentUser = userData;

  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  const { getToken } = useAuth();

  // Fetch discover users whenever input changes
  useEffect(() => {
    const discoverUsers = async () => {
      try {
        const token = await getToken();
        const res = await axios.post(
          `${import.meta.env.VITE_BASEURL}/api/user/discover`,
          { input },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error discovering users:", error);
        setUsers([]);
      }
    };

    discoverUsers();
  }, [input, getToken]);

  // Follow / Unfollow handler
  const handleFollow = async (id) => {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/user/follow`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        await FetchCurrentUser();
      }
    } catch (err) {
      console.error("Error following user:", err);
      alert(err.response?.data?.message || "Failed to follow user");
    }
  };

  // Send connection request
  const handleSendRequest = async (id) => {
    try {
      const token = await getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/user/connect`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Connection request sent!");
        await FetchCurrentUser();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Error sending request:", err);
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-1">Discover People</h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Find people to follow and expand your network
      </p>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Search by name, username, or location..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 text-sm sm:text-base"
        />
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-xl shadow hover:shadow-md transition p-6 flex flex-col items-center text-center"
          >
            {/* Profile */}
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mb-4"
            />
            <h2 className="font-semibold text-lg">{user.full_name}</h2>
            <p className="text-gray-500 text-sm mb-3">@{user.username}</p>

            {/* Bio */}
            <p className="text-sm text-gray-700 line-clamp-3">
              {user.bio || "No bio available"}
            </p>

            {/* Info badges */}
            <div className="flex gap-2 mt-3 flex-wrap justify-center text-xs text-gray-600">
              <span className="px-2 py-1 border rounded-full">
                {user.location || "Unknown"}
              </span>
              <span className="px-2 py-1 border rounded-full">
                {user.followers?.length || 0} Followers
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-5 w-full">
              <button
                onClick={() => handleFollow(user._id)}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-1"
              >
                <UserPlus className="w-4 h-4" />
                {currentUser?.following.includes(user._id)
                  ? "Following"
                  : "Follow"}
              </button>
              <button
                onClick={() => {
                  if (!currentUser?.connections.includes(user._id)) {
                    handleSendRequest(user._id);
                  } else {
                    alert("Open chat page here"); // you can navigate to chat instead
                  }
                }}
                className="p-2 border rounded-lg hover:bg-gray-100 transition"
              >
                {currentUser?.connections.includes(user._id) ? (
                  <MessageCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
