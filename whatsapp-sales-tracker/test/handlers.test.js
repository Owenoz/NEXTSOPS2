const assert = require('assert');
const {
  initializeDatabase,
  getShop,
  createShop,
  getProduct,
  addProduct,
  updateStock,
  recordSale,
  getLastSale,
  deleteSale,
  getDailyRevenue
} = require('../db');
const {
  parseCommand,
  handleSold,
  handleRestock,
  handleAddProduct,
  handleStock,
  handleSummary,
  handleUndo,
  handleHelp,
  ensureShopInitialized,
  sanitizeShopPhone
} = require('../commands');

describe('Command Handlers Integration Tests', () => {
  const shop1 = '+256700001001';
  const shop2 = '+256700001002';

  beforeEach(async () => {
    await initializeDatabase();
    await ensureShopInitialized(shop1);
    await ensureShopInitialized(shop2);
  });

  describe('Complete Flow: Add → Restock → Sell → Undo', () => {
    it('should execute complete product lifecycle', async () => {
      // Add product
      await handleAddProduct(shop1, 'Beans', 100);
      let product = await getProduct(shop1, 'Beans');
      assert.strictEqual(product.quantity, 100);

      // Restock
      await handleRestock(shop1, 'Beans', 50);
      product = await getProduct(shop1, 'Beans');
      assert.strictEqual(product.quantity, 150);

      // Sell
      await handleSold(shop1, 'Beans', 30, 3000);
      product = await getProduct(shop1, 'Beans');
      assert.strictEqual(product.quantity, 120);

      // Undo
      await handleUndo(shop1);
      product = await getProduct(shop1, 'Beans');
      assert.strictEqual(product.quantity, 150);
    });
  });

  describe('Multi-Tenant Isolation', () => {
    it('should prevent cross-shop data leakage', async () => {
      // Shop1 adds product
      await handleAddProduct(shop1, 'TestItem', 100);
      
      // Shop2 adds same product with different quantity
      await handleAddProduct(shop2, 'TestItem', 200);

      // Verify isolation
      const p1 = await getProduct(shop1, 'TestItem');
      const p2 = await getProduct(shop2, 'TestItem');
      
      assert.strictEqual(p1.quantity, 100);
      assert.strictEqual(p2.quantity, 200);

      // Shop1 sells
      await handleSold(shop1, 'TestItem', 20, 1000);
      
      // Verify Shop2 unaffected
      const p2After = await getProduct(shop2, 'TestItem');
      assert.strictEqual(p2After.quantity, 200);
      
      const p1After = await getProduct(shop1, 'TestItem');
      assert.strictEqual(p1After.quantity, 80);
    });

    it('should isolate sales records by shop', async () => {
      await handleAddProduct(shop1, 'Item', 500);
      await handleAddProduct(shop2, 'Item', 500);

      await handleSold(shop1, 'Item', 10, 1000);
      await handleSold(shop2, 'Item', 20, 2000);

      const sale1 = await getLastSale(shop1);
      const sale2 = await getLastSale(shop2);

      assert.strictEqual(sale1.quantity, 10);
      assert.strictEqual(sale2.quantity, 20);
      assert.notStrictEqual(sale1.id, sale2.id);
    });
  });

  describe('Error Scenarios', () => {
    it('should reject insufficient stock', async () => {
      await handleAddProduct(shop1, 'Scarce', 10);
      try {
        await handleSold(shop1, 'Scarce', 20, 1000);
        assert.fail('Should have thrown error');
      } catch (err) {
        assert(err.message.includes('Insufficient'));
      }
    });

    it('should reject duplicate product addition', async () => {
      await handleAddProduct(shop1, 'Unique', 50);
      try {
        await handleAddProduct(shop1, 'Unique', 100);
        assert.fail('Should have thrown error');
      } catch (err) {
        assert(err.message.includes('already exists'));
      }
    });

    it('should reject selling non-existent product', async () => {
      try {
        await handleSold(shop1, 'NonExistent', 5, 1000);
        assert.fail('Should have thrown error');
      } catch (err) {
        assert(err.message.includes('not found'));
      }
    });

    it('should handle restock of non-existent product', async () => {
      try {
        await handleRestock(shop1, 'Ghost', 50);
        assert.fail('Should have thrown error');
      } catch (err) {
        assert(err.message.includes('AddProduct'));
      }
    });
  });

  describe('Low Stock Warning', () => {
    const shopLowStock = '+256700001030';

    beforeEach(async () => {
      await initializeDatabase();
      await ensureShopInitialized(shopLowStock);
    });

    it('should include low-stock warning when threshold exceeded', async () => {
      await handleAddProduct(shopLowStock, 'Limited', 50);
      await handleSold(shopLowStock, 'Limited', 15, 1000);
      
      const response = await handleSold(shopLowStock, 'Limited', 20, 1000);
      assert(response.includes('low stock'));
      assert(response.includes('<= 20'));
    });

    it('should not warn when stock is above threshold', async () => {
      await handleAddProduct(shopLowStock, 'Plentiful', 1000);
      const response = await handleSold(shopLowStock, 'Plentiful', 100, 1000);
      assert(!response.includes('low stock'));
    });
  });

  describe('Stock and Summary Commands', () => {
    const shopTest = '+256700001010';

    beforeEach(async () => {
      await initializeDatabase();
      await ensureShopInitialized(shopTest);
    });

    it('should return formatted stock list', async () => {
      await handleAddProduct(shopTest, 'Product1', 50);
      await handleAddProduct(shopTest, 'Product2', 100);
      const response = await handleStock(shopTest);
      assert(response.includes('Product1'));
      assert(response.includes('Product2'));
    });

    it('should return empty inventory message', async () => {
      const shopEmpty = '+256700001011';
      await ensureShopInitialized(shopEmpty);
      const response = await handleStock(shopEmpty);
      assert(response.includes('empty'));
    });

    it('should calculate daily revenue', async () => {
      await handleAddProduct(shopTest, 'Item', 1000);
      await handleSold(shopTest, 'Item', 10, 5000);
      
      const response = await handleSummary(shopTest);
      assert(response.includes('revenue'));
      assert(response.includes('50000') || response.includes('50,000'));
    });
  });

  describe('Undo Command', () => {
    const shopUndo = '+256700001020';

    beforeEach(async () => {
      await initializeDatabase();
      await ensureShopInitialized(shopUndo);
    });

    it('should restore stock and remove sale on undo', async () => {
      await handleAddProduct(shopUndo, 'Item', 100);
      await handleSold(shopUndo, 'Item', 25, 2000);
      
      let product = await getProduct(shopUndo, 'Item');
      assert.strictEqual(product.quantity, 75);

      await handleUndo(shopUndo);
      
      product = await getProduct(shopUndo, 'Item');
      assert.strictEqual(product.quantity, 100);
      
      const lastSale = await getLastSale(shopUndo);
      assert.strictEqual(lastSale, undefined);
    });

    it('should handle undo with no sales', async () => {
      const shopNoSales = '+256700001021';
      await ensureShopInitialized(shopNoSales);
      const response = await handleUndo(shopNoSales);
      assert(response.includes('No recent sale'));
    });
  });

  describe('Help Command', () => {
    const shopHelp = '+256700001040';

    beforeEach(async () => {
      await initializeDatabase();
      await ensureShopInitialized(shopHelp);
    });

    it('should return help message with command list', async () => {
      const response = await handleHelp(shopHelp);
      assert(response.includes('AddProduct'));
      assert(response.includes('Sold'));
      assert(response.includes('Restock'));
      assert(response.includes('Stock'));
    });
  });

  describe('Phone Number Sanitization', () => {
    it('should handle whatsapp: prefix', () => {
      const sanitized = sanitizeShopPhone('whatsapp:+256700000000');
      assert.strictEqual(sanitized, '+256700000000');
    });

    it('should handle mixed case prefix', () => {
      const sanitized = sanitizeShopPhone('WhatsApp:+256700000000');
      assert.strictEqual(sanitized, '+256700000000');
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
