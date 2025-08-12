import React, { useEffect, useState } from "react";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import { CheckCircle, MapPin, CalendarDays, Edit } from "lucide-react";
import moment from "moment";
import PostCard from "../components/PostCard";
import EditProfile from "../components/EditProfile";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [edit, setEdit] = useState(false);

  const fetchFeeds = async () => {
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  useEffect(() => {
    setProfile(dummyUserData);
  }, []);

  if (!profile) return null;

  return (
    <div className="max-w-xl md:max-w-[768px] mx-auto p-5 overflow-y-scroll no-scrollbar">
      {/* Cover Image */}
      <div className="relative pt-5">
        <img
          src={profile.cover_photo}
          alt="cover"
          className="w-full h-40 md:h-56 object-cover rounded-t-2xl"
        />

        {/* Profile Image */}
        <div className="absolute top-32 left-6 sm:top-32 sm:left-8 md:top-40 md:left-12">
          <img
            src={profile.profile_picture}
            className="rounded-full w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] border-4 border-white"
            alt="profile"
          />
        </div>
      </div>

      {/* Profile Card */}
      <div className="shadow bg-white rounded-b-2xl pt-14 px-6 pb-6">
        {/* Name and Edit Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              {profile.is_verified && (
                <CheckCircle className="text-blue-500 w-5 h-5" />
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              @{profile.username}
            </p>
          </div>
          <button
            onClick={() => setEdit(true)}
            className="px-4 py-1 border rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Edit
          </button>
        </div>

        {/* Bio */}
        <p className="mt-3 text-gray-700 whitespace-pre-line">{profile.bio}</p>

        {/* Location & Joined */}
        <div className="flex flex-wrap gap-4 mt-3 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {profile.location}
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            Joined {moment(profile.createdAt).fromNow()}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-4 pt-4 flex gap-6 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-bold">{profile.posts.length}</span> Posts
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{profile.followers.length}</span>{" "}
            Followers
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{profile.following.length}</span>{" "}
            Following
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {posts.map((post) => (
          <PostCard key={post._id} feeds={post} />
        ))}
      </div>
      {edit && <EditProfile />}
    </div>
  );
};

export default Profile;
