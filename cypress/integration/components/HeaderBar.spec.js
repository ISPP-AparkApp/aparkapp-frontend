describe("Headerbar", () => {
    beforeEach(() => {
        cy.initialOpen();
    })

    it("the menubar only contains log in options", () => {
        cy.get("ul.p-menubar-root-list")
            .children()
            .should("contain", "Inicio")
            .and("contain", "Registro")
    })

    it("the menubar contains user options", () => {
        cy.get('a.p-menuitem-link').first().click()
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
        cy.get("ul.p-menubar-root-list").contains("Inicio")

    })
})