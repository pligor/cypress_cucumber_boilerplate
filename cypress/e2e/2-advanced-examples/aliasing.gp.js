/// <reference types="cypress" />

context("Aliasing", () => {
  beforeEach(() => {
    cy.visit("https://play1.automationcamp.ir/forms.html");
  });

  it(".as() - alias a DOM element for later use", () => {
    // https://on.cypress.io/as

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

  // it('.as() - alias a route for later use', () => {
  //   // Alias the route to wait for its response
  //   cy.intercept('GET', '**/comments/*').as('getComment')

  //   // we have code that gets a comment when
  //   // the button is clicked in scripts.js
  //   cy.get('.network-btn').click()

  //   // https://on.cypress.io/wait
  //   cy.wait('@getComment').its('response.statusCode').should('eq', 200)
  // })
});
