
let publisher = require("@pact-foundation/pact-node")
let path = require("path")


let opts = {
  providerBaseUrl: "http://localhost:8082",
  pactFilesOrDirs: [path.resolve(process.cwd(), "pacts")],
  pactBroker: process.env.PACT_BROKER_URL,
  check_for_potential_duplicate_pacticipant_names: "false",
  consumerVersion:  "2.0.0",
}

publisher.publishPacts(opts)

