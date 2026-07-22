import express from "express";
import payload from "payload";
import config from "./payload.config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
  await payload.init({
    ...config,
    express: app,
    secret: process.env.PAYLOAD_SECRET || "change-me",
    onInit: () => {
      app.listen(3001, () => {
        console.log("Payload admin running at http://localhost:3001");
      });
    },
  } as any);
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
