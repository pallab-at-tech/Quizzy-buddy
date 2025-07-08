const verifyEmailTemplate = ({ name, code }) => {

    return `
    <p>Dear ${name}</p>
    <h1>You ask for email verfication code :-</h1>
    <p>your email verification code : ${code}.</p>
    `
}

export default verifyEmailTemplate