// require('cypress-cucumber-preprocessor/steps');

// const { expect } = require("chai");
import {
  defineStep,
} from "@badeball/cypress-cucumber-preprocessor";

defineStep("We are on the home page", () => {
  const bs = Cypress.config("baseUrl");
  console.log("bs", bs);

  cy.visit("/");
});

defineStep("We have get rid of all the popup messages", () => {
  cy.log("This is a message logged from a Cypress scenario");

  const accept = "button#onetrust-accept-btn-handler";

  cy.get(accept).should("be.visible").click();

  cy.xpath("//label[text()='Do not show this again']/preceding-sibling::div[1]")
    .should("be.visible")
    .click();

  const new_features_xx =
    "div[title^='alternatively press the ESC key or click outside the modal w']";

  cy.get(new_features_xx).should("be.visible").click();
});

// https://github.com/cucumber/cucumber-expressions#readme
defineStep("We are filling the search with {string} query", (query) => {
  cy.log("The query is:", query);

  const search = "input#search";

  cy.get(search)
    .should("exist")
    .should("have.value", "")
    .type(query)
    .should("have.value", query);
});

defineStep("That the genome {string} is the selected one", (genome) => {
  cy.log("The genome is:", genome);

  // //DIDNT WORK
  // const genome_select = "select[name='genome']"
  // cy.get(genome_select)
  // .should('exist')
  // .select(genome, {force: true})

  const selected = ".select-selected";

  cy.get(selected).should("exist").should("be.visible").click();
  // .should('have.text', genome)

  const select_items = ".select-items > div";

  // //THIS WORKS to act upon each text
  // .each(($el, index, $list) => {
  // cy.task('log', $el.text())
  // })

  cy.get(select_items)
    .should("have.lengthOf.at.least", 1)
    .contains(genome)
    .should("be.visible")
    .click();

  cy.get(selected).should("have.text", genome);
});

defineStep("the search button is clicked", () => {
  const btn = "button#varsome-search-btn";
  cy.get(btn).should("be.visible").click();
});

defineStep(
  "the optional sample information form has phenotype names from {string}, phenotypes {string} and {int} age at onset",
  (phenotype_origin, phenotypes, age_onset) => {
    cy.log("phenotype_origin", phenotype_origin);
    cy.log("phenotypes", phenotypes);
    cy.log("age_onset", age_onset);

    cy.get(".radiobutton")
      .should("be.visible")
      .contains(phenotype_origin)
      .should("be.visible")
      .click();

    cy.get("div#germline-modal-phenotypes input[type='text']")
      .should("exist")
      .type(phenotypes);

    cy.get('#germline-modal-phenotypes div[id*="react-select"]')
      .should("exist")
      .should("have.length.at.least", 1)
      .contains("Add " + phenotypes)
      .scrollIntoView()
      .should("be.visible")
      .click();

    cy.get("div#germline-modal-onset-age > input")
      .should("be.visible")
      .type(age_onset);

    cy.xpath(
      "//button[contains(@class, 'Button__StyledButton') and contains(text(), 'Search')]"
    )
      .should("be.visible")
      .should("be.enabled")
      .click();
  }
);

defineStep("bypass the security validation", () => {
  const btn = "button#proceedBtn";

  cy.get(btn).should("be.visible").should("be.enabled");

  cy.xpath("//main").trigger("mouseover");

  cy.wait(1000);

  cy.xpath("//main/section").trigger("mouseover");

  cy.wait(1000);

  cy.xpath("//main/section/div").trigger("mouseover");

  cy.wait(1000);

  cy.get(btn).scrollIntoView();

  cy.wait(1000);

  cy.scrollTo('top');

  cy.wait(1000);

  cy.xpath("//main/section/div/div").trigger("mouseover");

  cy.wait(1000);

  cy.xpath("//main/section/div/div/div").trigger("mouseover");

  cy.wait(1000);

  cy.xpath("//main/section/div/div/div/form").trigger("mouseover");

  cy.wait(1000);

  cy.get(btn).trigger("mouseover");

  cy.wait(1000);

  cy.get(btn).click();

  //TODO even after those weird actions we still cannot bypass the security validation, one extra idea is to do a few extra mouseover and mousemove events right after the click
});

defineStep("skip the tour", () => {
  cy.xpath("//button[text()='Skip']", { timeout: 10000 })
    .should("be.visible")
    .click();
});
