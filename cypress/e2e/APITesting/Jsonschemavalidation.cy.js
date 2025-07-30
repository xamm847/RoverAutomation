// Use CommonJS or ES module, not both
const Ajv = require('ajv'); // You can also use: import Ajv from 'ajv';
const ajv = new Ajv();

describe('API Testing with JSON Schema Validation', () => {
    it('should validate the JSON response against the schema', () => {
        cy.request({
            method: 'GET',
            url: 'http://qa.rovermd.com:7777/mobile-users/all',
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Define the JSON schema
       const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Mobile Users Schema",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "number" },
      "status": { "type": "boolean" },
      "clientIndex": { "type": "number" },
      "enabled": { "type": "string" },
      "userId": { "type": "string" },
      "userName": { "type": "string" },
      "facilityName": { "type": "string" },
      "email": { "type": ["string", "null"] } // <-- Updated here
    },
    "required": [
      "id",
      "status",
      "clientIndex",
      "enabled",
      "userId",
      "userName",
      "facilityName"
      // "email" not required
    ]
  }
};


            // Validate response body
            const validate = ajv.compile(schema);
            const valid = validate(response.body);

            // Assert result
            expect(valid, `AJV validation errors: ${JSON.stringify(validate.errors, null, 2)}`).to.be.true;
        });
    });
});
