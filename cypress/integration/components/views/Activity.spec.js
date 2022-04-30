describe("Activity", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').eq(1).click()
        cy.get('input[placeholder="Nombre de usuario"]').type("user2");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
    });

    it("Filter announcements ", () => {
        cy.contains('Actividad').click()
        cy.get('div.p-dropdown-trigger').click()
        cy.get('li.p-dropdown-item').eq(1).click()
        cy.get('button.p-button.p-component.ml-2').click()
        cy.contains('Libres')
        cy.contains('No realizados')
        cy.contains('Reservados')
        cy.contains('Terminados')
        cy.contains('Cancelados')
    })

    it("Filter bookings ", () => {
        cy.contains('Actividad').click()
        cy.get('div.p-dropdown-trigger').click()
        cy.get('li.p-dropdown-item').eq(2).click()
        cy.get('button.p-button.p-component.ml-2').click()
        cy.contains('En curso')
        cy.contains('Terminados')
        cy.contains('Cancelados')
    })

    it("Filter bookings works succesfuly ", () => {
        cy.contains('Actividad').click()
        cy.get('div.p-dropdown-trigger').click()
        cy.get('li.p-dropdown-item').eq(2).click()
        cy.get('button.p-button.p-component.ml-2').click()
        cy.get('div.p-checkbox').first().click()
        cy.get('div.p-checkbox').eq(1).click()
        cy.get('div.p-checkbox').last().click()
        cy.contains('Aplicar').click()
        cy.contains('Parece que aún no tienes actividades')
    })

    it("Rate a booking", () => {
        cy.contains('Actividad').click()
        cy.contains('Valorar').click()
        cy.get('span.p-rating-icon.pi.pi-star').last().click()
        cy.get('textarea.p-inputtextarea').type('Gran intercambio!')
        cy.contains('Enviar').click()
        cy.contains('Valoración realizada correctamente')
    })
})