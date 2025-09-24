import { ApiErrors } from "../utils/ApiErrors.js";

export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if (req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin users can perform this action");
    }

    next();
}