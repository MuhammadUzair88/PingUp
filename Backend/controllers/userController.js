
//Get User Data using userId

import imagekit from "../config/ImageKit.js";
import Connection from "../models/Connection.js";
import User from "../models/User.js";
import fs from 'fs';
import Post from "../models/Post.js";


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
    const profile=req.files.profile_picture && req.files.profile_picture[0]
    const cover=req.files.cover_photo && req.files.cover_photo[0]
    
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


//send Connection request

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth(); // current user
    const { id: receiverId } = req.body; // receiver user

    // check if connection request already exists
    const findConnection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: receiverId },
        { from_user_id: receiverId, to_user_id: userId },
      ],
    });

    if (findConnection) {
      return res.json({
        success: false,
        message: "Connection Request Already exists",
      });
    }

    // create new connection request
    const ConnectionRequest = new Connection({
      from_user_id: userId,
      to_user_id: receiverId,
    });

    await ConnectionRequest.save();

    return res.json({
      success: true,
      message: "Connection Request Sent Successfully",
      data: ConnectionRequest,
    });
  } catch (error) {
    console.error("Error sending connection request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


//get User Connections

export const GetUserConnections = async (req, res) => {
  try {
    const { userId } = req.auth(); // current user

    const user = await User.findById(userId).populate(
      "connections followers following"
    );

    const Connections = user.connections;
    const followers = user.followers;
    const following = user.following;

    // ✅ get pending requests to accept them
    const pendingConnections = await Connection.find({
      to_user_id: userId,
      status: "pending",
    }).populate("from_user_id");

    res.json({
      connections: Connections,
      followers,
      following,
      pendingConnections,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

//Accept User Request

// Accept User Request
// Accept User Request
export const AcceptRequest = async (req, res) => {
  try {
    const { userId } = req.auth(); // current user (receiver)
    const { id } = req.body; // sender id

    // ✅ update connection status
    const acceptConnection = await Connection.findOneAndUpdate(
      { from_user_id: id, to_user_id: userId },
      { status: "accepted" },
      { new: true }
    );

    if (!acceptConnection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    // ✅ add each other in User.connections
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: id }, // prevent duplicates
    });

    await User.findByIdAndUpdate(id, {
      $addToSet: { connections: userId },
    });

    res.status(200).json({
      success: true,
      message: "Connection request accepted",
      connection: acceptConnection,
    });
  } catch (error) {
    console.error("Error accepting connection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getUserProfiles=async(req,res)=>{
  try{
    const {profileId}=req.params;
    const profile=await User.findById(profileId)
    if(!profile){
      return res.status(404).json({success:false,message:"Profile not found"})
    }
    const posts=await Post.find({ user: profileId }).populate('user')
    res.status(200).json({success:true,profile,posts})

  }
  catch(error){
    console.error(error);
    res.status(500).json({success:false,message:error.message})
  }
}






