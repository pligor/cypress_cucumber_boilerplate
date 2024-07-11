import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I can get, set, clear and save Cookies of a webpage', function() {
  cy.visit('https://www.saucedemo.com/');
  cy.get('#user-name').type('standard_user');
  cy.get('#password').type('secret_sauce');
  cy.get('#login-button').click();
  cy.url().should('eq', 'https://www.saucedemo.com/inventory.html');
  cy.get('.title').should('have.text', 'Products');
  cy.getCookies().then((cookies) => { //save cookies
    cy.writeFile('cypress/fixtures/cookies.json', cookies);
  });
  cy.clearCookies();
  // First failed attempt: // cy.reload(true);
  // cy.reload() requires the response code to be 2xx after following redirects.
  // 2nd failed attempt: // cy.visit('https://www.saucedemo.com/inventory.html', {failOnStatusCode: false});
  // cy.visit() requires the response code to be 2xx after following redirects.
  cy.get('.inventory_item_name').eq(0).click();
  cy.get('#user-name').should('be.visible');
  cy.get('#password').should('be.visible');
  cy.get('#login-button').should('be.visible');
  cy.readFile('cypress/fixtures/cookies.json').then((cookies) => {
    cookies.forEach((cookie) => { // load cookies
      cy.setCookie(cookie.name, cookie.value, {
        domain: cookie.domain,
        expiry: cookie.expiry,
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        secure: cookie.secure
      });
    });
  });
  // Failed attempt because of same reason as above
  // cy.visit('https://www.saucedemo.com/inventory.html', {failOnStatusCode: false});
  cy.go('back'); // So we had to use the go back
  cy.url().should('eq', 'https://www.saucedemo.com/inventory.html');
  cy.get('.title').should('have.text', 'Products');
  cy.writeFile('cypress/fixtures/cookies.json', '');
});

When('I can move forward and backward to pages', function() {
  cy.visit('https://qaplayground.dev/apps/links/');

  cy.contains('Home').should('be.visible');
  cy.contains('Contact').should('be.visible');

  cy.get('#title').should('not.exist');

  cy.get('div#nav > a:nth-of-type(5)').click();

  cy.get('#title').should('have.text', 'Welcome to the Contact Page');
  cy.xpath('//*[text()="Contact"]').should('not.exist');

  cy.go('back');

  cy.contains('Home').should('be.visible');
  cy.contains('Contact').should('be.visible');
  cy.get('#title').should('not.exist');

  cy.go('forward');

  cy.get('#title').should('have.text', 'Welcome to the Contact Page');
  cy.xpath('//*[text()="Contact"]').should('not.exist');
});

When('I can set the Geolocation to custom coordinates', function() {
  cy.visit('https://qaplayground.dev/apps/geolocation/');

  cy.get('#location-info').should('have.text', 'Click on the button to get your current location');

  cy.window().then((win) => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
      const position = {
        coords: {
          latitude: 37.7749,
          longitude: -122.4194
        }
      }
      callback(position)
    });
  });

  cy.get('#get-location').click();

  cy.get('#location-info').should('have.text', 'San Francisco, United States');
});

When('I can download a file', function() {
  cy.visit('https://qaplayground.dev/apps/download/');

  cy.get('#file').should('have.text', 'Download ⏬');

  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      setTimeout(function () { doc.location.reload() }, 5000);
    });
    cy.get('#file').click();
  });

  const downloadsFolder = Cypress.config('downloadsFolder');
  const downloadName = 'sample.pdf'; // Adjust based on expected file name

  cy.readFile(downloadsFolder + '/' + downloadName, 'binary', { timeout: 5000 })
    .should((fileContent) => {
      // Read the first 5 bytes of the file to verify it's a PDF
      const header = fileContent.slice(0, 5);
      expect(header).to.equal('%PDF-');
    });
});

When('I can upload a file', function() {
  cy.visit('https://qaplayground.dev/apps/upload/');

  cy.get('input[type="file"]').should('exist');

  const fileName = 'balls.jpg';

  cy.get('input[type="file"]').attachFile(fileName);

  cy.get('#num-of-files').should('have.text', '1 File Selected');
  cy.get('figcaption').should('have.text', fileName);
});

When('I can access open a new tab and assert in that tab, close it and return to main tab', function() {
  cy.visit(Cypress.config().baseUrl + '/apps/new-tab/');

  // cy.window().then((win) => {
  //   cy.stub(win, 'open').as('windowOpen');
  // });

  // cy.get('#open').click();

  // cy.get('@windowOpen').should('be.calledOnce').then((stub) => {
  //   const url = stub.args[0][0];
  //   cy.visit(url);
  // });

  // Stub the window.open method
  // cy.window().then((win) => {
  //   cy.stub(win, 'open').callsFake((url) => {
  //     win.location.href = url; // Redirect to the URL in the same tab
  //   }).as('windowOpen');
  // });

  // // Click the button that opens the new tab
  // cy.get('#open').click();

  // // Verify the window.open was called
  // cy.get('@windowOpen').should('be.calledOnce');

  // CYPRESS DOES NOT SUPPORT New tabs OR New Windows
  //https://docs.cypress.io/guides/references/trade-offs

  cy.get('h1').should('be.visible');
});

When('I can access a nested iframe and assert in it', function() {
  cy.visit(Cypress.config().baseUrl + '/apps/iframe/');

  cy.frameLoaded('#frame1'); // Assertion to ensure the iframe is loaded

  // yes you can wrap some of the below in a Cypress command
  cy.get('#frame1')
  .its('0.contentDocument.body')
  .should('not.be.empty')
  .then(cy.wrap)
  .within(() => {
    cy.get('legend').should('have.text', 'First Level Iframe');
    
    cy.get('#frame2').should('be.visible');

    cy.get('#frame2')
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap)
    .within(() => {
      cy.get('legend').should('have.text', 'Second Level Iframe');

      cy.get('#msg').should('not.be.visible');

      cy.get('.btn').should('be.visible').click();

      cy.get('#msg').should('be.visible').and('have.text', 'Button Clicked');
    });
  });

});

When('I can assert inside a changing iframe', function() {
  // cy.visit('https://qaplayground.dev/apps/changing-iframe/');
  cy.visit(Cypress.config().baseUrl + '/apps/changing-iframe/');

  // cy.frameLoaded('iframe'); // Assertion to ensure the iframe is loaded
  // cy.iframe().get('span#time', {timeout: 20000}).should('not.exist');
  // cy.iframe().should($iframeBody => {
  //   const msg = $iframeBody.find('#msg');
  //   expect(msg.text().trim()).to.equal('This is the end of the journey');
  //   throw new Error();
  // });
  // TODO we might be able to combine cypress-iframe plugin with cypress-wait-until plugin but we already spent too much time to make it work
  // Really non straightforward

  cy.get('iframe').should('exist');

  cy.waitUntil(() => {
    return cy.get('iframe').then($iframe => {
      const $body = $iframe.contents().find('body');
      const msg = $body.find('#msg');
      console.log($body);
      console.log($body.length);
      console.log(msg);
      console.log(msg.length);
      const check1 = () => msg.length > 0;
      const check2 = () => msg.text().trim() === 'This is the end of the journey';
      // expect(msg.length).to.be.greaterThan(0);
      // expect(msg.text().trim()).to.equal('This is the end of the journey');
      // only boolean works for cypress-wait-until-plugin.
      // a failed "expect" or raising any exception will stop the loop
      return check1() && check2();
    });
  }, {
    errorMsg: 'The text was not found after the iframe changed',
    timeout: 20000, // waits up to 2000 ms, default to 5000
    interval: 500 // performs the check every 500 ms, default to 200
  });
});

Given('I trigger a prompt alert and pass {string} as text', function(txt) {
  cy.visit('https://testpages.herokuapp.com/styled/alerts/alert-test.html');

  // cy.origin('testpages.herokuapp.com', () => {
    cy.get('#promptreturn').should('have.text', '');

    // Spy on the prompt function
    // const promptStub = cy.stub();
    // cy.on('window:prompt', promptStub);
    // // Trigger the prompt and wait for it
    // cy.get('#promptexample').click();
    // cy.wrap(promptStub).should('be.calledWith', 'I prompt you');
    // cy.on('window:prompt', () => txt); // Provide input to the prompt

    //ALTERNATIVE SOLUTION
    // Access the window object and stub the prompt method
    // cy.window().then(($win) => {
    //   cy.stub($win, 'prompt').returns(txt);

    //   // Trigger the prompt
    //   cy.get('#promptexample').click();

    //   // Verify the prompt was called with the expected text
    //   expect($win.prompt).to.be.calledWith('I prompt you');
    // });
  
    // Verify the result after handling the prompt
    cy.get('#promptreturn').should('have.text', txt);

    //TODO major failure. Latest cypress version CANNOT handle Prompts. They are not supported at all, they get rendered
  // });
});

Given('I wait for the contents of a popup alert and I dismiss it', function() {
  cy.visit('https://play1.automationcamp.ir/expected_conditions.html');
  const sel = 'button#alert_trigger';
  const alert_msg = 'I am alerting you!';
  
  cy.get(sel).should('have.text', 'Show Alert');

  // Spy on the alert function
  const stub = cy.stub();
  cy.on('window:alert', stub);

  cy.get('#alert_handled_badge').should('not.be.visible');

  // Trigger the alert
  cy.get(sel).click()

  cy.wrap(stub).should('be.calledWith', alert_msg);
  // the alert popup is never rendered in cypress !
  // but the assertion seems to be working and reliable

  cy.get('#alert_handled_badge').should('be.visible').and('contain.text', 'Alert').and('contain.text', 'handled');
});

Given('I wait for the confirmation popup and I accept it', function() {
  const sel = '#prompt_trigger';

  // I had to place the confirm and rejection code in another scenario

  // Spy on the confirm function
  const confirmStub = cy.stub();

  cy.get('#confirm_ok_badge').should('not.be.visible');
  cy.on('window:confirm', confirmStub);
  // Trigger the confirm and wait for it
  cy.get(sel).click();
  cy.wrap(confirmStub).should('be.calledWith', "Choose wisely...\nIt's your life!");
  cy.on('window:confirm', () => true); // accept the confirmation
  cy.get('#confirm_ok_badge').should('be.visible').and('contain.text', 'OK');
});

Given('I wait for the confirmation popup and I reject it', function() {
  const sel = '#prompt_trigger';
  
  // Spy on the confirm function
  const confirmStub2 = cy.stub();
  cy.get('#confirm_cancelled_badge').should('not.be.visible');
  cy.on('window:confirm', confirmStub2);
  cy.get(sel).click();
  cy.wrap(confirmStub2).should('be.calledWith', "Choose wisely...\nIt's your life!");
  cy.on('window:confirm', () => false); // cancel the confirmation
  cy.get('#confirm_cancelled_badge').should('be.visible').and('contain.text', 'Cancelled');
});

When('I get and I set attributes from an html element', function() {
  cy.get('#check_java').invoke('attr', 'disabled').should('exist');
  cy.get('#check_java').invoke('removeAttr', 'disabled');
  cy.get('#check_java').invoke('attr', 'disabled').should('not.exist');

  cy.get('.form-check-label[for=check_java]').invoke('attr', 'style', 'color: red;');
  cy.get('.form-check-label[for=check_java]').invoke('attr', 'style').should('equal', 'color: red;');
});

When('I select a native dropdown from a form', function() {
  const dropdown_loc = '#select_tool'
  const assertion_loc = '#select_tool_validate'

  cy.get(assertion_loc).should('be.hidden').and('have.text', '');

  cy.get(dropdown_loc).should('be.visible');
  cy.get(dropdown_loc).select('cyp');

  cy.get(assertion_loc).should('be.visible').and('contain.text', 'cyp');
});

When('I submit a form using native browser submit function', function() {
  const form_loc = 'form.needs-validation';

  cy.get(`${form_loc} .form-check-input`).check();

  cy.get('#validationCustom03').should('have.value', 'beautiful city');

  cy.get(form_loc).submit();

  cy.get('#validationCustom03').should('have.value', '');
});

Given('I use tab key and enter key to fill and submit a form without using the mouse', function() {
  cy.visit('https://play1.automationcamp.ir/forms.html');

  cy.get('#validationCustom04').should('not.have.focus');
  cy.get('#validationCustom03').type('beautiful city');

  cy.focused().tab(); // plugin required for tab, it worked well after all
  cy.get('#validationCustom04').should('have.focus');
  cy.get('#validationCustom04').type('MaState');

  cy.focused().tab();
  cy.get('#validationCustom05').should('have.focus');

  cy.get('#invalid_terms').should('contain.text', 'You must agree before submitting');
  cy.get('#invalid_terms').should('not.be.visible');

  cy.get('#validationCustom05').type('53479{enter}');

  cy.get('#invalid_terms').should('be.visible');
});

Given('I drag n drop an element on another element', function() {
  cy.visit('https://play1.automationcamp.ir/mouse_events.html');

  const drag_sel = '#drag_source';
  const drop_sel = '#drop_target';

  cy.get(drop_sel).should('be.visible').and('contain.text', 'Target');
  cy.get(drag_sel).should('be.visible').and('contain.text', 'Drop me on to the green');

  // cy.dragAndDrop(drag_sel, drop_sel);
  const dataTransfer = new DataTransfer();
  cy.get(drag_sel).trigger('dragstart', { dataTransfer });
  cy.get(drop_sel).trigger('drop', { dataTransfer });

  cy.get(drop_sel).should('be.visible').and('contain.text', 'Drop is successful!');
});

Given('I can double click and the action to be recorded as so', function() {
  cy.visit('https://play1.automationcamp.ir/mouse_events.html');

  cy.origin('play1.automationcamp.ir', () => {
    cy.get('#click_type').should('not.be.visible');

    cy.get('#click_area').should('be.visible').dblclick();

    cy.get('#click_type').should('exist').and('be.visible').and('have.text', 'Double-Click');
  })
});

Given('I can right click and interact with a context menu', function() {
  cy.visit(Cypress.config().baseUrl + '/apps/context-menu/');

  const del_icon_sel = 'i.uil-trash-alt';

  cy.get(del_icon_sel).should('not.be.visible');

  cy.get('#msg').rightclick();

  cy.get(del_icon_sel).should('be.visible');
});

Given('I can execute a real hover with the mouse', function() {
  cy.visit(Cypress.config().baseUrl + '/apps/mouse-hover/');
  cy.get('.poster').should('be.visible');

  const target_elem = '.title-container';
  const target_css_property = 'opacity';

  cy.get(target_elem).should('have.css', 'opacity', '0');

  cy.get('.poster').realHover();

  cy.get(target_elem).should('have.css', 'opacity', '1');
});

Given('I can click and I can type', function() {
  cy.visit(Cypress.config().baseUrl + '/apps/verify-account/');
  const codeRegex = '\\d-\\d-\\d-\\d-\\d-\\d';
  const codePattern = new RegExp(codeRegex);

  const inputString = ' The confirmation code is 9-9-9-9-9-9 ';
  const match = inputString.match(codePattern);
  expect(match).to.not.be.false;
  expect(match[0]).to.equal('9-9-9-9-9-9');

  cy.get('.info').invoke('text').then(txt => {
    const curMatch = txt.match(codePattern);
    expect(curMatch).to.not.be.false;

    const code_nums = curMatch[0].split("-");
    expect(code_nums).to.have.length(6);

    const nums = [];
    for (let num = 1; num <= 6; num++) {
      nums.push(cy.get(`.code-container input:nth-of-type(${num})`));
    }
    expect(nums).to.have.length(6);

    for (let ii = 0; ii < 6; ii++) {
      nums[ii].click();
      nums[ii].type(code_nums[ii]);
    }
  });

  cy.get('.info.success').should('have.text', 'Success');
});

Given('I reload the page', function() {
  cy.reload();
});

Given('I get ancestor of element', function() {
  cy.contains('Spider-Man', {matchCase: true})
    .xpath('//ancestor::tr')
    .get('td:nth-of-type(3)')
    .should('contain.text', 'Peter Parker');

  //apart from xpath you can also do it with the parents in cypress

  cy.contains('Spider-Man', {matchCase: true})
    .parents('tr').should('have.length', 1)
    .get('td:nth-of-type(3)')
    .should('contain.text', 'Peter Parker');
});

Given('I get parent of element', function() {
  cy.contains('Spider-Man', {matchCase: true}).should('be.visible')
  .xpath('..')
  .contains('@avengers.com')
  .should('have.text', 'spider-man@avengers.com');

  //however in cypress you can use the parent method as well
  cy.contains('Spider-Man', {matchCase: true}).should('be.visible')
  .parent()
  .contains('@avengers.com')
  .should('have.text', 'spider-man@avengers.com');
});

Given('I find an element inside an element', function() {
  cy.get('thead > tr:nth-of-type(1)').should('have.length', 1).within(() => {
    cy.get('th:nth-of-type(2)').should('contain.text', 'Status');
  });
});

Given('I find multiple elements and count them', function() {
  cy.get('tr > td').should('have.length', 24);
});

Given('I find elements by XPath selector', function() {
  cy.xpath("//*[contains(text(), 'View Test Suite')]").should('be.visible');
});

Given('I find elements by CSS selector', function() {
  cy.get("a[aria-label='full courses']").should('contain.text', 'Apps');
});

Given('I find elements by text and get their text', function () {
  cy.contains('superhero', { matchCase: false}).then($el => {
    const text = $el.text();
    const innerText = $el.prop('innerText');

    expect(text).to.not.be.equal(innerText);

    expect(innerText).to.be.equal('SUPERHERO');

    return $el;
  }).should('contain.text', 'Superhero')
    .and('have.prop', 'innerText', 'SUPERHERO');
});

Given('I visit a url', function () {  
  cy.visit(Cypress.config().baseUrl + '/apps/dynamic-table/');
});


Given('I am healthy', function () {
  cy.log('Take care of yourself first');
});
