describe('JSONPlaceholder API Chaining', () => {
  it('Gets posts and fetches user details using userId', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts').then((postResponse) => {
      expect(postResponse.status).to.eq(200);

      const userId = postResponse.body[0].userId;

      cy.request(`https://jsonplaceholder.typicode.com/users/${userId}`).then((userResponse) => {
        expect(userResponse.status).to.eq(200);
        expect(userResponse.body).to.have.property('id', userId);
      });
    });
  });
});
