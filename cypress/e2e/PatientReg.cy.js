const { should } = require("chai");


describe('Patient Registration', () => {
    it('Patient Reg testing', () => {
        cy.viewport(1750, 960);
        cy.fixture("Rovermd2").then((data) => {
            cy.visit("https://qa.rovermd.com:8443/RoverApp/#/login");

            data.forEach((userdata) => {
                cy.get(':nth-child(2) > .p-inputtext').type(userdata.username);
                cy.get(':nth-child(3) > .p-inputtext').type(userdata.password);
                cy.get("button[type='submit']").click();

                if (userdata.username === 'awaisQA1' && userdata.password === "Foxtrot@12345") {
                    cy.get('.p-dropdown-trigger-icon', { timeout: 10000 }).should('be.visible');
                    cy.get("div[aria-label='dropdown trigger']").click();
                    cy.get(".p-dropdown-filter.p-inputtext.p-component").type('Pearland');
                    cy.get("div[class='icd-item ng-star-inserted'] div strong").click();
                    cy.get('.p-button-label').click();
                    cy.wait(5000);
                    cy.get('.my-2').should('contain.text', 'A newer version of application is available.');
                    
                    cy.get('.button-margin > .p-ripple').should('contain.text', 'Reload Later').click();
                    cy.get('.p-menubar-root-list > :nth-child(1) > [target="undefined"] > .p-submenu-icon').click();
                    cy.get('body > app-root:nth-child(1) > app-main:nth-child(2) > div:nth-child(1) > app-topbar:nth-child(1) > div:nth-child(2) > div:nth-child(1) > p-menubar:nth-child(2) > div:nth-child(1) > p-menubarsub:nth-child(3) > ul:nth-child(1) > li:nth-child(1) > p-menubarsub:nth-child(2) > ul:nth-child(1) > li:nth-child(3) > a:nth-child(1) > span:nth-child(1)').click();
                    cy.wait(3000);
                    
                    cy.get('.mb-5 > .flex > p').should('be.visible').and('have.text', 'New Patient Registration');
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

                    validateNameField('#patientFirstName', 'Awaiss'); // First Name
                    validateNameField('#patientMiddleName', 'new'); // Middle Name (if applicable, adjust selector accordingly)
                    validateNameField('#patientLastName', 'Automation Thirty two'); // Last Name
                    cy.get('.mt-3.mb-3 > [style="width: 10%;"] > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click(); // Marital Status
                    cy.get('#pr_id_14_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                    cy.get('.customCalendarIconStyleInvalid > .p-element > .p-button-icon').click();
                    cy.get('tbody.ng-tns-c53-20 > :nth-child(1) > :nth-child(3) > .p-ripple').click();
                    cy.wait(3000);

                                
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
                                            cy.get('#patientSSN').type("453-45-3453"); //SSN
                                            cy.get('.mt-3.mb-3 > .custom-field.ng-star-inserted > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click(); //Attending physician
                                            cy.get('#pr_id_40_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('.my_scroll_div > :nth-child(1) > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click()//Race
                                            cy.get('#pr_id_15_list > :nth-child(2) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('[style="width: 14%;"] > .p-inputwrapper > .p-multiselect > .p-multiselect-trigger > .p-multiselect-trigger-icon').click();//Ethnicity
                                            cy.get('.p-multiselect-header > .p-checkbox > .p-checkbox-box').click();
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
                                            cy.get('#pr_id_41_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
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

                                            // Step 2: Type the full address and trigger Enter key to autofill other fields
                                            cy.get('#patientAddress')
                                            .type('22365 Mountain Pine Dr, New Caney, TX 77357, USA')
                                            .type('{enter}');

                                            // Step 3: Wait for autofill processing, if applicable (adjust timeout based on your app behavior)
                                            cy.wait(2000);

                                            // Step 4: Verify autofill of other fields with assertions
                                            cy.get('#patientAddress1').type('22365 Mountain Pine Dr')
                                            .should('have.value', '22365 Mountain Pine Dr');

                                            cy.get('#patientZipCode').type('77357')
                                            .should('have.value', '77357');

                                            cy.get('#patientCity').type('New Caney')
                                            .should('have.value', 'New Caney');

                                            cy.get('#patientState').type('TX')
                                            .should('have.value', 'TX');

                                            cy.get('#patientCounty').type('Montgomery County')
                                            .should('have.value', 'Montgomery County');
                                            cy.get('#patientCountry').type('United States')
                                            .should('have.value', 'United States');
                                            cy.get(':nth-child(5) > [style="width: 16%;"] > .custom-form-label').should('have.text','Preferred Language');
                                            // Click to open the dropdown
                                            cy.get(':nth-child(5) > [style="width: 16%;"] > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon')
                                            .scrollIntoView()
                                            .click();

                                            // Scroll to and click the specific option you want to select
                                            cy.get('#pr_id_19_list > :nth-child(8) > .p-ripple > .ng-star-inserted')
                                            .scrollIntoView()
                                            .click();
                                            cy.get('#pr_id_19_label').should('have.text','Castilian Spanish');
                                            cy.get('#patientEmployer').type('FnA');
                                            cy.get('#patientOccupation').type('SQA Engineer');
                                            cy.get('#patientEmpContact').type('(523) 452-3452').blur();
                                            cy.get(':nth-child(6) > .mx-0 > .heading-styling').should('contain.text','Authorization');
                                            cy.get('.mt-4 > :nth-child(1) > .custom-form-label > p').should('contain.text','Do you authorize releasing your medical information to other facilities or physicians?');
                                            cy.get('.mt-4 > .formgroup-inline > :nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box')
                                            .click().should('have.class', 'p-radiobutton-box p-highlight');  // Check that it has the 'checked' class
                                            cy.get(':nth-child(6) > :nth-child(3) > .custom-field > .custom-form-label').should('contain.text','I HEREBY AGREE AND CONFIRM THAT ALL MY INFORMATION STATED ABOVE IS ACCURATE.');
                                            cy.get('.custom-field > .p-element > .p-checkbox > .p-checkbox-box').click().should('have.class','p-checkbox-box p-highlight');
                                            cy.get('.mt-3 > :nth-child(1) > .custom-form-label > p > :nth-child(1)').should('contain.text','CONSENT TO CONTACT?');
                                            cy.get(':nth-child(6) > .mt-3 > .formgroup-inline > :nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box').click().should('have.class','p-radiobutton-box p-highlight');
                                        

                                            
                                            cy.get("p-fileupload[class='p-element'] span[class='p-ripple p-element p-button p-component p-fileupload-choose p-button-icon-only']").click();
                                            cy.wait(3000);
                                            cy.get("p-fileupload[class='p-element'] input[type='file']").eq(0).selectFile('cypress/fixtures/vr-glasses.jpg',{force: true});
                                            cy.wait(5000);  // Wait for the upload to complete
                                            
                                            cy.get('.p-image-preview-icon').click();
                                            cy.get('.p-image-preview').should('be.visible');
                                            cy.get(':nth-child(5) > .pi').click();
                                            cy.wait(3000);

                    
                                            cy.get('#p-tabpanel-4-label > .p-tabview-title').should('contain.text','Physician').click();
                                            cy.get('.flex > .heading-styling').should('contain.text','Primary Care Physician');
                                            cy.get('#p-tabpanel-4 > .my_scroll_div > :nth-child(2) > :nth-child(1) > .custom-form-label').should('contain.text','Primary Care Physician');
                                            cy.get('#patientPCP').type('Adam Parker').should('have.value','Adam Parker');
                                            cy.get('#p-tabpanel-4 > .my_scroll_div > :nth-child(2) > :nth-child(2) > .custom-form-label').should('contain.text','City');
                                            cy.get('#patientPCPCity').type('texas').should('have.value','texas');
                                            cy.get('#p-tabpanel-4 > .my_scroll_div > :nth-child(2) > :nth-child(3) > .custom-form-label').should('contain.text','State');
                                            cy.get(':nth-child(2) > :nth-child(3) > #patientPCPState').type('Dallas').should('have.value','Dallas');
                                            cy.get('#p-tabpanel-4 > .my_scroll_div > :nth-child(2) > :nth-child(4) > .custom-form-label').should('contain.text','Zip Code');
                                            cy.get(".p-inputtext.p-component.p-element.p-inputtext-sm.ng-dirty.mr-3.ng-untouched.ng-pristine.ng-valid[formcontrolname='patientPCPZip']").type('435335').should('have.value','435335');
                                            cy.get('.mb-4 > :nth-child(1) > .custom-form-label').should('contain.text',"Primary Care Physician's Address");
                                            cy.get('#patientPCPAddress').type('22365 Mountain Pine Dr, New Caney, TX 77357, USA').should('have.value','22365 Mountain Pine Dr, New Caney, TX 77357, USA');
                                            cy.get('.mb-4 > :nth-child(2) > .custom-form-label').should('contain.text',"Primary Care Physician's Address 2");
                                            cy.get('#patientPCPAddress2').type('22365 Mountain Pine Dr, New Caney, TX 77357, USA').should('have.value','22365 Mountain Pine Dr, New Caney, TX 77357, USA');

                                            //Physician Page
                                            cy.get('.mt-2 > .heading-styling').should('contain.text','Speciality Care Physician');
                                            cy.get('.my_scroll_div > .mt-4 > :nth-child(1) > .custom-form-label').should('contain.text','Speciality Care Physician');
                                            cy.get('#patientSCP').type('Marina bate').should('have.value','Marina bate');
                                            cy.get('.mt-4 > :nth-child(2) > .custom-form-label').should('contain.text','City');
                                            cy.get('#patientSCPCity').type('texas').should('have.value','texas');
                                            cy.get('.mt-4 > :nth-child(3) > .custom-form-label').should('contain.text','State');
                                            cy.get('.mt-4 > :nth-child(3) > #patientPCPState').type('Dallas').should('have.value','Dallas');
                                            cy.get('.mt-4 > :nth-child(4) > .custom-form-label').should('contain.text','Zip Code');
                                            cy.get('.mt-4 > :nth-child(4) > .p-inputtext').type('435335').should('have.value','435335');
                                            cy.get('.my_scroll_div > :nth-child(6) > :nth-child(1) > .custom-form-label').should('contain.text',"Speciality Care Physician's Address");
                                            cy.get('#patientSCPAddress').type('22365 Mountain Pine Dr, New Caney, TX 77357, USA').should('have.value','22365 Mountain Pine Dr, New Caney, TX 77357, USA');
                                            cy.get('.my_scroll_div > :nth-child(6) > :nth-child(2) > .custom-form-label').should('contain.text',"Speciality Care Physician's Address 2");
                                            cy.get('#patientSCPAddress2').type('22365 Mountain Pine Dr, New Caney, TX 77357, USA').should('have.value','22365 Mountain Pine Dr, New Caney, TX 77357, USA');

                                            //Covid-19 Page
                                            cy.get('#p-tabpanel-5-label').should('contain.text','COVID-19').click();
                                            cy.get('.mt-2 > :nth-child(1) > p').should('contain.text','Do you have any symptoms?');
                                            
                                    


                                            // Click the 'Yes' radio button
                                            cy.get('.mt-2 > :nth-child(1) > .formgroup-inline > :nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box') // Update selector to target 'Yes'
                                            .click({ force: true })
                                            .then(() => {
                                                // Wait for the page to update
                                                cy.wait(1000); 

                                                // Verify if 'Yes' is checked
                                                cy.get('.mt-2 > :nth-child(1) > .formgroup-inline > :nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box') // Check the 'Yes' button icon
                                                .should('have.class', 'p-radiobutton-box p-highlight') // Check that it has the 'checked' class
                                                .then(($yesChecked) => {
                                                    if ($yesChecked.length > 0) {
                                                    // Yes is checked - verify that additional fields are visible
                                                    cy.get('div.ng-star-inserted > :nth-child(1) > .custom-form-label').should('be.visible');
                                                    cy.get('.mt-3 > .custom-form-label').should('be.visible');
                                                    console.log('Yes is selected: Additional fields are visible.');
                                                    } else {
                                                    // If not, click the 'No' radio button and verify fields are hidden
                                                    cy.get('div.mt-2 > :nth-child(1) > .formgroup-inline > :nth-child(2) > .p-element > .p-radiobutton > .p-radiobutton-box > .p-radiobutton-icon')
                                                        .click({ force: true });
                                                    cy.wait(1000); // Wait to allow for page re-renders
                                                    cy.get('div.ng-star-inserted > :nth-child(1) > .custom-form-label').should('not.be.visible');
                                                    cy.get('.mt-3 > .custom-form-label').should('not.be.visible');
                                                    console.log('No is selected: Additional fields are hidden.');
                                                    }
                                                });
                                            });
                                            cy.get("label[for='Fever']").should('contain.text','Fever');
                                            cy.get("p-checkbox[inputid='Body Aches'] div[class='p-checkbox-box']").click();
                                            cy.get(':nth-child(5) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').should('contain.text','Muscle/Body Aches');
                                            cy.get("p-checkbox[inputid='patientCovidsymptomsRunnyNoseCongestion'] div[class='p-checkbox-box']").click();
                                            cy.get(':nth-child(6) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').should('contain.text','Congestion');
                                            cy.get("p-checkbox[inputid='patientCovidsymptomsOthers'] div[class='p-checkbox-box']").click();
                                            cy.get('div.ng-star-inserted > :nth-child(8) > :nth-child(3) > .p-element > .p-checkbox > .p-checkbox-box').should('contain.text','Others');
                                            cy.get(':nth-child(8) > .custom-field > .custom-form-label').should('contain.text','Briefly Describe Symptoms');
                                            cy.get('.custom-field > #float-input').type('tester reasons');
                                            cy.get(':nth-child(2) > .mb-3').should('contain.text','Are you employed in healthcare with direct patient contact?');
                                            cy.get('.mt-2 > :nth-child(2) > .formgroup-inline > :nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box').click();
                                            cy.get('.mt-2 > :nth-child(3) > p').should('contain.text','Have you tested positive for COVID before, if so what date?');
                                            cy.get(':nth-child(3) > .formgroup-inline > :nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box').click();
                                            cy.get(':nth-child(4) > .p-inputwrapper > .p-calendar > .p-element > .p-button-icon').click();
                                            cy.get('tbody.ng-tns-c53-59 > :nth-child(1) > :nth-child(5) > .p-ripple').click();
                                            cy.get('.pl-2 > .mt-3').should('contain.text','Have you been exposed or had direct contact with someone with CORONAVIRUS?');
                                            cy.get(':nth-child(6) > :nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box').click();
                                            cy.get(':nth-child(7) > .p-inputwrapper > .p-calendar > .p-element > .p-button-icon').click();
                                            cy.get('tbody.ng-tns-c53-60 > :nth-child(1) > :nth-child(5) > .p-ripple').click();
                                            cy.get(':nth-child(7) > .custom-form-label').should('contain.text','Exposure Date');
                                            cy.get('.mt-2 > :nth-child(8)').should('contain.text','Have you traveled outside of the country within the last two weeks?');
                                            cy.get(':nth-child(9) > :nth-child(1) > .p-element > .p-radiobutton > .p-radiobutton-box').click();
                                            cy.get('[style="width: 40%;"] > .p-inputwrapper > .p-calendar > .p-element > .p-button-icon').click();
                                            cy.get('tbody.ng-tns-c53-61 > :nth-child(1) > :nth-child(5) > .p-ripple').click();
                                            cy.get('#patientOutsideTravelLocation').type('texas').should('have.value','texas');
                                            cy.get('#patientOutsideTravelDuration').type('2 years').should('have.value','2 years');
                                            cy.get('#p-tabpanel-5-label > .p-tabview-title').should('contain.text','Guarantor').click();
                                            cy.get('[style="font-size: 13px;"] > .mb-3 > :nth-child(1) > .custom-form-label').should('contain.text','Is the patient Minor?');
                                            cy.get('[style="font-size: 13px;"] > .mb-3 > :nth-child(1) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_20_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('[style="font-size: 13px;"] > .mb-3 > :nth-child(2) > .custom-form-label').should('contain.text','Who is the Guarantor?');
                                            cy.get(':nth-child(2) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_21_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            cy.get('[style="font-size: 13px;"] > :nth-child(2) > :nth-child(1) > .custom-form-label').should('contain.text','First Name');
                                            cy.get('#patientGurantorFirstName').should('have.value','Awaiss');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(2) > :nth-child(2) > .custom-form-label').should('contain.text','Last Name');
                                            cy.get('#patientGurantorLastName').should('have.value','Automation Thirty two');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(2) > :nth-child(3) > .custom-form-label').should('contain.text','DOB')
                                            cy.get('#patientGurantorDob').should('have.value','06/05/2025');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(2) > :nth-child(4) > .custom-form-label').should('contain.text','Phone No');
                                            cy.get('#patientGurantorPhone').should('have.value','(423) 423-4234');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(2) > :nth-child(5) > .custom-form-label').should('contain.text','SSN');
                                            cy.get('#patientGurantorSSN').should('have.value','453-45-3453') ;
                                            cy.get('[style="font-size: 13px;"] > :nth-child(3) > :nth-child(1) > .custom-form-label').should('contain.text','Employer Name');
                                            cy.get('#patientGurantorEmployer').should('have.value','FnA');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(3) > :nth-child(2) > .custom-form-label').should('contain.text','Phone No');
                                            cy.get('#patientGurantorEmployerNumber').should('have.value','(523) 452-3452');
                                            cy.get('.my-4 > .heading-styling').should('contain.text','Guarantor Employer Address');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(5) > :nth-child(1) > .custom-form-label').should('contain.text','City');
                                            cy.get('#gurantorEmployerCity').type('New York').should('have.value','New York');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(5) > :nth-child(2) > .custom-form-label').should('contain.text','State');
                                            cy.get('#gurantorEmployerState').type('Dallas').should('have.value','Dallas');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(5) > :nth-child(3) > .custom-form-label').should('contain.text','Zip Code');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(5) > :nth-child(3) > .p-inputtext').type('34555').should('have.value','34555');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(6) > :nth-child(1) > .custom-form-label').should('contain.text','Employer Address 1');
                                            cy.get('#gurantorEmployerAddress').type('tester').should('have.value','tester');
                                            cy.get('[style="font-size: 13px;"] > :nth-child(6) > :nth-child(2) > .custom-form-label').should('contain.text','Employer Address 2');
                                            cy.get('#gurantorEmployerAddress2').type('tester2').should('have.value','tester2');
                                            cy.get('#p-tabpanel-6-label > .p-tabview-title').should('contain.text','Insurance').click();
                                            cy.get('[styleclass="p-button-sm button-margin"] > .p-ripple > .p-button-label').click();
                                            cy.get('.mb-2 > .heading-styling').should('contain.text','Insurance');
                                            cy.get('.p-dialog-content > :nth-child(2) > :nth-child(1) > .custom-form-label').should('contain.text','Priority');
                                            cy.get('#priority > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_23_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                
                                            cy.get('.p-dialog-content > :nth-child(2) > :nth-child(2) > .custom-form-label').should('contain.text','Types');
                                            cy.get('#types > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_24_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            cy.get(':nth-child(2) > .col-6 > .custom-form-label').should('contain.text','Payers');
                                            cy.get('.p-autocomplete-input').type('others');
                                            cy.wait(2000);
                                            // Scroll and select the "Others" option from the list
                                            cy.get(':nth-child(5) > .ng-tns-c50-22') // Replace with the actual selector for the dropdown options container
                                            .contains('Others')
                                            .scrollIntoView()
                                            .should('be.visible')
                                            .click();
                                            cy.get('.p-dialog-content > :nth-child(3) > :nth-child(1) > .custom-form-label').should('contain.text','Member ID');
                                            cy.get('#memberPolicy').type('3456345634563').should('have.value','3456345634563');
                                            cy.get('.p-dialog-content > :nth-child(3) > :nth-child(2) > .custom-form-label').should('contain.text','Group');
                                            cy.get('#group').type('T3454433').should('have.value','T3454433');
                                            cy.get(':nth-child(3) > .col-6 > .custom-form-label').should('contain.text','Other Insurance');
                                            cy.get('#otherInsurance').type('Foxtrot').should('have.value','Foxtrot');
                                            cy.get('.p-dialog-content > :nth-child(3) > :nth-child(3) > .custom-form-label').should('contain.text','Relation');
                                            cy.get('#relation > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                            cy.get('#pr_id_26_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                            // cy.get('#pr_id_26_label').should('have.value','Self');
                                            
                                             // Verify that the autofetched fields contain the expected values
                                             cy.get('#firstname').should('have.value', 'Awaiss'); // Replace with actual selector and value
                                             cy.get('#lastname').should('have.value', 'Automation Thirty two'); // Replace with actual selector and value
                                             cy.get('#subscriberDob').should('have.value', '06/05/2025'); // Replace with actual selector and value
                                            //  cy.get('#pr_id_27_label').should('have.value', 'Male');
                                             cy.get('#address').should('have.value', '22365 Mountain Pine Dr'); // Replace with actual selector and value
                                             cy.get('#city').should('have.value', 'New Caney'); // Replace with actual selector and value
                                             cy.get('#subscriberState').should('have.value', 'TX'); // Replace with actual selector and value
                                             cy.get(':nth-child(7) > :nth-child(1) > .p-inputtext').should('have.value', '77357'); // Replace with actual selector and value
                                             cy.get('#subscriberPhone').should('have.value', '(423) 423-4234'); // Replace with actual selector and value
                                             cy.get('#subscriberSSN').should('have.value', '453-45-3453'); // Replace with actual selector and value
                                             cy.get('#subscriberOccupation').should('have.value', 'SQA Engineer'); // Replace with actual selector and value

                                             cy.get(':nth-child(8) > .heading-styling').should('contain.text','Employer Information');
                                             cy.get('#subscriberEmpName').should('have.value','FnA')
                                             cy.get('.custom-form-grid > [style="width: 50%;"] > .custom-form-label').should('contain.text','Address');
                                             cy.get('#subscriberEmpAddress').type('Admas lane oak street');
                                             cy.get('.p-dialog-content > .custom-form-grid > [style="width: 15%;"] > .custom-form-label').should('contain.text','City');
                                             cy.get('#subscriberEmpCity').type('Texas').should('have.value','Texas');
                                             cy.get('.mr-0 > .custom-form-label').should('contain.text','State');
                                             cy.get('#subscriberEmpState').type('Dallas').should('have.value','Dallas');
                                             cy.get('.p-dialog-content > :nth-child(10) > :nth-child(1) > .custom-form-label').should('contain.text','Zip Code');
                                             cy.get(':nth-child(10) > :nth-child(1) > .p-inputtext').type('46454').should('have.value','46454');
                                             cy.get('.p-dialog-content > :nth-child(10) > :nth-child(2) > .custom-form-label').should('contain.text','Phone')
                                             cy.get('#subscriberEmpPhone').should('have.value','(523) 452-3452');
                                             cy.get('.p-dialog-content > :nth-child(10) > :nth-child(3) > .custom-form-label').should('contain.text','Effective Date');
                                             cy.get(':nth-child(10) > :nth-child(3) > .p-inputwrapper > .customCalendarIconStyleValid > .p-element > .p-button-icon').click();
                                             cy.get('tbody.ng-tns-c53-24 > :nth-child(1) > :nth-child(5) > .p-ripple').click();
                                             cy.get(':nth-child(10) > :nth-child(4) > .custom-form-label').should('contain.text','Termination Date');
                                             cy.get(':nth-child(10) > :nth-child(4) > .p-inputwrapper > .customCalendarIconStyleValid > .p-element > .p-button-icon').click();
                                             cy.get('tbody.ng-tns-c53-25 > :nth-child(1) > :nth-child(6) > .p-ripple').click();
                                             cy.get('.justify-content-between > :nth-child(1) > .ml-2').should('contain.text','Active Insurance');
                                             cy.get('[label="Save"] > .p-ripple > .p-button-label').click();
                                             cy.get('#p-tabpanel-7-label > .p-tabview-title').should('contain.text','Emergency Contact').click();
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(1) > :nth-child(1) > .custom-form-label').should('contain.text','First Name');
                                             cy.get('#emergencyFirstName').type('Adam').should('have.value','Adam');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(1) > :nth-child(2) > .custom-form-label').should('contain.text','Last Name');
                                             cy.get('#emergencyLastName').type('Benz').should('have.value','Benz');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(1) > :nth-child(3) > .custom-form-label').should('contain.text','Phone No');
                                             cy.get('#emergencyPhone').type('(756) 767-5675').should('have.value','(756) 767-5675');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(1) > :nth-child(4) > .custom-form-label').should('contain.text','Relationship with Patient');
                                             cy.get('#patientEmergencyRelation').type('Stepmother').should('have.value','Stepmother');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(1) > :nth-child(5) > .custom-form-label').should('contain.text','Leave Message');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(1) > :nth-child(5) > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon').click();
                                             cy.get('#pr_id_30_list > :nth-child(1) > .p-ripple > .ng-star-inserted').click();
                                             cy.get(':nth-child(2) > [style="width: calc(30% + 1rem);"] > .custom-form-label').should('contain.text','Address');
                                             cy.get('#patientEmergencyAddress').type('22365 Mountain Pine Dr, New Caney, TX 77357, USA').should('have.value','22365 Mountain Pine Dr, New Caney, TX 77357, USA');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(2) > :nth-child(2) > .custom-form-label').should('contain.text','City');
                                             cy.get('#patientEmergencyCity').type('texas').should('have.value','texas');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(2) > :nth-child(3) > .custom-form-label').should('contain.text','State');
                                             cy.get('#patientEmergencyState').type('Dallas').should('have.value','Dallas');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(3) > :nth-child(1) > .custom-form-label').should('contain.text','Zip Code');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(3) > :nth-child(1) > .p-inputtext').type('56755').should('have.value','56755');
                                             cy.get('[style="color: #0f0e01;"] > :nth-child(3) > :nth-child(2) > .custom-form-label').should('contain.text','Country');
                                             cy.get('#patientEmergencyCountry').type('USA').should('have.value','USA');
                                            
                                             cy.get('#p-tabpanel-8-label > .p-tabview-title').should('contain.text','Marketing').click();
                                             cy.get(':nth-child(2) > .col-9 > .field-radiobutton > .p-element > .p-checkbox > .p-checkbox-box').click();
                                                cy.get(':nth-child(2) > .col-9 > .field-radiobutton > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                             
                                             cy.get('[inputid="Google Search"] > .p-radiobutton-label').should('contain.text','Google Search');
                                             cy.get('[inputid="Website"] > .p-radiobutton-label').should('contain.text','Website');
                                             cy.get('[inputid="Online Review"] > .p-radiobutton-label').should('contain.text','Online Review');
                                             cy.get('[inputid="Map Search"] > .p-radiobutton-label').should('contain.text','Map Search');
                                             cy.get('[inputid="Google Search"] > .p-radiobutton > .p-radiobutton-box').click().should('have.class', 'p-radiobutton-box p-highlight');
                                            cy.get(':nth-child(3) > .col-9 > .field-radiobutton > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(3) > .col-9 > .field-radiobutton > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get('[inputid="Facebook"] > .p-radiobutton-label').should('contain.text','Facebook');
                                            cy.get('[inputid="Instagram"] > .p-radiobutton-label').should('contain.text','Instagram');
                                            cy.get('[inputid="TikTok"] > .p-radiobutton-label').should('contain.text','TikTok');
                                            cy.get('[inputid="Facebook"] > .p-radiobutton > .p-radiobutton-box').click().should('have.class', 'p-radiobutton-box p-highlight');
                                            cy.get('.col-9 > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get('.col-9 > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get('[inputid="fireEmsLawEnforcement"] > .p-radiobutton-label').should('contain.text','Fire / EMS / Law Enforcement');
                                            cy.get('[inputid="School Employee"] > .p-radiobutton-label').should('contain.text','School Employee');
                                            // cy.get('[inputid="collegeStudent"] > .p-radiobutton-label').should('contain.text','City Employee ');
                                            cy.get('[inputid="fireEmsLawEnforcement"] > .p-radiobutton > .p-radiobutton-box').click().should('have.class', 'p-radiobutton-box p-highlight');
                                            cy.get(':nth-child(5) > .col-6 > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(5) > .col-6 > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get(':nth-child(5) > .col-6 > :nth-child(2) > #float-input').type('Advanced Urgent Care').should('have.value','Advanced Urgent Care');
                                            cy.get(':nth-child(6) > .col-6 > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(6) > .col-6 > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get(':nth-child(6) > .col-6 > :nth-child(2) > #float-input').type('Technical Physician').should('have.value','Technical Physician');
                                            cy.get(':nth-child(7) > .col-6 > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(7) > .col-6 > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get(':nth-child(7) > .col-6 > :nth-child(2) > #float-input').type('CMD').should('have.value','CMD');
                                            cy.get(':nth-child(1) > :nth-child(8) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(1) > :nth-child(8) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');  
                                            cy.get(':nth-child(8) > :nth-child(1) > .p-element > .p-checkbox-label').should('contain.text','Community/Marketing Event');
                                            cy.get(':nth-child(1) > :nth-child(8) > :nth-child(2) > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(1) > :nth-child(8) > :nth-child(2) > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get(':nth-child(8) > :nth-child(2) > .p-element > .p-checkbox-label').should('contain.text','Family/Friend');
                                            cy.get(':nth-child(1) > :nth-child(8) > :nth-child(3) > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(1) > :nth-child(8) > :nth-child(3) > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get(':nth-child(3) > .p-element > .p-checkbox-label').should('contain.text','Billboard');
                                            cy.get(':nth-child(9) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(9) > :nth-child(1) > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get(':nth-child(9) > :nth-child(1) > .p-element > .p-checkbox-label').should('contain.text','Drive By/Building Sign');
                                            cy.get(':nth-child(9) > :nth-child(2) > .p-element > .p-checkbox > .p-checkbox-box').click();
                                            cy.get(':nth-child(9) > :nth-child(2) > .p-element > .p-checkbox > .p-checkbox-box').should('have.class', 'p-checkbox-box p-highlight');
                                            cy.get(':nth-child(9) > :nth-child(2) > .p-element > .p-checkbox-label').should('contain.text','Brochure');
                                            cy.get('[styleclass="p-button-sm p-button-raised"] > .p-ripple > .p-button-label').click();
                                            cy.get('.p-toast-detail').should('have.text', 'Patient Registration is successfully created');

                                            // cy.get('[styleclass="p-button-sm p-button-raised"] > .p-ripple > .p-button-label').should('contain.text', 'Do you want to take signature now?');
                                            cy.get('[styleclass="p-button-sm confirm-button-dialog"] > .p-ripple > .p-button-label').click();

                                            // Verify the text in the document signing section
                                            cy.get('.flex > :nth-child(1) > .claimViewCustomButton > .p-ripple > .p-button-label').should('contain.text', 'Add Signature').click();
                                            // Verify the presence of the canvas element for signature
                                            cy.get('.ng-tns-c57-65.ng-star-inserted > .heading-styling').should('contain.text', 'Sign Documentl');
                                            // Check that the canvas is visiblel
                                            cy.get('canvas').should('be.visible');

                                            // Simulate drawing a signature on the canvas
                                            cy.get('canvas').then(canvas => {
                                                const canvasWidth = canvas.width();
                                                const canvasHeight = canvas.height();
                                                
                                                // Set up starting point and drawing movements
                                                cy.wrap(canvas)
                                                    .trigger('mousedown', { clientX: canvasWidth * 0.3, clientY: canvasHeight * 0.5 })
                                                    .trigger('mousemove', { clientX: canvasWidth * 0.5, clientY: canvasHeight * 0.7 })
                                                    .trigger('mousemove', { clientX: canvasWidth * 0.7, clientY: canvasHeight * 0.5 })
                                                    .trigger('mouseup');
                                            });

                            


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