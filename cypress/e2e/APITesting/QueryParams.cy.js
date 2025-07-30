describe("API testing with query params", () => {
    it("GET method with query params", () => {
        cy.request({
            method: "GET",
            url: "http://qa.rovermd.com:7777/mobile-users/resetPassword/1",
            qs: {
                userId: 1
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
           
            expect(response.body.message).to.eq("message: Password Reset for User")
        });
    });
});
