import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SignupForm from "../components/Auth/SignupForm";
import SigninForm from "../components/Auth/SigninForm";

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentMode = searchParams.get("mode");

  const isSigninMode =
    currentMode === "signin" ||
    !currentMode ||
    (currentMode !== "signup" && currentMode !== "signin");
  const modeToDisplay = isSigninMode ? "signin" : "signup";

  const handleChangeMode = (mode) => {
    setSearchParams({ mode });
  };

  useEffect(() => {
    if (
      !currentMode ||
      (currentMode !== "signin" && currentMode !== "signup")
    ) {
      setSearchParams({ mode: "signin" }, { replace: true });
    }
  }, [currentMode, setSearchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center mb-6">
        {isSigninMode ? (
          <>
            <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
            <p className="text-sm text-gray-500/90 mt-3">
              Welcome back! Please sign in to continue.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl text-gray-900 font-medium">Sign up</h2>
            <p className="text-sm text-gray-500/90 mt-3">
              Hello! Please sign up to continue.
            </p>
          </>
        )}
      </div>

      {isSigninMode ? <SigninForm /> : <SignupForm />}

      <p className="text-gray-500/90 text-sm mt-4">
        {isSigninMode ? (
          <>
            Don’t have an account?{" "}
            <a
              onClick={() => handleChangeMode("signup")}
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              Sign up
            </a>
          </>
        ) : (
          <>
            Have an account?{" "}
            <a
              onClick={() => handleChangeMode("signin")}
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              Sign in
            </a>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthPage;
