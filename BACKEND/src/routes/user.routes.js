//endpoints

import {Router} from "express"
import { upload } from "../middlewares/multer.middlewares.js";
import { fetchUserDetails, refreshAccessToken, updateUserDetails, updateUserProfile, userLogin, userLogout, userRegister } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/register').post(upload.single("profileImage") , userRegister);
router.route('/login').post(userLogin);
router.route('/logout').post(verifyJWT , userLogout);
router.route('/fetch-user').get(verifyJWT,fetchUserDetails);
router.route('/update-details').patch(verifyJWT,updateUserDetails);
router.route('/update-profile').patch(verifyJWT , upload.single("profileImage") , updateUserProfile);
router.route('/refresh-access-token').post(refreshAccessToken);

export default router