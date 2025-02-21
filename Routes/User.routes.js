import { Router} from "express";
import { forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateUserDetails, uploadAvatar, verifyEmailController, verifyForgotPasswordOtp } from "../Controllers/User.controllers.js";
import Auth from "../Middleware/Auth.js";
import upload from '../Middleware/multer.js'; 
import { createAddress, deleteAddress, getAddressById,  getUserAddresses, updateAddress } from "../Controllers/Address.controllers.js";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../Controllers/Product.controllers.js";
import { addToCart,getCart, removeFromCart, updateCart } from "../Controllers/CartproductController.js";
import { createOrder, getAllOrders, getOrderById, updateOrder } from "../Controllers/Order.controllers.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../Controllers/Category.controllers.js";


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
UserRouter.post('/create-product',upload.single('image'),Auth,createProduct)
UserRouter.get('/all-products',getAllProducts)
UserRouter.get('/product-by-id/:id',Auth,getProductById)
UserRouter.put('/update-product/:id',Auth,updateProduct)
UserRouter.delete('/delete-product/:id',Auth,deleteProduct)
UserRouter.post('/cart',Auth,addToCart)
UserRouter.get('/Allcart',Auth,getCart)
UserRouter.put('/cart',Auth,updateCart)
UserRouter.delete("/cart/:cartProductId",Auth, removeFromCart);
UserRouter.post('/order',Auth,createOrder)
UserRouter.get('/allorder',Auth,getAllOrders)
UserRouter.get('/order-by-id/:id',Auth,getOrderById)
UserRouter.put('/order-update/:id',Auth,updateOrder)    
UserRouter.post('/create-category',Auth,createCategory)
UserRouter.get('/All-categories',Auth,getAllCategories)
UserRouter.get('/Categories-by-id/:id',getCategoryById)
UserRouter.put('/category-update/:id',updateCategory)
UserRouter.delete('/delete-category-by-id/:id',deleteCategory)
export default UserRouter;