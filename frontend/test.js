

let count = 10
const x = setInterval(() => {

    if (count === -1) {
        clearInterval(x)
    }
    else {
        console.log("count : ", count)
        count--
    }

}, 1000);

setTimeout(() => {
    console.log("All count down finish.")
}, 12000);