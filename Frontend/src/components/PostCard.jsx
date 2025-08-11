import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import React from "react";
import moment from "moment";

const PostCard = ({ feeds }) => {
  return (
    <div className="flex flex-col gap-2 bg-white shadow-lg max-w-sm max-h-xl md:max-w-5xl px-4 py-5 rounded-lg">
      {/* User Info */}
      <div className="flex items-center gap-2">
        <img
          src={feeds.user?.profile_picture}
          className="rounded-full w-12"
          alt={feeds.user?.full_name}
        />
        <div className="flex flex-col">
          <h1 className="font-semibold text-sm flex items-center gap-1">
            <span>{feeds.user?.full_name}</span>
            {feeds.user?.is_verified && <BadgeCheck size={16} />}
          </h1>
          <p className="text-xs text-gray-300">
            @{feeds.user?.username} • {moment(feeds.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      {feeds.content && <h1 className="text-sm">{feeds.content}</h1>}

      {/* Post Image */}
      {feeds.image_urls?.length > 0 && (
        <img
          src={feeds.image_urls[0]}
          className="object-cover rounded-lg"
          alt="post"
        />
      )}

      {/* Divider */}
      <div className="border border-b-1 text-gray-300"></div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Heart size={18} />
          <h1>{feeds.likes_count?.length || 0}</h1>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle size={18} />
          <h1>{feeds.comments_count || 0}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Share2 size={18} />
          <h1>{feeds.shares_count || 0}</h1>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
