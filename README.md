# Execution
### To execute by specifying the tag for a scenario in cucumber

    npx cypress run --headed --no-exit --browser chrome --spec=features/saphetor.feature -e TAGS="@helloworld or @exercise"

Note that the tags need to include the "@" character

### To execute by keeping the window open with chrome browser

    npx cypress run --headed --no-exit --browser chrome --spec=features/saphetor.feature


### To execute by keeping the window open

    npx cypress run --spec=features/saphetor.feature --headed --no-exit

### To execute cucumber:

    npx cypress run --spec=features/saphetor.feature --headed

### Do the demo of the plain todo form of Cypress  
        
    npx cypress run --spec "cypress/e2e/1-getting-started/todo.cy.js" --headed

# To Open Cypress application window

    npx cypress open

# References
## Cypress References
- Command line options: https://docs.cypress.io/guides/guides/command-line
- Assertions: https://docs.cypress.io/guides/references/assertions#Chai
- Cypress Configuration: https://docs.cypress.io/guides/references/configuration#Browser
- Cypress Waiting: https://filiphric.com/waiting-in-cypress-and-how-to-avoid-it
- type arguments for special keys of the keyboard: https://docs.cypress.io/api/commands/type#Arguments
- Configuration: https://docs.cypress.io/guides/references/configuration#Timeouts

## Cypress Cheatsheets
- https://chercher.tech/cypress-io/cheat-sheet-cypress-io

## Cucumber References
- Cucumber expressions: https://github.com/cucumber/cucumber-expressions#readme
- Data tables: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/data_table_interface.md

# FAQ
Get Text From A List Of Elements: https://www.youtube.com/watch?v=T5Aqa1KjIqQ&ab_channel=glebbahmutov
How to make Cypress work with TypeScript: `the /// <reference types="cypress" /> triple-slash directive is used to include Cypress type definitions in your test file and provide TypeScript with information about Cypress commands and APIs you use in your test.`

# Installation and Getting Started with Cucumber for Cypress
Initial instructions from: https://dev.to/kailashpathak7/how-to-integrate-bdd-cucumber-in-cypress-10-50ef

DO NOT USE this abandoned/deprecated package: cypress-cucumber-preprocessor

npm install cypress — save-dev
npm install -D @badeball/cypress-cucumber-preprocessor
npm install -D @bahmutov/cypress-esbuild-preprocessor
npm install -D @cypress/xpath

Have the configuration inside the `cypress.config.js` file
Inside this file import at the top the following:

    // This function provides a way to use Cucumber, a tool for writing automated tests in natural language, as a preprocessor for Cypress tests.
    const addCucumberPreprocessorPlugin = require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin

    // This module provides a way to transpile JavaScript code using esbuild, a fast JavaScript/TypeScript compiler, as a preprocessor for Cypress tests.
    const createBundler = require("@bahmutov/cypress-esbuild-preprocessor")

    //This function provides a way to use esbuild as a plugin for Cucumber preprocessor, allowing for transpilation of JavaScript code in Cucumber tests.
    const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin


Inside this same file include the following configuration in `e2e` (https://docs.cypress.io/guides/references/configuration#e2e):

    async setupNodeEvents(on, config) {
        const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
        });

        on("file:preprocessor", bundler);
        await addCucumberPreprocessorPlugin(on, config);

        return config;
    },
    specPattern: 'features/**/*.feature',

Sample of executing a feature file Cucumber: `npx cypress run --spec=features/saphetor.feature --headed`


# Extra links
- https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Support-file

# Command to see if project is cooking ok
npx cypress run --spec "cypress/e2e/1-getting-started/todo.gp.js" --headed
