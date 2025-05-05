import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://fvrnedtqidpcfiymfnjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cm5lZHRxaWRwY2ZpeW1mbmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDk5NTQsImV4cCI6MjA2MTcyNTk1NH0.UeXPF45bTcUbhY3vNmjuIFTgT5jJ55MI6cNE_wuJzB4';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);