import avatar from "../assets/avatar.png"
import { useSelector } from 'react-redux'
import { LuSchool } from "react-icons/lu";
import { MdOutlineModeEdit } from "react-icons/md";
import banner from "../assets/p_banner.webp"

const Profile = () => {

  const user = useSelector(state => state.user)

  // console.log("user",user)

  return (
    <div className='pt-3 px-3  bg-[#f9f8f8] pb-0 mb-0'>

      {/* outer background */}
      <div className='rounded-t-xl shadow-lg overflow-hidden relative'>

        <div className='m-5 p-2 cursor-pointer bg-[#ffff] text-blue-600 w-fit rounded-full absolute right-0 top-0'>
          <MdOutlineModeEdit size={25} />
        </div>

        <img src={banner} alt="" className='bg-cover object-cover h-[80px] sm:h-[100px] w-full' />

      </div>

      {/* profile section */}
      <div className='rounded-b-xl shadow-lg py-4 flex flex-col sm:flex-row gap-1 items-start sm:items-center relative bg-[#fcfcfc] px-4'>

        {/* profile */}
        <div className='px-0 sm:px-8 py-2'>
          <div className='rounded-full border-4 overflow-hidden border-blue-800'>
            <img src={avatar} alt="" className='w-[110px] h-[110x] rounded-full' />
          </div>
        </div>

        <div className=''>

          <div>
            <h1 className='font-bold text-xl'>{user?.name}</h1>
            <h2 className='relative bottom-1 text-base text-[#2c2c2c]'>userName</h2>
          </div>

          <div className='flex items-center gap-1 pt-2 pb-1'>
            <div className='p-1 rounded-md border border-[#c4c4c4]'>
              <LuSchool size={18} />
            </div>
            <p className='text-base text-[#0e0d0d] font-semibold'>MCKV Institue Of Engineering</p>
          </div>

        </div>

        <div className='text-white bg-blue-600 flex items-center gap-2 px-3 py-2 rounded-full absolute right-4 bottom-[60px] sm:bottom-10 cursor-pointer'>

          <div>
            <MdOutlineModeEdit />
          </div>

          <p>Edit Profile</p>

        </div>

      </div>

      {/* other section */}
      <div className='mt-3 text-lg rounded-t-xl px-6 py-4 bg-[#fcfcfc] ' style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 1px 0px 12px' }}>

        <p className='font-bold'>About</p>

        <div className='text-sm max-w-[70%]'>hi i am MERN Stack developer.</div>

        <p className='text-blue-700 text-base font-semibold cursor-pointer'>Add About</p>

      </div>

    </div>
  )
}

export default Profile
