//npm run dev - to start server and client together
const express = require("express");
const mongoose = require("mongoose");
//const bodyParaser = require("body-parser");
//const items = require("./routes/api/items");
const path = require("path");
const app = express();
const config = require("config");

//Bodyparser Middleware
app.use(express.json());

//DB config
const db = config.get("mongoURI");

//connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

//Use routes
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

//serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "builde", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
