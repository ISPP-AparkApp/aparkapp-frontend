describe("Logout", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click()
    });

    it("log out successfully", () => {
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
        cy.contains('¿Qué quieres hacer ahora?')
        cy.get('a.p-menuitem-link').last().click()
    })
})