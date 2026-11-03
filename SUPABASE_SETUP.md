# Meu Treino + Supabase: configuração necessária

O repositório `treino` é o **painel de administração**. O `treino-v2` é o site de consulta **individual**. Os dados são armazenados no Supabase e não mais em um arquivo JSON público.

## Para ativar

1. Crie um projeto em https://supabase.com/dashboard e habilite **Authentication → Providers → Email** com **Confirm email** ligado.
2. Copie a **Project URL** e a chave **Publishable** (prefixo `sb_publishable_`) no painel do Supabase, em **Connect** ou **Settings → API Keys**.
3. Edite o arquivo `supabase-config.js` **nos dois repositórios** e preencha só `url` e `publishableKey`. Esses valores podem estar em código público, com RLS configurado. **NUNCA** cole a secret key ou `service_role`.
4. Em **SQL Editor**, execute o SQL contido em `supabase/migrations/20261102_treino.sql`, disponível aqui no repositório administrativo.
5. Em **Authentication → Users**, crie o usuário administrador (e-mail e senha). Copie o **User UID** real. No SQL Editor execute:

```sql
insert into public.admin_users (user_id)
values ('COLE-AQUI-O-UUID-DO-ADMIN')
on conflict (user_id) do nothing;
```

6. Em **Authentication → URL Configuration**, adicione os dois endereços GitHub Pages na lista de URLs permitidas/redirecionamento conforme seus fluxos de login.
7. Habilite o GitHub Pages nos dois repositórios (branch `main`, pasta raiz).

## Utilização

- O administrador entra no endereço `/treino/` com e-mail e senha do Supabase.
- Cadastra o cliente com **nome e e-mail que ele usará para entrar**, preenche as 12 medidas e monta as sessões e exercícios. Pode usar um plano base, criar ou remover sessões e exercícios, e salvar.
- Para liberar o cliente, ele deve acessar `/treino-v2/`, criar sua conta com **o mesmo e-mail cadastrado no admin** e confirmar o e-mail. O site associa o login a seu cadastro automaticamente pela função `claim_treino_client()`.
- O cliente só consegue **consultar suas próprias medições e fichas**, sem botões de edição.
- A função de copiar o plano padrão para todos atualiza as fichas de vários clientes com confirmação explícita. Ela não copia medições e não sobrescreve o vínculo com os usuários.

## Proteção dos dados

- **RLS obrigatória**: tabelas permitem alterações somente a administradores cadastrados. Os clientes conseguem ler somente seus próprios dados.
- As medidas corporais **não devem** ser colocadas em arquivos públicos ou no GitHub.
- O navegador carrega apenas a chave publicável. **Não use service role nem secret key no JavaScript.**
- Exija e-mail confirmado. Se permitir cadastro sem confirmação, o vínculo seguro do cliente não será efetuado.
- O GitHub Pages hospeda apenas os arquivos do app; os dados vêm do Supabase.
- Evite publicar dados reais antes de testar as permissões RLS com duas contas de clientes distintos.
- O antigo conteúdo em `treino-v2/data/site-content.json` foi deixado no histórico do projeto para preservar o material de treino, mas o site de consulta não o utiliza.

## Limites da primeira versão

- Os dados de cada cliente são vinculados ao e-mail confirmado da conta no Supabase. Se um cliente trocar de e-mail, atualize o cadastro e a associação no banco com supervisão.
- Ainda não há upload próprio de vídeos; as mídias já existentes em `treino-v2/assets` podem ser vinculadas pelo ID de vídeo.
- Não há migração automática de dados que o aluno tenha salvo em `localStorage` anteriormente.
- O projeto Supabase e as regras SQL precisam ser ativados no dashboard para os sites funcionarem ao vivo.
