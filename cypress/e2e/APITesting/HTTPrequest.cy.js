
describe("HTTPrequest",()=>{

    it("Get call",()=>{

            cy.request('GET','http://qa.rovermd.com:7777/mobile-users/searchUser/awais').its('status').should('eq',200)
        
    })

    it("Post Call", ()=>{

            cy.request({

                method: 'POST',
                url: 'http://qa.rovermd.com:7777/mobile-users/add',
                body:{
                    id: 1,
                    clientIndex: 0,
                    email: "test@test.com",
                    firstName: "xamm",
                    lastName: "khan",
                    password: "abc@1234",
                    userId: "xamm00011",
                    userName: "test"
                }
            }).its('status').should('eq',201);

            })

    it.only('Put Call',()=>{

                cy.request({

                    method: 'PUT',
                    url: 'http://qa.rovermd.com:7777/mobile-users/updateLockedStatus/1',     

                })
                .its('status').should('eq',200)



            })


    })


   










    





