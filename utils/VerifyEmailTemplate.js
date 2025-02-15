const verifyEmailTemplate = ({name,url})=>{
    return`
    <p>Dear ${name}</p>
    <p>Thank you for registering Ayurveda</p>
    <a href=${url} style="color:white; background:blue;margain-top:10px; padding:10px;">verify Email</a>
    `
}
export default verifyEmailTemplate;