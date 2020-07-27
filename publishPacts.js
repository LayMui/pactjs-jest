
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
     exec('git rev-parse --abbrev-ref HEAD');
   });
}

function getGitSha() {
  return new Promise((resolve, reject)=> {
    exec('git rev-parse HEAD');
  });
}

Promise.all([getBranch, getGitSha]).then(branch, gitsha => {
  console.log('BR: ' + branch);
  console.log('GIT: ' + gitsha);
})

getGitShaBranch().then((gitsha_brname)  => {
    console.log('gitsha_brname: ' + gitsha_brname);
    return gitsha_brname;
  }).then(gitsha_brname => {
    let opts = {
      providerBaseUrl: "http://localhost:8082",
      pactFilesOrDirs: [path.resolve(process.cwd(), "pacts")],
      pactBroker: process.env.PACT_BROKER_URL,
      pactBrokerUrl: process.env.PACT_BROKER_TOKEN,
      check_for_potential_duplicate_pacticipant_names: "false",
      consumerVersion:  "2.0.0",
      //consumerVersion: gitSha,
      tags: gitsha_brname,
    }
  
    publisher.publishPacts(opts)
  });
  

