# Implementation Plan: WhatsApp Sales & Inventory Tracker

## Overview

This implementation plan breaks down the WhatsApp Sales & Inventory Tracker into sequential, executable tasks. The system is a multi-tenant Node.js application that enables shop owners to manage inventory and track sales through WhatsApp text commands. Implementation follows a bottom-up approach: database layer → command parsing → command handlers → webhook integration → scheduling → deployment preparation.

## Tasks

- [x] 1. Project setup and configuration
  - Initialize Node.js project with package.json
  - Install dependencies: express, sqlite3, twilio, node-cron, dotenv
  - Create .env file with Twilio credentials placeholders
  - Create .gitignore to exclude node_modules, .env, and database.sqlite
  - Set up basic project structure (index.js, db.js)
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 2. Implement database layer (db.js)
  - [x] 2.1 Create database initialization and schema
    - Write initializeDatabase() function to create shops, inventory, and sales tables
    - Implement UNIQUE constraint on (shop_phone, product_name) in inventory table
    - Add foreign key constraints for referential integrity
    - Use async/await with promise-based SQLite wrapper
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.7_
  
  - [x] 2.2 Implement shop management helper functions
    - Write getShop(shopPhone) to retrieve shop record
    - Write createShop(shopPhone) to insert new shop with timestamp
    - Write getAllShops() to retrieve all shops for daily notifications
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3_
  
  - [x] 2.3 Implement inventory helper functions
    - Write getProduct(shopPhone, productName) with shop_phone filtering
    - Write getAllProducts(shopPhone) to retrieve all products for a shop
    - Write addProduct(shopPhone, productName, quantity) with duplicate checking
    - Write updateStock(shopPhone, productName, newQuantity) for stock updates
    - Ensure all queries filter by shop_phone for data isolation
    - _Requirements: 1.3, 1.4, 1.5, 5.2, 5.3, 5.4, 6.1_
  
  - [x] 2.4 Implement sales helper functions
    - Write recordSale(shopPhone, productName, quantity, price) to insert sale record
    - Write getLastSale(shopPhone) to retrieve most recent sale for undo
    - Write deleteSale(saleId) to remove sale record
    - Write getDailyRevenue(shopPhone, date) to sum sales for a specific date
    - Handle timezone conversion for EAT (UTC+3)
    - _Requirements: 3.4, 7.1, 7.2, 8.1, 8.3_
  
  - [x]* 2.5 Write unit tests for database helper functions
    - Test shop creation and retrieval
    - Test product CRUD operations with multi-tenant isolation
    - Test sale recording and revenue calculation
    - Test error handling for constraint violations
    - _Requirements: 13.7_

- [x] 3. Checkpoint - Verify database layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement command parser
  - [x] 4.1 Create parseCommand function with regex patterns
    - Implement pattern matching for Sold command (extract last 2 tokens as quantity/price)
    - Implement pattern matching for Restock command (extract last token as quantity)
    - Implement pattern matching for AddProduct command (extract last token as initial stock)
    - Implement exact keyword matching for Stock, Summary, Undo, Help, MyShop
    - Handle product names with spaces correctly
    - Return structured CommandResult object with type and params
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_
  
  - [x]* 4.2 Write unit tests for command parser
    - Test parsing of all command types
    - Test product names with spaces
    - Test invalid command formats
    - Test edge cases (missing parameters, extra whitespace)
    - _Requirements: 15.7_

- [ ] 5. Implement command handlers
  - [x] 5.1 Implement handleSold function
    - Parse product name, quantity, and price from params
    - Verify product exists for shop_phone
    - Check sufficient stock availability
    - Record sale transaction
    - Deduct quantity from inventory stock
    - Check if stock falls below Low_Stock_Threshold (20 units)
    - Format confirmation message with low-stock warning if needed
    - Handle errors (product not found, insufficient stock)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [x] 5.2 Implement handleRestock function
    - Parse product name and quantity from params
    - Verify product exists for shop_phone
    - Add quantity to current stock level
    - Update inventory record with new stock and updated_at timestamp
    - Format confirmation message with new stock level
    - Handle error when product doesn't exist (suggest AddProduct)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [x] 5.3 Implement handleAddProduct function
    - Parse product name and initial stock from params
    - Check if product already exists for shop_phone
    - Create new inventory record with product name, initial stock, and shop_phone
    - Format confirmation message
    - Handle error when product already exists
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 5.4 Implement handleStock function
    - Retrieve all products for shop_phone
    - Format response as list with product names and quantities
    - Handle empty inventory case
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 5.5 Implement handleSummary function
    - Get current date in EAT timezone (UTC+3)
    - Calculate total revenue for current day and shop_phone
    - Format revenue amount in UGX with thousand separators
    - Handle zero revenue case
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 5.6 Implement handleUndo function
    - Retrieve most recent sale for shop_phone
    - Restore sold quantity back to product stock
    - Delete sale record from database
    - Format confirmation message with undone sale details
    - Handle case when no sales exist
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 5.7 Implement handleHelp function
    - Retrieve shop statistics (total products, total sales)
    - Format help message with available commands and usage examples
    - Include command list: Sold, Restock, AddProduct, Stock, Summary, Undo, Help/MyShop
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x]* 5.8 Write integration tests for command handlers
    - Test complete flow: add product → restock → sell → undo
    - Test multi-tenant isolation (two shops with same product names)
    - Test error scenarios (insufficient stock, duplicate products)
    - Test low-stock warnings
    - _Requirements: 1.6, 3.9_

- [x] 6. Checkpoint - Verify command handlers
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement webhook endpoint and Twilio integration
  - [x] 7.1 Create Express server with webhook endpoint
    - Set up Express app with JSON body parser
    - Create POST /whatsapp/webhook route
    - Extract From field (shop_phone) and Body field from request
    - Call parseCommand with message body
    - Route to appropriate command handler based on command type
    - Send response via Twilio API
    - Handle errors and send generic error message to user
    - Return 200 OK to Twilio
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.6_
  
  - [x] 7.2 Implement Twilio message sending function
    - Create sendWhatsAppMessage(to, body) function
    - Use Twilio client with credentials from environment variables
    - Handle API errors and log failures
    - Format recipient number in whatsapp:+256... format
    - _Requirements: 12.5, 14.1_
  
  - [x] 7.3 Implement automatic shop initialization
    - Check if shop exists when webhook receives message
    - Create shop record if new shop_phone detected
    - Seed four example products (Sugar, Rice, Salt, Maize Flour) for first shop only
    - Send welcome message with usage instructions
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 7.4 Implement command error handling
    - Handle unknown command types
    - Send friendly error message with usage guide
    - Suggest Help command for more information
    - Handle missing parameters with specific error messages
    - Log all errors with timestamps
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 8. Implement daily notification scheduler
  - [x] 8.1 Create scheduled task with node-cron
    - Set up cron job to run at 8:00 PM EAT (17:00 UTC)
    - Use cron expression '0 17 * * *' for UTC time
    - _Requirements: 10.1_
  
  - [x] 8.2 Implement daily revenue notification logic
    - Retrieve all shops from database
    - For each shop, calculate daily revenue for current date
    - Format revenue summary message with date and amount in UGX
    - Send message to each shop_phone via Twilio
    - Handle errors gracefully (log but don't crash)
    - _Requirements: 10.2, 10.3, 10.4, 10.5_

- [x] 9. Checkpoint - Test complete system
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Deployment preparation and documentation
  - [x] 10.1 Create environment configuration template
    - Document required environment variables in .env.example
    - Include TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
    - Add PORT variable for Render.com deployment
    - _Requirements: 14.1_
  
  - [ ] 10.2 Verify Render.com compatibility
    - Ensure server listens on process.env.PORT
    - Verify SQLite database persists correctly
    - Test application startup and database initialization
    - Confirm all dependencies are in package.json
    - _Requirements: 14.6, 14.7_
  
  - [x] 10.3 Create README with setup instructions
    - Document installation steps (npm install)
    - Explain environment variable configuration
    - Provide Twilio WhatsApp sandbox setup instructions
    - Include example commands and expected responses
    - Add deployment instructions for Render.com
    - _Requirements: 14.2, 14.3, 14.4, 14.5_

- [x] 11. Final checkpoint - End-to-end verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation follows a bottom-up approach to enable incremental testing
- Database layer must be completed before command handlers
- Command handlers must be completed before webhook integration
- All timezone operations use EAT (UTC+3) for consistency with Uganda business hours
- Multi-tenant isolation is enforced at the database query level using shop_phone filtering
- Product names with spaces are supported throughout the system
