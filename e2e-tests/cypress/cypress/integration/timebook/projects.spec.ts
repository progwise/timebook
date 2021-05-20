context('Project list', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/projects')
  })

  it('...should contain a project table', () => {
    cy.get('table').get('th').contains('Name')
    cy.get('table').get('th').contains('Duration')
  })

  it('...click on add shows a popup for a new project', () => {
    cy.contains('button', 'Add').click()
    cy.contains('form', 'New Project')
  })
})
