import { defineStep } from "@badeball/cypress-cucumber-preprocessor";

const url = "https://www.play1.automationcamp.ir/index.html";

defineStep("you visit the playground", () => {
  cy.visit(url);
});

defineStep("we are playing with the its of cypress", () => {
  cy.log("logging here");

  const sel = ".card";

  cy.get(sel).its("length").should("be.eq", 8);
  //   .get('.header').its('0.textContent').should('contain', 'My Header');
});

defineStep(
  "you have {int} of automation experience and by keeping {string} notes",
  (years, notes) => {
    const forms_button =
      ".container.shadow-lg > div:nth-of-type(2) > div:nth-of-type(3) .btn.btn-success";
    cy.get(forms_button).should("be.visible").click();

    cy.get("input#exp").should("be.visible").clear().type(years);

    cy.get("textarea#notes").should("be.visible").clear().type(notes);
  }
);

defineStep("wait {int} msec", (msec) => {
  cy.wait(msec);
});

defineStep("we are playing with the invoke of cypress", () => {
  cy.get(".card h5")
    .invoke("text")
    .then((text) => {
      cy.log(text);
    });

  let counter = 0;

  cy.get(".card > .card-header").then((headers) => {
    const header = headers[0];
    // console.log("header", header);
    // console.log("typeof header", typeof header);

    const $header = Cypress.$(header);
    // console.log("$header", $header);

    const oneclass = $header.attr("class");
    // console.log("oneclass", oneclass);

    cy.wrap(headers).each((hh, index) => {
      cy.wrap(hh)
        .should("have.attr", "class")
        .then((cls) => {
          expect(cls).to.equal(oneclass);
        });

      //equivalent
      cy.wrap(hh).should("have.attr", "class", oneclass);

      //equivalent
      cy.wrap(hh).invoke("attr", "class").should("equal", oneclass);
    });
  });

  //and this is equivalent to the above
  cy.get(".card > .card-header")
    .should("have.length", 8)
    .then((headers) => {
      const oneclass = Cypress.$(headers[0]).attr("class");

      const check = Cypress.$.makeArray(headers).every(xx => {
        // console.log(typeof xx);
        // console.log(xx);
        return Cypress.$(xx).attr("class") === oneclass;
      });

      expect(check).to.equal(true);
    });
});
