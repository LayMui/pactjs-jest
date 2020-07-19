const { Verifier } = require('@pact-foundation/pact');
const { server, importData, userRepository } = require('./provider');

const port = process.env.PORT || 3000;


beforeEach((done) => {
  server.listen(port, (err) => {
    if (err) return done(err);
    importData()
    console.log(`Listening on port ${port}...`);
    done();
  })
});

afterEach((done) => {
  return  server;
});

describe('Pact Verification', () => {
  test('should validate the expectations of our consumer', (done) => {
    let token = "INVALID TOKEN"
    const opts = {
      provider: 'iProvider',
      providerBaseUrl: `http://localhost:${port}`,
      pactBrokerUrl: 'http://localhost:9292',
      publishVerificationResult: true,
      providerVersion: '1.0.0',
      logLevel: 'INFO',

      requestFilter: (req, res, next) => {
        // e.g. ADD Bearer token
        req.headers['Content-Type'] = 'application/json'
        req.headers['Authorization'] = `Bearer ${token}`
        next()
      },

      stateHandlers: {
        "Create a new user": () => {
          token = "eyJzdWIiOiI1ZWU4MT"
          importData()
          return Promise.resolve(`Users added to the db`)
        },
        "is not authenticated": () => {
          token = ""
          Promise.resolve(`Invalid bearer token generated`)
        },
      },
    }
  
    //return new Verifier(opts).verifyProvider();
    
    return new Verifier(opts).verifyProvider().then(output => {
      console.log("Pact Verification Complete!")
      console.log(output)
      done();
    })
  })
})
