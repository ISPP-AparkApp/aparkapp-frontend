describe("SearchPlace", () => {
    beforeEach(() => {
        cy.accessSearch();
    });

    it("load map successfully", () => {
        // eslint-disable-next-line testing-library/await-async-utils
        cy.wait(1000);
        cy.reload();
        cy.contains("Mapa");
    });

    it("list announcements succesfully", () => {
        cy.get('div .announcements-list')
        cy.get('div .announcement-card');
        cy.get('div .p-datascroller-header');
        cy.get('div .p-datascroller-content')
    })
})