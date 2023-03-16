/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

//npx cypress run --headed --browser chrome --spec=cypress/e2e/1-getting-started/todo.gp.js --no-exit

describe("example to-do app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("https://www.play1.automationcamp.ir/index.html");
  });

  it("displays two todo items by default", () => {
    const card = ".card";
    cy.get(card).should("have.length", 8);

    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    const card_header = ".card h5";
    // //.invoke('trim') did not work on jquery element
    // cy.get(card_header).first().then( (el) => {
    //   expect( Cypress.$.trim(el.text()) ).to.equal("Wait Conditions");
    // });
    // //so an easier way is:
    cy.get(card_header) //here we have a list of jquery elements
      .first() //here we have a single jquery element
      .invoke("text") //here we get the text of the jquery element
      .invoke("trim") //so now we invoke the function of a javascript string whici is the trim()
      .should("equal", "Wait Conditions"); //so now we assert the actual text with the expected text

    cy.get(card_header).last().should("contain.text", "Advanced UI Features");
  });

  it("can add new todo items", () => {
    cy.get(
      ".container.shadow-lg > div:nth-of-type(2) > div:nth-of-type(3) .btn.btn-success"
    )
      .should("be.visible")
      .click();

    const checkbox = `input#invalidCheck`;

    cy.get(checkbox)
      .should("exist")
      .scrollIntoView()
      .should("be.visible")
      .click();

    // const city = `form.needs-validation .mb-3:nth-of-type(1) .form-control`;
    // const state = `form.needs-validation .mb-3:nth-of-type(2) .form-control`;
    // const zip = `form.needs-validation .mb-3:nth-of-type(3) .form-control`;

    const fields = "form.needs-validation .form-control";
    const city = () => cy.get(fields).eq(0);
    const state = () => cy.get(fields).eq(1);
    const zip = () => cy.get(fields).eq(2); //line one

    cy.get(fields).eq(0).type(`mycity`);
    cy.get(fields).eq(1).type(`mystate{enter}`);

    // cy.get(fields).last().should("be.empty"); //line two
    zip().should("be.empty"); //line two

    const invalidzip = `div#invalid_zip`;
    cy.get(invalidzip).should("be.visible");

    // cy.get(fields).eq(2).type(`some zip`); //line three
    zip().type(`some zip`); //line three

    cy.get(invalidzip).should("not.be.visible");

    cy.get(fields).first().should("not.have.value", "");
    cy.get(fields).eq(1).should("not.have.value", "");
    cy.get(fields).last().should("not.have.value", "");
    cy.get(checkbox).should("be.checked");

    cy.get(fields).last().type(`{enter}`);

    cy.get(fields).first().should("have.value", "");
    cy.get(fields).eq(1).should("have.value", "");
    cy.get(fields).last().should("have.value", "");
    cy.get(checkbox).should("not.be.checked");
  });

  it("can check off an item as completed", () => {
    cy.visit("https://www.play1.automationcamp.ir/forms.html");

    const name = "Python";

    // In addition to using the `get` command to get an element by selector,
    // we can also use the `contains` command to get an element by its contents.
    // However, this will yield the <label>, which is lowest-level element that contains the text.
    // In order to check the item, we'll find the <input> element for this <label>
    // by traversing up the dom to the parent element. From there, we can `find`
    // the child checkbox <input> element and use the `check` command to check it.

    cy.get(".form-check.form-check-inline input[type=checkbox]")
      .parent() //you get the parent element from the element that is found from the css selector
      .contains(name) //then when searching for some text you actually get the element (even if a child) that has that text
      .parent() //then you need to get back to the parent element
      .find("input[type=checkbox]") //and now we go back to the input checkbox to actually check it
      .check();

    // Now that we've checked the button, we can go ahead and make sure
    // that the list element is now marked as completed.
    // Again we'll use `contains` to find the <label> element and then use the `parents` command
    // to traverse multiple levels up the dom until we find the corresponding <li> element.
    // Once we get that element, we can assert that it has the completed class.
    cy.get("#check_validate").should("have.text", name.toUpperCase());
  });

  context("with all checked", () => {
    beforeEach(() => {
      // //this is useful for debugging purposes
      // cy.contains('Forms')
      // .should('exist')
      // .then((element) => {
      //   const text = element.html()
      //   console.log('prin');
      //   console.log('html', text);
      //   console.log('meta')
      // })

      cy.contains("Forms") //traverse the dom tree until you find the element(s) that contain the text (here we expect only one)
        .parents(".card") //traverse up the dom until we find the corresponding element
        .first() //get the first of the parent elements
        .find("a.btn") //find the button within that container
        .should("be.visible")
        .click();

      //we start with all the checkboxes unchecked
      cy.get(".form-check.form-check-inline input[type=checkbox]").check();
    });

    it("the check validate should not contain python", () => {
      cy.get("#check_validate")
        .should("exist")
        .should("contain.text", "PYTHON");
    });

    it("the check validate should not contain js", () => {
      // We can perform similar steps as the test above to ensure
      // that only completed tasks are shown
      cy.get("#check_validate")
        .should("exist")
        .should("contain.text", "JAVASCRIPT");
    });

    it("the check validate should not contain java", () => {
      cy.get("#check_validate").should("exist").should("contain.text", "JAVA");
    });

    it("the check validate should contain nothing if all are unchecked", () => {
      cy.get(".form-check.form-check-inline input[type=checkbox]").uncheck();

      cy.get("#check_validate").should("exist").should("have.text", "");
    });
  });
});
