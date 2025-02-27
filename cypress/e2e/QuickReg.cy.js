describe('Quick Registration', () => {
    it('Quick Reg testing', () => {
        cy.viewport(1750, 960);
        cy.fixture("Rovermd2").then((data) => {
            cy.visit("https://qa.rovermd.com:8443/RoverApp/#/login");

            data.forEach((userdata) => {
                cy.get(':nth-child(2) > .p-inputtext').type(userdata.username);
                cy.get(':nth-child(3) > .p-inputtext').type(userdata.password);
                cy.get("button[type='submit']").click();

                if (userdata.username === 'xamm' && userdata.password === "Mnbv@12345") {
                    cy.get("img[class='ng-tns-c60-0']").should('exist');
                    cy.get("div[aria-label='dropdown trigger']").click();
                    cy.get(".p-dropdown-filter.p-inputtext.p-component").type('Highland');
                    cy.get('strong').click();
                    cy.get('.p-button-label').click();

                    cy.get('.p-menubar-root-list > :nth-child(1) > [target="undefined"] > .p-submenu-icon').click();
                    cy.get('.p-menubar-root-list > :nth-child(1) > p-menubarsub.p-element > .p-submenu-list > :nth-child(2) > .p-ripple').click();
                    cy.wait(2000);

                    cy.get(':nth-child(2) > [style="width: 10%;"] > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger').click();
                    cy.get('#pr_id_13_list > :nth-child(1) > .p-ripple').click();

                    // Input patient details with validation
                    const validateNameField = (selector, name) => {
                        cy.get(selector).clear().type(name);
                        // Here you can add additional logic to check if the name is valid
                        const namePattern = /^[A-Za-z\s]*$/; // Regex for alphabetic characters and spaces
                        if (!namePattern.test(name)) {
                            cy.get('.error-message').should('be.visible').and('contain.text', 'Name field accepts only alphabetic characters.');
                        } else {
                            cy.get('.error-message').should('not.exist'); // Adjust the selector if necessary
                        }
                    };

                    validateNameField(':nth-child(2) > :nth-child(2) > #float-input', 'Awais'); // First Name
                    validateNameField(':nth-child(2) > :nth-child(3) > #float-input', 'new'); // Middle Name (if applicable, adjust selector accordingly)
                    validateNameField(':nth-child(2) > :nth-child(4) > #float-input', 'Automation sixteen'); // Last Name

                    // Click the button to proceed
                    cy.get('.p-button-icon').click();

                    cy.get('tbody.ng-tns-c51-19 > :nth-child(1) > :nth-child(3) > .p-ripple').click(); // DOB
                    cy.wait(3000);

                    // Check for existing patient
                    cy.get(':nth-child(2) > :nth-child(2) > #float-input').then(($firstName) => {
                        cy.get(':nth-child(2) > :nth-child(4) > #float-input').then(($lastName) => {
                            cy.get('#patientBirthDate').first().then(($dob) => {
                                const firstNameValue = $firstName.val();
                                const lastNameValue = $lastName.val();
                                const dobValue = $dob.val();

                                if (firstNameValue && lastNameValue && dobValue) {
                                    cy.request({
                                        method: 'GET',
                                        url: `https://qa.rovermd.com:7685/patient/existingpatientcheck?firstName=${firstNameValue}&lastName=${lastNameValue}&dob=${dobValue}`,
                                        failOnStatusCode: false
                                    }).then((response) => {
                                        if (response.body.exists) {
                                            cy.get('.p-toast-detail')
                                                .should('be.visible')
                                                .and('contain.text', 'Patient already exists.');
                                            
                                            // Terminate the test by throwing an error
                                            throw new Error('Patient already exists. Terminating registration process.');
                                        } else {
                                            cy.log('Patient does not exist. Proceeding with registration.');

                                            // Check if any of the required fields are empty
                                            cy.get('#float-input').then(($input) => {
                                                let allFieldsFilled = true;
                                                cy.get('#float-input').each(($input) => {
                                                    if (!$input.val()) {
                                                        allFieldsFilled = false;
                                                    }
                                                });

                                                // If any field is empty, disable the submit button
                                                if (!allFieldsFilled) {
                                                    cy.get('p-button.p-element').should('be.disabled');
                                                } else {
                                                    cy.get('p-button.p-element').should('not.be.disabled');
                                                }
                                            });

                                            // Continue filling out the form
                                            cy.get(':nth-child(1) > .p-inputtext-sm > .p-inputtext').type("453-45-3453");
                                            cy.get('[style="width: 8%;"] > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_14_list > :nth-child(1) > .p-ripple').as('Male').click();
                                            cy.get(':nth-child(3) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_15_list > :nth-child(1) > .p-ripple').as('single').click();
                                            cy.get(':nth-child(4) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_16_list > :nth-child(1) > .p-ripple').click();
                                            cy.get(':nth-child(5) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_17_list > :nth-child(1) > .p-ripple').as('COVID TESTING').click();
                                            cy.get('.custom-field.ng-star-inserted > .p-inputtext').should('have.value', 'COVID Testing');
                                            cy.get(':nth-child(4) > :nth-child(1) > #float-input').type('44535 12th St E, Lancaster, CA 93535, USA');
                                            cy.get(':nth-child(4) > :nth-child(1) > #float-input').type('{enter}');

                                            cy.wait(3000);
                                            cy.get(':nth-child(4) > :nth-child(2) > #float-input').type('44535 Bedford Ct');
                                            cy.get(':nth-child(5) > :nth-child(1) > #float-input').type('Temecula');
                                            cy.get(':nth-child(5) > :nth-child(2) > #float-input').type('CA');
                                            cy.get(':nth-child(5) > :nth-child(3) > #float-input').type('Riverside County');
                                            cy.get(':nth-child(5) > :nth-child(4) > #float-input').type('US');
                                            cy.get('[style="width: 7%;"] > .p-inputtext').type('92592');
                                            cy.get('#p-inputtext-sm').type('456-345-6356');
                                            cy.get(':nth-child(7) > #float-input').type('test@test.com');
                                            cy.get('.p-checkbox-box', { timeout: 10000 }).click();
                                            cy.get('.p-checkbox-box', { timeout: 10000 }).should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get(':nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box').click();
                                            cy.get(':nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box').should('have.class', 'p-radiobutton-box p-highlight');
                                            cy.get('.custom-submission-div > div').click();
                                            cy.get('.ngx-overlay', { timeout: 1000 })  // Replace with the correct overlay selector
                                            
                                            cy.get('.p-toast', { force: true }).should('contain.text', 'Patient registered successfully');


                                        }
                                    });
                                } else {
                                    cy.log('One or more required fields are missing');
                                    cy.get('p-button.p-element').should('be.disabled');
                                }
                            });
                        });
                    });


                   

                } else {
                    cy.get('.p-toast-detail').should("have.text", userdata.expected);
                }

                

                
            });
        });
    });
});
