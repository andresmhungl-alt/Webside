require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkSchema() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const projectRef = supabaseUrl ? supabaseUrl.split('.')[0].replace('https://', '') : 'Unknown';

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Error: Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('----------------------------------------------------');
    console.log(`Connecting to Supabase Project: ${projectRef}`);
    console.log(`Full URL: ${supabaseUrl}`);
    console.log('----------------------------------------------------');
    console.log('Checking stores table schema...');

    const { data: stores, error } = await supabase
        .from('stores')
        .select('*')
        .limit(1);

    if (error) {
        console.error('API Error selecting from stores:', error.message);
        if (error.message.includes('contact_email')) {
            console.log('CONFIRMED: The API does NOT know about `contact_email`.');
        }
        return;
    }

    if (stores && stores.length > 0) {
        const store = stores[0];
        const missingFields = [];
        const foundFields = [];

        ['contact_email', 'whatsapp', 'telegram', 'is_chat_enabled'].forEach(field => {
            if (store[field] === undefined) {
                missingFields.push(field);
            } else {
                foundFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            console.log('----------------------------------------------------');
            console.error('❌ PROBLEM DETECTED: Missing columns in API response!');
            console.error('Missing:', missingFields.join(', '));
            console.log('Found:', foundFields.length > 0 ? foundFields.join(', ') : 'None');
            console.log('----------------------------------------------------');
            console.log('Troubleshooting Steps:');
            console.log('1. Verify you ran the SQL migration on PROJECT ID:', projectRef);
            console.log('2. Run `NOTIFY pgrst, "reload config";` in the SQL Editor.');
            console.log('3. Wait 30 seconds and try again.');
        } else {
            console.log('✅ SUCCESS: All contact columns are present!');
        }
    } else {
        console.log('Table seems empty, creating a dummy store to test insert...');
        // Try inserting capturing error? Too risky if user_id required.
        console.log('Cannot verify columns on empty table via select(*). assuming failure if error not thrown earlier.');
    }
}

checkSchema();
