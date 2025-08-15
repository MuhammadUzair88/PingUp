import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  Home,
  MessageSquare,
  Users,
  Search,
  User,
  PlusCircle,
  LogOut,
  Settings,
} from "lucide-react";
import { useUser, SignOutButton, UserProfile } from "@clerk/clerk-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showAccount, setShowAccount] = useState(false); // 👈 toggle for account UI

  const menuItems = [
    { label: "Feed", icon: <Home size={20} />, path: "/" },
    { label: "Messages", icon: <MessageSquare size={20} />, path: "/messages" },
    { label: "Connections", icon: <Users size={20} />, path: "/connections" },
    { label: "Discover", icon: <Search size={20} />, path: "/discover" },
    { label: "Profile", icon: <User size={20} />, path: "/profile" },
  ];

  return (
    <div
      className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center
      sm:relative sm:translate-x-0 max-sm:fixed max-sm:top-0 max-sm:bottom-0 z-20
      transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Top Section */}
      <div className="w-full">
        {/* Logo */}
        <img
          onClick={() => {
            navigate("/");
            setSidebarOpen(false);
          }}
          src={assets.logo}
          className="w-26 ml-7 my-4 cursor-pointer"
          alt="Logo"
        />
        <hr className="border-gray-300 mb-8" />

        {/* Navigation Menu */}
        <ul className="space-y-4 px-6">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 cursor-pointer"
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="w-full px-6 mb-6 space-y-4">
        {/* Create Post Button */}
        <button
          onClick={() => {
            navigate("/create-post");
            setSidebarOpen(false);
          }}
          className="flex items-center justify-center w-full py-2 rounded-xl text-white font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
        >
          <PlusCircle className="mr-2" size={20} /> Create Post
        </button>

        {/* User Info */}
        {user && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between bg-gray-100 rounded-xl p-3">
              <div className="flex items-center space-x-3">
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                  {user.firstName}
                </span>
              </div>

              {/* Sign Out */}
              <SignOutButton>
                <button className="p-2 text-gray-500 hover:text-red-500">
                  <LogOut size={18} />
                </button>
              </SignOutButton>
            </div>

            {/* Manage Account Button */}
            <button
              onClick={() => setShowAccount(!showAccount)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600"
            >
              <Settings size={16} />
              <span>Manage Account</span>
            </button>

            {/* User Profile UI (Toggle) */}
            {showAccount && (
              <div className="bg-white border rounded-xl p-2 shadow-md">
                <UserProfile routing="virtual" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
