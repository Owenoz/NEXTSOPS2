const assert = require('assert');
const { parseCommand } = require('../commands');

describe('Command Parser Tests', () => {
  describe('Sold Command', () => {
    it('should parse sold command with product name, quantity, price', () => {
      const result = parseCommand('Sold Sugar 5 2000');
      assert.strictEqual(result.type, 'Sold');
      assert.strictEqual(result.params.productName, 'Sugar');
      assert.strictEqual(result.params.quantity, 5);
      assert.strictEqual(result.params.price, 2000);
    });

    it('should parse sold command with multi-word product name', () => {
      const result = parseCommand('Sold Maize Flour 10 1500');
      assert.strictEqual(result.type, 'Sold');
      assert.strictEqual(result.params.productName, 'Maize Flour');
      assert.strictEqual(result.params.quantity, 10);
      assert.strictEqual(result.params.price, 1500);
    });

    it('should handle sold with missing parameters', () => {
      const result = parseCommand('Sold Sugar');
      assert.strictEqual(result.type, 'Invalid');
      assert(result.error.includes('Sold command needs'));
    });

    it('should handle sold with non-numeric quantity', () => {
      const result = parseCommand('Sold Sugar abc 2000');
      assert.strictEqual(result.type, 'Invalid');
      assert(result.error.includes('must be numbers'));
    });
  });

  describe('Restock Command', () => {
    it('should parse restock command with product name and quantity', () => {
      const result = parseCommand('Restock Rice 50');
      assert.strictEqual(result.type, 'Restock');
      assert.strictEqual(result.params.productName, 'Rice');
      assert.strictEqual(result.params.quantity, 50);
    });

    it('should parse restock command with multi-word product name', () => {
      const result = parseCommand('Restock Maize Flour 20');
      assert.strictEqual(result.type, 'Restock');
      assert.strictEqual(result.params.productName, 'Maize Flour');
      assert.strictEqual(result.params.quantity, 20);
    });

    it('should handle restock with missing quantity', () => {
      const result = parseCommand('Restock Sugar');
      assert.strictEqual(result.type, 'Invalid');
    });

    it('should handle restock with non-numeric quantity', () => {
      const result = parseCommand('Restock Salt xyz');
      assert.strictEqual(result.type, 'Invalid');
      assert(result.error.includes('must be a number'));
    });
  });

  describe('AddProduct Command', () => {
    it('should parse addproduct command with product name and initial stock', () => {
      const result = parseCommand('AddProduct Tomato 100');
      assert.strictEqual(result.type, 'AddProduct');
      assert.strictEqual(result.params.productName, 'Tomato');
      assert.strictEqual(result.params.quantity, 100);
    });

    it('should parse addproduct command with multi-word product name', () => {
      const result = parseCommand('AddProduct Cooking Oil 30');
      assert.strictEqual(result.type, 'AddProduct');
      assert.strictEqual(result.params.productName, 'Cooking Oil');
      assert.strictEqual(result.params.quantity, 30);
    });

    it('should handle addproduct with missing stock', () => {
      const result = parseCommand('AddProduct NewProduct');
      assert.strictEqual(result.type, 'Invalid');
    });

    it('should handle addproduct with non-numeric stock', () => {
      const result = parseCommand('AddProduct Milk abc');
      assert.strictEqual(result.type, 'Invalid');
    });
  });

  describe('Single-Word Commands', () => {
    it('should parse stock command', () => {
      const result = parseCommand('Stock');
      assert.strictEqual(result.type, 'Stock');
    });

    it('should parse summary command', () => {
      const result = parseCommand('Summary');
      assert.strictEqual(result.type, 'Summary');
    });

    it('should parse undo command', () => {
      const result = parseCommand('Undo');
      assert.strictEqual(result.type, 'Undo');
    });

    it('should parse help command', () => {
      const result = parseCommand('Help');
      assert.strictEqual(result.type, 'Help');
    });

    it('should parse myshop command as help', () => {
      const result = parseCommand('MyShop');
      assert.strictEqual(result.type, 'Help');
    });
  });

  describe('Case Insensitivity', () => {
    it('should handle lowercase commands', () => {
      const result = parseCommand('sold sugar 2 1000');
      assert.strictEqual(result.type, 'Sold');
    });

    it('should handle mixed case commands', () => {
      const result = parseCommand('ReStOcK Rice 25');
      assert.strictEqual(result.type, 'Restock');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      const result = parseCommand('');
      assert.strictEqual(result.type, 'Unknown');
    });

    it('should handle null message', () => {
      const result = parseCommand(null);
      assert.strictEqual(result.type, 'Unknown');
    });

    it('should handle extra whitespace', () => {
      const result = parseCommand('  Sold   Sugar   5   2000  ');
      assert.strictEqual(result.type, 'Sold');
      assert.strictEqual(result.params.productName, 'Sugar');
    });

    it('should handle unknown command', () => {
      const result = parseCommand('Unknown command');
      assert.strictEqual(result.type, 'Unknown');
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
