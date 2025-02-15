import sendEmail from '../config/SendEmail.js'
import UserModel from '../Models/User.Model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/VerifyEmailTemplate.js'
import generateAcesstoken from '../utils/generateAcesstoken.js'
import generateRefreshtoken from '../utils/generateRefreshtoken.js'
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'
import generateOtp from '../utils/generateOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from "jsonwebtoken"

 export async function registerUserController(req,res){
    try{
        const {name ,email , password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({
                message:"provide email ,name and password",
                error:true,
                success:false
            })
        }
        const user = await UserModel.findOne({email})
        if(user){
            return res.json({
                message:"Already register email",
                error:true,
                success:false
            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)
        const payload ={
            name,
            email,
            password:hashPassword
        }
        const newUser = new UserModel(payload)
        const save = await newUser.save()
        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`
        const verifyEmail = await sendEmail({
            sendTo:email,
            subject:"Verify email from Ayurveda",
            html:verifyEmailTemplate({
                name,
                url : verifyEmailUrl
            })
        })
        return res.json({
            message:"User registered sucessfully",
            error:false,
            success : true,
            data:save
        })
    }catch(error){
        return res.status(500).json({
            error:true,
            sucess:false
        })
    }
 }

 export async function verifyEmailController(req,res){
    try{
        const {code} = request.body 
        const user = await UserModel.findOne({ _id :code})

        if(!user){
            return res.status(400).json({
                message :"Invalid code",
                error : true ,
                sucess : false
            })
        }
        const updateUser = await UserModel.updateOne({ _id : code},{
            verify_email : true
        })
        return res.json({
            message :"Verify email done",
            sucess:true,
            error:false

        })
    }catch(error){
        return res.status(500).json({
            message:error.message || error,
            error:true,
            sucess:true
        })
    }
 }

 export async function loginController(req,res){
    try{
        const {email , password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message:"provide email, password",
                error:true,
                sucess:false
            })  
        }
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"User not registered",
                error:true,
                sucess:false
            })
        }
        if(user.status !== "Active"){
            return res.status(400).json({
                message:"Contact to customare care",
                error:true,
                sucess:false
            })
        }
        const checkPassword = await bcryptjs.compare(password,user.password)
        if(!checkPassword){
            return res.status(400).json({
                message:"Invalid Password",
                error:true,
                sucess:false
            })
        }
        const accesstoken = await generateAcesstoken(user._id)
        const refreshtoken = await generateRefreshtoken(user._id)
        const cookieOptions = {
            httpOnly :true,
            secure : true,
            sameSite :'None'
        }
        res.cookie('accesstoken', accesstoken,cookieOptions)
        res.cookie('refreshtoken',refreshtoken,cookieOptions)

        return res.json({
            message :"Login sucessfully",
            error: false,
            sucess:true,
            data:{
                accesstoken,
                refreshtoken  
            }
        })
    }catch(error){
        return res.status(500).json({
            message:error.message || error,
            error:true,
            sucess:false
        })
    }
 }

 export async function logoutController(req,res){
        try{
            const userid = req.userId
            const cookieOptions = {
                httpOnly :true,
                secure : true,
                sameSite :'None'
            }
            res.clearCookie("accesstoken",cookieOptions)
            res.clearCookie("refreshtoken",cookieOptions)

            const removeRefreshtoken = await UserModel.findByIdAndUpdate(userid,{
                refresh_token : ""
            })

            return res.json({
                message:"Logout Sucessfully",
                error:false,
                success:true
            })

        }catch(error){
            return res.status(500).json({
                message:error.message || error,
                error:true,
                sucess:false
            })
        }
 }

 export async function uploadAvatar(req,res){
    try{
        const userId = req.userId
        const image = req.file
        const upload = await uploadImageCloudinary(image)
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })
        return res.json({
            message:"upload sucessfully",
            data : {
                    _id : userId,
                    avatar : upload.url
            }
        })
        
    }catch(error){
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
 }

 export async function updateUserDetails(req,res){
      try{
        const userId = req.userId
        const {name ,email , mobile , password} = req.body
        let hashPassword = ""
        if(password){
            const salt =  await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }
        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password:hashPassword }),
        })
        return res.json({
            message: "updated user sucessfuly",
            error:false,
            sucess: true,
            data: updateUser
        })
      }catch(error){
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
      }
 }

 export async function forgotPasswordController(req,res){
        try{
            const {email} = req.body
            const user = await UserModel.findOne({email})
            if(!user){
                return res.status(400).json({
                    message:"Email not availabel",
                    error:true,
                    sucess:false
                })
            }
            const otp = generateOtp()
            const expiretime = new Date(Date.now() + 5 * 60 * 1000);
            const update = await UserModel.findByIdAndUpdate(user._id,{
                    forgot_password_otp : otp,
                    forgot_password_expiry : new Date(expiretime).toString()
            })
            await sendEmail({
                sendTo : email,
                subject: "Forgot Password from Ayurveda",
                html : forgotPasswordTemplate({
                    name : user.name,
                    otp : otp
                })
            })
            return res.json({
                message : "check you email",
                error:  false,
                sucess:true
            })
        }catch(error){
            return res.status(500).json({
                message: error.message || error,
                error:true,
                sucess:false
            })
        }
 }

 export async function verifyForgotPasswordOtp(req,res){
    try{
        const { email , otp } = req.body
        if(!email || !otp){
            return res.status(400).json({
                message:"Provide requested field email,otp",
                error:true,
                success:flase
            })
        }
        const user = await UserModel.findOne({email})

        if(!user){
            return res.status(400).json({
                message:"Email not availabel",
                error: true,
                success:false
            })
        }
        const currentTime = new Date().toISOString
        if(user.forgot_password_expiry < currentTime){
            return res.status(400).json({
                message:"otp",
                error:true,
                success :false
            })
        }
        if(otp!== user.forgot_password_otp){
            return res.status(400).json({
                message:"Invalid otp",
                error:true,
                sucess:true
            })
        }
        return res.json({
            message :"verify otp",
            error:false,
            sucess:true
        })

    }catch(error){
        return res.status(500).json({
            message : error.message || error,
             error:true,
            success:false
        })
    }
 }

 export async function resetpassword(req,res) {
    try{
        const {email , newPassword , confirmPassword} = req.body
        if(!email || !newPassword  || !confirmPassword ){
            return res.status(400).json({
                message : "provide required fields email , newPassword , confirmPassword"
            })
        }
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"Email is not avilabel ",
                error:true,
                success:false
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message :" newPassword and confirmPassword not same",
                error:true,
                success:false

            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findByIdAndUpdate(user._id,{
            password : hashPassword

        })
          return res.json({
            message : "Password update sucessfully",
            error: false,
            success: true
          })
    }catch(error){
        return res.status(500).json({
            message:error.message || error,
            error: true,
            sucess:false
        })
    }
 }
 
 export async function refreshToken(req,res){
    try{
        const refreshToken = req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1]
        if(!refreshToken){
            return res.status(401).json({
                message : "Invalid token",
                error : true,
                sucess:false
            })
        }
        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)
        if(!verifyToken){
            return res.status(401).json({
                message:"token is expired",
                error:true,
                sucess:false
            })
        }
        const userId = verifyToken._id
        const newAccessToken = await generateAcesstoken(userId)
        const cookieOptions = {
            httpOnly : true ,
            secure : true ,
            sameSite : "None"
        }
        res.cookie("accesstoken",newAccessToken,cookieOptions)

        return res.json({
            message : "New Access token generated",
            error: false,
            sucess:true,
            data :{
                accesstoken : newAccessToken
            }
        })
    }catch(error){
        return res.status(500).json({
            message: error.message || error,
            error:true,
            sucess:false
        })
    }
 }