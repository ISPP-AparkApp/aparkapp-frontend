describe("CancelAnnouncement", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').eq(1).click()
        cy.get('input[placeholder="Nombre de usuario"]').type("user");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();

    });

    /* TODO: try cancel announcement but it is a reserve
    it("cancel announcement successfully", () => {
        cy.contains('Actividad').click();
        cy.wait(5000)
        cy.contains('Cancelar').click();
        cy.wait(5000)
        cy.contains('Cancelado');
    });
    */
});