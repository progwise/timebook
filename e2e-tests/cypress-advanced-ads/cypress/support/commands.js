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
Cypress.Commands.add('login', (username, password) => { 
  const url = Cypress.env('login_url')
  cy.clearLocalStorage()
  cy.clearCookies()
   cy.reload(true);
  cy.visit(url)
  cy.get('#user_login').type(username)
  cy.get('#user_pass').type(password)
  cy.get('#wp-submit').click()
  cy.get('.wp-menu-name').contains('Advanced Ads')
 })
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
