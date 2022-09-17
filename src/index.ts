import { fetchWordleOfTheDay } from "./parse";
import * as express from "express";
import { Cache } from "./cache";

const app = express();

const cache = new Cache(fetchWordleOfTheDay);

app.get("/", async (req, res) => {
  res.json({ solution: await cache.read() });
});

app.listen(3000);
