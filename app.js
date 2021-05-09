const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const multer = require("multer");
const fetch = require("node-fetch");
// Custom module
const urls = require("./config/myUrl");

// Import routes
const homeRoute = require("./routes/homeRoute");
const authRoute = require("./routes/authRoute");
const postsRoute = require("./routes/postsRoute");
const SearchRoutes = require("./routes/SearchRoutes");
const APIRoutes=require("./routes/APIRoutes");
//const forgotRoute=require("./routes/forgotRoute");
const likeRoute=require("./routes/LikeRoutes");
const { compare } = require("bcryptjs");
// const Admin = require("./routes/AdminRoutes");
// Initialize express app
const app = express();
// Database Connection

  const url = `mongodb+srv://202012077:13@MehaVora@cluster0.wglzq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

  //mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/web-bloggerspoint');
  /*.connect("mongodb+srv://202012077:13@MehaVora@cluster0.bibxr.mongodb.net/BloggersPoint?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then(() => console.log("MongoDB is successfully connected"))
  .catch((err) => console.log(err));
*/
// Configuration for form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Multer file upload Configuration
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
}).single("image");

app.use((req, res, next) => {
  upload(req, res, (err) => {
    if (req.file) {
      req.image = req.file.filename;
    }
    next();
  });
});

// Static file path setup
app.use("/static", express.static(path.join(__dirname, "public")));
// Setup for template Engine
app.set("views", "./views");
app.set("view engine", "ejs");

// Session store configuration
const store = new MongoDBStore({
  uri: urls.mongoDB,
  databaseName: "blogTrial",
  collection: "session",
});

// Session configuration
app.use(
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

// Set isAuthenticate to all routes
app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    res.locals.isAuthenticate = true;
    res.locals.authUser = req.session.user;
    // console.log(req.session.user);
    // console.log(req.locals.authUser);
  } else {
    res.locals.isAuthenticate = false;
    res.locals.authUser = 0;
  }
  next();
});

// Configure routes in middleware
app.use("/", homeRoute);
// app.use("/AdminRoutes", Admin);
app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/Search", SearchRoutes);
app.use("/api",APIRoutes);
//app.use("/forgot",forgotRoute);
app.use("/likes",likeRoute);
app.listen(3001, () => console.log("Server is running on port 3001"));
