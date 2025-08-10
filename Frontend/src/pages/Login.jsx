import React from "react";
import { SignIn } from "@clerk/clerk-react";
import { assets } from "../assets/assets"; // bgImage, logo, avatars, etc.

const Login = () => {
  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{
        backgroundImage: `url(${assets.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Section */}
      <div className="flex flex-col justify-center flex-1 px-6 sm:px-10 lg:px-20 py-10 bg-gradient-to-tr from-white/95 via-white/70 to-transparent backdrop-blur-sm">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="Logo"
          className="h-8 sm:h-10 mb-6 sm:mb-8"
        />

        {/* Avatars + rating */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="flex">
            <img
              src={assets.group_users}
              className="w-12 sm:w-16"
              alt="Users"
            />
          </div>
          <div className="leading-tight">
            <div className="text-yellow-500 text-xs sm:text-sm">★★★★★</div>
            <p className="text-gray-600 text-xs sm:text-sm">
              Used by 12k+ developers
            </p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-indigo-900 leading-tight mb-4 sm:mb-6">
          More than just friends,
          <br />
          truly connect
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-md">
          Join a global network of like-minded people and connect effortlessly
          with Pingup.
        </p>
      </div>

      {/* Right Section (Sign In Form) */}
      <div className="flex flex-1 justify-center items-center bg-white/50 backdrop-blur-md p-6 sm:p-10">
        <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-5 sm:mb-6">
            Sign in to your account
          </h2>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300",
                card: "shadow-none",
                formFieldInput:
                  "rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
              },
            }}
          />
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
            Don’t have an account?{" "}
            <a
              href="/sign-up"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
