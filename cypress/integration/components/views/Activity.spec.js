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

        //Login with another user
        cy.get('a.p-menuitem-link').first().click();
        cy.get('input[placeholder="Nombre de usuario"]').type("cliente1");                              // Login
        cy.get('input[placeholder="Contraseña"]').type("QWerty45");
        cy.get('button').click();

        cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').last().click();      // Search 
        cy.get('button:last').click();                                                              // Reserve
        cy.wait(5000);
    });

    it("cancel reservation successfully", () => {

        cy.contains('Actividad').click();
        cy.cotains('Cancelar').click();
        cy.contains('Cancelado');

    });

    it("cancel reserve succesfully", () => {
        cy.contains('Cancelar').click();
        cy.contains('Cancelado');
    })




});