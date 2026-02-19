import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .upsert({
            id: 'demo-user-123',
            email: 'priya@example.com',
            name: 'Priya',
            industry: 'Textiles',
            language: 'en'
        }, { onConflict: 'id' })
        .select()
        .single();

    if (error) {
        console.error('Seeding Error:', error);
    } else {
        console.log('Seeded User:', user);
    }
}

main();
