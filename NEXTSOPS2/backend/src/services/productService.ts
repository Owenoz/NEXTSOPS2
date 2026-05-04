import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class ProductService {
  async getProducts(filters: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    rating?: number
    sort?: string
    page?: number
    limit?: number
  }) {
    const page = filters.page || 1
    const limit = filters.limit || 20
    const skip = (page - 1) * limit

    const where: any = {
      active: true,
    }

    if (filters.category) {
      where.categoryId = filters.category
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {}
      if (filters.minPrice) where.price.gte = filters.minPrice
      if (filters.maxPrice) where.price.lte = filters.maxPrice
    }

    if (filters.rating) {
      where.rating = { gte: filters.rating }
    }

    let orderBy: any = { createdAt: 'desc' }
    if (filters.sort === 'price_asc') orderBy = { price: 'asc' }
    if (filters.sort === 'price_desc') orderBy = { price: 'desc' }
    if (filters.sort === 'popular') orderBy = { sold: 'desc' }
    if (filters.sort === 'rating') orderBy = { rating: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              rating: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            rating: true,
            totalSales: true,
          },
        },
        category: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return product
  }

  async createProduct(vendorId: string, data: any) {
    const product = await prisma.product.create({
      data: {
        vendorId,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        stock: data.stock,
        images: data.images || [],
        variants: data.variants,
        specifications: data.specifications,
        active: false, // Pending approval
      },
    })

    return product
  }

  async updateProduct(id: string, vendorId: string, data: any) {
    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product || product.vendorId !== vendorId) {
      throw new Error('Product not found or unauthorized')
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        stock: data.stock,
        images: data.images,
        variants: data.variants,
        specifications: data.specifications,
      },
    })

    return updated
  }

  async deleteProduct(id: string, vendorId: string) {
    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product || product.vendorId !== vendorId) {
      throw new Error('Product not found or unauthorized')
    }

    await prisma.product.delete({
      where: { id },
    })

    return { message: 'Product deleted successfully' }
  }

  async searchAutocomplete(query: string) {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
    })

    return { suggestions: products }
  }
}
