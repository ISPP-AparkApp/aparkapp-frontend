describe("SearchPlace", () => {
    beforeEach(() => {
        cy.accessSearch();
    });

    it("load map successfully", () => {
        // eslint-disable-next-line testing-library/await-async-utils
        cy.wait(5000);
        cy.reload();
        cy.wait(5000);
        cy.contains("Mapa");
    });

    it("Search by location and filter", () => {
        cy.get('input[placeholder="Busca en la zona donde quieras aparcar"]').type("Matalascañas");
        cy.get('span.pi-search').click();
        cy.get('span.pi-filter').click();
        cy.contains("¿Qué día deseas aparcar?");
        cy.contains("Escoge un rango de precios")
        cy.contains("Aplicar").click();
    })

    it("Bad search by location", () => {
        cy.get('input[placeholder="Busca en la zona donde quieras aparcar"]').type("sqiudhuiewqfhi");
        cy.get('span.pi-search').click();
        cy.contains("Ooops!! Parece que hubo un error :(");
    })
})