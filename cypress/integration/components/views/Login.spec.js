describe("Login", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click()
    });

    it("log in successfully", () => {
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
        cy.contains('¿Qué quieres hacer ahora?')
    })

    it("log in unsuccessfully, the user doesn't exist", () => {
        cy.get('input[placeholder="Nombre de usuario"]').type("usuario_incorrecto");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
        cy.contains('El usuario no existe')
    })

    it("log in unsuccessfully, the username is required", () => {
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
        cy.contains('El nombre de usuario no puede estar en blanco');
    })

    it("log in unsuccessfully, the password is required", () => {
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('button').click();
        cy.contains('La contraseña no puede estar en blanco');
    })
})