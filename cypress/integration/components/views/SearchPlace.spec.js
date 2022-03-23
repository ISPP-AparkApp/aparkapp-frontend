describe("SearchPlace", () => {
    beforeEach(() => {
        cy.accessSearch();
    });

    it("load map successfully", () => {
        // eslint-disable-next-line testing-library/await-async-utils
        cy.wait(1000);
        cy.reload();
        cy.accessSearch();
        cy.contains("Mapa");
    });
})