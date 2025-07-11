import { createBrowserRouter } from 'react-router-dom'
import App from '../App';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import ForgotPassword from '../pages/ForgotPassword';
import OtpVerificationpage from '../pages/OtpVerificationpage';
import ResetPassword from '../pages/ResetPassword';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path : "/sign-in",
        element : <SignInPage/>
    },
    {
        path : "/sign-up",
        element : <SignUpPage/>
    },
    {
        path : "/forgot-password",
        element : <ForgotPassword/>
    },
    {
        path : "/otp-verfication",
        element : <OtpVerificationpage/>
    },
    {
        path : "/reset-password",
        element : <ResetPassword/>
    }
    
]);

export default router