import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-1.5 cursor-pointer font-sans select-none group">

      {/* Icon Badge */}
      <div style={{ boxShadow: "inset rgb(124 124 243 / 51%) 1px 1px 6px , inset rgb(34 51 139) 1px 1px 4px 1px"  }} className={`flex items-center justify-center sm:w-9 sm:h-9 w-7 h-7 rounded-lg
                      bg-gradient-to-br from-[#3e4eff] to-[#2753cb]
                      border-[2px] border-blue-800
                      group-hover:scale-105 transition-transform duration-300
                      `}
      >
        <span className="sm:text-[1.6rem] text-[1.1rem] drop-shadow-sm text-white font-bold">
          <img src="/app-logo.png" alt="" className="w-[18px] h-[18px] custom-sm:w-[22px] custom-sm:h-[22px]"/>
        </span>
      </div>

      {/* Brand Text */}
      <h1 className="sm:text-[26px] text-[22px] font-extrabold tracking-tight leading-none">
        <span className="bg-gradient-to-r from-[#3747fa] to-[#0e3dbe] bg-clip-text text-transparent"
        >
          Quizzy
        </span>
        <span className=" text-gray-800">
          Buddy
        </span>
      </h1>
    </div>
  );
};

export default Logo;
