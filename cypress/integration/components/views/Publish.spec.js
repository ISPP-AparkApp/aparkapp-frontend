describe("Publish", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click()
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
    });

    it("publish successfully", () => {
        cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').first().click() 
        cy.get('div.p-dropdown').first().click()
        cy.get('li.p-dropdown-item').first().click()
        cy.get('button').contains("Ubicación actual").click()
        cy.get('div.p-dropdown').last().click()
        cy.get('li.p-dropdown-item').first().click()
        cy.wait(5000)
        cy.get('button').last().click()
        cy.contains("Anuncio publicado")
    });

    it("publish unsuccessfully", () => {
        cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').first().click() 
        cy.get('div.p-dropdown').first().click()
        cy.get('li.p-dropdown-item').first().click()
        cy.get('div.p-dropdown').last().click()
        cy.get('li.p-dropdown-item').first().click()
        cy.get('button').last().click()
        cy.contains("Ubicación requerida")
    })
})