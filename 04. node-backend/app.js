const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

//경로가 /api/places로 시작된다면 placesRoutes 실행
app.use("/api/places", placesRoutes);

app.listen(5000);
