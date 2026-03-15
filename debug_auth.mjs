import { createClient } from '@supabase/supabase-js';

const url = "https://vcrhviybmrlpintvdxjv.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcmh2aXlibXJscGludHZkeGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODI4ODQsImV4cCI6MjA4ODU1ODg4NH0.YQ__QAH_H8wpt_q4_CdwFgkuC_zXX5GQFTi4e-AV8Ic";

const supabase = createClient(url, key);

async function testLogin() {
  console.log("Tentando logar como admin... (senha: password123)");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@belezasystem.ao',
    password: 'password123',
  });
  
  if (error) {
    console.error("ERRO DE LOGIN:", error.message);
  } else {
    console.log("LOGIN BEM SUCEDIDO. User ID:", data.user.id);
  }
}

testLogin();
