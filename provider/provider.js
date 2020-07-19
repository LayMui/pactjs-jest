
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
  res.header("Content-Type", "application/json")
  next()
})

server.use((req, res, next) => {
  const token = req.headers["authorization"] 

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

  userRepository.insert(user)

  res.json(user)
})

module.exports = {
  server,
  importData,
  userRepository,
}