import fs from "fs";
import imagekit from "../config/ImageKit.js";
import Story from "../models/Story.js";


export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth(); // logged-in user
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";

    // Upload media to imagekit if exists
    if (media && (media_type === "image" || media_type === "video")) {
      const buffer = fs.readFileSync(media.path);
      const response = await imagekit.upload({
        fileName: media.originalname,
        file: buffer,
      });

      media_url = response.url;
    }

    // Create story
    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });

    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: story,
    });
  } catch (error) {
    console.error("Error adding story:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding story",
      error: error.message,
    });
  }
};


export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.auth(); // logged-in user

    // Fetch stories of the logged-in user and populate full user object
    const stories = await Story.find({ user: userId })
      .populate("user") // full user document
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User stories fetched successfully",
      data: stories,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching stories",
      error: error.message,
    });
  }
};