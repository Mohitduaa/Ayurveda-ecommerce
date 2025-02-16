import { Router} from "express";
import { forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateUserDetails, uploadAvatar, verifyEmailController, verifyForgotPasswordOtp } from "../Controllers/User.controllers.js";
import Auth from "../Middleware/Auth.js";
import upload from '../Middleware/multer.js'; 
import { createAddress, deleteAddress, getAddressById,  getUserAddresses, updateAddress } from "../Controllers/Address.controllers.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../Controllers/Product.controllers.js";
import { addToCart,getCart, removeFromCart, updateCart } from "../Controllers/CartproductController.js";
import { createOrder, getAllOrders } from "../Controllers/Order.controllers.js";


const UserRouter = Router()
UserRouter.post('/register',registerUserController)
UserRouter.post('/verify-email',verifyEmailController)
UserRouter.post('/login',loginController)
UserRouter.get('/logout',Auth,logoutController)
UserRouter.put('/upload-avatar',Auth,upload.single('avatar'),uploadAvatar)
UserRouter.put('/update-user',Auth,updateUserDetails)
UserRouter.put('/forgot-password',forgotPasswordController)
UserRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
UserRouter.put('/reset-password',resetpassword)
UserRouter.post('/refresh-token', refreshToken)
UserRouter.post('/create-Address',Auth,createAddress)
UserRouter.get('/all-Address',Auth,getUserAddresses)
UserRouter.get('/address-by-id/:id',Auth,getAddressById)
UserRouter.put('/update-address/:id',Auth,updateAddress)
UserRouter.delete('/delete-Address/:id',Auth,deleteAddress)
UserRouter.post('/create-product',Auth,upload.single('image'),createProduct)
UserRouter.get('/all-products',Auth,getAllProducts)
UserRouter.get('/product-by-id/:id',Auth,getProductById)
UserRouter.put('/update-product/:id',Auth,updateProduct)
UserRouter.delete('/delete-product/:id',Auth,deleteProduct)
UserRouter.post('/cart',addToCart)
UserRouter.get('/Allcart',getCart)
UserRouter.put('/cart',updateCart)
UserRouter.delete("/cart/:cartProductId", removeFromCart);
UserRouter.post('/order',createOrder)
UserRouter.get('/allorder',getAllOrders)

const ProductRouter = Router()


export default UserRouter;