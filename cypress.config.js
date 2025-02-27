const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'ezoq39',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
    },
    baseUrl: 'https://qa.rovermd.com:8443/RoverApp/#/login',
    // viewportHeight: 950,
    // viewportWidth: 1750,
    experimentalStudio: true
  },
});
//<reference types="Cypress"/>; 
//<reference types="Cypress-Xpath"/> 

require('@applitools/eyes-cypress')(module);
