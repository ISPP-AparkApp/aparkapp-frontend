describe("RouteVisualization", () => {
    beforeEach(() => {
        cy.accessActivity();
    });

    it("load route successfully", () => {
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        })
        // eslint-disable-next-line
        cy.wait(1000);
        cy.get('button').contains("Cómo llegar").click();
        // eslint-disable-next-line
        cy.wait(5000);
        cy.get('button').contains("¡He llegado!");
        cy.contains("km");
    });
})