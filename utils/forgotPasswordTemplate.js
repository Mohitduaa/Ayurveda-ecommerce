const forgotPasswordTemplate =({name,otp})=>{
    return`
    <div>
    <p>Dear, ${name}</p>
    <p>You are requested a password reset.Please use following OTP code to reset your Password</p>
    <div style="color:white; background:blue;margain-top:10px; padding:10px;">
    ${otp}
    </div>
    <p>This otp is valid for 5 minutes</p>
    <br/>
    <p>Thanks</p>
    <p>Ayurveda</p>
    </div>
    `
}
export default forgotPasswordTemplate