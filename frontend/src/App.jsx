import { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import fetchUserDetails from './utils/FetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from './store/userSlice'
import { useGlobalContext } from './provider/GlobalProvider'
import { useSelector } from 'react-redux'

function App() {

  const dispatch = useDispatch()
  const { isLogin } = useGlobalContext()
  const user = useSelector(state => state?.user)

  const fetchUser = async () => {
    const user = await fetchUserDetails()
    dispatch(setUserDetails(user?.data))
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (isLogin === null) return null

  return (
    <>
      {
        isLogin && <Header />
      }

      {
        <Outlet />
      }

      {
        !user && (
          <section className='fixed h-screen inset-0 flex items-center justify-center bg-[#aac1de8f] backdrop-blur-[5px] z-50'>
            <div className='participants_loader'></div>
          </section>
        )
      }
    </>
  )
}

export default App
