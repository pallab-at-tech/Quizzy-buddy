import { createBrowserRouter } from 'react-router-dom'
import App from '../App';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import ForgotPassword from '../pages/ForgotPassword';
import OtpVerificationpage from '../pages/OtpVerificationpage';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../Layout/Dashboard';
import Profile from '../Layout/Profile';
import Home from '../pages/Home';
import MobileDashboard from '../Layout/MobileDashboard';



const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,

        children: [
            {
                index : true,
                element : <Home/>
            },
            {
                path: "/dashboard",
                element: <Dashboard />,

                children: [
                    {
                        index : true,
                        element : <MobileDashboard/>
                    },
                    {
                        path : ":user",
                        element: <Profile />
                    },
                ]
            }

        ]
    },
    {
        path: "/sign-in",
        element: <SignInPage />
    },
    {
        path: "/sign-up",
        element: <SignUpPage />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/otp-verfication",
        element: <OtpVerificationpage />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
]);

export default router