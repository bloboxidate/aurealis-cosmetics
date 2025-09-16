# Environment Setup Guide

To get the Aurealis Cosmetics website running properly, you need to create a `.env.local` file in the root directory with the following environment variables:

## Required Environment Variables

Create a file named `.env.local` in the root directory with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Sariee API Configuration
NEXT_PUBLIC_SARIEE_API_URL=https://api.sariee.com/api/company/public/v2
NEXT_PUBLIC_SARIEE_API_KEY=your_sariee_api_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Aurealis Cosmetics
```

## For Development/Testing

If you don't have actual API keys yet, you can use placeholder values. The app will work in "demo mode" with simulated authentication:

```bash
# Supabase Configuration (Placeholder)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key

# Sariee API Configuration (Placeholder)
NEXT_PUBLIC_SARIEE_API_URL=https://api.sariee.com/api/company/public/v2
NEXT_PUBLIC_SARIEE_API_KEY=placeholder-sariee-key

# Stripe Configuration (Placeholder)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_SECRET_KEY=sk_test_placeholder

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Aurealis Cosmetics
```

### Demo Mode Behavior

When using placeholder values:
- ✅ **Registration/Login**: Works with simulated authentication
- ✅ **All Pages**: Fully functional for testing
- ✅ **Shopping Cart**: Works with local storage
- ✅ **Product Browsing**: Uses default product data
- ⚠️ **Real Authentication**: Not available (demo mode)
- ⚠️ **Real Payments**: Not available (demo mode)

## How to Get Real API Keys

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### Sariee API
1. Contact Sariee for API access
2. Get your company-specific API key
3. Update the API URL if needed

### Stripe
1. Go to [stripe.com](https://stripe.com)
2. Create an account
3. Go to Developers > API Keys
4. Copy the publishable and secret keys

## Important Notes

- Never commit the `.env.local` file to version control
- The file is already in `.gitignore`
- Restart the development server after creating the file
- Use test keys for development, production keys for deployment
