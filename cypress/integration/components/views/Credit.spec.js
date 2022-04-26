describe("Credit", () => {
    beforeEach(() => {
        cy.accessCredit();
    });

    it("withdraw credit incorrect mail", () => {
        cy.get('#pr_id_1_header_1').click();
        cy.get('input').first().clear().type('badrequest')
        cy.get(':nth-child(4) > .p-button-label').click();
        cy.contains("El email introducido no es válido");
    })

    it("withdraw credit succesfully", () => {
        cy.get('#pr_id_1_header_1').click();
        cy.get('input').first().clear().type('correo@mail.com')
        cy.get(':nth-child(4) > .p-button-label').click();
        cy.get('.p-confirm-dialog-accept > .p-button-label').click();
        cy.contains("2.00 €");
    })

    it("try withdraw credit without credit", () => {
        cy.get('#pr_id_1_header_1').click();
        cy.get('input').first().clear().type('correo@mail.com')
        cy.get(':nth-child(4) > .p-button-label').click();
        cy.contains("No tienes crédito suficiente");
    })

})