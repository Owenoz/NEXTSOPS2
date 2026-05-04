import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class OrderService {
  async createOrder(userId: string, data: {
    items: Array<{ productId: string; quantity: number; variant?: any }>
    deliveryAddress: any
    paymentMethod: string
  }) {
    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        throw new Error(`Product ${item.productId} not found`)
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`)
      }

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        variant: item.variant,
      })
    }

    const deliveryFee = 15000 // TODO: Calculate based on location
    const total = subtotal + deliveryFee

    // Generate order number
    const orderNumber = `NS-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`

    // Create order (simplified - in reality, group by vendor)
    const order = await prisma.order.create({
      data: {
        userId,
        vendorId: orderItems[0].productId, // TODO: Get actual vendor
        orderNumber,
        status: 'PENDING',
        subtotal,
        deliveryFee,
        total,
        paymentMethod: data.paymentMethod as any,
        paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        deliveryAddress: data.deliveryAddress,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update product stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
          sold: {
            increment: item.quantity,
          },
        },
      })
    }

    return order
  }

  async getUserOrders(userId: string, filters: {
    status?: string
    page?: number
    limit?: number
  }) {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const skip = (page - 1) * limit

    const where: any = { userId }
    if (filters.status) {
      where.status = filters.status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          vendor: {
            select: {
              businessName: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getOrderById(id: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        vendor: {
          select: {
            businessName: true,
            user: {
              select: {
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    return order
  }

  async cancelOrder(id: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new Error('Order cannot be cancelled at this stage')
    }

    // Update order status
    const updated = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        items: true,
      },
    })

    // Restore stock
    for (const item of updated.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
          sold: {
            decrement: item.quantity,
          },
        },
      })
    }

    return updated
  }

  async addReview(userId: string, data: {
    orderId: string
    productId: string
    rating: number
    comment?: string
    images?: string[]
  }) {
    // Verify order is delivered
    const order = await prisma.order.findFirst({
      where: {
        id: data.orderId,
        userId,
        status: 'DELIVERED',
      },
    })

    if (!order) {
      throw new Error('Order not found or not delivered')
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
        images: data.images || [],
        verified: true,
      },
    })

    // Update product rating
    const reviews = await prisma.review.findMany({
      where: { productId: data.productId },
    })

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await prisma.product.update({
      where: { id: data.productId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length,
      },
    })

    return review
  }
}
