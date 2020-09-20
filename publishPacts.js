
let publisher = require("@pact-foundation/pact-node")
let path = require("path")

const util = require('util');
const exec = util.promisify(require('child_process').exec);

if (process.env.CI !== "true") {
  console.log("skipping Pact publish as not on CI...")
  process.exit(0)
}

function getBranch()  {
   return new Promise((resolve, reject) => {
     resolve(exec('git rev-parse --abbrev-ref HEAD'));
   });
}

function getGitSha() {
  return new Promise((resolve, reject)=> {
    resolve(exec('git rev-parse HEAD'));
  });
}

Promise.all([getBranch().catch(error => { return error}), getGitSha().catch(error => { return error})]).then(data => {
  console.log('Data: ' + JSON.stringify(data));
  let branch = (data[0].stdout).replace(/\n/g," ");
  let gitsha = (data[1].stdout).replace(/\n/g," ");;
  console.log('BRANCH ' + branch);
  console.log('GITSHA ' + gitsha);
  let opts = {
    providerBaseUrl: "http://localhost:8082",
    pactFilesOrDirs: [path.resolve(process.cwd(), "pacts")],
    pactBroker: process.env.PACTBROKERURL,
    //pactBrokerUrl: process.env.PACTBROKERURL,
    pactBrokerToken: process.env.PACTBROKERTOKEN,
    check_for_potential_duplicate_pacticipant_names: "false",
    consumerVersion:  "2.0.0",
    consumerVersion: gitsha,
    tags: branch,
  }

  publisher.publishPacts(opts)
}).catch(error => {
  console.log(error);
})