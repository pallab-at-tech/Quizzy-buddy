export const badges = [
    // ---- STREAK BADGES ----
    {
        id: "Streak1Week",
        title: "1 Week Streak",
        description: "Complete quiz for 7 days consistently",
    },
    {
        id: "Streak1Month",
        title: "1 Month Streak",
        description: "Keep your streak for an entire month",
    },
    {
        id: "Streak3Month",
        title: "3 Month Streak",
        description: "A 3-month long dedication streak",
    },
    {
        id: "Streak6Month",
        title: "6 Month Streak",
        description: "Half-year of unstoppable consistency",
    },
    {
        id: "Streak1Year",
        title: "1 Year Streak",
        description: "One full year of consistent participation",
    },

    // ---- HOST QUIZ BADGES ----
    {
        id: "Host5",
        title: "Hosted 5 Quizzes",
        description: "Created 5 quizzes",
    },
    {
        id: "Host20",
        title: "Hosted 20 Quizzes",
        description: "Created 20 quizzes",
    },
    {
        id: "Host50",
        title: "Hosted 50 Quizzes",
        description: "Created 50 quizzes",
    },
    {
        id: "Host200",
        title: "Hosted 200 Quizzes",
        description: "Created 200 quizzes",
    },

    // ---- LEADERBOARD BADGES ----
    {
        id: "Top1",
        title: "Top 1",
        description: "Ranked #1 on leaderboard",
    },
    {
        id: "Top5",
        title: "Top 5",
        description: "Ranked in top 5",
    },
    {
        id: "Top10",
        title: "Top 10",
        description: "Ranked in top 10",
    },

    // Multiple-time leaderboard achievements
    {
        id: "Top10x5",
        title: "Top 10 (5 Times)",
        description: "Entered top 10 five times",
    },
    {
        id: "Top5x5",
        title: "Top 5 (5 Times)",
        description: "Placed in top 5 five times",
    },
    {
        id: "Top1x5",
        title: "Top 1 (5 Times)",
        description: "Achieved rank #1 five times",
    },

    {
        id: "Top10x20",
        title: "Top 10 (20 Times)",
        description: "Entered top 10 twenty times",
    },
    {
        id: "Top5x20",
        title: "Top 5 (20 Times)",
        description: "Placed in top 5 twenty times",
    },
    {
        id: "Top1x20",
        title: "Top 1 (20 Times)",
        description: "Achieved rank #1 twenty times",
    },
];

const x = badges.map((v) => v.title)

console.log("x", x.slice(0, 10))

