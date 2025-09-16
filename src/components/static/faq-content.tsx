'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQContent() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqData: FAQItem[] = [
    // General Questions
    {
      question: "What is Aurealis Cosmetics?",
      answer: "Aurealis Cosmetics is a premium beauty brand specializing in high-quality cosmetics and skincare products. We offer a carefully curated selection of products designed to enhance your natural beauty.",
      category: "general"
    },
    {
      question: "Are your products cruelty-free?",
      answer: "Yes! All our products are cruelty-free and never tested on animals. We are committed to ethical beauty practices and are certified by leading cruelty-free organizations.",
      category: "general"
    },
    {
      question: "Do you offer vegan products?",
      answer: "Many of our products are vegan-friendly. Look for the vegan label on product pages. We're continuously expanding our vegan product range.",
      category: "general"
    },

    // Orders & Shipping
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee. International shipping times vary by location.",
      category: "shipping"
    },
    {
      question: "What shipping methods do you offer?",
      answer: "We offer standard ground shipping, express shipping, and overnight delivery options. Free shipping is available on orders over $75.",
      category: "shipping"
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can track your package directly from our website or the carrier's site.",
      category: "shipping"
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within the United States. International shipping is coming soon! Sign up for our newsletter to be notified when it becomes available.",
      category: "shipping"
    },

    // Returns & Exchanges
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unopened products in their original packaging. Returns must be initiated within 30 days of delivery.",
      category: "returns"
    },
    {
      question: "How do I return an item?",
      answer: "To return an item, contact our customer service team or use our online return portal. We'll provide you with a return authorization number and shipping label.",
      category: "returns"
    },
    {
      question: "Are there any return fees?",
      answer: "Returns due to our error are free. For customer-initiated returns, a small restocking fee may apply. We'll provide a prepaid return label for your convenience.",
      category: "returns"
    },
    {
      question: "How long do refunds take?",
      answer: "Refunds are processed within 5-10 business days after we receive and inspect the returned items. The refund will appear on your original payment method.",
      category: "returns"
    },

    // Products
    {
      question: "How do I choose the right shade?",
      answer: "Use our virtual shade finder tool or contact our beauty consultants for personalized recommendations. We also offer sample sizes for many products.",
      category: "products"
    },
    {
      question: "What if a product doesn't work for me?",
      answer: "If you're not satisfied with a product, you can return it within 30 days for a full refund. We also offer product exchanges for different shades or formulas.",
      category: "products"
    },
    {
      question: "Do you offer product samples?",
      answer: "Yes! We offer sample sizes for many of our products. Samples are available with purchase or can be requested through our customer service team.",
      category: "products"
    },
    {
      question: "How long do products last?",
      answer: "Product shelf life varies by type. Skincare products typically last 12-24 months, while makeup products can last 6-18 months. Check the packaging for specific expiration dates.",
      category: "products"
    },

    // Account & Technical
    {
      question: "How do I create an account?",
      answer: "Click 'Sign Up' in the top right corner of our website. You'll need to provide your email address and create a password. Account creation is free and gives you access to order history and faster checkout.",
      category: "account"
    },
    {
      question: "I forgot my password. How do I reset it?",
      answer: "Click 'Forgot Password' on the login page and enter your email address. We'll send you a link to reset your password.",
      category: "account"
    },
    {
      question: "Can I change my account information?",
      answer: "Yes! Log into your account and go to 'Account Settings' to update your personal information, shipping addresses, and preferences.",
      category: "account"
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.",
      category: "account"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Questions' },
    { value: 'general', label: 'General' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'returns', label: 'Returns' },
    { value: 'products', label: 'Products' },
    { value: 'account', label: 'Account' }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-600">
          Find answers to common questions about our products and services
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((item, index) => {
          const isOpen = openItems.has(index);
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                {isOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-pink-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Still have questions?
        </h2>
        <p className="text-gray-600 mb-6">
          Our customer service team is here to help! Contact us for personalized assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="px-6 py-3 bg-pink-600 text-white rounded-md font-medium hover:bg-pink-700 transition-colors"
          >
            Contact Us
          </a>
          <a
            href="mailto:support@aurealis.com"
            className="px-6 py-3 border border-pink-600 text-pink-600 rounded-md font-medium hover:bg-pink-600 hover:text-white transition-colors"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
}
