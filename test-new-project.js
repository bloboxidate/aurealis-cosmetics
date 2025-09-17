// Test script for new Supabase project
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Testing New Supabase Project...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNewProject() {
  try {
    console.log('\n📡 Testing site_settings table...');
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ site_settings table working!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }

  try {
    console.log('\n🔐 Testing auth service...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Auth error:', error.message);
    } else {
      console.log('✅ Auth service working!');
    }
  } catch (err) {
    console.error('❌ Auth error:', err.message);
  }
}

testNewProject();
