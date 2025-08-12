import React, { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";

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
      <div className="hidden xl:block ">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          <h1 className="text-slate-800 font-semibold">Sponsored</h1>
          <img
            src={assets.sponsored_img}
            className="w-75 h-50 rounded-md"
            alt=""
          />
          <p className="text-slate-600">Email marketing</p>
          <p className="">
            Supercharge your marketing with a powerful, easy-to-use platfoem
            built for results{" "}
          </p>
        </div>
        <RecentMessages />
      </div>
    </div>
  );
};

export default Feed;
