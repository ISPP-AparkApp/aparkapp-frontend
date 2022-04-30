describe("Contact", () => {
    beforeEach(() => {
        cy.initialOpen();
    })

    it("the contact contains the correct information", () => {
        cy.contains("Contacto").click();
        cy.contains("¡Contáctanos!");
        cy.contains("Consultar Términos y condiciones de AparkApp");
        cy.contains("Horario de disponibilidad: Lunes a Domingo de 8:00 AM a 2:00 AM");
    })
})