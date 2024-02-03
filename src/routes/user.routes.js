import { Router } from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const userRoutes = Router();
userRoutes.post("/", userController.add);
userRoutes.post("/address", authMiddleware, userController.addAddress);
userRoutes.get("/", userController.get);
userRoutes.get("/:id", userController.find);
userRoutes.put("/", authMiddleware, userController.update);
userRoutes.delete("/:id", userController.delete);

export { userRoutes };
