import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SumarryApi'

const ViewMarksDetails = () => {

    const location = useLocation()
    const [data, setData] = useState(null)
    const [hasFetched, setHasFetched] = useState(false) 
    
    useEffect(() => {
        if (location.state?.viewDetails) {
            setData(location.state.viewDetails)
            setHasFetched(false) 
        }
    }, [location.state])

    useEffect(() => {
        const fetchAndUpdateData = async () => {
            if (!data || hasFetched) return 

            try {
                const response = await Axios({
                    ...SummaryApi.fetch_questionDetails,
                    data: { data: data.correctedData },
                })

                const { data: responseData } = response
                console.log("responseData", responseData)

                if (responseData?.success) {
                    setData((prev) => ({
                        ...prev,
                        correctedData: responseData.data,
                    }))
                    setHasFetched(true)
                }

            } catch (error) {
                console.log("fetchAndUpdateData error", error)
            }
        }

        fetchAndUpdateData()
    }, [data, hasFetched])

    console.log("ViewMarksDetails data", data)

    return (
        <section className='text-black'>
            ViewMarksDetails
        </section>
    )
}

export default ViewMarksDetails
