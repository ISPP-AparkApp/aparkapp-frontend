describe("Activity", () => {
    beforeEach(() => {

        // Login
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click();
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
        // Create announcement
        cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').first().click()
        cy.get('div.p-dropdown').first().click()
        cy.get('li.p-dropdown-item').first().click()
        cy.get('button').contains("Ubicación actual").click()
        cy.get('div.p-dropdown').last().click()
        cy.get('li.p-dropdown-item').first().click()
        // eslint-disable-next-line testing-library/await-async-utils
        cy.get('input.p-inputtext.p-component.p-filled').first().click()
        cy.get('span.pi.pi-chevron-up').first().click()
        cy.get('img.mr-3.logo-img').first().click()

        cy.wait(5000)
        cy.get('button').last().click()

        cy.visit("localhost:3000"); //Logout
        
        //Login
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click();
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();

        
    });

    it("cancel announcement successfully", () => {

        cy.contains('Actividad').click();
        cy.wait(5000)
        cy.contains('Cancelar').click();
        cy.wait(5000)
        cy.contains('Cancelado');

    });
});