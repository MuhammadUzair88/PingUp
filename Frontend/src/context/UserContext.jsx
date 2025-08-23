import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const { getToken } = useAuth();

  // Fetch current user from backend
  const FetchCurrentUser = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/user/data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(res.data.User);
      console.log("Fetched user data:", res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      // Optional: redirect to login if unauthorized
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Edit profile

  const EditProfile = async (editForm) => {
    try {
      const token = await getToken();

      const res = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/user/update`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData(res.data.updatedUser);
      alert("Profile updated successfully");
      console.log("Profile updated:", res.data);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Run once when component mounts
  useEffect(() => {
    FetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, FetchCurrentUser, EditProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the UserContext
export const useUser2 = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
