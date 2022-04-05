describe("CancelReservation", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click();
        cy.get('input[placeholder="Nombre de usuario"]').type("cliente1");
        cy.get('input[placeholder="Contraseña"]').type("QWerty45");
        cy.get('button').click();
    });     

    it("cancel reservation successfully", () => {

        cy.contains('Actividad').click();
        cy.wait(5000)
        cy.contains('Cancelar').click();
        cy.wait(5000)
        cy.contains('Cancelado');

    });

});    