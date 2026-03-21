const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Promisify database operations
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Initialize database schema
 */
async function initializeDatabase() {
  try {
    // Create shops table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS shops (
        shop_phone TEXT PRIMARY KEY,
        shop_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create inventory table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shop_phone TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(shop_phone, product_name),
        FOREIGN KEY (shop_phone) REFERENCES shops(shop_phone)
      )
    `);

    // Create sales table
    await runAsync(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shop_phone TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (shop_phone) REFERENCES shops(shop_phone)
      )
    `);

    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function getShop(shopPhone) {
  const sql = 'SELECT * FROM shops WHERE shop_phone = ?';
  return getAsync(sql, [shopPhone]);
}

async function createShop(shopPhone, shopName = null) {
  const sql = 'INSERT OR IGNORE INTO shops (shop_phone, shop_name, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)';
  await runAsync(sql, [shopPhone, shopName]);
  return getShop(shopPhone);
}

async function getAllShops() {
  const sql = 'SELECT * FROM shops';
  return allAsync(sql);
}

async function getProduct(shopPhone, productName) {
  const sql = 'SELECT * FROM inventory WHERE shop_phone = ? AND product_name = ?';
  return getAsync(sql, [shopPhone, productName]);
}

async function getAllProducts(shopPhone) {
  const sql = 'SELECT * FROM inventory WHERE shop_phone = ? ORDER BY product_name';
  return allAsync(sql, [shopPhone]);
}

async function addProduct(shopPhone, productName, quantity) {
  const sql = 'INSERT INTO inventory (shop_phone, product_name, quantity, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
  return runAsync(sql, [shopPhone, productName, quantity]);
}

async function updateStock(shopPhone, productName, newQuantity) {
  const sql = 'UPDATE inventory SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE shop_phone = ? AND product_name = ?';
  return runAsync(sql, [newQuantity, shopPhone, productName]);
}

async function recordSale(shopPhone, productName, quantity, price) {
  const sql = 'INSERT INTO sales (shop_phone, product_name, quantity, price, sale_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)';
  return runAsync(sql, [shopPhone, productName, quantity, price]);
}

async function getLastSale(shopPhone) {
  const sql = 'SELECT * FROM sales WHERE shop_phone = ? ORDER BY sale_date DESC, id DESC LIMIT 1';
  return getAsync(sql, [shopPhone]);
}

async function deleteSale(saleId) {
  const sql = 'DELETE FROM sales WHERE id = ?';
  return runAsync(sql, [saleId]);
}

async function getDailyRevenue(shopPhone, dateString) {
  const dayStart = `${dateString} 00:00:00`;
  const dayEnd = `${dateString} 23:59:59`;
  const sql = 'SELECT SUM(quantity * price) AS revenue FROM sales WHERE shop_phone = ? AND sale_date BETWEEN ? AND ?';
  const row = await getAsync(sql, [shopPhone, dayStart, dayEnd]);
  return row && row.revenue ? row.revenue : 0;
}

// Export database functions
module.exports = {
  db,
  runAsync,
  getAsync,
  allAsync,
  initializeDatabase
  ,getShop
  ,createShop
  ,getAllShops
  ,getProduct
  ,getAllProducts
  ,addProduct
  ,updateStock
  ,recordSale
  ,getLastSale
  ,deleteSale
  ,getDailyRevenue
};
