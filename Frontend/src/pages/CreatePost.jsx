import React, { useState, useEffect } from "react";
import { Image, X } from "lucide-react";
import { useUser2 } from "../context/UserContext";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const CreatePost = () => {
  const { userData } = useUser2();
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]); // actual File objects
  const [text, setText] = useState(""); // post text
  const { getToken } = useAuth();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  // Handle text change
  const handleTextChange = (e) => setText(e.target.value);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Remove a selected image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle publish
  const handlePublish = async () => {
    if (!text && images.length === 0) {
      alert("Please write something or add an image.");
      return;
    }

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("content", text);
      formData.append("post_type", images.length > 0 ? "image" : "text");

      images.forEach((file) => {
        formData.append("image", file); // backend: req.files
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/post/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("✅ Post created successfully");
        setText("");
        setImages([]);
      } else {
        alert("❌ Failed to create post");
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      alert(error.response?.data?.message || "Server error");
    }
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
        {user && (
          <div className="flex gap-2 items-center">
            <img
              src={user.profile_picture}
              className="w-12 h-12 rounded-full"
              alt="User"
            />
            <div>
              <h1>{user.full_name}</h1>
              <p className="text-xs text-gray-600">@{user.username}</p>
            </div>
          </div>
        )}

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
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`upload-${index}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
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
