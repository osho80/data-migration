const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const init = require("./init");

const app = express();
const http = require("http").createServer(app);

// Express App Config
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("../frontend/public/index.html"));
app.use(
  session({
    secret: "project1",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "public")));
} else {
  const corsOptions = {
    origin: [
      "http://127.0.0.1:8080",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

// Routes
const areaRoutes = require("./api/admin/areas/routes");
const siteRoutes = require("./api/admin/sites/routes");
const singleRoutes = require("./api/admin/singles/routes");
const articleRoutes = require("./api/admin/articles/routes");
const videoRoutes = require("./api/admin/videos/routes");

app.use("/api/admin/areas", areaRoutes);
app.use("/api/admin/sites", siteRoutes);
app.use("/api/admin/singles", singleRoutes);
app.use("/api/admin/articles", articleRoutes);
app.use("/api/admin/videos", videoRoutes);

init.init();

const logger = require("./services/logger.service");
const port = process.env.PORT || 3030;
app.get("/**", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public", "index.html"));
});
http.listen(port, () => {
  logger.info("Server is running on port: " + port);
});
