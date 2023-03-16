Feature: Saphetor Assignment
  As a candidate
  I want to be express to Saphetor company that I am competent in writing test automation scenarios
  So that I can have a chance of meeting the rest of the team and get to know them better to see if there is chemistry

  Scenario Outline: Scenario Outline name
    Given you visit the playground
    And you have <years> of automation experience and by keeping "<notes>" notes
    And wait 3000 msec
    Examples:
      | years | notes |
      | 2     | hello |
      | 7     | again |

  @helloworld
  @wip
  Scenario: Tutorial Scenario
    Given you visit the playground
    And we are playing with the its of cypress
    And we are playing with the invoke of cypress
    And wait 1000 msec

  @exercise
  Scenario: Successful scenario
    Given We are on the home page
    And We have get rid of all the popup messages
    And We are filling the search with "BRAF:V600E" query
    And That the genome "hg38" is the selected one
    And the search button is clicked
    And the optional sample information form has phenotype names from "Only OMIM", phenotypes "Long QT Syndrome" and 67 age at onset
    And bypass the security validation
    And skip the tour
# Click on ACMG Classification Card Verify that the card appears
# - Verify that in the Sample Information
# component the “Phenotype” inserted in the
# step above is present

# Scroll to the Automated criteria criteria
# column and deactivate PS3 rule

# The rule is deactivated

# Scroll on the cards on top of the page and
# click on “Publications”

# Verify that the Publications card appears

# On the “ORDER BY” section change the
# current value “relevance” to “publication date”

# Verify that the order of the Articles