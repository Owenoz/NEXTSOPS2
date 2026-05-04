import { Router } from 'express'

const router = Router()

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  // TODO: Fetch categories with hierarchy

  res.json({
    categories: [
      {
        id: '1',
        name: 'Phones',
        slug: 'phones',
        icon: 'smartphone',
        productCount: 1234,
        children: [
          { id: '1-1', name: 'Smartphones', slug: 'smartphones' },
          { id: '1-2', name: 'Feature Phones', slug: 'feature-phones' },
        ],
      },
      {
        id: '2',
        name: 'Electronics',
        slug: 'electronics',
        icon: 'laptop',
        productCount: 2345,
      },
      // ... more categories
    ],
  })
})

// GET /api/categories/:slug - Get category details
router.get('/:slug', async (req, res) => {
  const { slug } = req.params

  // TODO: Fetch category by slug
  // TODO: Include subcategories

  res.json({
    id: '1',
    name: 'Phones',
    slug,
    description: 'Latest smartphones and feature phones',
    productCount: 1234,
    children: [],
  })
})

module.exports = router
