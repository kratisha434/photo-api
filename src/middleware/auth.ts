import { Request, Response, NextFunction } from "express";
export const validateAccessKey = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessKey = req.headers["x-access-key"];
    const expectedKey = process.env.ACCESS_KEY;
    if (!accessKey || accessKey !== expectedKey) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    next();
};