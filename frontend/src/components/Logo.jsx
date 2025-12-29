import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer font-sans select-none group">

      {/* Icon Badge */}
      <div style={{ boxShadow: "inset rgb(128 128 128 / 41%) 1px 1px 6px , inset rgb(66 91 225) 1px 1px 6px"  }} className={`flex items-center justify-center sm:w-9 sm:h-9 w-7 h-7 rounded-lg
                      bg-gradient-to-br from-[#3e4eff] to-[#2753cb]
                      border-[2px] border-blue-800
                      group-hover:scale-105 transition-transform duration-300
                      `}
      >
        <span className="sm:text-[1.6rem] text-[1.1rem] drop-shadow-sm text-white font-bold">
          <img src="/owl.png" alt="" className="w-[22px] h-[22px]"/>
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
