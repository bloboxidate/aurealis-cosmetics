import Image from 'next/image';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';

export default function AboutContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Hero Section */}
      <div className="text-center mb-12 lg:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          About Aurealis Cosmetics
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted partner in premium beauty and skincare products. We believe that everyone deserves to feel confident and beautiful in their own skin.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Story</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Founded with a passion for beauty and a commitment to quality, Aurealis Cosmetics has been at the forefront of the beauty industry for over a decade. Our journey began with a simple belief: that beauty should be accessible, safe, and empowering.
            </p>
            <p>
              We started as a small team of beauty enthusiasts who were frustrated with the lack of transparency in the cosmetics industry. We wanted to create a brand that not only delivered exceptional products but also educated and empowered our customers to make informed choices about their beauty routine.
            </p>
            <p>
              Today, Aurealis Cosmetics has grown into a trusted name in the beauty community, known for our innovative formulations, ethical practices, and unwavering commitment to customer satisfaction.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="/placeholder-about.jpg"
              alt="Aurealis Cosmetics team"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Our Mission & Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
            <p className="text-gray-600">
              We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our high standards for safety, effectiveness, and longevity.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer-Centric</h3>
            <p className="text-gray-600">
              Our customers are at the heart of everything we do. We listen to feedback, continuously improve, and strive to exceed expectations with every interaction.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ethical Practices</h3>
            <p className="text-gray-600">
              We are committed to ethical sourcing, cruelty-free testing, and sustainable practices. Beauty should never come at the cost of our planet or its inhabitants.
            </p>
          </div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Skincare</h3>
            <p className="text-gray-600 text-sm">
              Advanced formulations designed to nourish, protect, and rejuvenate your skin at every stage of life.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Makeup</h3>
            <p className="text-gray-600 text-sm">
              High-performance cosmetics that deliver professional results for everyday wear and special occasions.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Guidance</h3>
            <p className="text-gray-600 text-sm">
              Personalized beauty consultations and expert advice to help you find the perfect products for your needs.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Collections</h3>
            <p className="text-gray-600 text-sm">
              Limited edition and seasonal collections featuring the latest trends and innovative formulations.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
            <p className="text-pink-600 mb-2">Founder & CEO</p>
            <p className="text-gray-600 text-sm">
              Beauty industry veteran with over 15 years of experience in product development and brand strategy.
            </p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Dr. Maria Rodriguez</h3>
            <p className="text-pink-600 mb-2">Chief Scientific Officer</p>
            <p className="text-gray-600 text-sm">
              Dermatologist and cosmetic chemist leading our research and development initiatives.
            </p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Alex Chen</h3>
            <p className="text-pink-600 mb-2">Creative Director</p>
            <p className="text-gray-600 text-sm">
              Award-winning makeup artist and creative visionary behind our product aesthetics and campaigns.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-pink-600 rounded-lg p-8 lg:p-12 text-center text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Your Beauty Journey?</h2>
        <p className="text-lg mb-6 opacity-90">
          Discover our carefully curated collection of premium beauty products and find your perfect match.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/products"
            className="px-6 py-3 bg-white text-pink-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border border-white text-white rounded-md font-medium hover:bg-white hover:text-pink-600 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
