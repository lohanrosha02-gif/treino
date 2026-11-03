# Meu Treino · painel administrativo

Este repositório publica o painel da professora. O portal dos alunos e o catálogo de exercícios ficam em [`treino-v2`](https://github.com/lohanrosha02-gif/treino-v2).

## O que o painel faz

- Autentica o administrador pelo Supabase.
- Cadastra alunos, acompanha inscrições pendentes e aprova o acesso.
- Registra 17 itens de avaliação por aluno, organizados por região corporal, e monta treinos personalizados.
- Salvar a ficha envia a atualização apenas para o aluno selecionado; o portal dele busca mudanças automaticamente enquanto estiver aberto.
- Publica comunicados para alunos aprovados.
- Pode aplicar um plano a todos os cadastros após duas confirmações; as medidas individuais são preservadas.

As fichas, medidas oficiais e progresso ficam no Supabase com Row Level Security (RLS). A professora é a única pessoa que insere ou altera a avaliação; o aluno consulta as próprias medidas e os cálculos automáticos no portal.

## Ativar

Siga [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para configurar o Supabase, o usuário administrador e o GitHub Pages. O navegador usa somente a URL do projeto e a chave publicável; nunca coloque uma `service_role`, chave `sb_secret_` ou token pessoal no código.

## Banco de dados

- `supabase/migrations/20261102_treino.sql` cria a estrutura inicial e as políticas do administrador.
- `supabase/migrations/20261103032334_student_self_registration_with_admin_approval.sql` cria o autocadastro com aprovação e bloqueia a leitura de medidas e treinos até a aprovação.
- `supabase/migrations/20261103035754_secure_individual_8_week_workout_progress.sql` salva a avaliação e o progresso por conta, com RLS.

O arquivo `data/site-content.json` no repositório do portal contém o catálogo de exercícios e referências de mídia; não deve conter dados individuais de alunos. Alguns scripts antigos continuam no histórico, mas o painel atual carrega `admin-supabase.js`.
