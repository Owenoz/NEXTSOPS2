require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { initializeDatabase } = require('./db');
const twilio = require('twilio');
const {
  sanitizeShopPhone,
  parseCommand,
  handleAddProduct,
  handleRestock,
  handleSold,
  handleStock,
  handleSummary,
  handleUndo,
  handleHelp,
  ensureShopInitialized,
  seedDefaultProducts,
  getAllShops
} = require('./commands');
const { getDailyRevenue } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

let twilioClient;
try {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} catch (err) {
  console.warn('Twilio credentials not configured properly - messaging disabled');
  twilioClient = null;
}

function formatToWhatsAppNumber(phone) {
  let num = String(phone).trim();
  if (num.startsWith('whatsapp:')) {
    num = num.slice(9);
  }
  if (!num.startsWith('+')) {
    num = '+' + num.replace(/^0+/, '');
  }
  return `whatsapp:${num}`;
}

async function sendWhatsAppMessage(to, body) {
  if (!twilioClient || !process.env.TWILIO_FROM_WHATSAPP) {
    console.warn('Twilio not configured - message not sent to:', to);
    return;
  }
  const recipient = formatToWhatsAppNumber(to);
  const from = formatToWhatsAppNumber(process.env.TWILIO_FROM_WHATSAPP);
  try {
    await twilioClient.messages.create({
      from,
      to: recipient,
      body
    });
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
  }
}

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('WhatsApp Sales & Inventory Tracker is running!');
});

// WhatsApp webhook endpoint (to be implemented)
app.post('/whatsapp/webhook', async (req, res) => {
  // TODO: Implement webhook handler
  const from = req.body.From || req.body.from;
  const body = req.body.Body || req.body.body;

  if (!from || !body) {
    res.status(400).send('Invalid webhook payload');
    return;
  }

  const shopPhone = sanitizeShopPhone(from);

  try {
    const { isNew } = await ensureShopInitialized(shopPhone);
    if (isNew) {
      await seedDefaultProducts(shopPhone);
      await sendWhatsAppMessage(from, 'Welcome! Your shop is initialized with sample products. Use Help for commands.');
    }

    const cmd = parseCommand(body);
    let reply;
    if (cmd.type === 'Unknown') {
      reply = 'Unknown command. Send Help for list of commands.';
    } else if (cmd.type === 'Invalid') {
      reply = `Invalid command: ${cmd.error}`;
    } else {
      try {
        switch (cmd.type) {
          case 'Sold':
            reply = await handleSold(shopPhone, cmd.params.productName, cmd.params.quantity, cmd.params.price);
            break;
          case 'Restock':
            reply = await handleRestock(shopPhone, cmd.params.productName, cmd.params.quantity);
            break;
          case 'AddProduct':
            reply = await handleAddProduct(shopPhone, cmd.params.productName, cmd.params.quantity);
            break;
          case 'Stock':
            reply = await handleStock(shopPhone);
            break;
          case 'Summary':
            reply = await handleSummary(shopPhone);
            break;
          case 'Undo':
            reply = await handleUndo(shopPhone);
            break;
          case 'Help':
            reply = await handleHelp(shopPhone);
            break;
          default:
            reply = 'Command not supported. Send Help.';
            break;
        }
      } catch (e) {
        reply = `Error: ${e.message}`;
      }
    }

    await sendWhatsAppMessage(from, reply);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook handling failed:', err);
    await sendWhatsAppMessage(from, 'Sorry, an error occurred processing your request.');
    res.status(200).send('OK');
  }
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Daily revenue cron at 17:00 UTC (20:00 EAT)
    cron.schedule('0 17 * * *', async () => {
      try {
        const shops = await getAllShops();
        const now = new Date();
        const utcTs = now.getTime() + (now.getTimezoneOffset() * 60000);
        const eatTs = utcTs + 3 * 3600 * 1000;
        const eatDate = new Date(eatTs);
        const yyyy = eatDate.getUTCFullYear();
        const mm = String(eatDate.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(eatDate.getUTCDate()).padStart(2, '0');
        const dateString = `${yyyy}-${mm}-${dd}`;

        for (const shop of shops) {
          const revenue = await getDailyRevenue(shop.shop_phone, dateString);
          const msg = `Daily revenue (${dateString}): UGX ${revenue.toLocaleString()}`;
          await sendWhatsAppMessage(shop.shop_phone, msg);
        }
      } catch (error) {
        console.error('Daily notification error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
