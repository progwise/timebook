context('Navigate on top', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('...to time-table', () => {
    cy.get('nav').contains('Time').click()
    cy.url().should('contain', '/time')
  })

  it('...to time-table', () => {
    cy.get('nav').contains('Projects').click()
    cy.url().should('contain', '/projects')
  })
})
