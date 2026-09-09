# Nexo

Central de estudos para ADS, inglês profissional, redes e finanças pessoais.

## Publicar no Netlify

1. Envie esta pasta para um repositório Git.
2. No Netlify, importe o repositório.
3. A configuração já usa `npm run build` e publica `dist`.
4. Publique.

## Firebase

O Nexo já funciona no dispositivo, salvando rascunhos e movimentações no navegador. Quando quiser sincronizar dados entre dispositivos:

1. Crie um aplicativo **Web** no Firebase.
2. Copie `.env.example` para `.env.local`.
3. Preencha a configuração pública do aplicativo.
4. No Netlify, crie as mesmas variáveis em **Site configuration → Environment variables**.
5. Ative Authentication e Firestore antes de salvar dados pessoais na nuvem. Configure regras para que cada usuário leia e escreva apenas seus próprios registros.

A configuração do Firebase Web é pública por natureza; a segurança vem das regras e da autenticação, não de esconder essas variáveis.

