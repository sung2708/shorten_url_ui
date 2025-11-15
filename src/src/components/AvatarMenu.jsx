import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const AvatarMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/");

    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <img
        className="h-10 w-10 rounded-full cursor-pointer"
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
        alt="userImage2"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-56 p-4 bg-white border border-gray-300/30 text-gray-500 rounded-md font-medium shadow-lg z-50">
          <ul className="flex flex-col gap-2">
            <li className="flex items-center bg-blue-200 gap-2  cursor-pointer px-3 py-2 rounded">
              <img className="h-5 w-5" src={assets.userIcon} />
              <a href="#">Account</a>
            </li>

            <li className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded hover:bg-gray-300/40 transition">
              <img className="h-5 w-5" src={assets.linkIcon} />
              <a href="/dashboard">My link</a>
            </li>

            <div className="w-full h-px bg-gray-300/50 my-2"></div>

            <li className="flex items-center gap-3 px-3 py-2 rounded hover:bg-red-300/40 hover:text-red-500 transition">
              <img className="w-5 h-5" src={assets.logoutIcon} />
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 w-full text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
