import express from "express";
import bodyParser from "body-parser";
import globalErrorHandler from "../middlewares/errorHandler.middleware";
import { userRoutes } from "../routes/user.routes";
import cors from 'cors';

/*
  body-parser: Parse incoming request bodies in a middleware before your handlers,
  available under the req.body property.
*/

let server;

const expressService = {
  init: async () => {
    try {
      server = express();
      server.use(cors());
      server.use(bodyParser.json());
      server.use('/users', userRoutes);
      server.use(globalErrorHandler);
      server.listen(process.env.SERVER_PORT, () => {
        console.log(`Listening on port ${process.env.SERVER_PORT}`)
      });
      console.log("[EXPRESS] Express initialized");
    } catch (error) {
      console.log("[EXPRESS] Error during express service initialization");
      throw error;
    }
  },
};

export default expressService;
