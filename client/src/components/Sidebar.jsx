import React from "react";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  House,
  Hash,
  Image,
  SquarePen,
  Eraser,
  Scissors,
  FileText,
  User,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { SignUp } from "@clerk/clerk-react";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article ", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/resume-review", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: User },
];
const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white border-r border-grey-200 
      flex flex-col justify-between items-center
      max-sm:absolute top-14 bottom-0
      ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}
      transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full ">
        <img
          src={user?.imageUrl || "/fallback.png"}
          alt="User avatar"
          className="w-13 rounded-full mx-auto"
        />
        <h1 className="mt-1 text-center">{user?.fullName || "Guest"}</h1>
        <div className="px-6 mt-5 text-sm text-grey-600 font-medium " >
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded 
        ${
          isActive
            ? "bg-gradient-to-r from-[#3c81f6] to-[#9234ea] text-white"
            : "hover:bg-gray-100"
        }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-center">
        <div onClick={openUserProfile} className="flex gap-2 items-center cursor-pointer">
          <img src={user.imageUrl} className="w-8 rounded-full" alt="" />
          <div>
            <h1 className="text-sm font-medium">{user.fullName}</h1>
            <p className="text-xs text-gray-500"></p>
            <Protect plan="premium"fallback="Free" > Premium</Protect>
            Plan
          </div>
        </div>
        <LogOut onClick={signOut} className="w-4.5 text-grey-400 hover:text-gray-700 transition cursor-pointer"/>
      </div>
    </div>
  );
};

export default Sidebar;
