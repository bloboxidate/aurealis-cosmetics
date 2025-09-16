import { 
  TruckIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function ShippingReturnsContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Shipping & Returns
        </h1>
        <p className="text-lg text-gray-600">
          Everything you need to know about shipping and returns
        </p>
      </div>

      {/* Shipping Section */}
      <div className="mb-16">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          <div className="flex items-center mb-6">
            <TruckIcon className="w-8 h-8 text-pink-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
          </div>

          {/* Free Shipping Banner */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-pink-600 mr-3" />
              <div>
                <h3 className="font-semibold text-pink-800">Free Shipping on Orders Over $75</h3>
                <p className="text-pink-700 text-sm">No minimum order required for standard shipping</p>
              </div>
            </div>
          </div>

          {/* Shipping Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ClockIcon className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Standard Shipping</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">3-5 business days</p>
              <p className="text-gray-600 text-sm mb-2">$5.99 or FREE over $75</p>
              <p className="text-gray-500 text-xs">Delivered by USPS or FedEx</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <TruckIcon className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Express Shipping</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">1-2 business days</p>
              <p className="text-gray-600 text-sm mb-2">$12.99</p>
              <p className="text-gray-500 text-xs">Delivered by FedEx</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ShieldCheckIcon className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Overnight Shipping</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2">Next business day</p>
              <p className="text-gray-600 text-sm mb-2">$24.99</p>
              <p className="text-gray-500 text-xs">Delivered by FedEx</p>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Time</h3>
              <p className="text-gray-600">
                All orders are processed within 1-2 business days. Orders placed on weekends or holidays 
                will be processed on the next business day.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Tracking</h3>
              <p className="text-gray-600 mb-2">
                Once your order ships, you'll receive a tracking number via email. You can track your 
                package directly from our website or the carrier's site.
              </p>
              <p className="text-gray-600">
                <strong>Note:</strong> Tracking information may take up to 24 hours to appear in the system.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Areas</h3>
              <p className="text-gray-600 mb-2">
                We currently ship to all 50 US states. International shipping is coming soon!
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800 text-sm">
                    <strong>P.O. Boxes:</strong> We cannot ship to P.O. boxes. Please provide a street address.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Restrictions</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Some products may have shipping restrictions due to size or content</li>
                <li>Perfumes and certain cosmetics may have ground shipping only restrictions</li>
                <li>We reserve the right to refuse shipment to certain addresses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Returns Section */}
      <div className="mb-16">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          <div className="flex items-center mb-6">
            <ArrowPathIcon className="w-8 h-8 text-pink-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Returns & Exchanges</h2>
          </div>

          {/* Return Policy Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-800">30-Day Return Policy</h3>
                <p className="text-green-700 text-sm">Return unopened products within 30 days for a full refund</p>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Return</h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-2">
                <li>Contact our customer service team or use our online return portal</li>
                <li>Receive a return authorization number and prepaid shipping label</li>
                <li>Package items securely in original packaging</li>
                <li>Attach the return label and drop off at any authorized location</li>
                <li>Track your return and receive confirmation once processed</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Requirements</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Items must be unopened and in original packaging</li>
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Original receipt or order confirmation required</li>
                <li>Items must be in resellable condition</li>
                <li>Some items may be final sale (clearly marked)</li>
              </ul>
            </div>
          </div>

          {/* Refund Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Processing</h3>
              <p className="text-gray-600 mb-2">
                Refunds are processed within 5-10 business days after we receive and inspect your returned items.
              </p>
              <p className="text-gray-600">
                The refund will appear on your original payment method. Processing time may vary by bank or credit card company.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Shipping Costs</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <strong>Free Returns:</strong> Returns due to our error or defective products
                </p>
                <p className="text-gray-600">
                  <strong>Customer Returns:</strong> $5.99 return shipping fee (deducted from refund)
                </p>
                <p className="text-gray-600">
                  <strong>Exchanges:</strong> Free return shipping for size/color exchanges
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Exchanges</h3>
              <p className="text-gray-600 mb-2">
                We offer free exchanges for different sizes or colors of the same product. 
                Contact customer service to initiate an exchange.
              </p>
              <p className="text-gray-600">
                If the exchange item costs more, you'll pay the difference. If it costs less, 
                we'll refund the difference.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Damaged or Defective Items</h3>
              <p className="text-gray-600 mb-2">
                If you receive a damaged or defective item, please contact us immediately. 
                We'll send a replacement at no cost to you.
              </p>
              <p className="text-gray-600">
                Please include photos of the damage when contacting customer service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-pink-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Need Help with Shipping or Returns?
        </h2>
        <p className="text-gray-600 mb-6">
          Our customer service team is here to assist you with any shipping or return questions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="px-6 py-3 bg-pink-600 text-white rounded-md font-medium hover:bg-pink-700 transition-colors"
          >
            Contact Support
          </a>
          <a
            href="mailto:returns@aurealis.com"
            className="px-6 py-3 border border-pink-600 text-pink-600 rounded-md font-medium hover:bg-pink-600 hover:text-white transition-colors"
          >
            Email Returns Team
          </a>
        </div>
      </div>
    </div>
  );
}
