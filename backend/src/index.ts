import express from "express";
import cors from "cors";
import simulationRouter from "./routes/simulation/route";
import gameRouter from "./routes/game/route";
import filtersRouter from "./routes/filters/route";

const app = express();
const port = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use("/api", simulationRouter);
app.use("/api", filtersRouter);
app.use("/api", gameRouter);

app.get("/", (req, res) => {
  res.send("Cricket Data Analytics API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
