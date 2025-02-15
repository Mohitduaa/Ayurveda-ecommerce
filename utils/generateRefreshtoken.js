
import jwt from 'jsonwebtoken'
import UserModel from "../Models/User.Model.js"

const generateRefreshtoken = async(userId) =>{
    const token = await jwt.sign({id : userId},process.env.SECRET_KEY_REFRESH_TOKEN,{
            expiresIn:'30d'}
        )
        const updateRefreshtokenuser = await UserModel.updateOne(
            { _id : userId },
    {
            refresh_token :token
    }
)
    return token
}

export default generateRefreshtoken