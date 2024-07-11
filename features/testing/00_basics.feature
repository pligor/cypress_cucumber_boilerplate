Feature: Basics

Settings such as headless, window size and page/command timeout are all configured in cypress.config.js

Execute this feature file like so:
npx cypress run --browser chrome --config baseUrl="https://qaplayground.dev",retries=0 --spec="cypress/e2e/testing/00_basics.feature" -e TAGS="@wip" --headed --no-exit

    Background: Hello world
        Given I am healthy

    @helloworld
    Scenario: I learn Cypress basics in first course
        Given I visit a url
        And I find elements by text and get their text
        And I find elements by CSS selector
        And I find elements by XPath selector
        And I find multiple elements and count them
        And I find an element inside an element
        And I get parent of element
        And I get ancestor of element
        And I reload the page

    Scenario: I learn mouse tricks of Cypress
        Given I can click and I can type
        And I can execute a real hover with the mouse
        And I can right click and interact with a context menu
        And I can double click and the action to be recorded as so

    Scenario: I play with forms in Cypress
        Given I drag n drop an element on another element
        And I use tab key and enter key to fill and submit a form without using the mouse
        And I submit a form using native browser submit function
        And I select a native dropdown from a form
        And I get and I set attributes from an html element

    Scenario: I check alerts and confirmation boxes with Cypress
        Given I wait for the contents of a popup alert and I dismiss it
        And I wait for the confirmation popup and I accept it
        And I wait for the confirmation popup and I reject it

    # Scenario: Name is missing here
        # Given I trigger a prompt alert and pass "geia sou" as text
        # MAJOR FAILURE HERE we cannot find a prompt alert

    Scenario: Asserting changing iFrame
        Given I can assert inside a changing iframe

    Scenario: Working with nested Frames
        Given I can access a nested iframe and assert in it

# And I can access open a new tab and assert in that tab, close it and return to main tab
# CYPRESS DOES NOT SUPPORT New tabs OR New Windows
# https://docs.cypress.io/guides/references/trade-offs

    Scenario: Working with files
        Given I can upload a file
        And I can download a file

    Scenario: Geolocation
        Given I can set the Geolocation to custom coordinates

    Scenario: Move in pages
        When I can move forward and backward to pages
    
    Scenario: Manage Cookies
        When I can get, set, clear and save Cookies of a webpage