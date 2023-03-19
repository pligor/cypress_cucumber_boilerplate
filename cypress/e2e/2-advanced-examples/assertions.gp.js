/// <reference types="cypress" />

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("https://play1.automationcamp.ir/index.html");
  });

  /*
  describe("Implicit Assertions", () => {
    it(".should() - make an assertion about the current subject", () => {
      cy.contains("Forms").parents(".card").find(".btn").click();

      // https://on.cypress.io/should
      cy.contains("Form with Validations")
        .parents(".card")
        .find(".form-control")
        .first()
        .should("have.attr", "placeholder", "City")
        .type("London UK")
        .should("contain.value", "London")
        .should("have.html", "") //no html is included in for input element
        .should("match", "input") // matches the html tag
        .clear()
        .type("aaaa")
        .invoke("val")
        .should("match", /a+/); //regular expression

      cy.contains("label", /Agre+[a-z ]+conditions/).should(
        "contain.text",
        "Agree to terms and conditions"
      );
    });

    it(".and() - chain multiple assertions together", () => {
      cy.contains("Forms").parents(".card").find(".btn").click();

      // https://on.cypress.io/and
      cy.get(".btn-primary")
        .scrollIntoView()
        .should("be.visible")
        .and("be.enabled")
        .and("have.text", "Submit Form")
        .and("have.attr", "type", "submit")
        .and("match", "button");
    });
  });
  */

  describe("Explicit Assertions", () => {
    /*
    // https://on.cypress.io/assertions
    it("expect - make an assertion about a specified subject", () => {
      // We can use Chai's BDD style assertions
      expect(true).to.be.true;
      expect(false).to.be.false;

      const obj = { foo: "bar", hello: "babe" };

      expect(obj).to.equal(obj);

      expect(obj).to.deep.equal({ hello: "babe", foo: "bar" });
      //because the order of the json keys does not matter

      // matching text using regular expression
      expect("ગુજરાતી").to.match(/^[^A-Za-z0-9]+$/i);
      //expect to not match any english letters or digits
    });

    it("pass your own callback function to should()", () => {
      cy.contains("Forms").parents(".card").find(".btn").click();

      // Pass a function to should that can have any number
      // of explicit assertions within it.
      // The ".should(cb)" function will be retried
      // automatically until it passes all your explicit assertions or times out.
      cy.get("#select_lang")
        .find("option")
        .should("have.length", 4)
        .should(($options) => {
          // https://on.cypress.io/$
          // return an array of texts from all of the p's
          const texts = $options.map((i, el) => Cypress.$(el).text());
          console.log(texts); //texts is a jquery object despite the whole map thing

          // jquery map returns jquery object
          // and .get() convert this to simple array
          const options = texts.get();
          console.log(options); //options is an array of texts

          expect(options, "has 4 options").to.have.length(4);

          // use second argument to expect(...) to provide clear
          // message with each assertion
          expect(options, "has expected text in each option").to.deep.eq([
            "Java",
            "Python",
            "JavaScript",
            "TypeScript",
          ]);
        });
    });

    it("finds element by class name regex", () => {
      cy.visit("https://play1.automationcamp.ir/login.html");

      // with timeout zero, check synchronously (no retry)
      cy.get("form", { timeout: 1000 })
        .find("input")
        // .should(cb) callback function will be retried
        .should(($elems) => {
          expect($elems).to.have.length(3);

          const cur_type = $elems[2].type;

          expect(cur_type).to.match(/check[a-z]{3}/);
        })
        // .then(cb) callback is not retried,
        // it either passes or fails
        .then(($elems) => {
          expect(
            $elems[0],
            "custom message text content is not the expected one"
          ).to.have.attr("placeholder", "Username");
        });
    });

    it('can throw any error', () => {
      cy.contains("Sample Pages").parents(".card").find(".btn").click();

      cy.get('form')
        .find('input')
        .should(($inputs) => {

          if ($inputs.length !== 3) {
            // you can throw your own errors
            throw new Error('Did not find 1 element')
          }

          const className = $inputs[1].className

          if (!className.match(/form-control/)) {
            throw new Error(`Could not find class "form-control" in ${className}`)
          }
        })
    })
    */

    it("matches unknown text between two elements", () => {
      cy.contains("Sample Pages").parents(".card").find(".btn").click();

      //  * Text from the first element.
      //  * @type {string}
      let text;

      //  * Normalizes passed text,
      //  * useful before comparing text with spaces and different capitalization.
      //  * @param {string} s Text to normalize
      const normalizeText = (ss) => ss.replace(/\s/g, "").toLowerCase();

      cy.get("form", { timeout: 1000 })
        .find("input")
        .first()
        .type("    admin    ")
        .then(($input) => {
          // save text from the first element
          text = normalizeText($input.val());
        });

      console.log("text: ", text);

      cy.get("form", { timeout: 1000 })
        .find("input")
        .eq(1)
        .type("ADMIN")
        .should(($input) => {
          // we can massage text before comparing
          const secondText = normalizeText($input.val());
          expect(secondText, "second text custom error message").to.equal(text);
        });
    });

    /*
    it('assert - assert shape of an object', () => {
      const person = {
        name: 'Joe',
        age: 20,
      }

      assert.isObject(person, 'value is object')
    })

    it('retries the should callback until assertions pass', () => {
      cy.get('#random-number')
        .should(($div) => {
          const n = parseFloat($div.text())

          expect(n).to.be.gte(1).and.be.lte(10)
        })
    })
    */
  });
});
