'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, Banknote } from 'lucide-react'

export default function CheckoutForm() {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('momo')

  const cartTotal = 3860000
  const deliveryFee = 15000
  const total = cartTotal + deliveryFee

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`w-24 h-1 ${step > s ? 'bg-primary-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          {step === 1 && (
            <div className="bg-white border-2 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full px-4 py-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <select className="w-full px-4 py-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none">
                    <option>Select City</option>
                    <option>Kampala</option>
                    <option>Entebbe</option>
                    <option>Jinja</option>
                    <option>Mbarara</option>
                  </select>
                  <select className="w-full px-4 py-3 border-2 rounded-lg focus:border-primary-500 focus:outline-none">
                    <option>Select District</option>
                    <option>Kampala</option>
                    <option>Wakiso</option>
                    <option>Mukono</option>
                  </select>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Payment Method */}
          {step === 2 && (
            <div className="bg-white border-2 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3 mb-6">
                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === 'momo' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <Smartphone className="w-6 h-6 text-primary-600" />
                  <div className="flex-1">
                    <div className="font-semibold">MTN Mobile Money</div>
                    <div className="text-sm text-gray-600">Pay with MTN MoMo</div>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === 'airtel' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="airtel"
                    checked={paymentMethod === 'airtel'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <Smartphone className="w-6 h-6 text-red-600" />
                  <div className="flex-1">
                    <div className="font-semibold">Airtel Money</div>
                    <div className="text-sm text-gray-600">Pay with Airtel Money</div>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard</div>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <Banknote className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <div className="font-semibold">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive</div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Review */}
          {step === 3 && (
            <div className="bg-white border-2 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Review Your Order</h2>
              <div className="space-y-4 mb-6">
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-gray-600">John Doe<br />+256 700 123 456<br />Plot 123, Kampala Road<br />Kampala, Uganda</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <p className="text-gray-600">MTN Mobile Money</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border-2 border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
                <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold">
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal (3 items)</span>
                <span className="font-medium">UGX {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">UGX {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">UGX {total.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              ✓ Free delivery on orders over UGX 100,000
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
