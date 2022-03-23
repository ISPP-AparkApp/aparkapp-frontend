describe("Reserve", () => {
    beforeEach(() => {
        cy.accessSearch();

    });
    it("show data reservation", () => {
        cy.get('button:last').click()
        cy.contains('Fecha y hora:')
        cy.contains('Nº de teléfono:')
        cy.contains('Dirección')
        cy.contains('Modelo')
        cy.contains('Color')
        cy.contains('Tiempo de espera')
        cy.contains('Precio')
        })
})