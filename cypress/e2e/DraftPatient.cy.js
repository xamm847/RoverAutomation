const { should } = require("chai");


describe('Save Draft Patient', () => {
    it('Save Draft Patient testing', () => {
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
                    cy.get(".p-dropdown-filter.p-inputtext.p-component").type('Lakewood');
                    cy.get("div[class='icd-item ng-star-inserted'] div strong").click();
                    cy.get('.p-button-label').click();

                    cy.get('.p-menubar-root-list > :nth-child(1) > [target="undefined"] > .p-submenu-icon').click();
                    cy.get('body > app-root:nth-child(1) > app-main:nth-child(2) > div:nth-child(1) > app-topbar:nth-child(1) > div:nth-child(2) > div:nth-child(1) > p-menubar:nth-child(2) > div:nth-child(1) > p-menubarsub:nth-child(3) > ul:nth-child(1) > li:nth-child(1) > p-menubarsub:nth-child(2) > ul:nth-child(1) > li:nth-child(3) > a:nth-child(1) > span:nth-child(1)').click();
                    cy.wait(2000);
                    
                    cy.get('.flex > p').should('be.visible').and('have.text', 'New Patient Registration');
                    cy.wait(5000);
                    cy.get(':nth-child(2) > [style="width: 10%;"] > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger').click();
                    cy.get('#pr_id_13_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();

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

                    validateNameField('#patientFirstName', 'Awais'); // First Name
                    validateNameField('#patientMiddleName', 'new'); // Middle Name (if applicable, adjust selector accordingly)
                    validateNameField('#patientLastName', 'Automation Thirty seven'); // Last Name
                    cy.get('.mt-3.mb-3 > [style="width: 10%;"] > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click(); // Marital Status
                    cy.get('#pr_id_14_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                    cy.get('.customCalendarIconStyleInvalid > .p-element > .p-button-icon').click();
                    cy.get('tbody.ng-tns-c51-19 > :nth-child(1) > :nth-child(6) > .p-ripple').click();
                    
                    cy.wait(3000);

    // Check for the toast message
    cy.get('body').then($body => {
        if ($body.find('.p-toast-message-content:contains("Patient already exists")').length) {
            // If toast is found, log a message and terminate the test
            cy.log('Patient already exists. Terminating test.');
            return;  // This effectively stops further steps from running
        }
    });

    cy.wait(2000);



                    // Check for existing patient
                    cy.get('#patientFirstName').then(($firstName) => {
                        cy.get('#patientLastName').then(($lastName) => {
                            cy.get('#patientDob').first().then(($dob) => {
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
                                                .and('contain.text', 'Patient already exists. MRN: 310098');
                                            
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
                                            cy.get('#patientSSN').type("453-45-3453"); //SSN
                                            cy.get('.mt-3.mb-3 > .custom-field.ng-star-inserted > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click(); //Attending physician
                                            cy.get('#pr_id_35_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('.my_scroll_div > :nth-child(1) > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click()//Race
                                            cy.get('#pr_id_15_list > :nth-child(2) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('[style="width: 14%;"] > .p-inputwrapper > .p-multiselect > .p-multiselect-trigger > .p-multiselect-trigger-icon').click();//Ethnicity
                                            cy.get(':nth-child(1) > .p-ripple > .p-checkbox > .p-checkbox-box').click();
                                            cy.wait(2000);
                                            cy.get(':nth-child(1) > [style="width: 10%;"] > .custom-form-label').should('have.text', 'Sex');
                                            cy.get(':nth-child(1) > [style="width: 10%;"] > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click(); //Sex
                                            cy.get('#pr_id_16_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            cy.get(':nth-child(1) > [style="width: 16%;"] > .custom-form-label').should('have.text','Sexual Orientation');
                                            cy.get(':nth-child(1) > [style="width: 16%;"] > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_17_list > :nth-child(2) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('.my_scroll_div > :nth-child(1) > :nth-child(5) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click(); //Gender Identity
                                            cy.get('#pr_id_18_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('.my_scroll_div > :nth-child(1) > :nth-child(5) > .p-inputwrapper > .p-dropdown > .p-dropdown-label').should('have.text','Male');
                                            cy.get('.mt-2 > :nth-child(1) > .custom-form-label').should('have.text','Reason For Visit');
                                            cy.get('.mt-2 > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click(); //Reason of visit
                                            cy.get('#pr_id_36_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('#patientVisitReasonSpecify').should('have.value','BBH'); //Specify REason For visit
                                            cy.get('.mt-2 > [style="width: 10%;"] > .custom-form-label').should('have.text','Contact No');
                                            cy.get('#patientContactNumber').type('(423) 423-4234').should('have.value','(423) 423-4234');
                                            cy.get('.mt-2 > [style="width: 16%;"] > .custom-form-label').should('have.text','Email');
                                            cy.get('#patientEmail').type('test@gmail.com');
                                            const emailField = '#patientEmail'; // Adjust selector to match your input field

                                            // Function to validate and clear the email input field
                                            const validateEmail = (email) => {
                                                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
                                            
                                                cy.get(emailField).clear().type(email).then(() => {
                                                    if (!emailPattern.test(email)) {
                                                        // If email doesn't match the pattern, clear the field
                                                        cy.get('#patientEmail').should('have.value', email); // Check that the email is entered
                                                        cy.get('#patientEmail').clear(); // Clear the field if invalid
                                                        cy.get('#patientEmail').should('have.value', ''); // Assert that the field is cleared
                                                    } else {
                                                        // If the email is valid, assert that the email stays in the input field
                                                        cy.get(emailField).should('have.value', email);
                                                    }
                                                });
                                            };
                                            cy.wait(2000);

                                            cy.get('.mt-2 > :nth-child(5) > .custom-form-label').should('have.text','Confirm Email');
                                            cy.get('#patientConfirmEmail').type('test@gmail.com').should('have.value','test@gmail.com');
                                            cy.get('.p-element.ng-star-inserted > .p-ripple > .p-button-label').should('not.be.disabled');

                                          

                                            // Verify that the "Save Draft Patient" button becomes visible
                                            cy.get("button[class='p-ripple p-element p-button-sm p-button-raised button-margin p-button p-component'] span[class='p-button-label ng-star-inserted']").should('be.visible');
                                            cy.get('.p-element.ng-star-inserted > .p-ripple > .p-button-label').click();
                                            cy.get('.p-toast-message-content').should('contain.text','Patient saved as DRAFT,');
    
                                            cy.get('.p-menubar-root-list > :nth-child(1) > [target="undefined"] > .p-submenu-icon').click();
                                            cy.get('.p-menubar-root-list > :nth-child(1) > p-menubarsub.p-element > .p-submenu-list > :nth-child(1) > .p-ripple > .p-menuitem-text').click();
                                            cy.wait(2000);
                                            cy.get('.mr-2 > .p-ripple').click();
                                            cy.get(':nth-child(3) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_47_list > :nth-child(3) > .p-ripple > .ng-star-inserted').click();
                                           
                                            cy.get('[label="Apply Filter"] > .p-ripple > .p-button-label').click();
                                            cy.get('.p-datatable-tbody > :nth-child(5) > :nth-child(2)').click();
                                            

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