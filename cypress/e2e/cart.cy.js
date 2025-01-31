/// <reference types="cypress"/> 
describe('Should not allow user to add items to cart before login', () => {
    it('Should add item to cart after login', () => {
        cy.visit('http://127.0.0.1:5500')
        cy.get('.cards').contains('Power')
        cy.get('.add-to-cart').first().click()
        cy.on('window:alert', (banana) => {
            expect(banana).contains('Login first to add items to cart')
        })
    })
})
describe('Should allow user to add items to cart after Login', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500')
        cy.login()
    })
    it('Should add item to cart', () => {
        cy.get('.cards').contains('Power')
        cy.get('.add-to-cart').first().click()
    })
})

describe('Should allow user view cart items', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500')
        cy.login()
    })
    it('Should open cart', () => {
        cy.get('[data-cy="open-cart"]').click()
    })
})

describe('Should allow user to checkout cart items', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500')
        cy.login()
    })
    it('Should checkout cart items', () => {
        cy.get('[data-cy="open-cart"]').click()
        cy.get('[data-cy="checkout"]').first().click()
    })
})