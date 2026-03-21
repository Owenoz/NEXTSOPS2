# Requirements Document

## Introduction

This document specifies requirements for a WhatsApp-based Sales & Inventory Tracker designed for small shops in Kampala, Uganda. The system enables shop owners to manage inventory, record sales, and track revenue through simple WhatsApp text commands. The system uses the sender's WhatsApp phone number as a unique shop identifier, providing automatic multi-tenant isolation without requiring separate authentication.

## Glossary

- **System**: The WhatsApp Sales & Inventory Tracker application
- **Shop**: A unique tenant identified by their WhatsApp phone number
- **Shop_Phone**: The WhatsApp phone number in format 'whatsapp:+2567xxxxxxxx' used as unique shop identifier
- **Product**: An inventory item with a name, quantity, and associated shop
- **Sale**: A transaction record containing product name, quantity sold, price, and timestamp
- **Stock**: The current quantity of a product available in inventory
- **Low_Stock_Threshold**: A quantity level of 20 units below which a warning is triggered
- **Webhook**: The HTTP POST endpoint that receives incoming WhatsApp messages
- **Command**: A text message following a specific pattern to trigger system actions
- **Revenue**: Total sales amount in Ugandan Shillings (UGX)
- **Twilio_API**: The third-party service used for WhatsApp message integration
- **Database**: SQLite database storing shop, inventory, and sales data
- **EAT**: East Africa Time timezone (UTC+3)

## Requirements

### Requirement 1: Multi-Tenant Shop Management

**User Story:** As a shop owner, I want my inventory and sales data to be automatically isolated from other shops, so that my business information remains private and secure.

#### Acceptance Criteria

1. WHEN a WhatsApp message is received, THE System SHALL extract the Shop_Phone from the request body From field
2. THE System SHALL use Shop_Phone as the unique identifier for all database operations
3. THE System SHALL create database tables with a shop_phone column for data isolation
4. WHEN querying inventory or sales data, THE System SHALL filter results by the sender's Shop_Phone
5. THE System SHALL enforce a UNIQUE constraint on the combination of shop_phone and product_name in the inventory table
6. FOR ALL database queries, filtering by Shop_Phone then querying SHALL return only that shop's data (data isolation property)

### Requirement 2: Automatic Shop Initialization

**User Story:** As a new shop owner, I want to start using the system immediately without registration, so that I can begin tracking sales right away.

#### Acceptance Criteria

1. WHEN a message is received from a new Shop_Phone, THE System SHALL create a shop record automatically
2. WHEN a new shop is created, THE System SHALL send a welcome message with usage instructions
3. THE System SHALL include the current timestamp in the shop record as created_at
4. WHERE the shop is the first shop in the database, THE System SHALL seed four example products (Sugar, Rice, Salt, Maize Flour) with initial stock quantities

### Requirement 3: Record Sales Transactions

**User Story:** As a shop owner, I want to record sales by sending a simple message, so that I can quickly log transactions while serving customers.

#### Acceptance Criteria

1. WHEN a message matching pattern 'Sold [Product Name] [Quantity] [Price]' is received, THE System SHALL parse the product name, quantity, and price
2. WHEN a sale is recorded, THE System SHALL verify sufficient stock exists for the product
3. IF insufficient stock exists, THEN THE System SHALL send an error message and not record the sale
4. WHEN sufficient stock exists, THE System SHALL create a sale record with product name, quantity, price, Shop_Phone, and timestamp
5. WHEN a sale is recorded, THE System SHALL deduct the sold quantity from the product's current stock
6. WHEN a sale is recorded, THE System SHALL send a confirmation message to the shop
7. WHILE the product stock is below Low_Stock_Threshold after a sale, THE System SHALL include a low-stock warning in the confirmation message
8. THE System SHALL handle product names containing spaces correctly in the Sold command
9. FOR ALL valid sales, recording a sale then calling Undo SHALL restore the original stock quantity (round-trip property)

### Requirement 4: Restock Inventory

**User Story:** As a shop owner, I want to add stock to existing products, so that I can keep my inventory levels current when I receive new supplies.

#### Acceptance Criteria

1. WHEN a message matching pattern 'Restock [Product] [Quantity]' is received, THE System SHALL parse the product name and quantity
2. WHEN a restock command is processed, THE System SHALL verify the product exists for the Shop_Phone
3. IF the product does not exist, THEN THE System SHALL send an error message suggesting the AddProduct command
4. WHEN the product exists, THE System SHALL add the quantity to the current stock level
5. WHEN a restock is completed, THE System SHALL send a confirmation message with the new stock level
6. THE System SHALL handle product names containing spaces correctly in the Restock command

### Requirement 5: Add New Products

**User Story:** As a shop owner, I want to add new products to my inventory, so that I can track items as my product range expands.

#### Acceptance Criteria

1. WHEN a message matching pattern 'AddProduct [Product Name] [Initial Stock]' is received, THE System SHALL parse the product name and initial stock quantity
2. WHEN adding a product, THE System SHALL verify the product name does not already exist for the Shop_Phone
3. IF the product already exists, THEN THE System SHALL send an error message indicating the product is already in inventory
4. WHEN the product does not exist, THE System SHALL create an inventory record with the product name, initial stock, and Shop_Phone
5. WHEN a product is added, THE System SHALL send a confirmation message
6. THE System SHALL handle product names containing spaces correctly in the AddProduct command

### Requirement 6: View Current Inventory

**User Story:** As a shop owner, I want to see all my products and their stock levels, so that I can quickly check what needs restocking.

#### Acceptance Criteria

1. WHEN a message containing 'Stock' is received, THE System SHALL retrieve all products for the sender's Shop_Phone
2. THE System SHALL format the response as a list showing each product name and current quantity
3. WHEN no products exist for the shop, THE System SHALL send a message indicating the inventory is empty
4. THE System SHALL send the formatted inventory list to the shop's WhatsApp number

### Requirement 7: Daily Revenue Summary

**User Story:** As a shop owner, I want to see my total sales for today, so that I can track my daily business performance.

#### Acceptance Criteria

1. WHEN a message containing 'Summary' is received, THE System SHALL calculate total revenue for the current day in EAT timezone
2. THE System SHALL sum all sale prices for sales records matching the Shop_Phone and current date
3. THE System SHALL format the revenue amount in Ugandan Shillings (UGX)
4. THE System SHALL send the daily revenue total to the shop's WhatsApp number
5. WHEN no sales exist for the current day, THE System SHALL send a message indicating zero revenue

### Requirement 8: Undo Last Sale

**User Story:** As a shop owner, I want to undo my most recent sale entry, so that I can correct mistakes without manual database edits.

#### Acceptance Criteria

1. WHEN a message containing 'Undo' is received, THE System SHALL retrieve the most recent sale record for the Shop_Phone
2. WHEN a recent sale exists, THE System SHALL restore the sold quantity back to the product's stock
3. WHEN a recent sale exists, THE System SHALL delete the sale record from the database
4. WHEN the undo is completed, THE System SHALL send a confirmation message with details of the undone sale
5. WHEN no sales exist for the shop, THE System SHALL send a message indicating there is nothing to undo

### Requirement 9: Shop Information and Help

**User Story:** As a shop owner, I want to see my shop's current status and available commands, so that I can understand how to use the system.

#### Acceptance Criteria

1. WHEN a message containing 'MyShop' or 'Help' is received, THE System SHALL retrieve the shop's statistics
2. THE System SHALL include total products count in the response
3. THE System SHALL include total sales count in the response
4. THE System SHALL include a list of available commands with usage examples
5. THE System SHALL send the formatted help message to the shop's WhatsApp number

### Requirement 10: Automatic Daily Revenue Notifications

**User Story:** As a shop owner, I want to receive an automatic summary of my daily revenue, so that I can review my business performance without manually requesting it.

#### Acceptance Criteria

1. THE System SHALL schedule a daily task to run at 8:00 PM EAT
2. WHEN the scheduled time occurs, THE System SHALL calculate the day's total revenue for each shop
3. FOR ALL shops with sales data, THE System SHALL send a revenue summary message to each Shop_Phone
4. THE System SHALL format the revenue amount in Ugandan Shillings (UGX)
5. THE System SHALL include the date in the automated summary message

### Requirement 11: Command Error Handling

**User Story:** As a shop owner, I want to receive helpful error messages when I send incorrect commands, so that I can learn the correct format without frustration.

#### Acceptance Criteria

1. WHEN a message does not match any known command pattern, THE System SHALL send a friendly error message
2. THE System SHALL include a brief usage guide in the error message
3. THE System SHALL suggest the Help command for more information
4. IF a command is missing required parameters, THEN THE System SHALL send an error message indicating which parameters are needed
5. THE System SHALL log all errors with timestamps for debugging purposes

### Requirement 12: WhatsApp Webhook Integration

**User Story:** As a system administrator, I want the application to receive WhatsApp messages via webhook, so that shops can interact with the system through WhatsApp.

#### Acceptance Criteria

1. THE System SHALL expose a POST endpoint at /whatsapp/webhook
2. WHEN a POST request is received at the webhook, THE System SHALL extract the message body and sender phone number
3. THE System SHALL parse the message body to identify the command type
4. THE System SHALL process the command and generate an appropriate response
5. THE System SHALL send the response message via Twilio_API to the sender's WhatsApp number
6. IF an error occurs during processing, THEN THE System SHALL log the error and send a generic error message to the user

### Requirement 13: Database Schema and Operations

**User Story:** As a system administrator, I want a well-structured database schema, so that data is stored efficiently and queries perform well.

#### Acceptance Criteria

1. THE System SHALL create an inventory table with columns: id, shop_phone, product_name, quantity, created_at, updated_at
2. THE System SHALL create a sales table with columns: id, shop_phone, product_name, quantity, price, sale_date
3. THE System SHALL create a shops table with columns: shop_phone, shop_name, created_at
4. THE System SHALL enforce a UNIQUE constraint on (shop_phone, product_name) in the inventory table
5. THE System SHALL use async/await patterns for all database operations
6. THE System SHALL implement promise-based database helper functions for common operations
7. FOR ALL database operations, the System SHALL handle errors gracefully and return meaningful error messages

### Requirement 14: Configuration and Deployment

**User Story:** As a system administrator, I want the application to be easily deployable to Render.com free tier, so that hosting costs remain minimal for small shops.

#### Acceptance Criteria

1. THE System SHALL store Twilio credentials in environment variables via .env file
2. THE System SHALL organize code into three main files: index.js, db.js, and .env
3. THE System SHALL use Node.js with Express framework for the web server
4. THE System SHALL use SQLite as the database engine
5. THE System SHALL include all necessary dependencies in package.json
6. THE System SHALL be compatible with Render.com free tier resource limits
7. WHEN the application starts, THE System SHALL initialize the database schema if it does not exist

### Requirement 15: Message Parsing and Product Name Handling

**User Story:** As a shop owner, I want to use product names with spaces in my commands, so that I can use natural product names like "Maize Flour" instead of abbreviated codes.

#### Acceptance Criteria

1. THE System SHALL parse commands using a pattern that captures product names with spaces
2. WHEN parsing 'Sold [Product Name] [Quantity] [Price]', THE System SHALL extract the last two space-separated tokens as quantity and price
3. WHEN parsing 'Sold [Product Name] [Quantity] [Price]', THE System SHALL treat all preceding tokens as the product name
4. WHEN parsing 'Restock [Product] [Quantity]', THE System SHALL extract the last token as quantity and all preceding tokens as product name
5. WHEN parsing 'AddProduct [Product Name] [Initial Stock]', THE System SHALL extract the last token as initial stock and all preceding tokens as product name
6. THE System SHALL trim whitespace from parsed product names
7. FOR ALL commands with product names, parsing a command with spaces in the product name SHALL correctly identify the product (parsing correctness property)
