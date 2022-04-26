describe("Publish", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').eq(1).click()
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
        // eslint-disable-next-line testing-library/await-async-utils
        cy.get('input.p-inputtext.p-component.p-filled').first().click()
        cy.get('span.pi.pi-chevron-up').first().click()
        cy.get('img.mr-3.logo-img').first().click()

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

    it("map appears succesfuly", () => {
        cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').first().click()
        cy.get('button.map-button').click()
        cy.contains("Localiza tu plaza");
    })
    })