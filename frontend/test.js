
const quiz_start = "2025-10-18T16:08"
const quiz_expire_per_Q = "6"
const time_sec_min = "seconds"
// seconds

const startDate = new Date(quiz_start)
const perQuestionTime = parseInt(quiz_expire_per_Q, 10)

let totalTime;

if (time_sec_min === "minutes") {
    totalTime = 10 * perQuestionTime * 60
}
else {
    totalTime = 10 * perQuestionTime
}

const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
};

const endDate = new Date(startDate.getTime() + totalTime * 1000)
console.log("start date", startDate.toLocaleDateString(undefined , options))
console.log("End date", endDate.toLocaleDateString(undefined , options))
