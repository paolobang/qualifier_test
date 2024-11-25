import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qnlrumpbtophlvyxbixs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFubHJ1bXBidG9waGx2eXhiaXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NTg0NDAsImV4cCI6MjA0ODEzNDQ0MH0.jlanoRQtgxWIA4Isg6od5B7JVd5lpgSUc7nfc55DwQU";
export const supabase = createClient(supabaseUrl, supabaseKey);