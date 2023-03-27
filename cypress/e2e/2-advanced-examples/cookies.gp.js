/// <reference types="cypress" />

context("Cookies", () => {
  beforeEach(() => {
    Cypress.Cookies.debug(true);

    cy.visit("https://primaryplayground.net/cookie-taste-test-activities/");

    // clear cookies again after visiting to remove
    // any 3rd party cookies picked up such as cloudflare
    cy.clearCookies();
  });

  it("cy.getCookie() - get a browser cookie", () => {
    cy.getCookie("euconsent-v2", { timeout: 10000 }).should("be.null");

    // cy.getCookie("euconsent-v2", { timeout: 10000 }).should("not.be.null"); //TODO it seems that Cypress is not retrying here as one would expect and this is also true for getCookies

    // https://on.cypress.io/getcookie

    cy.xpath("//*[text()='Accept']").should("be.visible").click();

    // cy.getCookie() yields a cookie object
    // cy.getCookie("euconsent-v2").should("have.p" "have.property", "value", "123ABC");

    cy.getCookie("euconsent-v2", { timeout: 10000 }).should(
      "have.property",
      "name"
    );

    cy.getCookie("euconsent-v2", { timeout: 10000 }).should((cookie) => {
      expect(cookie).to.have.property("name", "euconsent-v2");
      // console.log("cookie", cookie); //basically cookie is like a js object
    });

    cy.getCookie("euconsent-v2", { timeout: 10000 }).should(
      "have.property",
      "value"
    );
  });

  //  ONLY FOR THE CURRENT DOMAIN
  it("cy.getCookies() - get browser cookies for the current domain", () => {
    // https://on.cypress.io/getcookies
    cy.getCookies().should("be.empty");

    cy.xpath("//*[text()='Accept']").should("be.visible").click();

    // cy.getCookies() yields an array of cookies

    cy.getCookies()
      .should("have.lengthOf.gte", 2) //TODO here if you wait long enough this could be 16
      .should((cookies) => {
        // each cookie has these properties
        expect(cookies[0]).to.have.property("name", "euconsent-v2");
        expect(cookies[0]).to.have.property("value").not.be.empty;
        expect(cookies[0]).to.have.property("httpOnly", false);
        expect(cookies[0]).to.have.property("secure", false);
        expect(cookies[0]).to.have.property("domain");
        expect(cookies[0]).to.have.property("path");

        expect(cookies[1])
          .to.have.property("name")
          .that.contains("cmp_version");
        expect(cookies[1]).to.have.property("value").that.contains("v1");
      });
  });

  // FOR DOMAIN AND ALL SUBDOMAINS
  it("cy.getAllCookies() - get all browser cookies", () => {
    cy.visit("https://www.mcspotlight.org/index.shtml");
    cy.get('img[src*=head]').should("be.visible");
    
    cy.clearCookies();

    // https://on.cypress.io/getallcookies
    cy.getAllCookies().should("be.empty");

    //no collission
    cy.setCookie("samekey", "main domain");
    cy.setCookie("samekey", "another domain", {
      domain: "mysubdomain.example.com",
    });

    // cy.getAllCookies() yields an array of cookies
    cy.getAllCookies()
      .should("have.length", 2)
      .should((cookies) => {
        // each cookie has these properties
        expect(cookies[0]).to.have.property("name", "samekey");
        expect(cookies[0]).to.have.property("value", "main domain");
        expect(cookies[0]).to.have.property("httpOnly", false);
        expect(cookies[0]).to.have.property("secure", false);
        expect(cookies[0]).to.have.property("domain");
        expect(cookies[0]).to.have.property("path");

        expect(cookies[1]).to.have.property("name", "samekey");
        expect(cookies[1]).to.have.property("value", "another domain");
        expect(cookies[1]).to.have.property("httpOnly").to.be.false;
        expect(cookies[1]).to.have.property("secure", false);
        expect(cookies[1]).to.have.property(
          "domain",
          ".mysubdomain.example.com"
        );
        expect(cookies[1]).to.have.property("path");
      });
  });

  /*
  it('cy.setCookie() - set a browser cookie', () => {
    // https://on.cypress.io/setcookie
    cy.getCookies().should('be.empty')

    cy.setCookie('foo', 'bar')

    // cy.getCookie() yields a cookie object
    cy.getCookie('foo').should('have.property', 'value', 'bar')
  })

  it('cy.clearCookie() - clear a browser cookie', () => {
    // https://on.cypress.io/clearcookie
    cy.getCookie('token').should('be.null')

    cy.get('#clearCookie .set-a-cookie').click()

    cy.getCookie('token').should('have.property', 'value', '123ABC')

    // cy.clearCookies() yields null
    cy.clearCookie('token').should('be.null')

    cy.getCookie('token').should('be.null')
  })

  it('cy.clearCookies() - clear browser cookies for the current domain', () => {
    // https://on.cypress.io/clearcookies
    cy.getCookies().should('be.empty')

    cy.get('#clearCookies .set-a-cookie').click()

    cy.getCookies().should('have.length', 1)

    // cy.clearCookies() yields null
    cy.clearCookies()

    cy.getCookies().should('be.empty')
  })

  it('cy.clearAllCookies() - clear all browser cookies', () => {
    // https://on.cypress.io/clearallcookies
    cy.getAllCookies().should('be.empty')

    cy.setCookie('key', 'value')
    cy.setCookie('key', 'value', { domain: '.example.com' })

    cy.getAllCookies().should('have.length', 2)

    // cy.clearAllCookies() yields null
    cy.clearAllCookies()

    cy.getAllCookies().should('be.empty')
  })
  */
});
