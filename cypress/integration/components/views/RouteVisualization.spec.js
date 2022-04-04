describe("RouteVisualization", () => {
    beforeEach(() => {
        cy.accessActivity();
    });

    it("load route successfully", () => {
        cy.wait(1000);
        cy.get('button').contains("Cómo llegar").click();
        // eslint-disable-next-line testing-library/await-async-utils
        cy.wait(5000);
        cy.get('button').contains("¡He llegado!");
        cy.get('p.text-xl publish_label mb-2 mt-1').first().contains("Distancia: 31,3 km Duración aproximada: 27 min");
    });
})