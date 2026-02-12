import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = process.env.METRO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.METRO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        'Missing Supabase env vars. Check METRO_PUBLIC_SUPABASE_URL and METRO_PUBLIC_SUPABASE_ANON_KEY.'
    );
}

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
);

export const getUser = () => supabase.auth.getUser();
