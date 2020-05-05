require("dotenv").config();
require("./configs/mongodb.js")
  .connectDB()
  .then(() => {
    console.log(`\x1b[32m(PLAIN) Successfuly connected to database server\x1b[0m`);

    const express = require("express");
    const bodyParser = require("body-parser");
    const cors = require("cors");

    const app = express();

    app.use(bodyParser.json());
    app.use(cors());

    app.use("/obra", require("./routes/obra-route.js"));
    app.use("/user", require("./routes/user-route.js"));

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`\x1b[32m(PLAIN) Server listening on port ${port}\x1b[0m`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
