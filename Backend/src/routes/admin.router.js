import { Router } from "express";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { getDashboardStats, getAllUsers, syncMovies } from "../controllers/admin.controller.js";

const router = Router();

// Protect all admin routes
router.use(verifyJWT, isAdmin);

router.route("/stats").get(getDashboardStats);
router.route("/users").get(getAllUsers);
router.route("/sync-movies").post(syncMovies);

export default router;
