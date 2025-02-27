class login

{

    setUserName(username)

    {
        cy.get(':nth-child(2) > .p-inputtext').type(username);

    }

    setPassword(password)

    {
        cy.get(':nth-child(3) > .p-inputtext').type(password);

    }

    ClickSubmit()

    {
        cy.get('.p-button-label').click();

    }

    verifyLogin()
    {

    }

}

export default login;