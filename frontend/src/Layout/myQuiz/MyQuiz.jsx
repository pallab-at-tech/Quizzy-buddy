import React from 'react'
import { useSelector } from 'react-redux'

const MyQuiz = () => {

  const user = useSelector(state => state.user)
  console.log("state user",user)
  return (
    <section>
        MyQuiz
    </section>
  )
}

export default MyQuiz
