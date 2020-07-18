const { Verifier } = require('@pact-foundation/pact');
const { server, importData, userRepository } = require('./provider');

const port = process.env.PORT || 3000;


server.listen(port, () => {
  importData()
  console.log(`Listening on port ${port}...`);
})


describe('Pact Verification', () => {
  test('should validate the expectations of our consumer', () => {
    const opts = {
      provider: 'iProvider',
      providerBaseUrl: `http://localhost:${port}`,
      pactBrokerUrl: 'http://localhost:9292',
      publishVerificationResult: true,
      providerVersion: '1.0.0',
      logLevel: 'INFO',

      requestFilter: (req, res, next) => {
        // e.g. ADD Bearer token
        req.headers["authorization"] = `Bearer ${token}`
        next()
      },

      stateHandlers: {
        "Create a new user": () => {
          importData()
          return Promise.resolve(`Users added to the db`)
        },
        "is not authenticated": () => {
          token = ""
          Promise.resolve(`Invalid bearer token generated`)
        },
      },

    }
  
    return new Verifier(opts).verifyProvider().then(output => {
      console.log("Pact Verification Complete!")
      console.log(output)
    })
  })
})
