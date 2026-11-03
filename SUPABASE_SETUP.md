# Meu Treino · configuração do Supabase

O repositório `treino` publica o painel administrativo. O portal individual fica em `treino-v2`; ambos usam o mesmo projeto Supabase.

## Nova instalação

1. Crie um projeto Supabase e habilite o provedor **Email** em **Authentication → Providers**. Mantenha a confirmação de e-mail ligada.
2. Copie a **Project URL** e a chave **Publishable** (`sb_publishable_…`) em **Connect** ou **Settings → API Keys**.
3. Preencha somente `url` e `publishableKey` em `supabase-config.js` nos dois repositórios. Esses valores são públicos; nunca use `service_role` ou uma chave `sb_secret_` no navegador.
4. No **SQL Editor**, execute estes arquivos nesta ordem:
   1. `supabase/migrations/20261102_treino.sql`
   2. `supabase/migrations/20261103032334_student_self_registration_with_admin_approval.sql`
   3. `supabase/migrations/20261103035754_secure_individual_8_week_workout_progress.sql`
5. Em **Authentication → Users**, crie a conta do administrador. Copie o **User UID** e execute:

   ```sql
   insert into public.admin_users (user_id)
   values ('COLE-AQUI-O-UUID-DO-ADMIN')
   on conflict (user_id) do nothing;
   ```

6. Em **Authentication → URL Configuration**, permita os endereços `/treino/` e `/treino-v2/` do GitHub Pages como URLs do site e de redirecionamento.
7. Ative o GitHub Pages nos dois repositórios usando `main` e a pasta raiz.

## Projeto já configurado

Antes de rodar SQL em um projeto com dados, confira **Database → Migrations** e as tabelas existentes. A migração de autocadastro e a de progresso já estão registradas no projeto atual. Não reaplique a instalação inicial em um banco existente só para atualizar os arquivos do GitHub; aplique apenas uma migração realmente ausente.

## Uso do painel e do portal

- Entre em `/treino/` com a conta do administrador e do Supabase.
- Cadastre o aluno ou peça para ele criar a conta em `/treino-v2/`. O autocadastro precisa usar um e-mail confirmado; o registro fica pendente até aprovação.
- Se o e-mail de confirmação não chegar, o aluno pode pedir outro pela tela de entrada. Após muitas solicitações, o Supabase limita temporariamente novos envios; aguarde e confira a caixa de spam.
- Abra **Pendentes**, escolha o aluno e clique em **Aprovar aluno**. O plano-base A–D só é atribuído quando o aluno ainda não tem um plano.
- Edite as medidas e os treinos nas abas do painel. O aluno consulta as medidas publicadas pelo professor e registra sua própria avaliação e evolução.

## Dados e permissões

- O cadastro, as medidas do professor, os planos e os comunicados ficam no Supabase. A avaliação pessoal e os registros de treino são salvos em `client_progress`.
- RLS restringe cada aluno aos próprios dados e bloqueia medidas e planos enquanto a conta estiver pendente. Só um UID listado em `admin_users` recebe permissões administrativas.
- As migrações concedem explicitamente os acessos mínimos usados pelo Data API e habilitam RLS nas tabelas. Ao criar novas tabelas, configure os `GRANT`s e as políticas RLS junto com a estrutura.
- O código do navegador usa somente a chave publicável. O painel atual autentica pelo Supabase; não pede token pessoal do GitHub.
- O catálogo `treino-v2/data/site-content.json` deve conter apenas material genérico de exercícios e referências de mídia, nunca dados individuais.
- Backups anteriores do navegador podem ser importados pelo próprio aluno no menu **Meus dados**. Eles não são associados automaticamente a uma conta.

## E-mails de autenticação

O SMTP padrão do Supabase tem limites de envio. Para uso contínuo, configure um provedor SMTP próprio em **Authentication → SMTP Settings**. O portal mostra uma mensagem de espera quando o Supabase retorna limite temporário.
