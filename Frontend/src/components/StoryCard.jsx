import { ArrowLeft, Text, Upload, PlusCircle } from "lucide-react";
import React, { useState } from "react";

const StoryCard = ({ setCreateStory }) => {
  const bgColors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488",
  ];

  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [isText, setIsText] = useState(true);
  const [media, setMedia] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log("Story submitted:", { text, media, background });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-neutral-800 bg-opacity-90 z-50 p-4">
      <div className="flex flex-col gap-4 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => setCreateStory(false)}
            className="text-white cursor-pointer"
          />
          <h1 className="text-white font-semibold text-lg">Create Story</h1>
        </div>

        {/* Text or Media Area */}
        {isText ? (
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-4 rounded-lg resize-none text-white text-lg font-medium focus:outline-none"
            style={{ backgroundColor: background }}
          />
        ) : (
          <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-indigo-400 transition">
            <Upload className="text-white mb-2" size={30} />
            <span className="text-white">Click to upload photo/video</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {media && (
              <p className="mt-2 text-sm text-gray-300">{media.name}</p>
            )}
          </label>
        )}

        {/* Color Picker (only for text mode) */}
        {isText && (
          <div className="flex gap-2 flex-wrap">
            {bgColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setBackground(color)}
                className={`w-9 h-9 rounded-full border-2 ${
                  background === color ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Mode Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsText(true)}
            className={`w-[220px] h-[40px] rounded-lg flex items-center justify-center gap-1 cursor-pointer ${
              isText ? "bg-white text-black" : "bg-[#27272A] text-white"
            }`}
          >
            <Text /> <span>Text</span>
          </button>
          <button
            onClick={() => setIsText(false)}
            className={`w-[220px] h-[40px] rounded-lg flex items-center justify-center gap-1 cursor-pointer  ${
              !isText ? "bg-white text-black" : "bg-[#27272A] text-white"
            }`}
          >
            <Upload /> <span>Photo/Video</span>
          </button>
        </div>

        {/* Submit Story Button */}
        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          style={{
            background: "linear-gradient(to right, #615FFF, #9810FA)",
          }}
        >
          <PlusCircle size={22} />
          Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
