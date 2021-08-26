/// <reference types="cypress" />

describe('when a user visits https://test-setup.com/cypress/wp-admin/', () => {

  before(() => {
    cy.visit('https://test-setup.com/cypress/wp-admin/')
  })

  it('the login screen is rendered', () => {
    
    cy.get('#user_login').should('be.visible')
    cy.get('#user_pass').should('be.visible')
  })

  it('user can login', () => {
    cy.get('#user_login').type('user')
    cy.get('#user_pass').type('user')
    cy.get('#wp-submit').click()
  })

  describe('If the user has entered the Advanced Ads section', () => {
    beforeEach(() => {
      cy.get('.wp-menu-name').contains('Advanced Ads').click()
    })

    it('Then the wizard is started', () => {

    })
  })
})