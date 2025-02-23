import jwt from "jsonwebtoken"

const Auth = async(req,res,next) =>{
    try{
        const token = req.cookies.accesstoken ||req?.header?.authorization.split(" ")[1]
        if(!token){
            return res.status(401).json({
                message:"Provide token"
            })
        } 
        const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)  
        if(!decode){
            return res.status(401).json({
                message : "Unauthorized acess",
                error:true,
                success:false
            })
        }
        req.userId = decode.id
        next()
        console.log("decode",decode);
             
    }catch(error){
        return res.status(500).json({
            message:error.message|| error,
            error :true,
            success :false
        })
    }
}
export default Auth