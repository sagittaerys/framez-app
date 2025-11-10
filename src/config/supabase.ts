import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltjqmqfxbzwvbulmbhdm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0anFtcWZ4Ynp3dmJ1bG1iaGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NjcyNDEsImV4cCI6MjA3ODI0MzI0MX0.5m9wV8TGLAtZhcRl_YqgOor2wHQDYwXwRGjQdqo_QQU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});