import React, { useEffect, useState } from "react";
import { dummyUserData } from "../assets/assets";
import { Image, X } from "lucide-react";

const CreatePost = () => {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]); // Store selected images
  const [text, setText] = useState(""); // Store post text

  // Load user data (dummy for now)
  useEffect(() => {
    setUser(dummyUserData);
  }, []);

  // Handle text change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]); // Add to previous images
  };

  // Remove a selected image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle publish (just logs for now)
  const handlePublish = () => {
    console.log("Post Text:", text);
    console.log("Images:", images);
    alert("Post Published! (Check console)");
    setText("");
    setImages([]);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-1">Create Post</h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        Share your thoughts with the world
      </p>

      {/* Post Box */}
      <div className="max-w-[364px] md:max-w-[576px] shadow bg-white p-5 rounded-lg flex flex-col">
        {/* User Info */}
        <div className="flex gap-2 items-center">
          <img
            src={user?.profile_picture}
            className="w-12 h-12 rounded-full"
            alt="User"
          />
          <div>
            <h1>{user?.full_name}</h1>
            <p className="text-xs text-gray-600">@{user?.username}</p>
          </div>
        </div>

        {/* Text Field */}
        <textarea
          placeholder="What's happening?"
          value={text}
          onChange={handleTextChange}
          className="mt-5 p-2 border border-gray-300 rounded-md w-full"
          rows="3"
        ></textarea>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`upload-${index}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
                {/* Remove button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-black bg-opacity-50 p-1 rounded-full text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center mt-3">
          {/* Upload Image Button */}
          <label className="text-gray-500 cursor-pointer flex items-center gap-1">
            <Image />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="px-3 py-1 bg-[#9810FA] text-white rounded-lg hover:bg-[#7c0cc6]"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
