const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");
const morgan = require("morgan");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

function greeter(teamName) {
  return function(req, res, next) {
    req.team = teamName;

    next();
  };
}

function checkBy3() {
  return (req, res, next) => {
    let time = new Date();
    let seconds = time.getSeconds();

    if (seconds % 3 === 0) {
      res.status(400).end();
    }

    next();
  };
}

server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use(greeter("works!"));
// server.use(checkBy3());

server.use("/api/hubs", restricted, hubsRouter);

server.get("/", (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to the ${req.team}</p>
    `);
});

function restricted(req, res, next) {
  const password = req.headers.password;

  if (password === "mellon") {
    next();
  } else {
    res.status(401).send("DONT PASS");
  }
}

module.exports = server;
