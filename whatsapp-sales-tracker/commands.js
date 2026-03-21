const {
  getShop,
  createShop,
  getAllShops,
  getProduct,
  getAllProducts,
  addProduct,
  updateStock,
  recordSale,
  getLastSale,
  deleteSale,
  getDailyRevenue
} = require('./db');

const LOW_STOCK_THRESHOLD = 20;

function sanitizeShopPhone(rawPhone) {
  if (!rawPhone) return rawPhone;
  return rawPhone.replace(/^whatsapp:/i, '').trim();
}

function parseCommand(message) {
  if (!message || typeof message !== 'string') {
    return { type: 'Unknown', error: 'Empty command' };
  }

  const trimmed = message.trim();
  const tokens = trimmed.split(/\s+/);
  const primary = tokens[0]?.toLowerCase();

  if (!primary) return { type: 'Unknown', error: 'Empty command' };

  const tail = tokens.slice(1);

  switch (primary) {
    case 'sold':
      if (tail.length < 3) {
        return { type: 'Invalid', error: 'Sold command needs product name, quantity, price' };
      }
      {
        const quantity = parseInt(tail[tail.length - 2], 10);
        const price = parseInt(tail[tail.length - 1], 10);
        if (Number.isNaN(quantity) || Number.isNaN(price)) {
          return { type: 'Invalid', error: 'Sold quantity and price must be numbers' };
        }
        const productName = tail.slice(0, tail.length - 2).join(' ');
        return { type: 'Sold', params: { productName, quantity, price } };
      }

    case 'restock':
      if (tail.length < 2) {
        return { type: 'Invalid', error: 'Restock command needs product name and quantity' };
      }
      {
        const quantity = parseInt(tail[tail.length - 1], 10);
        if (Number.isNaN(quantity)) {
          return { type: 'Invalid', error: 'Restock quantity must be a number' };
        }
        const productName = tail.slice(0, tail.length - 1).join(' ');
        return { type: 'Restock', params: { productName, quantity } };
      }

    case 'addproduct':
      if (tail.length < 2) {
        return { type: 'Invalid', error: 'AddProduct needs product name and initial stock' };
      }
      {
        const quantity = parseInt(tail[tail.length - 1], 10);
        if (Number.isNaN(quantity)) {
          return { type: 'Invalid', error: 'Initial stock must be a number' };
        }
        const productName = tail.slice(0, tail.length - 1).join(' ');
        return { type: 'AddProduct', params: { productName, quantity } };
      }

    case 'stock':
      return { type: 'Stock', params: {} };
    case 'summary':
      return { type: 'Summary', params: {} };
    case 'undo':
      return { type: 'Undo', params: {} };
    case 'help':
      return { type: 'Help', params: {} };
    case 'myshop':
      return { type: 'Help', params: {} };
    default:
      return { type: 'Unknown', error: 'Unknown command' };
  }
}

function formatCurrencyUGX(amount) {
  return `UGX ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

async function handleAddProduct(shopPhoneRaw, productName, quantity) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  if (!productName || quantity < 0) {
    throw new Error('Invalid add product params');
  }

  const existing = await getProduct(shopPhone, productName);
  if (existing) {
    throw new Error(`Product '${productName}' already exists`);
  }

  await addProduct(shopPhone, productName, quantity);
  return `Added product '${productName}' with stock ${quantity}.`;
}

async function handleRestock(shopPhoneRaw, productName, quantity) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  if (!productName || quantity <= 0) {
    throw new Error('Invalid restock params');
  }

  const existing = await getProduct(shopPhone, productName);
  if (!existing) {
    throw new Error(`Product '${productName}' not found. Use AddProduct to create it.`);
  }

  const newQty = existing.quantity + quantity;
  await updateStock(shopPhone, productName, newQty);
  return `Restocked '${productName}' by ${quantity}. New stock: ${newQty}.`;
}

async function handleSold(shopPhoneRaw, productName, quantity, price) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  if (!productName || quantity <= 0 || price < 0) {
    throw new Error('Invalid sold params');
  }

  const existing = await getProduct(shopPhone, productName);
  if (!existing) {
    throw new Error(`Product '${productName}' not found.`);
  }

  if (existing.quantity < quantity) {
    throw new Error(`Insufficient stock for '${productName}'. Available ${existing.quantity}.`);
  }

  const newQty = existing.quantity - quantity;
  await recordSale(shopPhone, productName, quantity, price);
  await updateStock(shopPhone, productName, newQty);

  let response = `Sold ${quantity} x '${productName}' at ${formatCurrencyUGX(price)} each. Remaining stock ${newQty}.`;
  if (newQty <= LOW_STOCK_THRESHOLD) {
    response += ` Warning: low stock (<= ${LOW_STOCK_THRESHOLD}).`;
  }

  return response;
}

async function handleStock(shopPhoneRaw) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  const products = await getAllProducts(shopPhone);
  if (!products || products.length === 0) {
    return 'Inventory is empty. Add products with AddProduct command.';
  }

  const lines = products.map(p => `${p.product_name}: ${p.quantity}`);
  return `Stock for your shop:\n` + lines.join('\n');
}

async function handleSummary(shopPhoneRaw) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  const now = new Date();
  // Convert to EAT (UTC+3) and format date YYYY-MM-DD
  const utcTs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const eatTs = utcTs + 3 * 3600 * 1000;
  const eatDate = new Date(eatTs);
  const yyyy = eatDate.getUTCFullYear();
  const mm = String(eatDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(eatDate.getUTCDate()).padStart(2, '0');
  const dateString = `${yyyy}-${mm}-${dd}`;

  const revenue = await getDailyRevenue(shopPhone, dateString);
  if (revenue === 0) {
    return `Today's revenue (${dateString}) is UGX 0.`;
  }
  return `Today's revenue (${dateString}): ${formatCurrencyUGX(revenue)}.`;
}

async function handleUndo(shopPhoneRaw) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  const lastSale = await getLastSale(shopPhone);
  if (!lastSale) {
    return 'No recent sale to undo.';
  }

  const product = await getProduct(shopPhone, lastSale.product_name);
  if (!product) {
    throw new Error(`Product '${lastSale.product_name}' not found while undoing sale.`);
  }

  const restoredQty = product.quantity + lastSale.quantity;
  await updateStock(shopPhone, lastSale.product_name, restoredQty);
  await deleteSale(lastSale.id);

  return `Undone sale of ${lastSale.quantity} x '${lastSale.product_name}'. Stock restored to ${restoredQty}.`;
}

async function handleHelp(shopPhoneRaw) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  const products = await getAllProducts(shopPhone);
  const productCount = (products && products.length) || 0;

  return `WhatsApp Sales & Inventory Tracker Commands:\n` +
    `- AddProduct <product name> <stock>\n` +
    `- Restock <product name> <quantity>\n` +
    `- Sold <product name> <quantity> <unit price>\n` +
    `- Stock\n` +
    `- Summary\n` +
    `- Undo\n` +
    `- Help\n` +
    `Current products: ${productCount}.`;
}

async function ensureShopInitialized(shopPhoneRaw) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  let shop = await getShop(shopPhone);
  let isNew = false;
  if (!shop) {
    isNew = true;
    shop = await createShop(shopPhone);
  }

  return { shop, isNew };
}

async function seedDefaultProducts(shopPhoneRaw) {
  const shopPhone = sanitizeShopPhone(shopPhoneRaw);
  const existing = await getAllProducts(shopPhone);
  if (existing && existing.length > 0) return;

  const defaults = [
    { name: 'Sugar', qty: 50 },
    { name: 'Rice', qty: 80 },
    { name: 'Salt', qty: 40 },
    { name: 'Maize Flour', qty: 70 }
  ];

  for (const item of defaults) {
    const p = await getProduct(shopPhone, item.name);
    if (!p) {
      await addProduct(shopPhone, item.name, item.qty);
    }
  }
}

module.exports = {
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
};
