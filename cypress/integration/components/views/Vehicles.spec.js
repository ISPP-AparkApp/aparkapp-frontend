describe("Vehicles", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').eq(1).click()
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
    });

    it("edit vehicle successfully", () => {
        cy.wait(3000);
        cy.get("ul.p-menubar-root-list > li:nth-child(5)").click()
        cy.get('[id^=pr_id_1_header_1]').click()
        cy.wait(3000);
        cy.get('button').eq(1).click()
        cy.get('input').first().clear().type('1111XXX')
        cy.get('input').eq(1).clear().type('Test Brand')
        cy.get('input').eq(2).clear().type('Test Model')
        cy.get('input').eq(3).clear().type('Test Color')
        cy.get('button').eq(1).click()
        cy.contains('1111XXX')
        cy.contains('Test Brand')
        cy.contains('Test Model')
        cy.contains('Test Color')
    });

    it("edit vehicle unsuccessfully", () => {
        cy.wait(3000);
        cy.get("ul.p-menubar-root-list > li:nth-child(5)").click()
        cy.get('[id^=pr_id_1_header_1]').click()
        cy.wait(3000);
        cy.get('button').eq(1).click()
        cy.get('input').first().clear().type('Bad License Plate')
        cy.get('input').eq(1).clear().type('X')
        cy.get('input').eq(2).clear().type('X')
        cy.get('input').eq(3).clear().type('X')
        cy.get('button').eq(1).click()
        cy.contains('La matrícula introducida no es válida')
        cy.contains('La marca del vehículo debe tener entre 3 y 30 caracteres')
        cy.contains('El modelo del vehículo debe tener entre 1 y 50 caracteres')
        cy.contains('El color del vehículo debe tener entre 3 y 30 caracteres')
    });
})