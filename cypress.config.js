const { defineConfig } = require("cypress")

// This function provides a way to use Cucumber, a tool for writing automated tests in natural language, as a preprocessor for Cypress tests.
const addCucumberPreprocessorPlugin = require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin

// This module provides a way to transpile JavaScript code using esbuild, a fast JavaScript/TypeScript compiler, as a preprocessor for Cypress tests.
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor")

//This function provides a way to use esbuild as a plugin for Cucumber preprocessor, allowing for transpilation of JavaScript code in Cucumber tests.
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin

module.exports = defineConfig({
  viewportWidth: 1600,
  viewportHeight: 1000,
  e2e: {
    async setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on("file:preprocessor", bundler);
      await addCucumberPreprocessorPlugin(on, config);

      on('task', {
        log(messages) {
          if(Array.isArray(messages)) {
            console.log(...messages)
          } else {
            console.log(messages)
          }
          return null
        }
      })

      return config;
    },
    specPattern: ['features/**/*.feature', 'cypress/e2e/**/*.js'],
    baseUrl: 'https://varsome.com',
    chromeWebSecurity: false, // disable same origin security policy for Chrome
  },
  projectId: 'r1rxns',
});
