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

Cypress.Commands.add("createAnnouncement", () => {
    // Login
    cy.initialOpen();
    cy.get('a.p-menuitem-link').first().click();
    cy.get('input[placeholder="Nombre de usuario"]').type("admin");
    cy.get('input[placeholder="Contraseña"]').type("admin");
    cy.get('button').click();
    // Create announcement
    cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').first().click();
    cy.get('div.p-dropdown').first().click();
    cy.get('li.p-dropdown-item').first().click();
    cy.get('button').contains("Ubicación actual").click();
    cy.get('div.p-dropdown').last().click();
    cy.get('li.p-dropdown-item').first().click();
    cy.wait(3000);
    cy.get('button').last().click();
    cy.wait(5000);
    cy.visit("localhost:3000");                                                                 // Logout
});

Cypress.Commands.add("createReservation", () => {
    // Login
    cy.get('a.p-menuitem-link').first().click();
    cy.get('input[placeholder="Nombre de usuario"]').type("user");                              // Login
    cy.get('input[placeholder="Contraseña"]').type("admin");
    cy.get('button').click();
    // Create reservation
    cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').last().click();      // Search 
    cy.get('button:last').click();                                                              // Reserve
    cy.wait(5000);
    cy.get('button').last().click();                                                            // Show route
});

Cypress.Commands.add("departure", () => {
    // Login
    cy.initialOpen();
    cy.get('a.p-menuitem-link').first().click();
    cy.get('input[placeholder="Nombre de usuario"]').type("admin");
    cy.get('input[placeholder="Contraseña"]').type("admin");
    cy.get('button').click();
    // Create announcement with another vehicle
    cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').first().click();
    cy.get('div.p-dropdown').first().click();
    cy.get('li.p-dropdown-item').last().click();
    cy.get('button').contains("Ubicación actual").click();
    cy.get('div.p-dropdown').last().click();
    cy.get('li.p-dropdown-item').first().click();
    cy.wait(3000);
    cy.get('button').last().click();
    cy.wait(5000);
    cy.visit("localhost:3000");    
    cy.createReservation();
    // Departure
    cy.wait(7000);
    cy.get('button:first').click();                                     // I arrive
    cy.wait(5000);
    cy.visit("localhost:3000");                                         // Logout
    cy.get('a.p-menuitem-link').first().click();
    cy.get('input[placeholder="Nombre de usuario"]').type("admin");
    cy.get('input[placeholder="Contraseña"]').type("admin");
    cy.get('button').click();
    cy.get('ul.p-menubar-root-list > li:nth-child(3)').click();
    cy.wait(7000);
    cy.get('button').click();
});