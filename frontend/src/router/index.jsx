import { createBrowserRouter } from 'react-router-dom'
import App from '../App';
import SignInPage from '../pages/AuthPages/SignInPage';
import SignUpPage from '../pages/AuthPages/SignUpPage';
import ForgotPassword from '../pages/AuthPages/ForgotPassword';
import OtpVerificationpage from '../pages/AuthPages/OtpVerificationpage';
import ResetPassword from '../pages/AuthPages/ResetPassword';
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