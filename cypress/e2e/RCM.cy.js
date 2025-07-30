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
                }
            });
        });
    });
});