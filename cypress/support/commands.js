// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/*
Cypress.Commands.add('isWithinViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).to.be.within(0, window.innerHeight);
  expect(rect.right).to.be.within(0, window.innerWidth);
  expect(rect.bottom).to.be.within(0, window.innerHeight);
  expect(rect.left).to.be.within(0, window.innerWidth);

  return subject;
});

Cypress.Commands.add('isOutsideViewport', { prevSubject: true }, (subject) => {
  const rect = subject[0].getBoundingClientRect();

  expect(rect.top).not.to.be.within(0, window.innerHeight);
  expect(rect.right).not.to.be.within(0, window.innerWidth);
  expect(rect.bottom).not.to.be.within(0, window.innerHeight);
  expect(rect.left).not.to.be.within(0, window.innerWidth);

  return subject;
});
*/

Cypress.Commands.add("isInViewport", { prevSubject: true }, (el) => {
  cy.get(el).then(($el) => {
    cy.window().then((window) => {
      const { documentElement } = window.document;
      const bottom = documentElement.clientHeight;
      const right = documentElement.clientWidth;
      const rect = $el[0].getBoundingClientRect();
      expect(rect.top).to.be.lessThan(bottom);
      expect(rect.bottom).to.be.greaterThan(0);
      expect(rect.right).to.be.greaterThan(0);
      expect(rect.left).to.be.lessThan(right);
    });

    return cy.wrap($el);
  });
});

Cypress.Commands.add("isNotInViewport", { prevSubject: true }, (el) => {
  cy.get(el).then(($el) => {
    cy.window().then((window) => {
      const { documentElement } = window.document;
      const bottom = documentElement.clientHeight;
      const right = documentElement.clientWidth;
      console.log("bottom", bottom);
      console.log("right", right);
      const rect = $el[0].getBoundingClientRect();

      const check1 = rect.top <= bottom;
      const check2 = rect.left <= right;
      const check3 = rect.bottom <= 0;
      const check4 = rect.right <= 0;
      const check = check1 || check2 || check3 || check4;

      expect(check).to.be.true;
    });

    return cy.wrap($el);
  });
});
