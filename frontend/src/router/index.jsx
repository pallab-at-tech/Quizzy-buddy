import { createBrowserRouter } from 'react-router-dom'
import App from '../App';
import SignInPage from '../pages/AuthPages/SignInPage';
import SignUpPage from '../pages/AuthPages/SignUpPage';
import ForgotPassword from '../pages/AuthPages/ForgotPassword';
import OtpVerificationpage from '../pages/AuthPages/OtpVerificationpage';
import ResetPassword from '../pages/AuthPages/ResetPassword';
import Dashboard from '../Layout/main/Dashboard';
import Profile from '../Layout/Profile';
import Home from '../pages/Home';
import MobileDashboard from '../Layout/main/MobileDashboard';
import HostQuizPage from '../pages/QuizPages/HostQuizPage';
import { FaEdit, FaRobot } from "react-icons/fa";
import CreateQuizManual from '../pages/QuizPages/CreateQuizManual';
import { Link } from 'react-router-dom';
import CreateQuizAi from '../pages/QuizPages/CreateQuizAi';
import OrganizerPannel from '../Layout/Organizer/OrganizerPannel';
import HostPage from '../Layout/Organizer/HostPage';
import QuizJoined from '../pages/Users/QuizJoined';
import StartQuiz from '../pages/Users/StartQuiz';
import GetSubmissionFullDetails from '../Layout/Organizer/GetSubmissionFullDetails';
import ViewMarksDetails from '../Layout/Organizer/ViewMarksDetails';
import MyQuiz from '../Layout/myQuiz/MyQuiz';
import ParticiapantsDetails from '../Layout/myQuiz/ParticiapantsDetails';
import Mainpage from '../pages/DailyQuiz/Mainpage';
import QuizPage from '../pages/DailyQuiz/QuizPage';
import Leaderboard from '../Layout/Leaderboard/Leaderboard';
import DashboardOverveiw from '../Layout/DashboardOverview/DashboardOverveiw';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,

        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/dashboard",
                element: <Dashboard />,

                children: [
                    {
                        index: true,
                        element: <MobileDashboard />
                    },
                    {
                        path: ":user",
                        element: <Profile />
                    },
                    {
                        path: "organizer-pannel",
                        element: <OrganizerPannel />,
                        children: [
                            {
                                path: ":quizId",
                                element: <HostPage />,
                                children: [
                                    {
                                        path: "full-details",
                                        element: <GetSubmissionFullDetails />,
                                    },
                                    {
                                        path: "view",
                                        element: <ViewMarksDetails />
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path : "my-quiz",
                        element : <MyQuiz/>,
                        children : [
                            {
                                path : ":quiz_Id",
                                element : <ParticiapantsDetails/>
                            }
                        ]
                    },
                    {
                        path : "leaderboard",
                        element : <Leaderboard/>
                    },
                    {
                        path : "overview",
                        element : <DashboardOverveiw/>
                    }
                ]
            },
            {
                path: "/host-quiz",
                element: <HostQuizPage />,
                children: [
                    {
                        index: true,
                        element: <div className="px-8 py-10 bg-gray-50 h-full">
                            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                                ⚙️ Quiz Setup
                            </h1>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Manual Quiz Card */}
                                <Link to={"/host-quiz/create-quiz"} className="group bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <FaEdit size={26} />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">
                                            Create Quiz Manually
                                        </h2>
                                    </div>
                                    <p className="text-gray-500 leading-relaxed">
                                        Build your quiz from scratch — add questions, options, correct answers, and assign marks as you like.
                                    </p>
                                </Link>

                                {/* AI Assistance Quiz Card */}
                                <Link to={"/host-quiz/create-ai-quiz"} className="group bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-purple-400 transition-all duration-300 cursor-pointer">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                                            <FaRobot size={26} />
                                        </div>
                                        <h2 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600">
                                            Create with AI Assistance
                                        </h2>
                                    </div>
                                    <p className="text-gray-500 leading-relaxed">
                                        Let AI automatically generate quiz questions, suggest correct answers, and balance difficulty levels intelligently.
                                    </p>
                                </Link>
                            </div>
                        </div>
                    },
                    {
                        path: "create-quiz",
                        element: <CreateQuizManual />
                    },
                    {
                        path: "create-ai-quiz",
                        element: <CreateQuizAi />
                    }
                ]
            },
            {
                path: "/joined/:hostId",
                element: <QuizJoined />,
                children: [
                    {
                        path: ":userId",
                        element: <StartQuiz />
                    }
                ]
            },
            {
                path : "/daily-quiz",
                element : <Mainpage/>
            }
        ]
    },
    {
        path : "/daily-quiz/:userId",
        element : <QuizPage/>
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