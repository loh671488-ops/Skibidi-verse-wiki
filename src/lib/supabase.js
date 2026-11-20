import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfcvxcxtbjnycviubtxd.supabase.co';

const supabaseKey = 'sb_publishable_P-3ksoTXf8zG3eJF5mFhyQ_6fNuO5Ne';

export const supabase = createClient(supabaseUrl, supabaseKey);
