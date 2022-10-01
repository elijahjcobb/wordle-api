import { fetchWordleOfTheDay } from "./parse";
import * as express from "express";
import { Cache } from "./cache";
import * as fs from "fs";
import * as https from "https";

const app = express();

const cache = new Cache(fetchWordleOfTheDay);

app.get("/", async (req, res) => {
  res.json({ solution: await cache.read() });
});

const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/wordle-api.elijahcobb.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/wordle-api.elijahcobb.com/fullchain.pem",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);
