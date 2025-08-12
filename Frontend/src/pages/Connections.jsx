import React, { useState } from "react";
import {
  dummyFollowersData,
  dummyFollowingData,
  dummyPendingConnectionsData,
  dummyConnectionsData,
} from "../assets/assets"; // adjust path as needed

const tabs = [
  { key: "followers", label: "Followers", data: dummyFollowersData },
  { key: "following", label: "Following", data: dummyFollowingData },
  { key: "pending", label: "Pending", data: dummyPendingConnectionsData },
  { key: "connections", label: "Connections", data: dummyConnectionsData },
];

const Connections = () => {
  const [activeTab, setActiveTab] = useState("followers");

  const activeData =
    tabs.find((t) => t.key === activeTab)?.data || dummyFollowersData;

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
          <p className="text-lg font-semibold">{dummyFollowersData.length}</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <p className="text-lg font-semibold">{dummyFollowingData.length}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <p className="text-lg font-semibold">
            {dummyPendingConnectionsData.length}
          </p>
          <p className="text-gray-500 text-sm">Pending</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <p className="text-lg font-semibold">{dummyConnectionsData.length}</p>
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
        {activeData.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center sm:items-start sm:flex-row gap-4"
          >
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-semibold text-lg truncate">
                {user.full_name}
              </h2>
              <p className="text-gray-500 text-sm truncate">@{user.username}</p>
              <p className="text-sm mt-1 line-clamp-2">{user.bio}</p>
              <button className="mt-3 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md text-sm">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
