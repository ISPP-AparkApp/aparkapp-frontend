describe("Edit", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').eq(1).click()
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
    });

    it("Edit succesfuly", () => {
        cy.contains('Actividad').click()
        cy.contains('Editar anuncio').click()
        cy.contains('Ubicación actual').click()
        cy.wait(5000)
        cy.contains('Guardar').click()
        cy.contains("Anuncio modificado")
    });

    it("Edit unsuccessfully", () => {
        cy.contains('Actividad').click()
        cy.contains('Editar anuncio').click()
        cy.get('input.p-inputtext.p-component.p-filled.p-inputnumber-input').first().clear()
        cy.contains('Guardar').click()
        cy.contains("Tiempo de espera requerido")
    });

})