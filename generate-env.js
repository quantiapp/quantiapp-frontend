const fs = require('fs');
const path = require('path');

// Caminho absoluto para a pasta e o arquivo
const envDir = path.resolve(__dirname, 'src/environments');
const envFile = path.join(envDir, 'environment.ts');

// Cria a pasta caso não exista
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Conteúdo do environment.ts
const envContent = `
export const environment = {
  production: true,
  server: '${process.env['server'] || 'http://localhost:8000'}',
  supabaseUrl: '${process.env['supabaseUrl'] || 'https://xyz.supabase.co'}',
  supabaseAnonKey: '${process.env['supabaseAnonKey'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}',
  trialDays: ${process.env['trialDays'] || 30}
};
`;

// Grava o arquivo
fs.writeFileSync(envFile, envContent.trim(), { encoding: 'utf8' });

console.log('✅ Arquivo environment.ts gerado com sucesso!');
