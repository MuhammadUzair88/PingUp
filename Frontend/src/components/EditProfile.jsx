import React, { useState, useEffect } from "react";
import { useUser2 } from "../context/UserContext";

const EditProfile = () => {
  const { userData, EditProfile } = useUser2();

  const [editForm, setEditForm] = useState(null);

  // Initialize form when userData becomes available
  useEffect(() => {
    if (userData) {
      setEditForm({
        username: userData.username || "",
        bio: userData.bio || "",
        location: userData.location || "",
        profile_picture: null,
        cover_photo: null,
        full_name: userData.full_name || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm((prev) => ({
        ...prev,
        [type]: file,
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (editForm) {
      await EditProfile(editForm);
      console.log("Saved profile data: ", editForm);
    }
  };

  // 🔥 Guard render until form is ready
  if (!editForm) {
    return (
      <div className="fixed top-0 bottom-0 left-0 right-0 z-110 h-screen flex items-center justify-center bg-black/50">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50">
      <div className="max-w-2xl sm:py-10 mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Profile
          </h1>
          <form className="space-y-5" onSubmit={handleSaveProfile}>
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <img
                  src={
                    editForm.profile_picture
                      ? URL.createObjectURL(editForm.profile_picture)
                      : userData.profile_picture
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "profile_picture")}
                className="text-sm text-gray-600"
              />
            </div>

            {/* Cover Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Photo
              </label>
              <div className="w-full h-40 rounded-lg overflow-hidden mb-2">
                <img
                  src={
                    editForm.cover_photo
                      ? URL.createObjectURL(editForm.cover_photo)
                      : userData.cover_photo
                  }
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "cover_photo")}
                className="text-sm text-gray-600"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="full_name"
                value={editForm.full_name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-lg resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
