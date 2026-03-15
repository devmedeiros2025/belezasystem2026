import { createClient } from '@supabase/supabase-js';

const url = "https://vcrhviybmrlpintvdxjv.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcmh2aXlibXJscGludHZkeGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODI4ODQsImV4cCI6MjA4ODU1ODg4NH0.YQ__QAH_H8wpt_q4_CdwFgkuC_zXX5GQFTi4e-AV8Ic";

const supabase = createClient(url, key);

async function createAccounts() {
  console.log("Iniciando criação das contas de exemplo...\n");

  const accounts = [
    {
      email: 'admin@belezasystem.ao',
      password: 'password123',
      nome: 'Administrador Master',
      nomeNegocio: 'BelezaSystem Angola (Sede)',
      plano: 'Premium',
      role: 'super_admin'
    },
    {
      email: 'gratuito@salao.com',
      password: 'password123',
      nome: 'João Gratuito',
      nomeNegocio: 'Salão João (Trial)',
      plano: 'Gratuito',
      role: 'admin'
    },
    {
      email: 'vip@salao.com',
      password: 'password123',
      nome: 'Maria VIP',
      nomeNegocio: 'Studio Maria (Professional)',
      plano: 'Professional',
      role: 'admin'
    }
  ];

  for (const acc of accounts) {
    console.log(`Criando conta: ${acc.email}...`);
    
    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: acc.email,
      password: acc.password,
      options: {
        data: { nome: acc.nome }
      }
    });

    if (authError && !authError.message.includes("User already registered") && !authError.message.includes("already registered")) {
      console.error(`❌ Erro ao criar auth para ${acc.email}: ${authError.message}`);
      continue;
    }

    if (authError && (authError.message.includes("User already registered") || authError.message.includes("already registered"))) {
        console.log(`⚠️ Usuário ${acc.email} já existe. Tentando login...`);
        // We login anyway
    } else {
        console.log(`✅ Auth de ${acc.email} criado com sucesso.`);
    }

    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({ email: acc.email, password: acc.password });
    
    if (loginData?.user) {
        const userId = loginData.user.id;
        
        // Verifica se já tem estabelecimento
        const { data: estabExiste } = await supabase.from('estabelecimentos').select('id').eq('owner_user_id', userId).single();
        
        if (estabExiste) {
             console.log(`⚠️ Estabelecimento do usuário ${acc.email} já existe.`);
             await supabase.from('estabelecimentos').update({ plano: acc.plano }).eq('id', estabExiste.id);
        } else {
            // Create establishment
            const slugValue = acc.nomeNegocio.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
            
            const { data: estabData, error: estabErr } = await supabase
                .from('estabelecimentos')
                .insert({
                    nome: acc.nomeNegocio,
                    slug: slugValue,
                    plano: acc.plano,
                    owner_user_id: userId
                })
                .select('id')
                .single();

            if (estabErr) {
                console.error(`❌ Erro ao criar estabelecimento para ${acc.email}:`, estabErr);
            } else if (estabData) {
                console.log(`✅ Estabelecimento "${acc.nomeNegocio}" criado.`);
                
                // Link profile to establishment
                await supabase
                    .from('profiles')
                    .update({ estabelecimento_id: estabData.id })
                    .eq('user_id', userId);
                
                console.log(`✅ Perfil vinculado ao estabelecimento.`);
            }
        }
        
        // Adiciona role se for admin
        if (acc.email === 'admin@belezasystem.ao') {
             await supabase.from('user_roles').insert({ user_id: userId, role: 'super_admin' }).catch(() => {});
        } else {
             await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' }).catch(() => {});
        }

        // Sign out
        await supabase.auth.signOut();
    }
    
    console.log("-----------------------------------------");
  }

  console.log("🎉 Contas de exemplo criadas/conferidas! Pode testar os logins.");
}

createAccounts();
