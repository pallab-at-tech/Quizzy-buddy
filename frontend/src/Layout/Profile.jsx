import avatar from "../assets/avatar.png"
import { useSelector, useDispatch } from 'react-redux'
import { LuSchool } from "react-icons/lu";
import { MdOutlineModeEdit } from "react-icons/md";
import banner from "../assets/p_banner.webp"
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import Axios from "../utils/Axios"
import SummaryApi from "../common/SumarryApi";
import toast from "react-hot-toast";
import { setBackgroundImage, setProfileAndData, setStateAbout } from "../store/userSlice";
import { useEffect } from "react";
import uploadFile from "../utils/uploadFile";

const Profile = () => {

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [openWindow, setOpenWindow] = useState({
    aboutEdit: false,
    profileEdit: false
  })
  const [loader, setLoader] = useState({
    aboutLoader: false,
    profileLoader: false,
    backGroundLoader: false
  })

  const [about, setAbout] = useState("")
  const [newBgImg, setnewBgImg] = useState("")

  const [profileData, setProfileData] = useState({
    profileImg: user?.avatar,
    name: user?.name,
    institute: user?.institute
  })

  useEffect(() => {
    setAbout(user?.about)
    setProfileData({
      profileImg: user?.avatar,
      name: user?.name,
      institute: user?.institute
    })
  }, [user])

  const addAbout = async (e) => {
    e.preventDefault()
    setLoader((prev) => { return { ...prev, aboutLoader: true } })
    try {
      const response = await Axios({
        ...SummaryApi.add_about,
        data: {
          about: about
        }
      })

      const { data: responseData } = response

      if (responseData?.success) {
        toast.success(responseData?.message)
        dispatch(setStateAbout({
          about: responseData?.about
        }))
        setOpenWindow((prev) => {
          return {
            ...prev,
            aboutEdit: false
          }
        })
      }

      setLoader((prev) => { return { ...prev, aboutLoader: false } })
    } catch (error) {
      setLoader((prev) => { return { ...prev, aboutLoader: false } })
      toast.error(error?.response?.data?.message || "Some Error Occured!")
      console.log("addAbout error", error)
    }
  }

  const handleOnChangeImage = async (e) => {
    try {
      setLoader((prev) => { return { ...prev, backGroundLoader: true } })
      const file = e.target.files?.[0]
      if (!file) return
      const response = await uploadFile(file)

      if (response?.secure_url) {
        setnewBgImg(response?.secure_url)
      }
      setLoader((prev) => { return { ...prev, backGroundLoader: false } })
    } catch (error) {
      toast.error("Some error occuerd!")
      setLoader((prev) => { return { ...prev, backGroundLoader: false } })
      console.log("handleOnChange error on profile page", error)
    }
  }

  const addBackgroundImg = async (e) => {
    e.preventDefault()
    if (!newBgImg) return

    try {
      const response = await Axios({
        ...SummaryApi.add_background,
        data: {
          bg: newBgImg
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        dispatch(setBackgroundImage({
          bg: newBgImg
        }))
        setnewBgImg("")
      }

      setLoader((prev) => { return { ...prev, backGroundLoader: false } })

    } catch (error) {
      setLoader((prev) => { return { ...prev, backGroundLoader: false } })
      toast.error(error?.response?.data?.message || "Some Error Occured!")
      console.log("addAbout error", error)
    }
  }

  const handleOnChangeProfileImg = async (e) => {
    try {
      setLoader((prev) => { return { ...prev, backGroundLoader: true } })
      const file = e.target.files?.[0]
      if (!file) return
      const response = await uploadFile(file)

      if (response?.secure_url) {
        setProfileData((prev) => {
          return {
            ...prev,
            profileImg: response?.secure_url
          }
        })
      }
      setLoader((prev) => { return { ...prev, backGroundLoader: false } })
    } catch (error) {
      toast.error("Some error occuerd!")
      setLoader((prev) => { return { ...prev, backGroundLoader: false } })
      console.log("handleOnChangeProfileImg error on profile page", error)
    }
  }

  const profileEdit = async (e) => {

    e.preventDefault()

    if (!profileData.name) {
      toast.error("Profile image required!")
      return
    }

    try {
      setLoader((prev) => { return { ...prev, profileLoader: true } })

      const response = await Axios({
        ...SummaryApi.add_profile,
        data: profileData
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData?.message)
        dispatch(setProfileAndData({
          profileImg: profileData.profileImg,
          name: profileData.name,
          institute: profileData.institute
        }))
        setProfileData((prev)=>{
          return
        })
      }
      else {
        toast.error(responseData?.message)
      }

      setLoader((prev) => { return { ...prev, profileLoader: false } })

    } catch (error) {
      // toast.error(error?.response?.data?.message || "Some Error Occured!")
      setLoader((prev) => { return { ...prev, profileLoader: false } })
      console.log("profileEdit error", error)
    }
  }

  return (
    <div className='pt-3 px-3  bg-[#f9f8f8] pb-0 mb-0 '>

      {/* outer background */}
      <div className='rounded-t-xl shadow-lg overflow-hidden relative'>

        <div className='m-5 group p-2 cursor-pointer bg-[#ffff] hover:bg-[#f1fbff] text-blue-600 w-fit rounded-full absolute right-0 top-0'>
          <label htmlFor="bgImg">
            <MdOutlineModeEdit size={25} className="cursor-pointer " />
            <input type="file"
              accept="image/*"
              id="bgImg"
              className="hidden"
              onChange={(e) => handleOnChangeImage(e)}
            />
          </label>
        </div>

        {
          user?.backgroundImg ? (
            <img src={user?.backgroundImg} alt="" className='bg-cover object-cover object-center h-[80px] sm:h-[100px] w-full' />
          ) : (
            <img src={banner} alt="" className='bg-cover object-cover h-[80px] sm:h-[100px] w-full' />
          )
        }

      </div>

      {/* profile section */}
      <div className='rounded-b-xl shadow-lg py-4 flex flex-col sm:flex-row gap-1 items-start sm:items-center relative bg-[#fcfcfc] px-4'>

        {/* profile */}
        <div className='px-0 sm:px-8 py-2'>
          {
            user?.avatar ? (
              <div className="">
                <img src={user?.avatar} alt="" className='w-[110px] h-[110px] object-cover rounded-full border-blue-800 border-4' />
              </div>
            ) : (
              <div className='rounded-full border-4 overflow-hidden border-blue-800'>
                <img src={avatar} alt="" className='w-[110px] h-[110x] rounded-full' />
              </div>
            )
          }
        </div>


        <div>

          <div>
            <h1 className='font-bold text-2xl'>{user?.name}</h1>
            <h2 className='relative bottom-1 text-[13px] text-[#676767] font-semibold'>{user?.nanoId}</h2>
          </div>

          {
            user?.institute && (
              <div className='flex items-center gap-1 pt-2 pb-1'>
                <div className='p-1 rounded-md border border-[#c4c4c4]'>
                  <LuSchool size={18} />
                </div>
                <p className='text-base text-[#0e0d0d] font-semibold'>{user?.institute}</p>
              </div>
            )
          }
        </div>

        <div
          onClick={() => {
            setOpenWindow((prev) => {
              return {
                ...prev,
                profileEdit: true
              }
            })
          }}
          className='text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 px-3 py-2 rounded-full absolute right-4 bottom-[60px] sm:bottom-10 cursor-pointer'
        >

          <div>
            <MdOutlineModeEdit />
          </div>

          <p>Edit Profile</p>
        </div>

      </div>

      {/* other section */}
      <div className='mt-3 text-lg rounded-t-xl px-6 py-4 bg-[#fcfcfc] ' style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 1px 0px 12px' }}>

        <p className='font-bold'>About</p>

        {
          user?.about && (
            <div className='text-sm max-w-[70%]'>{user?.about}</div>
          )
        }

        <div className="flex items-center gap-2">
          {
            !user?.about && (
              <p
                onClick={() => {
                  setOpenWindow((prev) => {
                    return {
                      ...prev,
                      aboutEdit: true
                    }
                  })
                }}
                className='text-blue-700 text-base font-semibold cursor-pointer'>
                Add About
              </p>
            )
          }

          <FaEdit
            onClick={() => {
              setOpenWindow((prev) => {
                return {
                  ...prev,
                  aboutEdit: true
                }
              })
            }}
            size={18}
            className="cursor-pointer text-gray-900"
          />
        </div>

      </div>

      {
        openWindow.aboutEdit && (
          <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[3px] z-50">

            <form onSubmit={addAbout} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Add Note
              </h2>

              <textarea
                value={about}
                onChange={(e) => {
                  setAbout(() => {
                    return e.target.value
                  })
                }}
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:border-green-500 outline-none focus:ring-2 focus:ring-green-200"
                rows="4"
                placeholder="Write something..."
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setOpenWindow((prev) => {
                      return {
                        ...prev,
                        aboutEdit: false
                      }
                    })
                  }}
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loader.aboutLoader}
                  className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 active:scale-95 transition"
                >
                  {loader.aboutLoader ? "Saving..." : "Save"}
                </button>
              </div>

            </form>
          </section>
        )
      }

      {
        loader.backGroundLoader && (
          <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[1px] z-50">
            <div className="spinLoader"></div>
          </section>
        )
      }

      {
        newBgImg && (
          <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[3px] z-50">

            <form
              onSubmit={(e) => addBackgroundImg(e)}
              className="w-full max-w-[320px] sm:max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              {/* Image Preview */}
              <div className="mb-5 overflow-hidden rounded-xl border bg-gray-100">
                <img
                  src={newBgImg}
                  alt="Preview"
                  className="h-52 w-full object-cover"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setnewBgImg("")}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loader.backGroundLoader}
                  className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-green-700 active:scale-95 transition cursor-pointer"
                >
                  {loader.backGroundLoader ? "Saving" : "Save"}
                </button>
              </div>
            </form>


          </section>
        )
      }

      {
        openWindow.profileEdit && (
          <section className="fixed inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[3px] z-50">

            <form
              onSubmit={(e) => profileEdit(e)}
              className="w-full max-w-md mx-8 rounded-2xl bg-white p-6 shadow-xl"
            >
              {/* Header */}
              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Edit Profile
              </h2>

              {/* Avatar Section */}
              <div className="mb-6 flex items-center gap-4">

                {
                  profileData.profileImg ? (
                    <div className="relative group">
                      <img src={profileData.profileImg} alt="" className="h-20 w-20 rounded-full border-2 outline-none object-cover" />
                      {
                        loader.backGroundLoader ? (
                          <div className="transition-all absolute top-0 bottom-0 left-0 right-0 bg-black/60 rounded-full flex items-center justify-center text-gray-200 font-semibold cursor-pointer">
                            <div className="smallSpinLoader"></div>
                          </div>
                        ) : (
                          <div onClick={() => setProfileData((prev) => { return { ...prev, profileImg: "" } })} className="group-hover:opacity-100 opacity-0 transition-opacity absolute top-0 bottom-0 left-0 right-0 bg-black/60 rounded-full flex items-center justify-center text-gray-200 font-semibold cursor-pointer">
                            Remove
                          </div>
                        )
                      }
                    </div>
                  ) : user?.avatar ? (
                    <div>
                      <img src={user?.avatar}
                        alt=""
                        className="h-20 w-20 rounded-full border-2 outline-none object-cover"
                      />
                      {
                        loader.backGroundLoader && (
                          <div className="transition-all absolute top-0 bottom-0 left-0 right-0 bg-black/60 rounded-full flex items-center justify-center text-gray-200 font-semibold cursor-pointer">
                            <div className="smallSpinLoader"></div>
                          </div>
                        )
                      }
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="h-20 w-20 rounded-full border-2 outline-none object-cover"
                      />
                      {
                        loader.backGroundLoader && (
                          <div className="transition-all absolute top-0 bottom-0 left-0 right-0 bg-black/60 rounded-full flex items-center justify-center text-gray-200 font-semibold cursor-pointer">
                            <div className="smallSpinLoader"></div>
                          </div>
                        )
                      }
                    </div>
                  )
                }

                <label
                  htmlFor="profilePic"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition cursor-pointer"
                >
                  Change Photo
                </label>

                <input type="file" onChange={(e) => handleOnChangeProfileImg(e)} accept="image/*" id="profilePic" className="hidden" />
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => {
                    setProfileData((prev) => {
                      return {
                        ...prev,
                        name: e.target.value
                      }
                    })
                  }}
                  name="name"
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Institute */}
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Institute
                </label>
                <input
                  type="text"
                  value={profileData.institute}
                  onChange={(e) => {
                    setProfileData((prev) => {
                      return {
                        ...prev,
                        institute: e.target.value
                      }
                    })
                  }}
                  name="institute"
                  placeholder="Your institute"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpenWindow((prev) => {
                      return {
                        ...prev,
                        profileEdit: false
                      }
                    })
                  }}
                  className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 active:scale-95 transition cursor-pointer"
                >
                  {loader.profileLoader ? "Saving" : "Save"}
                </button>
              </div>
            </form>

          </section>
        )
      }

    </div>
  )
}

export default Profile
