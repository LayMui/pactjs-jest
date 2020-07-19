const { Matchers } = require("@pact-foundation/pact")
const axios = require('axios');
const { like, eachLike } = Matchers;


describe('user management request', () => {
 // const urlpath = '/api/uaa/admin/users?username=mike&firstName=mike&lastName=tan&password=CukeStudio)123&email=mike@amazon.com&organizations=e290e5c2-bd43-11ea-882a-cd26553a22fa&role=ROLE_KCP_DUMMY'
  const urlpath = '/api/uaa/admin/users'
 
  const getApiEndpoint = () => `http://${global.host}:${global.port}`
  /*
  **  POST /api/uaa/admin/users?username=mike&firstName=mike&lastName=tan&password=CukeStudio)123&email=mike@amazon.com&organizations=e290e5c2-bd43-11ea-882a-cd26553a22fa&role=ROLE_KCP_DUMMY'
  **  #1 Create a new user
  */
  describe('create new user request', () => {
    afterEach(() => provider.verify())
    const EXPECTED_BODY = {
      uuid: "60b7a577-c623-4c03-a902-aa3200bb0e89",
      email: "mike@amazon.com",
      username: "mike",
      firstName: "mike",
      lastName: "tan",
      title: null,
      department: null,
      location: null,
      groups: [],
      roles: [],
      organizations: [{uuid: "e290e5c2-bd43-11ea-882a-cd26553a22fa", code: "ABC"}]
    };
    
    
    const HEADER = {
      'Content-Type': 'application/json',
   //   'Authorization': like("Bearer eyJzdWIiOiI1ZWU4MT")
    };

   
    const BODY = EXPECTED_BODY;

    beforeEach(() => {
      const interaction = {
        state: 'Create a new user',
        uponReceiving: 'uuid and username',
        withRequest: {
          method: 'POST',
          path: urlpath,
          headers: HEADER,
          body: like(BODY),
        },
        willRespondWith: {
          status: 201,
          headers: HEADER,
          body: like(EXPECTED_BODY),
        },
      };
      return provider.addInteraction(interaction);
    });

    // add expectations
    it('returns a successfully body', () => { 
      return axios.request({
        method: 'POST',
        baseURL: getApiEndpoint(),
        url: urlpath,
        headers: HEADER,
        data: BODY,
      })
      .then((response) => {
        expect(response.status).toEqual(201);
        expect(response.headers['content-type']).toEqual('application/json');
        expect(response.data).toEqual(EXPECTED_BODY);
      })
  })
})

});
