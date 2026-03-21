const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {
  initializeDatabase,
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
  getDailyRevenue,
  db
} = require('../db');

// Use a test database file
const testDbPath = path.join(__dirname, '..', 'database-test.sqlite');

// Clean up test database before and after tests
function cleanupTestDb() {
  try {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  } catch (e) {
    // Ignore
  }
}

describe('Database Layer Tests', () => {
  before(cleanupTestDb);
  after(cleanupTestDb);

  describe('Shop Management', () => {
    it('should create a shop', async () => {
      await initializeDatabase();
      const shop = await createShop('+256700000001', 'Test Shop 1');
      assert(shop, 'Shop creation failed');
      assert.strictEqual(shop.shop_phone, '+256700000001');
    });

    it('should retrieve shop by phone', async () => {
      await initializeDatabase();
      await createShop('+256700000002', 'Test Shop 2');
      const shop = await getShop('+256700000002');
      assert(shop, 'Shop retrieval failed');
      assert.strictEqual(shop.shop_name, 'Test Shop 2');
    });

    it('should return undefined for non-existent shop', async () => {
      await initializeDatabase();
      const shop = await getShop('+256999999999');
      assert.strictEqual(shop, undefined);
    });

    it('should retrieve all shops', async () => {
      await initializeDatabase();
      await createShop('+256700000003', 'Shop A');
      await createShop('+256700000004', 'Shop B');
      const shops = await getAllShops();
      assert(Array.isArray(shops), 'getAllShops should return array');
      assert(shops.length >= 2, 'Should have at least 2 shops');
    });
  });

  describe('Product Management', () => {
    const shopPhone = '+256700000100';

    beforeEach(async () => {
      await initializeDatabase();
      await createShop(shopPhone, 'Test Shop');
    });

    it('should add a product', async () => {
      await addProduct(shopPhone, 'TestProduct', 100);
      const product = await getProduct(shopPhone, 'TestProduct');
      assert(product, 'Product not found');
      assert.strictEqual(product.quantity, 100);
    });

    it('should prevent duplicate products for same shop', async () => {
      await addProduct(shopPhone, 'Sugar', 50);
      try {
        await addProduct(shopPhone, 'Sugar', 100);
        assert.fail('Should have thrown error for duplicate product');
      } catch (err) {
        // Expected: UNIQUE constraint violation
        assert(err.message.includes('UNIQUE'));
      }
    });

    it('should retrieve all products for a shop', async () => {
      await addProduct(shopPhone, 'Product1', 10);
      await addProduct(shopPhone, 'Product2', 20);
      const products = await getAllProducts(shopPhone);
      assert(products.length >= 2);
    });

    it('should enforce multi-tenant isolation', async () => {
      const shop2Phone = '+256700000101';
      await createShop(shop2Phone, 'Shop 2');
      
      await addProduct(shopPhone, 'SharedName', 50);
      await addProduct(shop2Phone, 'SharedName', 100);
      
      const p1 = await getProduct(shopPhone, 'SharedName');
      const p2 = await getProduct(shop2Phone, 'SharedName');
      
      assert.strictEqual(p1.quantity, 50);
      assert.strictEqual(p2.quantity, 100);
    });

    it('should update stock', async () => {
      await addProduct(shopPhone, 'Item', 50);
      await updateStock(shopPhone, 'Item', 75);
      const product = await getProduct(shopPhone, 'Item');
      assert.strictEqual(product.quantity, 75);
    });
  });

  describe('Sales Management', () => {
    beforeEach(async () => {
      await initializeDatabase();
    });

    it('should record a sale', async () => {
      const shopPhone = '+256700000501';
      await createShop(shopPhone, 'Test Shop');
      await addProduct(shopPhone, 'ProductA', 1000);
      await recordSale(shopPhone, 'ProductA', 10, 5000);
      const lastSale = await getLastSale(shopPhone);
      assert(lastSale, 'Sale not recorded');
      assert.strictEqual(lastSale.quantity, 10);
      assert.strictEqual(lastSale.price, 5000);
    });

    it('should retrieve the last sale', async () => {
      const shopPhone = '+256700000502';
      await createShop(shopPhone, 'Test Shop');
      await addProduct(shopPhone, 'ProductB', 1000);
      await recordSale(shopPhone, 'ProductB', 5, 2000);
      await recordSale(shopPhone, 'ProductB', 10, 5000);
      const lastSale = await getLastSale(shopPhone);
      assert.strictEqual(lastSale.quantity, 10);
    });

    it('should return undefined when no sales exist', async () => {
      const shop2 = '+256700000503';
      await createShop(shop2, 'Shop 2');
      await addProduct(shop2, 'Item', 50);
      const lastSale = await getLastSale(shop2);
      assert.strictEqual(lastSale, undefined);
    });

    it('should delete a sale', async () => {
      const shopPhone = '+256700000504';
      await createShop(shopPhone, 'Test Shop');
      await addProduct(shopPhone, 'ProductC', 1000);
      await recordSale(shopPhone, 'ProductC', 5, 2000);
      const sale = await getLastSale(shopPhone);
      await deleteSale(sale.id);
      const deletedSale = await getLastSale(shopPhone);
      assert.strictEqual(deletedSale, undefined);
    });

    it('should calculate daily revenue', async () => {
      const shopPhone = '+256700000505';
      await createShop(shopPhone, 'Test Shop');
      await addProduct(shopPhone, 'ProductD', 1000);
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      await recordSale(shopPhone, 'ProductD', 2, 5000);
      await recordSale(shopPhone, 'ProductD', 3, 5000);
      
      const revenue = await getDailyRevenue(shopPhone, dateString);
      assert.strictEqual(revenue, 25000); // 2*5000 + 3*5000
    });

    it('should return 0 for day with no sales', async () => {
      const shopPhone = '+256700000506';
      await createShop(shopPhone, 'Test Shop');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yyyy = yesterday.getFullYear();
      const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
      const dd = String(yesterday.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      const revenue = await getDailyRevenue(shopPhone, dateString);
      assert.strictEqual(revenue, 0);
    });
  });
});

// Run tests if this file is executed directly
if (require.main === module) {
  const Mocha = require('mocha');
  const mocha = new Mocha();
  mocha.addFile(__filename);
  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });
}
