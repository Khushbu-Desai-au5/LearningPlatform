let express = require("express");
let app = express();
const session = require("express-session");
const path = require("path");
let ejs = require("ejs");
const router = require("./routes/routes");

const DBConnection = require("./db");
DBConnection.connectToServer(() => console.log("Connected to DB."));

//<-------------------------------------------------------Body-parser setup---------------------------------------------------->
let bodyParser = require("body-parser");
app.use(bodyParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "1234567890",
    resave: true,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
console.log(__dirname);
app.set("views", path.join(__dirname, "../lms-app01/view"));
app.use(express.static(path.join(__dirname, '../lms-app01/view')));
app.use(router);

app.listen(3000, () => console.log("Server is Listening on Port 3000"));
