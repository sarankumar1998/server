const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const autho = require("./auth/auth");
const cors = require("cors");

const app = express();


app.use(cors());



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", autho);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy checkkkk" });
});


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cookieParser());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
