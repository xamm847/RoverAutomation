

describe("Authentication", ()=>{

// it("Basic Autorization", ()=>{

//    cy.request(
               
//                 { 
//                     method: 'GET',
//                     url: 'https://qa.rovermd.com:8443/RoverApp/#/login',
//                     auth:{
//                             username: 'awais605',
//                             password:'Foxtrot@1234'
                        
//                          }
//                          })
//                          .then((Response)=>{
//                            expect(Response.status).to.eq(200)

//    })

})

   it("Document upload",()=>{
      cy.request(
               
         { 
             method: 'GET',
             url: 'http://qa.rovermd.com:7778/documents/{patientRegId}?patientRegId=2317',
             Params:{
                     patientRegId: '2317',
                    }
                  })
                  .then((Response)=>{
                    expect(Response.status).to.eq(200)



   })

   })