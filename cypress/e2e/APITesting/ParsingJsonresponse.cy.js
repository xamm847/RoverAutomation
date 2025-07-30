describe("parsing json response", () => {


    it("parsing json response", () => {
        cy.request({
            method: "GET",
            url: "http://qa.rovermd.com:7777/mobile-users/all",

        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body[0].id).to.equal(23)
            expect(response.body[0].status).to.equal(true)
            expect(response.body[0].clientIndex).to.equal(54)
            expect(response.body[0].facilityName).to.equal('PROCARE PRESTON HOLLOW ER')


            
            expect(response.body[42].id).to.equal(3)
            expect(response.body[42].status).to.equal(true)
            expect(response.body[42].clientIndex).to.equal(10)
            expect(response.body[42].facilityName).to.equal('PROCARE ODESSA')

        })
     
    });
});



 