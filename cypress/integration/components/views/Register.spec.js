import { v4 as uuidv4 } from 'uuid';

describe("Sign up", () => {
    beforeEach(() => {
        cy.initialOpen();
        cy.get('a.p-menuitem-link').last().click()
    });

    it("sign up successfully", () => {
        // user information
        cy.get('input[placeholder="Nombre de usuario"]').type(uuidv4());
        cy.get('input[placeholder="Contraseña"]').type("manolito98");
        cy.get('input[placeholder="Confirmar contraseña"]').type("manolito98");
        cy.get('input[placeholder="Correo electrónico"]').type(uuidv4() + "@gmail.com");
        cy.get('input[placeholder="Nombre"]').type("Manolo");
        cy.get('input[placeholder="Apellidos"]').type("López García");
        cy.get('input[placeholder="Número de teléfono"]').type("656544499");
        cy.get('input[placeholder="Fecha de nacimiento"]').type("04/05/2000");
        cy.get("tbody > :nth-child(1) > :nth-child(3) > :nth-child(1)").click();

        // vehicle information
        cy.get('input[placeholder="Marca"]').type("Opel");
        cy.get('input[placeholder="Modelo"]').type("Corsa");
        cy.get('input[placeholder="Matrícula"]').type(Math.round((Math.random() * 8999 + 1000)) + "TFG");
        cy.get("div.p-dropdown-trigger").click();
        cy.get("div.p-dropdown-items-wrapper").first().click()
        cy.get('div.p-checkbox.p-component').click();
        cy.get('button').last().click()
        cy.contains('¿Qué quieres hacer ahora?')
    })

    it("sign up unsuccessfully, some fields are invalid", () => {
        // user information
        cy.get('input[placeholder="Nombre de usuario"]').type("manolito98");
        cy.get('input[placeholder="Contraseña"]').type("manolito98");
        cy.get('input[placeholder="Correo electrónico"]').type("manologmail.com");
        cy.get('input[placeholder="Nombre"]').type("Ma");
        cy.get('input[placeholder="Apellidos"]').type("Ló");
        cy.get('input[placeholder="Número de teléfono"]').type("3454");
        cy.get('input[placeholder="Fecha de nacimiento"]').click();
        cy.get('button').first().click();
        cy.contains('El email introducido no es válido');
        cy.contains('El nombre debe tener una longitud entre 3 y 30 caracteres');
        cy.contains('Los apellidos deben tener una longitud entre 3 y 50 caracteres');
        cy.contains('El número de teléfono introducido no es válido');
        cy.contains('La fecha de nacimiento es requerida');
    })
})