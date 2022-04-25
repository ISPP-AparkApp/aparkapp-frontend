describe("Error", () => {
    beforeEach(() => {
        cy.visit("localhost:3000/esdf")
    });

    it("loading error page successfully", () => {
        cy.contains('Ooops!! Parece que hubo un error :(')
        cy.get('button').click();
    });
});