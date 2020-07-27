
let publisher = require("@pact-foundation/pact-node")
let path = require("path")

const util = require('util');
const exec = util.promisify(require('child_process').exec);

if (process.env.CI !== "true") {
  console.log("skipping Pact publish as not on CI...")
  process.exit(0)
}

const getBranch = async () => {
  const { stdout, stderr } = await exec('git rev-parse --abbrev-ref HEAD');
  return stdout.replace('\n', '');
}

const getGitShaBranch = async () => {
  const { stdout, stderr } = await exec('git rev-parse HEAD');
  getBranch().then((branch) => {
    console.log('BR: ' + stdout.replace('\n', '') + ' ' + branch);
    return stdout.replace('\n', '') + ' ' + branch;
  }).then((combination) => {
    console.log('COMB: ' + combination);
    return combination;
  })

}

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
  

