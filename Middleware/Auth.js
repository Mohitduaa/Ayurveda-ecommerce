import jwt from "jsonwebtoken";

const Auth = async (req, res, next) => {
    try {
        const token = req.cookies.accesstoken || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
        
        if (!token) {
            return res.status(401).json({
                message: "Provide token",
                error: true,
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        
        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        req.userId = decode.id;
        next();
        console.log("Decoded Token:", decode);

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export default Auth;
