/// <reference types="cypress"/> 

describe('Should register a new user', ()=> {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500')
        cy.get('[data-cy="sign-up-btn"]').click();
    })
    it('Should validate sign up form inputs', ()=> {
        cy.get('[data-cy="form-btns"]').contains('Register').click()
    })
    it('Should not register an existing user', () => {
        cy.get('[data-cy="name"]').type('Ivonne')
        cy.get('[data-cy="username"]').type('admin')
        cy.get('[data-cy="email"]').type('admin@gmail.com')
        cy.get('[data-cy="password"]').type('P@$$word')
        cy.get('[data-cy="form-btns"]').contains('Register').click()
    })
    it('Should register a user if they do not exist', () => {
        cy.get('[data-cy="name"]').type('Jane Doe')
        cy.get('[data-cy="username"]').type('janedoe')
        cy.get('[data-cy="email"]').type('janedoe@gmail.com')
        cy.get('[data-cy="password"]').type('1234')
        cy.get('[data-cy="form-btns"]').contains('Register').click()
    })
    it('Should close the sign up form', ()=> {
        cy.get('[data-cy="form-btns"]').contains('Close').click()
    })

})

describe('Should login a user', ()=> {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:5500')
        cy.get('[data-cy="login-btn"]').click();
    })

    it('Should validate login form inputs', ()=> {
        cy.get('button').contains('Login').click()
    })

    it('Should not login a user with incorrect credentials', () => {
        cy.get('[data-cy="login-username"]').type('Coyote')
        cy.get('[data-cy="login-passwd"]').type('1234')
        cy.get('button').contains('Login').click()

    })

    it('Should login a user with correct credentials', () => {
        cy.get('[data-cy="login-username"]').type('Coyote')
        cy.get('[data-cy="login-passwd"]').type('1111')
        cy.get('button').contains('Login').click()
    })
    
    it('Should close the login form', ()=> {
        cy.get('[data-cy="close-login"]').click()
    })
    

})
