const path = require("path")
const Pact = require("@pact-foundation/pact").Pact

global.port = 8991
global.host = '127.0.0.1'
global.provider = new Pact({
  port: global.port,
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "pacts"),
  spec: 2,
  pactfileWriteMode: "update",
  consumer: "iConsumer",
  provider: "iProvider",
})