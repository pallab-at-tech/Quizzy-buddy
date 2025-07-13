import { useEffect } from 'react'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Home from './pages/Home'
import fetchUserDetails from './utils/FetchUserDetails'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from './store/userSlice'

function App() {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)


  const fetchUser = async () => {
    const user = await fetchUserDetails()
    dispatch(setUserDetails(user?.data))
  }

  useEffect(() => {
    fetchUser()
  }, [])

  
  


  return (
    <>

      {
        user?._id && <Header />
      }

      {
        <Outlet/>
      }

      {/* <Home /> */}
      {/* <Footer/> */}

    </>
  )
}

export default App
