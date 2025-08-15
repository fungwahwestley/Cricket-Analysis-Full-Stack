import express from "express";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import simulationRouter from "./routes/simulation/route";
import gameRouter from "./routes/game/route";
import filtersRouter from "./routes/filters/route";
import gamesRouter from "./routes/games/route";

const app = express();
const port = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use("/api", simulationRouter);
app.use("/api", filtersRouter);
app.use("/api", gameRouter);
app.use("/api", gamesRouter);

app.get("/", (req, res) => {
  res.send("Cricket Data Analytics API");
});

const useHttps = process.env.HTTPS === "true";

const createServer = () => {
  if (useHttps) {
    try {
      const httpsOptions: https.ServerOptions = {
        key: fs.readFileSync("/etc/letsencrypt/live/fungwah.me/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/fungwah.me/fullchain.pem"),
      };
      return https.createServer(httpsOptions, app);
    } catch (error) {
      console.warn("HTTPS disabled: failed to load SSL certificates.", error);
      return undefined;
    }
  } else {
    return http.createServer(app);
  }
};

const server = createServer();
if (!server) {
  throw new Error("Failed to create server");
}
const protocol = server instanceof https.Server ? "https" : "http";

server.listen(port, () => {
  console.log(`Server is running on ${protocol}://localhost:${port}`);
});
