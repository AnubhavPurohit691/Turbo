import express from "express";
import routerone from "./controller/controller"
import cors from "cors"

const app = express();
app.use(cors())
app.use(express.json());

app.use("/v1",routerone)

app.listen(9000, () => {
  console.log("Server is running on port 9000");
});
