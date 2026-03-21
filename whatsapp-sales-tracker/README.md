# WhatsApp Sales & Inventory Tracker

A multi-tenant Node.js application that enables shop owners in Uganda to manage inventory and track sales through WhatsApp text commands.

## Features

- **Multi-Tenant Support**: Separate shops with isolated inventory and sales data
- **Text-Based Commands**: Simple command interface via WhatsApp
- **Inventory Management**: Add products, track stock levels, manage restocking
- **Sales Tracking**: Record sales, undo recent transactions
- **Daily Reports**: Automated daily revenue notifications in EAT timezone
- **Multi-Word Product Names**: Support for product names with spaces (e.g., "Maize Flour")
- **Low Stock Alerts**: Automatic warnings when stock falls below 20 units

## Commands

| Command | Format | Example |
|---------|--------|---------|
| **AddProduct** | `AddProduct <product name> <quantity>` | `AddProduct Maize Flour 100` |
| **Restock** | `Restock <product name> <quantity>` | `Restock Sugar 50` |
| **Sold** | `Sold <product name> <quantity> <price>` | `Sold Rice 20 2000` |
| **Stock** | `Stock` | `Stock` |
| **Summary** | `Summary` | `Summary` |
| **Undo** | `Undo` | `Undo` |
| **Help** | `Help` or `MyShop` | `Help` |

## Installation

### Prerequisites

- Node.js 14+ and npm
- Twilio WhatsApp sandbox or production account

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatsapp-sales-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_FROM_WHATSAPP=whatsapp:+14155238886
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## Twilio WhatsApp Setup

### For WhatsApp Sandbox (Development):

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to WhatsApp → Sandbox
3. Follow instructions to confirm your phone number
4. You'll receive a sandbox number (e.g., `+14155238886`)
5. Update your `.env` with `TWILIO_FROM_WHATSAPP=whatsapp:+14155238886`

### For Production:

1. Request WhatsApp Business API access from Twilio
2. Verify your business phone number
3. Set `TWILIO_FROM_WHATSAPP` to your verified WhatsApp Business number

## Webhook Configuration

Configure your Twilio WhatsApp number to send incoming messages to:

```
https://your-domain.com/whatsapp/webhook
```

## Database

The application uses SQLite with three main tables:

### shops
- `shop_phone` (PRIMARY KEY): Phone number in format `+256xxxxxxxxx`
- `shop_name`: Optional shop name
- `created_at`: Timestamp of shop creation

### inventory
- `id`: Auto-increment ID
- `shop_phone`: Foreign key to shops
- `product_name`: Name of product
- `quantity`: Current stock level
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
- **Constraint**: UNIQUE(shop_phone, product_name)

### sales
- `id`: Auto-increment ID
- `shop_phone`: Foreign key to shops
- `product_name`: Sold product name
- `quantity`: Quantity sold
- `price`: Price per unit in UGX
- `sale_date`: Date/time of sale

## API Endpoints

### POST /whatsapp/webhook
Receives incoming WhatsApp messages from Twilio.

**Request Format:**
```json
{
  "From": "whatsapp:+256700000000",
  "Body": "Stock"
}
```

**Response:**
- Returns 200 OK with `OK` text body
- Sends WhatsApp message with command response via Twilio

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- **Database operations**: CRUD for shops, products, and sales
- **Command parsing**: All command types with edge cases
- **Command handlers**: Complete workflows including integration tests
- **Multi-tenant isolation**: Verifies data separation between shops
- **Error handling**: Validates error scenarios

## Deployment to Render.com

### Prerequisites
- Render.com account
- GitHub repository with this code
- Twilio credentials

### Steps

1. **Create a new Web Service on Render**
   - Connect GitHub repository
   - Select Node.js as runtime
   - Build command: `npm install`
   - Start command: `npm start`

2. **Set Environment Variables**
   - Add all variables from `.env.example`:
     - `TWILIO_ACCOUNT_SID`
     - `TWILIO_AUTH_TOKEN`
     - `TWILIO_FROM_WHATSAPP`
     - `PORT=3000`

3. **Configure Twilio Webhook**
   - Get your Render URL (e.g., `https://myapp.onrender.com`)
   - Update Twilio WhatsApp webhook to: `https://myapp.onrender.com/whatsapp/webhook`

4. **Test Connection**
   - Send a test message from WhatsApp
   - Check Render logs for activity

### Note on Database Persistence

SQLite uses a local file (`database.sqlite`) that **will be lost** when Render restarts the service. For production, consider:
- Using Render's PostgreSQL database
- Backing up database to external storage
- Implementing database export functionality

## Architecture

### Database Layer (`db.js`)
- Promise-based SQLite wrapper
- Helper functions for shops, inventory, and sales operations
- Multi-tenant data isolation at query level

### Command Parser (`commands.js`)
- Parses WhatsApp message text into structured commands
- Validates command syntax and parameters
- Handles case-insensitive commands and multi-word product names

### Command Handlers
Implements business logic for each command type with error handling and validation

### Webhook Handler (`index.js`)
- Receives and processes incoming WhatsApp messages
- Routes to appropriate command handler
- Sends responses via Twilio API
- Initializes new shops and seeds default products

### Scheduler
- Daily cron job at 8:00 PM EAT (17:00 UTC)
- Sends revenue summary to all registered shops
- Handles timezone conversion for Uganda business hours

## Timezone

All timestamps use EAT (East Africa Time, UTC+3). 

- Daily notifications sent at: 8:00 PM EAT (17:00 UTC)
- Revenue calculations use EAT local date

## Error Handling

The application provides user-friendly error messages for:
- Unknown or malformed commands
- Invalid parameters
- Product not found
- Insufficient stock
- Duplicate products
- Missing required parameters

## Requirements Traceability

This implementation fulfills all requirements in the specification:
- **R1-R11**: Core command functionality
- **R12**: Twilio WhatsApp integration
- **R13-R15**: Database layer, architecture, and command parsing
- **R14**: Environment configuration and deployment

## License

ISC
