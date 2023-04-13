/// <reference types="cypress" />

context("Aliasing", () => {
  beforeEach(() => {
    cy.visit("https://play1.automationcamp.ir/");
  });

  it(".as() - alias a DOM element for later use", () => {
    // https://on.cypress.io/as
    cy.contains("Forms").parents(".card").find(".btn").click();

    // Alias a DOM element for use later
    // We don't have to traverse to the element
    // later in our code, we reference it with @

    cy.get("button").as("cta");

    // when we reference the alias, we place an
    // @ in front of its name

    cy.get("#validationCustom03").type("test");
    cy.get("#validationCustom04").type("test");
    cy.get("#validationCustom05").type("test");

    cy.get("@cta").click();

    cy.get("div#invalid_terms")
      .should("contain.text", "You must agree before submitting")
      .should("be.visible");
  });

  it(".as() - alias a route for later use", () => {
    // cy.visit('https://example.cypress.io/commands/aliasing')

    // cy.intercept('GET', '**/comments/*').as('getComment')

    // // we have code that gets a comment when
    // // the button is clicked in scripts.js
    // cy.get('.network-btn').click()

    // // https://on.cypress.io/wait
    // cy.wait('@getComment').its('response.statusCode').should('eq', 200)

    cy.visit("https://resttesttest.com/");

    // // Alias the route to wait for its response
    cy.intercept("GET", "**/get").as("getAjax");

    cy.get("button#submitajax").click();

    // // https://on.cypress.io/wait
    cy.wait("@getAjax").its("response.statusCode").should("eq", 200);
  });

  it("to save any cypress variable", () => {
    cy.wrap('egrapsa oti ithela, kai opoio object na nai').as('kati');

    cy.log("@kati");
  });
});
