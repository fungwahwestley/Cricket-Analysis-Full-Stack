import express from "express";
import cors from "cors";
import gamesRouter from "./routes/games";
import teamsRouter from "./routes/teams";
import venuesRouter from "./routes/venues";
import simulationsRouter from "./routes/simulations";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", gamesRouter);
app.use("/api", teamsRouter);
app.use("/api", venuesRouter);
app.use("/api", simulationsRouter);

app.get("/", (req, res) => {
  res.send("Cricket Data Analytics API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
