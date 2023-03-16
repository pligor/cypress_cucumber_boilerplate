/// <reference types="cypress" />
import StabilityChecker from "../../support/helpers/assert_helpers";
import { random_integer } from "../../support/helpers/random_helpers";

// npx cypress run --headed --browser chrome --spec=cypress/e2e/2-advanced-examples/actions.gp.js --no-exit
context("Actions", () => {
  beforeEach(() => {
    cy.visit("https://www.play1.automationcamp.ir/index.html");
  });

  // https://on.cypress.io/interacting-with-elements

  it(".type() - type into a DOM element", () => {
    cy.contains("Keyboard Actions").parents(".card").find(".btn").click();

    const wysiwyg = `12 years of automation experience`;

    const sel = "textarea#area";

    const target = `span#key`;

    // https://on.cypress.io/type
    cy.get(sel).type(wysiwyg).should("have.value", wysiwyg);

    cy.get(sel).type("{downarrow}").should("have.value", wysiwyg);
    cy.get(target).should("have.text", "ArrowDown");

    cy.get(sel).type("{rightarrow}{uparrow}").should("have.value", wysiwyg);
    cy.get(target).should("have.text", "ArrowUp");

    cy.get(sel)
      .type("{uparrow}{downarrow}{rightarrow}")
      .should("have.value", wysiwyg);
    cy.get(target).should("have.text", "ArrowRight");

    cy.get(sel)
      .type("{rightarrow}{uparrow}{downarrow}{leftarrow}")
      .should("have.value", wysiwyg);
    cy.get(target).should("have.text", "ArrowLeft");

    //cursor here is one letter before the end of the written text above

    const notlastchar = wysiwyg.split("").slice(0, -1).join("");
    cy.log(notlastchar);
    cy.get(sel).type("{del}").should("have.value", notlastchar);

    cy.get(sel).type("{selectall}{backspace}").should("have.value", "");

    cy.get(sel).type("{meta}{command}{cmd}"); //all of these are equivalent and the same
    cy.get(target).should("have.text", "Meta");

    cy.get(sel).type("{alt}{option}"); //these are equivalent
    cy.get(target).should("have.text", "Alt");

    cy.get(sel).type("{ctrl}{control}"); //these are equivalent
    cy.get(target).should("have.text", "Control");

    cy.get(sel).type("{shift}");
    cy.get(target).should("have.text", "Shift");

    cy.get(sel).type(wysiwyg, { delay: 150 }).should("have.value", wysiwyg);

    cy.visit("https://www.play1.automationcamp.ir/forms.html");

    cy.get("input#salary")
      .should("have.attr", "placeholder", "You should not provide this")
      // Ignore error checking prior to type
      // like whether the input is visible or disabled
      .type(wysiwyg, { force: true })
      .should("have.value", wysiwyg);
  });

  it(".focus() - focus on a DOM element", () => {
    cy.visit("https://example.cypress.io/commands/actions");
    // https://on.cypress.io/focus
    cy.get("input#password1")
      .should("have.class", "action-focus")
      .should("not.have.class", "focus")
      .focus()
      .should("have.class", "action-focus")
      .should("have.class", "focus");
  });

  it(".blur() - blur off a DOM element", () => {
    cy.visit("https://example.cypress.io/commands/actions");

    // https://on.cypress.io/blur
    cy.get("input#fullName1")
      .type("About to blur") //got focus automatically after this action, no need to call focus() explicitly
      .should("have.class", "action-blur")
      .should("not.have.class", "error")
      .blur()
      .should("have.class", "error")
      // .invoke("css", "border-color")
      .should("have.css", "border-color", "rgb(255, 0, 0)")
      .then(($elem) => {
        console.log(typeof $elem);
        console.log($elem);
        console.log($elem.css("border-color"));
        expect($elem).to.have.class("error");
        //if you do not wrap it here, you would have to use it exactly as a jquery object in the next "should" or other cypress command
        return cy.wrap($elem);
      });
  });

  it(".clear() - clears an input or textarea element", () => {
    // https://on.cypress.io/clear
    cy.visit("https://www.play1.automationcamp.ir/forms.html");

    const note = "This is a note";

    const sel = "textarea#notes";
    const valid = "span#area_notes_validate";

    cy.get(sel)
      .should("exist")
      .should("have.value", "")
      .type(note)
      .should("have.value", note);
    cy.get(valid).should("exist").should("have.text", note);

    cy.get(sel).clear().should("have.value", "");
    cy.get(valid).should("have.text", "");
  });

  it(".submit() - submit a form", () => {
    // https://on.cypress.io/submit
    cy.contains("Forms").parents(".card").find(".btn").click();

    const form = "form.needs-validation";

    cy.get(form).find("#validationCustom03").type("some city");
    cy.get(form).find("#validationCustom04").type("some state");
    cy.get(form).find("#validationCustom05").type("some zip");

    cy.get(form)
      .submit()
      .find("#invalid_terms")
      .should("contain", "You must agree before submitting");
  });

  it(".click() - click on a DOM element", () => {
    // https://on.cypress.io/click
    cy.contains("Mouse Actions").parents(".card").find(".btn").click();

    const ca = "#click_area";
    const ct = "#click_type";
    const xx = "#click_x";
    const yy = "#click_y";

    cy.get(ca).should("be.visible").click();
    cy.get(ct).should("be.visible").should("have.text", "Click");
    cy.get(xx)
      .should("be.visible")
      .should(($el) => {
        expect($el.text().endsWith(258)).to.be.true;
      });
    cy.get(yy)
      .should("be.visible")
      .should(($el) => {
        expect($el.text().endsWith(99)).to.be.true;
      });

    cy.get(ca).should("be.visible").click("topLeft");
    cy.get(xx)
      .should("be.visible")
      .should(($el) => {
        expect($el.text().endsWith(0)).to.be.true;
      });
    cy.get(yy)
      .should("be.visible")
      .should(($el) => {
        expect($el.text().endsWith(0)).to.be.true;
      });

    minlen = 10;
    interval = 100;

    // const clickit = (pos) => {
    //   console.log(pos);
    //   cy.get(ca).click(pos);
    //   cy.get(xx)
    //     .should(new StabilityChecker().wait_to_stabilize())
    //     .then(($el) => console.log($el.text()));
    //   cy.get(yy)
    //     .should(new StabilityChecker().wait_to_stabilize())
    //     .then(($el) => console.log($el.text()));
    // };

    const clickit = (pos, coordx, coordy) => {
      cy.get(ca).should("be.visible").click(pos);
      cy.get(xx)
        .should("be.visible")
        .should(($el) => {
          expect($el.text().endsWith(coordx)).to.be.true;
        });
      cy.get(yy)
        .should("be.visible")
        .should(($el) => {
          expect($el.text().endsWith(coordy)).to.be.true;
        });
    };

    clickit("top", 258, 0);
    clickit("topRight", 515, 0);
    clickit("left", 0, 99);
    clickit("right", 515, 99);
    clickit("bottomLeft", 0, 198);
    clickit("bottom", 258, 198);
    clickit("bottomRight", 515, 198);

    // You can click on 9 specific positions of an element:
    //  -----------------------------------
    // | topLeft        top       topRight |
    // |                                   |
    // |                                   |
    // |                                   |
    // | left          center        right |
    // |                                   |
    // |                                   |
    // |                                   |
    // | bottomLeft   bottom   bottomRight |
    //  -----------------------------------

    // click 80px on x coord and 75px on y coord
    const coor_x = 80;
    const coor_y = 75;
    cy.get(ca).should("be.visible").click(coor_x, coor_y);
    cy.get(xx)
      .should("be.visible")
      .should(($el) => {
        expect($el.text().endsWith(coor_x)).to.be.true;
      });
    cy.get(yy)
      .should("be.visible")
      .should(($el) => {
        expect($el.text().endsWith(coor_y)).to.be.true;
      });

    cy.go("back");
    cy.contains("Forms").parents(".card").find(".btn").click();
    const checkboxes = ".form-row .form-check-inline input[type=checkbox]";

    // click multiple elements by passing multiple: true
    // here clicking all three checkboxes
    cy.get(checkboxes).should("have.length", 3).click({ multiple: true });
    cy.get("#check_validate")
      .should("exist")
      .should("contain.text", "JAVA")
      .should("contain.text", "PYTHON")
      .should("contain.text", "JAVASCRIPT");

    // Ignore error checking prior to clicking
    //here because the click at the center of the element falls at the label and triggers the switch button it also works ok
    cy.get("#german").should("exist").click({ force: true });
    cy.get("#german_validate").should("contain.text", "true");
  });

  it(".dblclick() - double click on a DOM element", () => {
    // https://on.cypress.io/dblclick
    cy.contains("Mouse Actions").parents(".card").find(".btn").click();

    // Our app has a listener on 'dblclick' event in our 'scripts.js'
    // that hides the div and shows an input on double click
    cy.get("span#click_type").should("exist").should("not.be.visible");
    cy.get("div#click_area").should("be.visible").dblclick();
    cy.get("span#click_type")
      .should("be.visible")
      .should("have.text", "Double-Click");
  });

  it(".rightclick() - right click on a DOM element", () => {
    // https://on.cypress.io/rightclick
    cy.contains("Mouse Actions").parents(".card").find(".btn").click();

    // Our app has a listener on 'contextmenu' event in our 'scripts.js'
    // that hides the div and shows an input on right click
    cy.get("span#click_type").should("exist").should("not.be.visible");
    cy.get("div#click_area").should("be.visible").rightclick();
    cy.get("span#click_type")
      .should("be.visible")
      .should("have.text", "Right-Click");
  });

  it(".check() - check a checkbox or radio element", () => {
    // https://on.cypress.io/check
    cy.contains("Forms").parents(".card").find(".btn").click();

    // By default, .check() will check all
    // matching checkbox or radio elements in succession, one after another
    const checkboxes = cy.get("input[type=checkbox]").not("#german");
    checkboxes.should("have.length", 7).check().should("be.checked");

    cy.get("input[type=radio]")
      .should("have.length", 2)
      .check()
      .should("be.checked");
    //this passes even for radios because at the moment that the check assertion is happening
    //that same state, the radio button is asserted if it is checked
    // In other words each radio button above will be checked and every button after selected will be checked if it is
    //truly checked and it will pass. Of course if you would later assert that all of them are checked this would fail

    // .check() accepts a value argument
    cy.get("input[type=radio]")
      .should("have.length", 2)
      .check("SELENIUM") //this should be the value of the input field
      .should("be.checked");
    cy.get("#rad_validate")
      .should("be.visible")
      .should("have.text", "SELENIUM");

    // .check() accepts an array of values
    const en_checkboxes = ".form-row .form-check-inline input[type=checkbox]";
    cy.get(en_checkboxes)
      .should("have.length", 3)
      .uncheck()
      .should("not.be.checked");
    cy.get(en_checkboxes).should("not.be.checked").check(["PYTHON", "JAVA"]);
    cy.get("#check_validate")
      .should("be.visible")
      .should("contain.text", "PYTHON")
      .should("contain.text", "JAVA")
      .should("not.contain.text", "JAVASCRIPT");

    // // Ignore error checking prior to checking
    cy.get("#german").check({ force: true }).should("be.checked");
    cy.get("#german_validate")
      .should("be.visible")
      .should("contain.text", "true");

    cy.get("#check_javascript")
      .should("not.be.checked")
      .invoke("attr", "disabled", true)
      // .invoke("attr", "disabled", ""); //equivalent, since disabled does not require a value
      .check({ force: true })
      .should("be.checked");
  });

  it(".uncheck() - uncheck a checkbox element", () => {
    // https://on.cypress.io/uncheck
    cy.contains("Forms").parents(".card").find(".btn").click();

    const checkboxes = () => cy.get("input[type=checkbox]").not("#german");

    //first check them one by one
    checkboxes()
      .should("have.length", 7)
      .check()
      .should("be.checked")
      .uncheck()
      .should("not.be.checked");

    checkboxes()
      .should("have.length", 7)
      .check()
      .should("be.checked")
      .uncheck("PYTHON") //this should be the value of the input field
      .should("not.be.checked");

    checkboxes()
      .should("have.length", 7)
      .uncheck(["JAVA", "JAVASCRIPT"])
      .should("not.be.checked");

    const en_checkboxes = ".form-row .form-check-inline input[type=checkbox]";
    cy.get(en_checkboxes).should("have.length", 3).should("not.be.checked");

    // // Ignore error checking prior to unchecking
    // cy.get('.action-check [disabled]')
    //   .uncheck({ force: true }).should('not.be.checked')

    cy.get("#check_javascript")
      .check()
      .should("be.checked")
      .invoke("attr", "disabled", true)
      // .invoke("attr", "disabled", ""); //equivalent, since disabled does not require a value
      .uncheck({ force: true })
      .should("not.be.checked");
  });

  it(".select() - select an option in a <select> element", () => {
    // https://on.cypress.io/select
    cy.contains("Forms").parents(".card").find(".btn").click();

    // at first, no option should be selected
    cy.get("#select_tool").should("have.value", "sel");

    // Select option(s) with matching text content
    cy.get("#select_tool").select("Cypress");
    // confirm the apples were selected
    // note that each value starts with "fr-" in our HTML
    cy.get("#select_tool").should("have.value", "cyp");
    cy.get("#select_tool_validate").should("have.text", "cyp");

    const len = 2;
    const ind = random_integer(len);
    const assertions = ["SELENIUM", "PROTRACTOR"];

    cy.get("input[type=radio]")
      .should("have.length", len)
      .then((radio_buttons) => {
        console.log(radio_buttons);
        const arr = Cypress.$.makeArray(radio_buttons);
        console.log(arr);
        const radio_button = arr[ind];
        console.log(radio_button);
        return radio_button;
      })
      .click();
    cy.get("#rad_validate").should("have.text", assertions[ind]);

    cy.get("#select_tool")
      .select("pro")
      // can attach an assertion right away to the element
      .should("have.value", "pro");
    cy.get("#select_tool_validate").should("have.text", "pro");

    // assert the selected values include oranges
    cy.get("#select_tool").invoke("val").should("include", "pro");

    // Select option(s) with matching value
    cy.get("#select_lang")
      .select(["typescript", "python"])
      // when getting multiple values, invoke "val" method first
      .invoke("val")
      .should("deep.equal", ["python", "typescript"]); // here the order matters of how the values are rendered in the html
  });

  it(".scrollIntoView() - scroll an element into view", () => {
    // https://on.cypress.io/scrollintoview
    cy.contains("Forms").parents(".card").find(".btn").click();

    // normally all of these buttons are hidden,
    // because they're not within
    // the viewable area of their parent
    // (we need to scroll to see them)
    cy.get(".fa-linkedin-in").isNotInViewport().scrollIntoView().isInViewport();

    // // Cypress handles the scroll direction needed
    // // Cypress knows to scroll to the right and down
  });

  it(".trigger() - trigger an event on a DOM element", () => {
    // https://on.cypress.io/trigger
    cy.contains("Forms").parents(".card").find(".btn").click();

    // To interact with a range input (slider)
    // we need to set its value & trigger the
    // event to signal it changed

    // Here, we invoke jQuery's val() method to set
    // the value and trigger the 'change' event
    // cy.get("#exp").invoke("val", 25);
    // cy.get("#exp_help").should("have.text", "");
    // cy.get("#exp").trigger("change");
    // cy.get("#exp_help").should("have.text", "25");

    //equivalently
    cy.get("#exp")
      .invoke("val", 25)
      .siblings("#exp_help")
      .should("have.text", "")
      .siblings("#exp")
      .trigger("change")
      .siblings("#exp_help")
      .should("have.text", "25");
  });

  it('cy.scrollTo() - scroll the window or element to a position', () => {
    // https://on.cypress.io/scrollto
    cy.contains("Forms").parents(".card").find(".btn").click();

    // You can scroll to 9 specific positions of an element:
    //  -----------------------------------
    // | topLeft        top       topRight |
    // |                                   |
    // |                                   |
    // |                                   |
    // | left          center        right |
    // |                                   |
    // |                                   |
    // |                                   |
    // | bottomLeft   bottom   bottomRight |
    //  -----------------------------------

    // if you chain .scrollTo() off of cy, we will
    // scroll the entire window
    cy.scrollTo('bottom')
    cy.get('span > a:nth-of-type(1)').isInViewport().should('contain.text', 'Thanks')

    // cy.get('#scrollable-horizontal').scrollTo('right')

    // // or you can scroll to a specific coordinate:
    // // (x axis, y axis) in pixels
    // cy.get('#scrollable-vertical').scrollTo(250, 250)

    // // or you can scroll to a specific percentage
    // // of the (width, height) of the element
    // cy.get('#scrollable-both').scrollTo('75%', '25%')

    // // control the easing of the scroll (default is 'swing')
    // cy.get('#scrollable-vertical').scrollTo('center', { easing: 'linear' })

    // // control the duration of the scroll (in ms)
    // cy.get('#scrollable-both').scrollTo('center', { duration: 2000 })
  })
});
