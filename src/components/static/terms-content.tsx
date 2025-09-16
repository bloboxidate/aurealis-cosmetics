export default function TermsContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
        <div className="prose prose-gray max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to Aurealis Cosmetics. These Terms of Service ("Terms") govern your use of our website, 
              products, and services. By accessing or using our services, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-600">
              If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By creating an account, making a purchase, or using our website, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
              posting on our website. Your continued use of our services constitutes acceptance of any changes.
            </p>
          </section>

          {/* Use of Website */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Website</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Permitted Use</h3>
            <p className="text-gray-600 mb-4">
              You may use our website for lawful purposes only. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use our products in accordance with their intended purpose</li>
              <li>Respect intellectual property rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Prohibited Use</h3>
            <p className="text-gray-600 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Use our website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our website</li>
              <li>Upload or transmit malicious code or harmful content</li>
              <li>Impersonate another person or entity</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Products and Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Products and Services</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Product Information</h3>
            <p className="text-gray-600 mb-4">
              We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant 
              that product descriptions or other content is accurate, complete, or error-free.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Product Availability</h3>
            <p className="text-gray-600 mb-4">
              Product availability is subject to change without notice. We reserve the right to limit quantities 
              and discontinue products at any time.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Pricing</h3>
            <p className="text-gray-600 mb-4">
              All prices are subject to change without notice. Prices do not include applicable taxes, shipping, 
              or handling charges unless otherwise stated.
            </p>
          </section>

          {/* Orders and Payment */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Orders and Payment</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Order Acceptance</h3>
            <p className="text-gray-600 mb-4">
              All orders are subject to acceptance by us. We reserve the right to refuse or cancel any order 
              for any reason, including but not limited to product availability, pricing errors, or suspected fraud.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Payment</h3>
            <p className="text-gray-600 mb-4">
              Payment is due at the time of order placement. We accept major credit cards and other payment 
              methods as indicated on our website.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Order Modifications</h3>
            <p className="text-gray-600 mb-4">
              Once an order is placed, modifications may not be possible. Please contact customer service 
              immediately if you need to make changes to your order.
            </p>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Return Policy</h3>
            <p className="text-gray-600 mb-4">
              We offer a 30-day return policy for unopened products in their original packaging. 
              Returns are subject to our Return Policy, which is available on our website.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Refund Processing</h3>
            <p className="text-gray-600 mb-4">
              Refunds will be processed to the original payment method within 5-10 business days 
              after we receive and inspect the returned items.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content on our website, including text, graphics, logos, images, and software, is the property 
              of Aurealis Cosmetics or its licensors and is protected by copyright and other intellectual property laws.
            </p>
            <p className="text-gray-600">
              You may not reproduce, distribute, modify, or create derivative works from our content without 
              our express written permission.
            </p>
          </section>

          {/* Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy</h2>
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, 
              use, and protect your information.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, Aurealis Cosmetics shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising out of or relating to your use of 
              our services.
            </p>
            <p className="text-gray-600">
              Our total liability to you for any damages shall not exceed the amount you paid for the products 
              or services giving rise to the claim.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-600">
              You agree to indemnify and hold harmless Aurealis Cosmetics and its officers, directors, employees, 
              and agents from any claims, damages, or expenses arising out of your use of our services or 
              violation of these Terms.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account and access to our services at any time, with or without 
              cause, with or without notice.
            </p>
            <p className="text-gray-600">
              Upon termination, your right to use our services will cease immediately.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                <strong>Email:</strong> legal@aurealis.com<br />
                <strong>Phone:</strong> +1 (555) 123-4567<br />
                <strong>Address:</strong> 123 Beauty Street, New York, NY 10001
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
