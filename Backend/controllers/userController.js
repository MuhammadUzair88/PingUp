
//Get User Data using userId

import imagekit from "../config/ImageKit.js";
import User from "../models/User.js";
import fs from 'fs';

export const getUser=async(req,res)=>{
    
try{
    const {userId}=req.auth();

    const findUser=await User.findById(userId);

    if(!findUser){
      return res.status(404).json({success:false,message:"Unable to find User"})

    }
    res.status(200).json({success:true,User:findUser})
}
catch(error){
     res.status(500).json({success:false,message:error.message})
}
}

//update user data

export const UpdateUser=async(req,res)=>{
   try{
     const {userId}=req.auth();
    const {username,bio,location,full_name}=req.body;
    
    const tempUser=await User.findById(userId)

    if(tempUser.username!==username){
      const user=await User.findOne({username})
      if(user){
        return res.status(404).json({success:false,message:"Username Already Exist"})
      }
    }
    const UpdatedUser={
      username:username,
      bio:bio,
      location:location,
      full_name:full_name,
    }
    const profile=req.files.profile && req.files.profile[0]
    const cover=req.files.cover && req.files.cover[0]
    
    if(profile){
      const buffer=fs.readFileSync(profile.path)
      const response=await imagekit.upload({
        fileName:profile.originalname,
        file:buffer,
      })

      const url=imagekit.url({
        path:response.filePath,
        transformation:[
        {quality:'auto'},
        {format:'webp'},
        {width:'512'}
        ]
      })

      UpdatedUser.profile_picture=url;
    }

       if(cover) {
      const buffer=fs.readFileSync(cover.path)
      const response=await imagekit.upload({
        fileName:cover.originalname,
        file:buffer,
      })

      const url=imagekit.url({
        path:response.filePath,
        transformation:[
        {quality:'auto'},
        {format:'webp'},
        {width:'512'}
        ]
      })

      UpdatedUser.cover_photo=url;
    }
    
    const user=await User.findByIdAndUpdate(userId,
      UpdatedUser,{
        new:true
      }
    )

    res.json({success:true,user,message:'profile updated successfully'})

   }
catch(error){
  console.log(error)
  res.json({success:false,message:error.message})
}
    
}


//find users based on username,email,location,name

export const discoverUsers = async (req, res) => {
  try {
    const {userId}=req.auth();
    const {input} = req.body;

    // search users by username, full_name, email, or location
    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    // filter out the current user
    const filteredUsers = allUsers.filter((user) => user._id !== userId);

    res.status(200).json({
      success: true,
      users: filteredUsers,
    });
  } catch (error) {
    console.error("Error discovering users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while discovering users",
      error: error.message,
    });
  }
};

//follow 

export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth(); // current user
    const { id } = req.body; // receiver user

    // find current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // check if already following
    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You have already followed this user",
      });
    }

    // add to following list
    user.following.push(id);
    await user.save();

    // find receiver
    const receiver = await User.findById(id);
    if (!receiver) {
      return res.status(404).json({ success: false, message: "Receiver not found" });
    }

    // check if already in followers list
    if (receiver.followers.includes(userId)) {
      return res.json({
        success: false,
        message: "Already in receiver's follower list",
      });
    }

    // add to followers list
    receiver.followers.push(userId);
    await receiver.save();

    return res.json({ success: true, message: "Followed successfully" });
  } catch (error) {
    console.error("Error in followUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

//Unfollow User

// const UnfollowUser = async (req, res) => {
//   try {
//     const { userId } = req.auth(); // current user
//     const { id } = req.body; // receiver user

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (user.following.includes(id)) {
//       // filter out the unfollowed user
//       user.following = user.following.filter(
//         (followedId) => followedId.toString() !== id.toString()
//       );

//       await user.save();

//       // also remove current user from receiver's followers
//       const receiver = await User.findById(id);
//       if (receiver) {
//         receiver.followers = receiver.followers.filter(
//           (followerId) => followerId.toString() !== userId.toString()
//         );
//         await receiver.save();
//       }

//       return res.json({ success: true, message: "Unfollowed successfully" });
//     } else {
//       return res.json({ success: false, message: "You are not following this user" });
//     }
//   } catch (error) {
//     console.error("Unfollow error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const unFollowUser = async (req, res) => {
  try {
    const { userId } = req.auth(); // current user
    const { id: receiverId } = req.body; // receiver user

    const user = await User.findById(userId);       // current user
    const receiver = await User.findById(receiverId); // user being unfollowed

    if (!user || !receiver) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ---- remove receiver from current user's following ----
    let updatedFollowing = [];
    updatedFollowing = user.following.filter(followId => followId.toString() !== receiverId);
    user.following = updatedFollowing;
    await user.save();

    // ---- remove current user from receiver's followers ----
    let updatedFollowers = [];
    updatedFollowers = receiver.followers.filter(followerId => followerId.toString() !== userId);
    receiver.followers = updatedFollowers;
    await receiver.save();

    return res.json({ success: true, message: "Unfollowed successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

