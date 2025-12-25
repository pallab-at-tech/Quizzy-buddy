import React from "react";
import pic from "/my_pic.jpeg"
import { Streak1Month, Streak1Week, Streak1Year, Streak3Month, Streak6Month } from "../components/Badge"
import { Host5, Host20, Host50, Host200 } from "../components/Badge"
import { Top1, Top5, Top10, Top10x5, Top5x5, Top1x5, Top10x20, Top5x20, Top1x20 } from "../components/Badge"

const About = () => {

    const badgeSystem = [
        {
            element: <Streak1Week />,
            name: "Streak 1 Week",
            about: "Maintain a daily quiz participation streak for 7 consecutive days."
        },
        {
            element: <Streak1Month />,
            name: "Streak 1 Month",
            about: "Maintain a daily quiz participation streak for 30 consecutive days."
        },
        {
            element: <Streak3Month />,
            name: "Streak 3 Months",
            about: "Maintain a daily quiz participation streak for 90 consecutive days."
        },
        {
            element: <Streak6Month />,
            name: "Streak 6 Months",
            about: "Maintain a daily quiz participation streak for 180 consecutive days."
        },
        {
            element: <Streak1Year />,
            name: "Streak 1 Year",
            about: "Maintain a daily quiz participation streak for 365 consecutive days."
        },
        {
            element: <Host5 />,
            name: "Host 5 Quizzes",
            about: "Successfully host and complete 5 quizzes on QuizzyBuddy."
        },
        {
            element: <Host20 />,
            name: "Host 20 Quizzes",
            about: "Successfully host and complete 20 quizzes on QuizzyBuddy."
        },
        {
            element: <Host50 />,
            name: "Host 50 Quizzes",
            about: "Successfully host and complete 50 quizzes on QuizzyBuddy."
        },
        {
            element: <Host200 />,
            name: "Host 200 Quizzes",
            about: "Successfully host and complete 200 quizzes on QuizzyBuddy."
        },
        {
            element: <Top1 />,
            name: "Top 1",
            about: "Secure the 1st position on the daily leaderboard at least once."
        },
        {
            element: <Top5 />,
            name: "Top 5",
            about: "Secure the 5th position on the daily leaderboard at least once."
        },
        {
            element: <Top10 />,
            name: "Top 10",
            about: "Secure the 10th position on the daily leaderboard at least once."
        },
        {
            element: <Top10x5 />,
            name: "Top 10 × 5",
            about: "Secure the 10th position on the daily leaderboard at least 5 times."
        },
        {
            element: <Top10x20 />,
            name: "Top 10 × 20",
            about: "Secure the 10th position on the daily leaderboard at least 20 times."
        },
        {
            element: <Top5x5 />,
            name: "Top 5 × 5",
            about: "Secure the 5th position on the daily leaderboard at least 5 times."
        },
        {
            element: <Top5x20 />,
            name: "Top 5 × 20",
            about: "Secure the 5th position on the daily leaderboard at least 20 times."
        },
        {
            element: <Top1x5 />,
            name: "Top 1 × 5",
            about: "Secure the 1st position on the daily leaderboard at least 5 times."
        },
        {
            element: <Top1x20 />,
            name: "Top 1 × 20",
            about: "Secure the 1st position on the daily leaderboard at least 20 times."
        }
    ]

    return (
        <section className="h-[calc(100vh-70px)] overflow-y-auto bg-gradient-to-br from-indigo-50 to-white px-8 sm:px-12 lg:px-6 py-10">
            <div className="max-w-6xl mx-auto space-y-14">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700">
                        About QuizzyBuddy
                    </h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        QuizzyBuddy is your ultimate quiz companion — challenge yourself,
                        compete with others, and grow your knowledge every day.
                    </p>
                </div>

                {/* Daily Quiz */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            📅 Daily Quiz & Leaderboard
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Participate in daily quizzes to test your skills and consistency.
                            Every attempt counts toward your ranking on the global leaderboard,
                            motivating you to improve and stay competitive.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <ul className="space-y-2 text-gray-700">
                            <li>✔ Daily skill-based questions</li>
                            <li>✔ Real-time leaderboard updates</li>
                            <li>✔ Performance tracking</li>
                        </ul>
                    </div>
                </div>

                {/* Host Quiz */}
                <div className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            🧠 Host Your Own Quiz
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Become a quiz host by creating quizzes manually or with AI
                            assistance. Share a unique join code and let others join instantly.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <ul className="space-y-2 text-gray-700">
                            <li>✔ Manual & AI-assisted quiz creation</li>
                            <li>✔ Join via secure quiz code</li>
                            <li>✔ Multi-user participation</li>
                        </ul>
                    </div>
                </div>

                {/* Dashboard */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            📊 Modern Result Dashboard
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            After the quiz ends, hosts get access to a modern analytics
                            dashboard to view participant results, performance insights, and
                            release final scores.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <ul className="space-y-2 text-gray-700">
                            <li>✔ Participant-wise score view</li>
                            <li>✔ Instant score release</li>
                            <li>✔ Clean & modern UI</li>
                        </ul>
                    </div>
                </div>

                {/* Quiz Battle */}
                <div className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            ⚔️ Quiz Battle (1 vs 1)
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Challenge other players in an intense 1 vs 1 quiz battle.
                            Compete under limited time and prove your speed and accuracy.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <ul className="space-y-2 text-gray-700">
                            <li>✔ Real-time competition</li>
                            <li>✔ Time-limited battles</li>
                            <li>✔ Skill-based matchmaking</li>
                        </ul>
                    </div>
                </div>

                {/* Badges */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        🏆 Badge & Achievement System
                    </h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {
                            badgeSystem.map((v , i) => {
                                return <div
                                    key={i}
                                    className="bg-white shadow rounded-lg px-4 py-3 text-center text-gray-700 font-medium"
                                >
                                    {v.element}
                                </div>
                            })
                        }
                    </div>

                    <p className="text-center text-gray-500 mt-6">
                        Rankings are tracked using Top 1, Top 5, and Top 10 counts to reward
                        consistent high performers.
                    </p>
                </div>

                {/* Meet the Developer */}
                <div className="border-t border-gray-300 pt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        👨‍💻 Meet the Developer
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white shadow rounded-xl p-8 max-w-4xl mx-auto">
                        <img
                            src={`${pic}`} // replace with your image path
                            alt="Developer"
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600 object-top "
                        />

                        <div className="text-center md:text-left space-y-3">
                            <h3 className="text-xl font-bold text-gray-800">
                                Pallab Bag
                            </h3>
                            <p className="text-gray-600 font-semibold">
                                MERN Stack Developer & Creator of QuizzyBuddy
                            </p>
                            <p className="text-gray-500 max-w-md">
                                Passionate about building interactive web applications,
                                real-time systems, and AI-assisted platforms that make learning
                                engaging and competitive.
                            </p>

                            <a
                                href="https://portfolio-cyan-pi-92.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                                View Portfolio
                            </a>
                        </div>
                    </div>
                </div>

                {/* Section: Contact Us */}
                <div className="border-t border-gray-300 pt-10 mt-12 text-center">
                    <h2
                        className={`text-2xl font-semibold mb-4 text-blue-600`}
                    >
                        📬 Contact Us
                    </h2>
                    <p className={"text-gray-700 mb-4"}>
                        Have questions, feedback, or collaboration ideas? Let’s connect!
                    </p>
                    <div className="space-y-2 text-gray-700 flex flex-col items-center justify-start">
                        <p className={`text-gray-700`}>
                            📧 Email:{" "}
                            <a
                                href="mailto:pallab861774@gmail.com"
                                className={`text-blue-700 hover:underline`}
                            >
                                pallab861774@gmail.com
                            </a>
                        </p>
                        <p className={`text-gray-700 pl-7`}>
                            💼 LinkedIn:{" "}
                            <a
                                href="https://www.linkedin.com/in/pallab-bag-35115a2b1/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-blue-700 hover:underline`}
                            >
                                linkedin.com/in/pallab-bag
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center pt-6 border-t border-gray-300">
                    <h3 className="text-xl font-semibold text-indigo-700">
                        &copy; {new Date().getFullYear()} <span>QuizzyBuddy — Your Quiz, Your Buddy</span>
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Learn, compete, host, and grow together.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
