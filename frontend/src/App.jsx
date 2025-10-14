import { useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import fetchUserDetails from './utils/FetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from './store/userSlice'
import { useGlobalContext } from './provider/GlobalProvider'

function App() {

  const dispatch = useDispatch()
  const { isLogin } = useGlobalContext()


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
    </>
  )
}

export default App
