// <reference types="Cypress" />
// <reference types="cypress-xpath" />

const { defineConfig } = require("cypress");

// Register Applitools Eyes
require('@applitools/eyes-cypress')(module);

module.exports = defineConfig({
  projectId: 'ezoq39',
  e2e: {
    baseUrl: 'https://qa.rovermd.com:8443/RoverApp/#/login',
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // Register any required plugins here
      // Example: Visual snapshot testing plugin
      // const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');
      // addMatchImageSnapshotPlugin(on, config);

      return config;
    },
  },

env: {
  appliConfFile: {
    failCypressAfterAllSpecs: false,
    showLogs: true,
    tapDirPath: 'cypress/results/',
    tapFileName: 'eyes.tap',
    eyesFetchConcurrency: 5
  }
}




});
