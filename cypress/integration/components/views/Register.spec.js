describe("Login", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').last().click()
    });

    it("sign up successfully", () => {
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('input[placeholder="Nombre"]').type("Manolo");
        cy.get('input[placeholder="Apellidos"]').type("López García");
        cy.get('input[placeholder="Número de teléfono"]').type("656543454");
        cy.get('input[placeholder="Fecha de nacimiento"]').click();
        
    })
})