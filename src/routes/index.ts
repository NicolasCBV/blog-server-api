import cors, { CorsOptions } from "cors";
import { Router } from "express";

import { CorsConfig } from "../middleware/CorsConfig";
import routesAuth from "./authenticatedRoutes";
import { HandleNotFoundError } from "../middleware/HandleNotFoundError";

import defaultRoutes from "./defaultRoutes";

const routes = Router();

const corsOptions: CorsOptions = {
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  // credentials: false,
  // allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  origin: "*",
};

routes.use(cors(corsOptions));
routes.options("/", cors(corsOptions));
routes.use(CorsConfig);
routes.get("/healthz", (req, res) => {
  return res.json({ test: "hello world" });
});
routes.use(defaultRoutes);
routes.use(routesAuth);
routes.use(HandleNotFoundError);

export default routes;
