import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer font-sans select-none group">

      {/* Icon Badge */}
      <div className={`flex items-center justify-center w-9 h-9 rounded-lg
                      bg-gradient-to-br from-[#3546fd] to-[#1d4bca]
                      border-[2px] border-blue-800
                      group-hover:scale-105 transition-transform duration-300
                      `}
      >
        <span style={{ textShadow: "rgb(216 210 210 / 41%) 1px 1px 6px" }} className="text-[1.6rem] drop-shadow-sm text-white font-bold">🦉</span>
      </div>

      {/* Brand Text */}
      <h1 className="text-[26px] font-extrabold tracking-tight leading-none">
        <span className="bg-gradient-to-r from-[#3747fa] to-[#0e3dbe]
                         bg-clip-text text-transparent"
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
