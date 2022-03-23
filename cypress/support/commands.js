Cypress.Commands.add("initialOpen", () => {
    cy.visit("localhost:3000");
});

Cypress.Commands.add("accessSearch", () => {
    cy.initialOpen();
    cy.get('a.p-menuitem-link').first().click();
    cy.get('input[placeholder="Nombre de usuario"]').type("admin");
    cy.get('input[placeholder="Contraseña"]').type("admin");
    cy.get('button').click();
    cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').last().click();
});