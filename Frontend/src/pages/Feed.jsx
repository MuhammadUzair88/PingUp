import React, { useEffect, useState } from "react";
import { dummyPostsData } from "../assets/assets";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [feeds, setfeeds] = useState([]);

  const fetchFeeds = async () => {
    setfeeds(dummyPostsData);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8 ">
      {/* Stories and post list */}
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} feeds={post} />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden md:block">
        <div>
          <h1>Sponsored</h1>
        </div>
        <h1>Recent messages</h1>
      </div>
    </div>
  );
};

export default Feed;
