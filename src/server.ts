import express from "express";

import routes from "./routes/index";

import ErrorMiddleware from "./middleware/Errors";
import { PreventDDOSMiddleware } from "./middleware/PreventDDOSMiddleware";

const port = process.env.PORT || 3030;

const app = express();
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "public/uploads"));

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(PreventDDOSMiddleware);
app.use(routes);
app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log("Server online!");
});
