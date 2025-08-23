import React from "react";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import { Route, Routes } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import Layout from "./pages/Layout";
import { useEffect } from "react";
import { useUser2 } from "./context/UserContext";

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const { FetchCurrentUser } = useUser2();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await getToken();
      if (token) {
        FetchCurrentUser();
      }
    };
    fetchUserData();
  }, [user, getToken]);

  return (
    <div>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
