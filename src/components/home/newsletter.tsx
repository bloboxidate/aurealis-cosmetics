'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
      // For now, we'll just simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="bg-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to the Aurealis Family!
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Thank you for subscribing. You'll receive exclusive offers and beauty tips.
            </p>
            <button
              onClick={() => setIsSubscribed(false)}
              className="text-purple-200 hover:text-white underline"
            >
              Subscribe another email
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-purple-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-purple-500 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Beautiful, Stay Updated
          </h2>
          
          <p className="text-xl text-purple-100 mb-8">
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive offers, and beauty tips from our experts.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-md border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>

          <p className="text-sm text-purple-200 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-2">15%</div>
              <div className="text-purple-200">Off your first order</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">Free</div>
              <div className="text-purple-200">Beauty tips & tutorials</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">Early</div>
              <div className="text-purple-200">Access to new products</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
