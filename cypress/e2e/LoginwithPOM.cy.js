
import login from "../PageObjects/LoginPage2.js"



describe('POM', ()=>{

    it('Logintest', ()=>{

       cy.visit("https://qa.rovermd.com:8443/RoverApp/#/rovermd/dashboard")

       const ln=new login();
       ln.setUserName("awaisQA1")
       ln.setPassword("Foxtrot@12345")
       ln.ClickSubmit();
       ln.verifyLogin();
    })

    //Using POM with fixtures

    it.only('Logintest', ()=>{

        cy.visit("https://qa.rovermd.com:8443/RoverApp/#/rovermd/dashboard")
 
        cy.fixture('Rovermd').then((data)=>{
            const ln=new login();
            ln.setUserName(data.username);
            ln.setPassword(data.password);
            ln.ClickSubmit();
            ln.verifyLogin();
        })
       
     })



})