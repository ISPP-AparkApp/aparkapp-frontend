describe("Profile", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click()
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
    });

    it("edit profile successfully", () => {
        cy.get("ul.p-menubar-root-list > li:nth-child(3)").click()
        cy.get('button').click();
        cy.get('input').first().clear().type('Test Cypress Name')
        cy.get('input').eq(1).clear().type('Test Cypress Surname')
        cy.get('input').eq(2).clear().type('666666666')
        cy.get('input').eq(3).clear().type('test@mail.com')
        cy.get('button').last().click();
        cy.contains('Test Cypress Name')
        cy.contains('Test Cypress Surname')
        cy.contains('666666666')
        cy.contains('test@mail.com')
    });

    it("edit profile unsuccessfully", () => {
        cy.get("ul.p-menubar-root-list > li:nth-child(3)").click()
        cy.get('button').click();
        cy.get('input').first().clear().type('X')
        cy.get('input').eq(1).clear().type('X')
        cy.get('input').eq(2).clear().type('123')
        cy.get('input').eq(3).clear().type('invalid mail')
        cy.get('button').last().click();
        cy.contains('El nombre debe tener una longitud entre 3 y 30 caracteres')
        cy.contains('Los apellidos deben tener una longitud entre 3 y 50 caracteres')
        cy.contains('El número de teléfono introducido no es válido')
        cy.contains('El email introducido no es válido')

    });
})