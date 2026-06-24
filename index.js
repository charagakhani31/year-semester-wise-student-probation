import express from "express";
import probationRoutes from "./routes/ProbationRoutes.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
const app = express();
const PORT = 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + "/public"));


app.use("/api", probationRoutes);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "index.html")),
);

app.listen(PORT, () =>
  console.log(`Express server running at http://localhost:${PORT}`),
);
