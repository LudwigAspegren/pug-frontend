import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djtaonenojsxepcakvvu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqdGFvbmVub2pzeGVwY2FrdnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTgzOTQ4OTYsImV4cCI6MTk3Mzk3MDg5Nn0.xWRitrqda_HxnM44t3TxPwLueabX89VAtt8jBptBYI0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)