/// <reference types="cypress"/> 

describe('Should allow admin to login', () => {
    it('Should Login an admin', () => {
        cy.visit('http://127.0.0.1:5500')
        cy.get('[data-cy="login-btn"]').click();
        cy.get('[data-cy="login-username"]').type('admin')
        cy.get('[data-cy="login-passwd"]').type('1234')
        cy.get('[data-cy="login"]').click()
    })
})
describe('Should allow admin to add new products', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500')
        cy.adminLogin()
    })
    it('Should display available products', () => {

        cy.get('[data-cy="products-table"]').click()
        cy.get('[data-cy="add-product"]').click()
        cy.get('[data-cy="product-name"]').type('new')
        cy.get('[data-cy="product-image"]').type('https://www.californian.co.za/wp-content/uploads/2023/07/A1201-PUMA-WHITE_VARSITYGREEN3.jpg')
        cy.get('[data-cy="product-price"]').type('1000')
        cy.get('[data-cy="product-desc"]').type('lorem ipsum')
        

    })
})