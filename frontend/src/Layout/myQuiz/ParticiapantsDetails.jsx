import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ParticiapantsDetails = () => {

  const params = useParams()
  const [data, setData] = useState(null)


  useEffect(() => {

    if(!params?.quiz_Id) return

  }, [])

  console.log("para", params?.quiz_Id)

  return (
    <section className='px-6'>
      ParticiapantsDetails
    </section>
  )
}

export default ParticiapantsDetails
