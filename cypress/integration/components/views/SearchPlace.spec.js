describe("SearchPlace", () => {
    beforeEach(() => {
        cy.accessSearch();
    });

    it("load map successfully", () => {
        cy.wait(1000);
        cy.reload();
        cy.accessSearch();
        cy.contains("Mapa");
    });
})