import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";


export const adminAuth = asyncHandler( async(req, res, next) => {
    if(!req.user){
        return res.status(401).json(
            new APIresponse(401, null, "Unauthorized")
        );
    }
    if(req.user.role !== "ADMIN"){
        return res.status(403).json(
            new APIresponse(403, null, "Admin access required")
        );
    }
    next()
})