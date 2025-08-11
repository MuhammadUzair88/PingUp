import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!viewStory) return;

    setProgress(0); // Reset when new story opens
    const duration = 5000; // story duration in ms (5s)
    const intervalTime = 50; // update every 50ms
    const increment = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(interval);
          setViewStory(null); // Close story after completion
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [viewStory, setViewStory]);

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return <img src={viewStory.media_url} alt="" />;
      case "text":
        return <p>{viewStory.content}</p>;
      case "video":
        return (
          <video
            onEnded={() => setViewStory(null)}
            src={viewStory.media_url}
            controls
            autoPlay
            alt=""
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center`}
      style={{
        backgroundColor:
          viewStory.media_type === "text"
            ? viewStory.background_color
            : "#000000",
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* User Info - top left */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
        <img
          src={viewStory.user?.profile_picture}
          alt=""
          className="size-7 sm:size-8 rounded-full object-cover border border-white"
        />
        <div>
          <span>{viewStory.user?.full_name}</span>
        </div>
      </div>

      <div
        onClick={() => setViewStory(null)}
        className="absolute top-4 right-4 flex items-center p-2 px-4 sm:p-4 sm:px-8 text-white "
      >
        <ArrowLeft />
      </div>

      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default StoryViewer;
