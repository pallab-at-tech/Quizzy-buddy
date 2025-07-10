import { createBrowserRouter } from 'react-router-dom'
import App from '../App';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';


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
    }
    
]);

export default router