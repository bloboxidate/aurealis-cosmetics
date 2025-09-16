# Supabase Setup Guide for Aurealis Cosmetics

This guide explains how to set up and configure Supabase for the Aurealis cosmetics website.

## Prerequisites

1. Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Supabase CLI installed (`npm install -g supabase`)

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `aurealis-cosmetics`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Project Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Sariee API Configuration
NEXT_PUBLIC_SARIEE_API_URL=https://api.sariee.com/api/company/public/v2
NEXT_PUBLIC_SARIEE_API_KEY=your_sariee_api_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run Database Migrations

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migrations in order:

```sql
-- Run 001_initial_schema.sql
-- Run 002_indexes_and_triggers.sql  
-- Run 003_rls_policies.sql
-- Run 004_initial_data.sql
```

#### Option B: Using Supabase CLI

```bash
# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Configure Authentication

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure the following:

#### Site URL
```
http://localhost:3000 (for development)
https://yourdomain.com (for production)
```

#### Redirect URLs
```
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
```

#### Email Templates
Customize the email templates for:
- Confirm signup
- Reset password
- Magic link

### 6. Set Up Row Level Security (RLS)

The migrations automatically set up RLS policies, but you can verify them in:
- Authentication → Policies
- Make sure all tables have appropriate policies

### 7. Configure Storage (Optional)

If you plan to store images in Supabase:

1. Go to Storage in your dashboard
2. Create a new bucket called `product-images`
3. Set up policies for public read access

```sql
-- Allow public read access to product images
CREATE POLICY "Product images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

## Database Schema Overview

### Core Tables

- **users** - User profiles (extends Supabase auth.users)
- **products** - Product catalog (synced with Sariee)
- **categories** - Product categories (synced with Sariee)
- **orders** - Customer orders
- **cart_items** - Shopping cart items
- **user_addresses** - Customer addresses

### Key Features

- **Sariee Integration**: Tables include `sariee_*_id` fields for syncing
- **Row Level Security**: Users can only access their own data
- **Automatic Timestamps**: `created_at` and `updated_at` fields
- **Order Number Generation**: Automatic order number generation (A000001, A000002, etc.)

## Testing the Setup

### 1. Test Database Connection

```typescript
import { supabase } from './src/lib/supabase';

async function testConnection() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful:', data);
  }
}
```

### 2. Test Authentication

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/register`
3. Try creating a new account
4. Check the Supabase dashboard → Authentication → Users

### 3. Test Sariee Sync

```typescript
import { SupabaseSarieeSync } from './src/lib/supabase-sync';

// Test syncing categories
const result = await SupabaseSarieeSync.syncCategories();
console.log('Sync result:', result);
```

## Production Deployment

### 1. Update Environment Variables

Update your production environment variables with:
- Production Supabase URL and keys
- Production Sariee API credentials
- Production Stripe keys

### 2. Update Site URLs

In Supabase dashboard → Authentication → Settings:
- Update Site URL to your production domain
- Update Redirect URLs to include production domain

### 3. Set Up Monitoring

- Enable Supabase monitoring and alerts
- Set up error tracking (Sentry, etc.)
- Monitor database performance

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Check that policies are properly set up
   - Verify user authentication is working

2. **Migration Errors**
   - Run migrations in the correct order
   - Check for existing data conflicts

3. **Authentication Issues**
   - Verify Site URL and Redirect URLs
   - Check email template configuration

4. **Sariee Sync Issues**
   - Verify API credentials are correct
   - Check network connectivity
   - Review API rate limits

### Getting Help

1. Check Supabase documentation
2. Review error logs in Supabase dashboard
3. Check browser console for client-side errors
4. Contact support if needed

## Security Best Practices

1. **Never expose service role key** in client-side code
2. **Use RLS policies** to protect user data
3. **Validate all inputs** before database operations
4. **Use HTTPS** in production
5. **Regular security audits** of your database

## Backup and Recovery

1. **Enable automatic backups** in Supabase dashboard
2. **Export data regularly** for additional backup
3. **Test recovery procedures** periodically
4. **Document recovery processes** for your team
