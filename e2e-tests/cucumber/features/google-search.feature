@google
Feature: Search google

  Scenario Outline: Simple search
    Given I navigate to 'www.google.<tld>'
    And Press the 'I agree' button if it exists
    When I type the term 'cucumber' into the 'Search' box
    And Press the 'Google Search' button
    Then I get some 'Web results'

    Examples:
      | tld |
      | com |
      | de  |
