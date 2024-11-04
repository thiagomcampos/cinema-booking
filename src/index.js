import express from "express";
import bodyParser from "body-parser";
import sessionsRouter from "./routes/sessions.js";

const app = express();
app.use(express.static("public"));

app.use(bodyParser.json());

app.use("/sessions", sessionsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
