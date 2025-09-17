# Create New Supabase Project

## Steps to Create a New Project:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in to your account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - **Name**: `aurealis-cosmetics-new`
     - **Database Password**: Generate a strong password
     - **Region**: Choose closest to your location

3. **Get New Credentials**
   - Go to Project Settings → API
   - Copy the new values:
     - **Project URL** (e.g., `https://your-new-project.supabase.co`)
     - **Anon/Public Key** (starts with `eyJ...`)

4. **Update Environment Variables**
   - Update your `.env.local` file with the new credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-new-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key_here
   ```

5. **Run the Schema**
   - Go to SQL Editor in your new project
   - Run the `complete-schema.sql` file

6. **Test the Connection**
   - Run `node test-credentials.js` to verify it works
