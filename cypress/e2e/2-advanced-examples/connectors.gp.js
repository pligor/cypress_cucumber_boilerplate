/// <reference types="cypress" />

context("Connectors", () => {
  beforeEach(() => {
    cy.visit("https://play1.automationcamp.ir/");
  });

  it(".each() - iterate over an array of elements", () => {
    cy.contains("Wait Conditions").parents(".card").find(".btn").click();

    // https://on.cypress.io/each
    cy.get("button").each(($el, index, $list) => {
      console.log($el, index, $list);
    });
  });

  it(".its() - get properties on the current subject", () => {
    cy.contains("Wait Conditions").parents(".card").find(".btn").click();

    // https://on.cypress.io/its
    cy.get("button")
      // calls the 'length' property yielding that value
      .its("length") //invoke is for functions, and its is for fields
      .should("be.gt", 10);
  });

  it(".invoke() - invoke a function on the current subject", () => {
    cy.contains("Wait Conditions").parents(".card").find(".btn").click();

    // our div is hidden in our script.js
    // $('.connectors-div').hide()
    cy.get("button#visibility_target").should("be.hidden");

    // https://on.cypress.io/invoke
    // call the jquery method 'show'
    cy.get("button#visibility_target").invoke("show");

    cy.get("button#visibility_target").should("be.visible");
  });

  it(".spread() - spread an array as individual args to callback function", () => {
    // https://on.cypress.io/spread
    const arr = ["uno", "duo", "tre"];

    cy.wrap(arr).spread((foo, bar, baz) => {
      expect(foo).to.eq("uno");
      expect(bar).to.eq("duo");
      expect(baz).to.eq("tre");
      expect([foo, bar, baz]).to.deep.eq(["uno", "duo", "tre"]);
    });
  });

  describe(".then()", () => {
    it("invokes a callback function with the current subject", () => {
      cy.visit("https://play1.automationcamp.ir/order_submit.html");

      // https://on.cypress.io/then
      cy.get("input[type=checkbox]", { timeout: 10000 })
        .siblings("label")
        .then(($elems) => {
          expect(
            $elems,
            "3 items are expected and this is a custom error message"
          ).to.have.length(3);

          expect($elems.eq(0), "first item").to.contain("Onions");
          expect($elems.eq(1), "second item").to.contain("Green Olive");
          expect($elems.eq(2), "third item").to.contain("Tomatoes");
        });
    });
    /*
    it('yields the returned value to the next command', () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1)

          return 2
        })
        .then((num) => {
          expect(num).to.equal(2)
        })
    })

    it('yields the original subject without return', () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1)
          // note that nothing is returned from this callback
        })
        .then((num) => {
          // this callback receives the original unchanged value 1
          expect(num).to.equal(1)
        })
    })

    it('yields the value yielded by the last Cypress command inside', () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1)
          // note how we run a Cypress command
          // the result yielded by this Cypress command
          // will be passed to the second ".then"
          cy.wrap(2)
        })
        .then((num) => {
          // this callback receives the value yielded by "cy.wrap(2)"
          expect(num).to.equal(2)
        })
    })
    */
  });
});
