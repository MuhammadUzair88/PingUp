import React, { useState } from "react";
import { Plus, ArrowLeft, Upload, Type } from "lucide-react";

const StoryCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#4f46e5");

  const colors = [
    "#4f46e5",
    "#ec4899",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#14b8a6",
  ];

  return (
    <>
      {/* Add Story Card */}
      <div
        onClick={() => setShowModal(true)}
        className="rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white"
      >
        <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm font-medium text-slate-700 text-center">
            Create Story
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-4 relative">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button onClick={() => setShowModal(false)}>
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="ml-3 text-lg font-semibold">Create Story</h2>
            </div>

            {/* Textarea */}
            <textarea
              placeholder="What's on your mind?"
              className="w-full h-48 p-3 rounded-lg text-white resize-none focus:outline-none"
              style={{ backgroundColor: selectedColor }}
            />

            {/* Color Picker */}
            <div className="flex gap-2 mt-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Options */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 rounded-md py-2">
                <Type className="w-4 h-4" /> Text
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white rounded-md py-2">
                <Upload className="w-4 h-4" /> Photo/Video
              </button>
            </div>

            {/* Create Story Button */}
            <button className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md">
              <Plus className="inline-block w-4 h-4 mr-2" /> Create Story
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryCard;
