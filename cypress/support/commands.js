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
     username = 'Coyote'
     password = '1111'
    cy.visit('http://127.0.0.1:5500')
    cy.get('[data-cy="login-btn"]').click();
    cy.get('[data-cy="login-username"]').type(username)
    cy.get('[data-cy="login-passwd"]').type(password)
    cy.get('[data-cy="login"]').click()
})
Cypress.Commands.add('adminLogin', (username, password) => {
    username = 'admin'
    password = '1234'
   cy.visit('http://127.0.0.1:5500')
   cy.get('[data-cy="login-btn"]').click();
   cy.get('[data-cy="login-username"]').type(username)
   cy.get('[data-cy="login-passwd"]').type(password)
   cy.get('[data-cy="login"]').click()
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