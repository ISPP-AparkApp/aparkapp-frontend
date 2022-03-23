describe("SearchPlace", () => {
    beforeEach(() => {
        cy.accessSearch();
    });

    it("load map successfully", () => {
        cy.wait(1000);
        cy.reload();
        cy.accessSearch();
        cy.contains("Mapa");
    });

    it("list announcements succesfully", () => {
        cy.get('div .announcements-list')
        cy.get('div .announcement-card');
        cy.get('div .p-datascroller-header');
        cy.get('div .p-datascroller-content')
    })
})