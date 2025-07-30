class login

{
    txtUserName=':nth-child(2) > .p-inputtext';
    txtPassword=':nth-child(3) > .p-inputtext';
    btnSubmit='.p-button-label';

    setUserName(username)

    {
        cy.get(this.txtUserName).type(username);

    }

    setPassword(password)

    {
        cy.get(this.txtPassword).type(password);

    }

    ClickSubmit()

    {
        cy.get(this.btnSubmit).click();

    }

    verifyLogin()
    {

    }

}

export default login;