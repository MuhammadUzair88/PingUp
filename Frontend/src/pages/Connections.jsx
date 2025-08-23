import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const tabs = [
  { key: "followers", label: "Followers" },
  { key: "following", label: "Following" },
  { key: "pending", label: "Pending" },
  { key: "connections", label: "Connections" },
];

const Connections = () => {
  const [activeTab, setActiveTab] = useState("followers");
  const [data, setData] = useState({
    followers: [],
    following: [],
    pending: [],
    connections: [],
  });

  const { getToken } = useAuth();

  // ✅ Fetch connections on mount
  const fetchConnections = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/user/connections`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData({
        followers: res.data.followers || [],
        following: res.data.following || [],
        pending: res.data.pendingConnections || [],
        connections: res.data.connections || [],
      });
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // ✅ Unfollow handler
  const handleUnfollow = async (id) => {
    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/user/unfollow`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchConnections();
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  // ✅ Accept pending connection
  const handleAccept = async (id) => {
    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/user/accept`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchConnections();
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  // choose correct dataset
  const activeData =
    activeTab === "followers"
      ? data.followers
      : activeTab === "following"
      ? data.following
      : activeTab === "pending"
      ? data.pending
      : data.connections;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-1">Connections</h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Manage your network and discover new connections
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <p className="text-lg font-semibold">{data.followers.length}</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <p className="text-lg font-semibold">{data.following.length}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <p className="text-lg font-semibold">{data.pending.length}</p>
          <p className="text-gray-500 text-sm">Pending</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <p className="text-lg font-semibold">{data.connections.length}</p>
          <p className="text-gray-500 text-sm">Connections</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-full border text-sm sm:text-base ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeData.map((user) => {
          // if it's pending tab → user object is inside `from_user_id`
          const userObj = activeTab === "pending" ? user.from_user_id : user;

          return (
            <div
              key={userObj._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center sm:items-start sm:flex-row gap-4"
            >
              <img
                src={userObj.profile_picture}
                alt={userObj.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-semibold text-lg truncate">
                  {userObj.full_name}
                </h2>
                <p className="text-gray-500 text-sm truncate">
                  @{userObj.username}
                </p>
                <p className="text-sm mt-1 line-clamp-2">
                  {userObj.bio || "No bio"}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md text-sm">
                    View Profile
                  </button>

                  {activeTab === "following" && (
                    <button
                      onClick={() => handleUnfollow(userObj._id)}
                      className="px-4 py-1.5 bg-red-500 text-white rounded-md text-sm"
                    >
                      Unfollow
                    </button>
                  )}

                  {activeTab === "pending" && (
                    <button
                      onClick={() => handleAccept(userObj._id)}
                      className="px-4 py-1.5 bg-green-500 text-white rounded-md text-sm"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
