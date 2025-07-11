import SummaryApi from "../common/SumarryApi";
import Axios from "./Axios";

const fetchUserDetails = async () => {

    try {
        const response = await Axios({
            ...SummaryApi.user_Details
        })

        return response.data

    } catch (error) {
        console.log(error)
    }
}

export default fetchUserDetails