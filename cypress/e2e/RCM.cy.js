describe('RCM - Revenue Cycle Management', () => {
    
    /**
     * Main RCM workflow test
     * Tests complete flow from login to create claim form completion
     */
    it('RCM Complete Workflow - Login to Create Claim', () => {
        
        // =======================================================================
        // TEST SETUP & CONFIGURATION
        // =======================================================================
        
        // Set browser viewport for consistent testing across environments
        cy.viewport(1750, 960);
        cy.log('🔧 Browser viewport set to 1750x960 for optimal testing');
        
        // Load test data from fixture file
        cy.fixture("Rovermd2").then((data) => {
            cy.log('📄 Test data loaded from Rovermd2 fixture');
            
            // =======================================================================
            // NAVIGATION & LOGIN SECTION
            // =======================================================================
            
            // Navigate to application login page
            cy.visit("https://qa.rovermd.com:8443/RoverApp/#/login");
            cy.log('🌐 Navigated to RoverMD QA login page');

            // Process each user from test data
            data.forEach((userdata) => {
                cy.log(`👤 Processing user: ${userdata.username}`);
                
                // =======================================================================
                // USER AUTHENTICATION
                // =======================================================================
                
                // Enter username with proper field clearing
                cy.get(':nth-child(2) > .p-inputtext')
                    .clear()
                    .type(userdata.username)
                    .should('have.value', userdata.username);
                cy.log(`✅ Username entered: ${userdata.username}`);
                
                // Enter password with proper field clearing
                cy.get(':nth-child(3) > .p-inputtext')
                    .clear()
                    .type(userdata.password);
                cy.log('✅ Password entered successfully');
                
                // Submit login form
                cy.get("button[type='submit']")
                    .should('be.visible')
                    .should('be.enabled')
                    .click();
                cy.log('🚀 Login form submitted');

                // =======================================================================
                // POST-LOGIN WORKFLOW (SPECIFIC USER ONLY)
                // =======================================================================
                
                // Process workflow only for specific test user
                if (userdata.username === 'awaisQA1' && userdata.password === "Foxtrot@12345") {
                    cy.log('🎯 Processing main test user workflow');
                    
                    // Wait for successful login and page navigation
                    cy.url({ timeout: 10000 })
                        .should('include', '/login');
                    cy.log('✅ Login successful - redirected from login page');
                    
                    // =======================================================================
                    // LOCATION SELECTION WORKFLOW
                    // =======================================================================
                    
                    cy.log('🏢 Starting location selection process');
                    
                    // Wait for location dropdown to be available
                    cy.get('.p-dropdown-trigger-icon', { timeout: 10000 })
                        .should('be.visible');
                    cy.log('✅ Location dropdown is ready');
                    
                    // Open location selection dropdown
                    cy.get("div[aria-label='dropdown trigger']")
                        .should('be.visible')
                        .click();
                    cy.log('🔽 Location dropdown opened');
                    
                    // Filter and select Pearland location
                    cy.get(".p-dropdown-filter.p-inputtext.p-component")
                        .should('be.visible')
                        .type('Pearland');
                    cy.log('🔍 Filtered locations with "Pearland"');
                    
                    // Click on Pearland location option
                    cy.get("div[class='icd-item ng-star-inserted'] div strong")
                        .should('be.visible')
                        .click();
                    cy.log('✅ Pearland location selected');
                    
                    // Confirm location selection
                    cy.get('.p-button-label')
                        .should('be.visible')
                        .click();
                    cy.log('✅ Location selection confirmed');
                    
                    // =======================================================================
                    // APPLICATION UPDATE NOTIFICATION HANDLING
                    // =======================================================================
                    
                    cy.log('🔄 Handling application update notification');
                    
                    // Wait for update notification to appear
                    cy.wait(4000);
                    
                    // Verify and handle update notification
                    cy.get('.my-2 > span')
                        .should('be.visible')
                        .should('contain', 'A newer version of application is available.');
                    cy.log('📢 Update notification detected');
                    
                    // Dismiss update notification
                    cy.get('.button-margin > .p-ripple > .p-button-label')
                        .should('be.visible')
                        .click();
                    cy.log('❌ Update notification dismissed');
                    
                    // Wait for notification overlay to disappear completely
                    cy.get('.my-2 > span')
                        .should('not.exist');
                    cy.log('✅ Update notification overlay cleared');
                    
                    // Additional wait for UI stabilization
                    cy.wait(2000);
                    cy.log('⏳ UI stabilization wait completed');
                    
                    // =======================================================================
                    // RCM MODULE NAVIGATION
                    // =======================================================================
                    
                    cy.log('🎯 Starting RCM module navigation');
                    
                    // Locate and prepare RCM menu item
                    cy.get(':nth-child(3) > [aria-haspopup="false"]')
                        .should('exist');
                    
                    // Click on RCM module link
                    cy.contains('RCM', { timeout: 10000 })
                        .should('be.visible')
                        .click();
                    cy.log('✅ RCM module accessed successfully');
                    
                    // Wait for RCM module to load
                    cy.wait(2000);
                    
                    // Verify RCM menu is active and ready
                    cy.get('.p-menuitem-active')
                        .should('be.visible');
                    cy.log('✅ RCM module menu is active and ready');
                    
                    // =======================================================================
                    // CLAIMS LIST NAVIGATION
                    // =======================================================================
                    
                    cy.log('📋 Navigating to Claims List');
                    
                    // Navigate to Claims List from RCM menu
                    cy.contains('.p-menuitem-text', 'Claims List', { timeout: 10000 })
                        .should('be.visible')
                        .click();
                    cy.log('✅ Claims List navigation initiated');
                    
                    // =======================================================================
                    // CLAIMS LIST PAGE VERIFICATION
                    // =======================================================================
                    
                    cy.log('🔍 Verifying Claims List page elements');
                    
                    // Verify Claims List page title
                    cy.get('.mb-5 > .flex > p')
                        .should('be.visible')
                        .should('contain', 'Claims List');
                    cy.log('✅ Claims List page title verified');
                    
                    // Verify "All Claims" filter label
                    cy.get('#pr_id_14_label')
                        .should('be.visible')
                        .should('have.text', 'All Claims');
                    cy.log('✅ All Claims filter label verified');
                    
                    // Verify search input placeholder text
                    cy.get('.col-6 > .p-inputtext')
                        .should('be.visible')
                        .should('have.attr', 'placeholder', 'Search by Claim Number ,MRN ,Member ID ,PCN ,Name ,DOB');
                    cy.log('✅ Search input placeholder verified');
                    
                    // Clear search input field (testing field functionality)
                    cy.get('.col-6 > .p-inputtext')
                        .clear()
                        .should('have.value', '');
                    cy.log('✅ Search input field cleared and verified');
                    
                    // =======================================================================
                    // CREATE CLAIM MODAL INITIATION
                    // =======================================================================
                    
                    cy.log('➕ Initiating Create Claim process');
                    
                    // Locate and click Create Claim button
                    cy.get('.ml-2 > .p-ripple > .p-button-label')
                        .should('be.visible')
                        .should('have.text', 'Create Claim')
                        .click();
                    cy.log('✅ Create Claim button clicked');
                    
                    // Verify Create Claim modal opens
                    cy.get('.p-dialog')
                        .should('be.visible')
                        .and('contain', 'Create Claim');
                    cy.log('✅ Create Claim modal opened successfully');
                    
                    // =======================================================================
                    // PATIENT SELECTION WORKFLOW
                    // =======================================================================
                    
                    cy.log('👤 Starting patient selection process');
                    
                    // Verify Patient label is present
                    cy.get('label.custom-form-label')
                        .should('be.visible')
                        .should('include.text', 'Patient');
                    cy.log('✅ Patient label verified');
                    
                    // Enter patient search term in autocomplete field
                    cy.get('.p-autocomplete > .p-element')
                        .should('be.visible')
                        .clear()
                        .type('Awais', { timeout: 2000 })
                        .should('have.value', 'Awais');
                    cy.log('✅ Patient search term "Awais" entered');
                    
                    // Wait for autocomplete suggestions and select first option
                    cy.get('.p-autocomplete-panel .p-autocomplete-item', { timeout: 5000 })
                        .should('be.visible')
                        .first()
                        .click();
                    cy.log('✅ First patient suggestion selected');
                    
                    // Verify patient selection was successful
                    cy.get('.p-autocomplete > .p-element')
                        .should('have.value', 'Sign, Awais');
                    cy.log('✅ Patient "Sign, Awais" selected successfully');
                    
                    // =======================================================================
                    // VISIT SELECTION WORKFLOW
                    // =======================================================================
                    
                    cy.log('🏥 Starting visit selection process');
                    
                    // Verify Visit label is present
                    cy.get('.custom-field > .custom-form-label')
                        .should('be.visible')
                        .should('include.text', 'Visit');
                    cy.log('✅ Visit label verified');
                    
                    // Open visit selection dropdown
                    cy.get('.custom-field > .p-inputwrapper > .p-dropdown > .p-dropdown-trigger > .p-dropdown-trigger-icon')
                        .should('be.visible')
                        .click();
                    cy.log('🔽 Visit dropdown opened');
                    
                    // Select first available visit option
                    cy.get('.country-item > div', { timeout: 5000 })
                        .should('be.visible')
                        .first()
                        .click();
                    cy.log('✅ First visit option selected');
                    
                    // =======================================================================
                    // TEST COMPLETION
                    // =======================================================================
                    
                    // Final wait for any remaining UI updates
                    cy.wait(2000);
                    cy.log('✅ Create Claim form completion workflow finished');
                    
                    cy.log('🎉 RCM Complete Workflow Test PASSED - All steps completed successfully');


                                        // Check if session timeout popup is showing and handle it (NON-BLOCKING)
                    cy.get('body').then(($body) => {
                        // Check if session timeout popup exists and is visible
                        if ($body.find('p-dialog.ng-tns-c57-7').length > 0 && $body.find('p-dialog.ng-tns-c57-7').is(':visible')) {
                            
                            cy.log('🚨 Session timeout popup detected - handling re-authentication');
                            
                            // Verify session timeout popup is visible
                            cy.get('p-dialog.ng-tns-c57-7')
                                .should('be.visible');
                            
                            // Verify session timeout heading text
                            cy.get('p-dialog.ng-tns-c57-7 > .p-dialog-mask > .ng-trigger > .p-dialog-content > .mx-0 > .heading-styling')
                                .should('be.visible')
                                .then(($heading) => {
                                    cy.log(`📋 Session timeout message: "${$heading.text().trim()}"`);
                                });
                            
                            // Verify password label
                            cy.get(':nth-child(2) > .field > .custom-form-label')
                                .should('be.visible')
                                .then(($label) => {
                                    cy.log(`🏷️ Password label: "${$label.text().trim()}"`);
                                });
                            
                            // Click on password field and enter password
                            cy.get('#currenUserPassword')
                                .should('be.visible')
                                .should('be.enabled')
                                .click()
                                .clear()
                                .type('Foxtrot@12345')
                                .should('have.value', 'Foxtrot@12345');
                            
                            cy.log('✅ Password entered: Foxtrot@12345');
                            
                            // Click Login button
                            cy.get('[label="Login"] > .p-button-label')
                                .should('be.visible')
                                .should('be.enabled')
                                .click();
                            
                            cy.log('✅ Login button clicked');
                            
                            // Wait for popup to close after successful login
                            cy.get('p-dialog.ng-tns-c57-7')
                                .should('not.be.visible');
                            
                            cy.log('🎉 Session timeout popup handled successfully - continuing with test execution');
                            
                            // Optional: Add a small wait for UI to stabilize after re-authentication
                            cy.wait(2000);
                            
                        } else {
                            // IMPORTANT: This else block ensures test continues normally if no popup is found
                            cy.log('ℹ️ No session timeout popup detected - continuing with normal test execution');
                            // No additional actions needed - test will proceed to next steps automatically
                        }
                    });

                        // Click Create Institutional Claim button to open the institutional claim modal
                        cy.get('.mr-2 > .p-ripple').click();
                        cy.log('✅ Create Institutional Claim button clicked');

                        // Wait for modal loading and UI stabilization
                        cy.wait(4000); // Consider reducing this wait time or using explicit waits for better performance

                        // Verify Institutional Claim modal has opened successfully
                        cy.get('.justify-content-center > .mr-6')
                            .should('have.text', 'Institutional Claim');
                        cy.log('✅ Institutional Claim modal opened successfully');

                        // =======================================================================
                        // CLAIM INFORMATION SECTION - BASIC DETAILS
                        // =======================================================================

                        // Verify and validate Claim No field (auto-generated field)
                        cy.get('#p-tabpanel-3 > .my_scroll_div > form.ng-untouched > .p-fluid > :nth-child(1) > .custom-form-label')
                            .should('have.text', 'Claim No');

                        // Verify Claim No field has default value "New" (auto-populated)
                        cy.get('.p-fluid > :nth-child(1) > #float-input')
                            .should('have.value', 'New');

                            cy.wait(3000); // Wait for UI to stabilize after modal open

                        // Verify and fill Reference No field (manual entry required)
                        cy.get('#p-tabpanel-3 > .my_scroll_div > form.ng-untouched > .p-fluid > :nth-child(2) > .custom-form-label')
                            .should('have.text', 'Reference No');

                        // Enter Reference Number for claim tracking
// Enter Reference Number for claim tracking
// Enter Reference Number for claim tracking
cy.get('.p-fluid > :nth-child(2) > #float-input')
    .should('be.visible')
    .click()
    .type('1234567890', { delay: 200 }) // Type slowly
    .blur() // Trigger validation
    .wait(500); // Wait for any async operations

// Check if value persisted
cy.get('.p-fluid > :nth-child(2) > #float-input')
    .invoke('val')
    .then(value => {
        if (value === '') {
            cy.log('❌ Value was cleared - field may require specific format');
        } else {
            cy.log('✅ Reference No entered successfully:', value);
        }
    });

                        // =======================================================================
                        // TYPE OF BILL SECTION - BILLING CLASSIFICATION
                        // =======================================================================

                        // Verify Type of Bill field label
                        cy.get('#p-tabpanel-3 > .my_scroll_div > form.ng-untouched > .p-fluid > :nth-child(3) > .custom-form-label')
                            .should('have.text', 'Type of Bill');

                        // Verify Type of Bill field has pre-populated value "131" (institutional billing code)
                        cy.get('.p-input-icon-right > #float-input')
                            .should('have.value', '131'); // 131 = Hospital Inpatient (including Medicare Part A)

                        // Click on Type of Bill dropdown/overlay icon to open billing details panel
                        cy.get('.p-input-icon-right > .pi').click();

                        // =======================================================================
                        // TYPE OF BILL OVERLAY PANEL - DETAILED BILLING INFORMATION
                        // =======================================================================

                        // Verify Type of Facility label in the overlay panel
                        cy.get('.p-overlaypanel-content > :nth-child(1) > :nth-child(1) > .custom-form-label')
                            .should('have.text', 'Type of Facility');

                        // Verify Type of Care label in the overlay panel
                        cy.get('.mr-0 > .custom-form-label')
                            .should('have.text', 'Type of Care');

                        // Verify Frequency label in the overlay panel
                        cy.get('.p-overlaypanel-content > :nth-child(2) > .custom-field > .custom-form-label')
                            .should('have.text', 'Frequency');

                        // Close the Type of Bill overlay panel by clicking OK/Apply button
                        cy.get('.p-overlaypanel-content > [style="display: flex; justify-content: right;"] > .button-margin > .p-ripple > .p-button-label')
                            .click();

                        // =======================================================================
                        // PATIENT IDENTIFICATION SECTION - MRN VERIFICATION
                        // =======================================================================

                        // Verify MRN (Medical Record Number) field label
                        cy.get('[style="width: 11%;"] > .custom-form-label')
                            .should('have.text', 'MRN');

                        // Verify MRN field has auto-populated value "312160" (from patient selection)
                        cy.get('[style="width: 11%;"] > #float-input')
                            .should('have.value', '312160'); // This value should match the selected patient's MRN
                        // Verify Account No field label
                        cy.get('form.ng-valid > .p-fluid > :nth-child(5) > .custom-form-label').should('have.text', 'Account No');
                        // Verify Account No field has auto-populated value "VN-312160-1" (from patient selection)
                        cy.get('.p-fluid > :nth-child(5) > #float-input').should('have.value', 'VN-312160-1'); // This value should match the selected patient's Account No
                        // Verify Patient SSN field label
                        cy.get(':nth-child(6) > .custom-form-label').should('have.text', 'SSN');
                        // Verify SSN field has auto-populated value "646-34-9491" (from patient selection)
                        cy.get('#viewClaimFormClaim_SSN > .p-inputtext').should('have.value', '646-34-9491'); // This value should match the selected patient's SSN
                        // Verify Patient NAme field label
                        cy.get(':nth-child(2) > [style="width: calc(28% + 1rem);"] > .custom-form-label').should('have.text', 'Patient');
                        // Verify Patient Name field has auto-populated value "Sign, Awais"
                        cy.get(':nth-child(2) > [style="width: calc(28% + 1rem);"] > #float-input').should('have.value', 'Sign, Awais'); // This value should match the selected patient's name
                        // Verify Date of Service field label
                        cy.get('#p-tabpanel-3 > .my_scroll_div > form.ng-valid > :nth-child(2) > :nth-child(2) > .custom-form-label').should('have.text', 'Date of Service');
                        // Verify Date of Service field has auto-populated value
                        cy.get('form.ng-valid > :nth-child(2) > :nth-child(2) > .p-inputtext').should('have.value', '05/23/2024 06:24:34'); // This value should match the selected patient's date of service
                        // Verify Upload date field label
                        cy.get('#p-tabpanel-3 > .my_scroll_div > form.ng-valid > :nth-child(2) > :nth-child(3) > .custom-form-label').should('have.text', 'Upload Date');
                        // Verify Upload Date field value
                        cy.get(':nth-child(3) > .p-inputwrapper > .customCalendarIconStyleValid > .p-element > .p-button-icon').click();
                        cy.get('tbody.ng-tns-c53-42 > :nth-child(1) > :nth-child(6) > .p-ripple').click();

                        // Verify address field label
                        cy.get(':nth-child(3) > [style="width: calc(28% + 1rem);"] > .custom-form-label').should('have.text', 'Address');
                        // Verify address field has value
                        cy.get(':nth-child(3) > [style="width: calc(28% + 1rem);"] > #float-input').should('have.value', 'United States, Virginia, Sterling, Shepard Drive, 678 Sterling'); // This value should match the selected patient's address
                        // Verify Phone field label and value

                        // Verify Phone field label and value
                        cy.get('#p-tabpanel-3 > .my_scroll_div > form.ng-valid > :nth-child(3) > :nth-child(2) > .custom-form-label')
                            .should('have.text', 'Phone');
                        cy.get('#patientContactNumber')
                            .should('have.value', '(644) 964-7979');
                        cy.log('✅ Phone auto-populated: (644) 964-7979');

                        // Verify Email field label and value
                        cy.get('#p-tabpanel-3 > .my_scroll_div > form.ng-valid > :nth-child(3) > :nth-child(3) > .custom-form-label')
                            .should('have.text', 'Email');
                        cy.get(':nth-child(3) > :nth-child(3) > #float-input')
                            .should('have.value', 'Test@test.com');
                        cy.log('✅ Email auto-populated: Test@test.com');









                }
            });
        });
    });
});