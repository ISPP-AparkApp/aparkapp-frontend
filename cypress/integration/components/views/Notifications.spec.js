describe("Notifications", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').first().click()
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
    });

    it("whithout notify", () => {
        cy.get('ul.p-menubar-root-list > li:nth-child(3)').click();
        cy.get('div.p-card-title').contains('Parece que no tienes notificaciones');
    });

    it("arrival notify", () => {
        cy.createAnnouncement();
        cy.createReservation();
        cy.wait(7000);
        cy.get('button:first').click()                                  // I arrive
        cy.wait(5000);
        cy.visit("localhost:3000");                                     // Logout
        cy.get('a.p-menuitem-link').first().click();
        cy.get('input[placeholder="Nombre de usuario"]').type("admin");
        cy.get('input[placeholder="Contraseña"]').type("admin");
        cy.get('button').click();
        cy.get('ul.p-menubar-root-list > li:nth-child(3)').click();
        cy.wait(7000);
        cy.get('button');
    });

//    it("departure notify", () => {
//        cy.departure();
//        cy.visit("localhost:3000");                                                                 // Logout
//        cy.get('a.p-menuitem-link').first().click();
//        cy.get('input[placeholder="Nombre de usuario"]').type("user");                              // Login
//        cy.get('input[placeholder="Contraseña"]').type("admin");
//        cy.get('button').click();
//        cy.get('button.p-button.p-component.p-button-raised.p-button-rounded').last().click();      // Search 
//        cy.get('button:last').click();                                                              // Reserve
//        cy.wait(10000);
//        cy.get("div[role=alert]");
//    });
})