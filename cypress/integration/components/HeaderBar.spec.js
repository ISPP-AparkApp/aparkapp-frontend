describe("Headerbar", () => {
    beforeEach(() => {
        cy.initialOpen();
    })

    it("the menubar only contains log in options", () => {
        cy.get("ul.p-menubar-root-list")
        cy.contains("Iniciar sesión")
        cy.contains("Registro")
        cy.contains("Contacto")
    })

    it("the menubar contains user options", () => {
        cy.get('a.p-menuitem-link').eq(1).click()
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
        cy.get("ul.p-menubar-root-list").contains("Inicio")
    })
})