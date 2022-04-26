describe("CancelReservation", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click();
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
    });

    /* Add initial data */
    it("cancel reservation successfully", () => {
        cy.contains('Actividad').click();
        cy.wait(5000)
        cy.contains('Cancelar').click();
        cy.wait(5000)
        cy.contains('Cancelado por mí');
    });

});