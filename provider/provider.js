const cors = require("cors")
const express = require('express')
const bodyParser = require("body-parser")
const Repository = require("./repository")

const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

server.use((req, res, next) => {
  const token = req.headers["authorization"]
  console.log("TOKEN: " + token);
  if (token !== "Bearer eyJzdWIiOiI1ZWU4MT") {
    res.sendStatus(401).send()
  } else {
    next()
  }
})


const userRepository = new Repository()

// Load default data into a repository
const importData = () => {
  const data = require("./data/users.json")
  data.reduce((a, v) => {
    v.id = a + 1
    userRepository.insert(v)
    return a + 1
  }, 0)
}

// Register a new user for the service
server.post("/api/uaa/admin/users", (req, res) => {
  const user = req.body

  // Really basic validation
  if (!user || !user.username) {
    res.writeHead(400)
    res.end()
    return
  }

  const authorizationToken = req.headers["authorization"]

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Authorization', authorizationToken);
  res.writeHead(201)
  res.end(JSON.stringify(user));
})

module.exports = {
  server,
  importData,
  userRepository,
}