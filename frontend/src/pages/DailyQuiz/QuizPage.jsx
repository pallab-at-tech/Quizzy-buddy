import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation , useNavigate } from 'react-router-dom'

const QuizPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState(null)

    useEffect(()=>{
        if(!location.state?.data){
            navigate(-1)
            toast.error("Illegal Access find")
        }
        setData(location.state?.data)

        return ()=>{

        }
    },[])

    // console.log("Location",data)
  return (
    <div>
      QuizPage
    </div>
  )
}

export default QuizPage
