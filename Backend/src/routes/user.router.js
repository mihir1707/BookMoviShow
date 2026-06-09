import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getFavoriteMovies, loginUser, logoutUser, refreshAccessToken, registerUser, toggleFavoriteMovie, updateAccountDetails, firebaseAuth } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(verifyJWT, changeCurrentPassword)
router.route('/current-user').get(verifyJWT, getCurrentUser)
router.route('/update-account').patch(verifyJWT, updateAccountDetails)
router.route('/favorites/:movieId').post(verifyJWT, toggleFavoriteMovie)
router.route('/favorites').get(verifyJWT, getFavoriteMovies)
router.route('/firebase-auth').post(firebaseAuth)


export default router;