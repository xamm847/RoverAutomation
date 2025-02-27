

describe('MyTestSuit', ()=>{

    //Direct access
    /*it ('Fixture demo test', ()=>{

        cy.visit("https://qa.rovermd.com:8443/RoverApp/#/login");

        cy.fixture('Rovermd').then((data)=>{
            cy.get(':nth-child(2) > .p-inputtext').type(data.username);
            cy.get(':nth-child(3) > .p-inputtext').type(data.password);
            cy.get("button[type='submit']").click();
            cy.get("img[class='ng-tns-c60-0']").should('exist');

        })

    })*/

      //Access through the Hook - For Multiple it blocks
      
     let userdata; 
     before(()=>{
        cy.fixture("Rovermd").then((data)=>{
            userdata=data;
        })

     })
      
      it('FixtureDemotest',()=>{

        cy.visit("https://qa.rovermd.com:8443/RoverApp/#/login");

            cy.fixture('Rovermd').then((data)=>{
            cy.get(':nth-child(2) > .p-inputtext').type(userdata.username);
            cy.get(':nth-child(3) > .p-inputtext').type(userdata.password);
            cy.get("button[type='submit']").click();
            cy.get("img[class='ng-tns-c60-0']").should('exist');

        })



      })

})