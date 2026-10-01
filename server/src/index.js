require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("./config/passport");

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error del servidor" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT || 4000, () => console.log("API lista")),
  )
  .catch((e) => {
    console.error("No se pudo conectar a MongoDB", e);
    process.exit(1);
  });
