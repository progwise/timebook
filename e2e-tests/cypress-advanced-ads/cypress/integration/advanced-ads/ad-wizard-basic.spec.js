/// <reference types="cypress" />

describe('an admin that is logged in', () => {
  beforeEach(() => {
    cy.login('user', 'user')
  })
  it('bla', () => {
    cy.log('Michael was here')
  })
})