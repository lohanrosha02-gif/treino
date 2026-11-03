# Meu Treino · Painel administrativo

Este repositório (`treino`) hospeda o **painel administrativo** estático do projeto Meu Treino. O site dos usuários está no repositório independente [`treino-v2`](https://github.com/lohanrosha02-gif/treino-v2).

## Como funciona

1. Abra a página publicada deste repositório (`/treino/`).
2. No GitHub, crie um **fine-grained personal access token** em Settings → Developer settings → Personal access tokens → Fine-grained tokens.
3. Restrinja o token a **Only select repositories → treino-v2** e dê somente a permissão **Repository permissions → Contents: Read and write**. Use validade curta.
4. Cole o token **somente no campo do painel** e clique em Conectar.
5. Altere avisos, títulos, dias de treino, doses, orientações, passos e cardio. Clique em **Publicar para todos**.
6. O painel envia o JSON atualizado para `lohanrosha02-gif/treino-v2` → `data/site-content.json` em `main` via API oficial do GitHub. O site dos usuários busca esse JSON a cada carregamento de página.

### Segurança e privacidade

- **Nunca** coloque o token no código, em arquivos do repositório nem em mensagens de chat.
- O token digitado fica somente em memória enquanto esta aba está aberta; o painel não o salva no navegador nem o envia a terceiros. Todas as chamadas autenticadas vão para `https://api.github.com`.
- O painel é uma **página pública com publicação protegida por token do GitHub**, não um backend com login privado. Em uma futura implantação profissional, substitua o token manual por autenticação OAuth/GitHub App com backend seguro.
- O GitHub Pages é estático: não há banco de dados nem sincronização de dados individuais. Medidas, cargas, semanas e progresso permanecem em `localStorage` do navegador de cada aluno no site `treino-v2`.
- Não crie avisos com dados pessoais. Qualquer alteração no JSON público fica visível a todos.
- O painel não altera IDs, vídeos, tipos de exercício nem adiciona/remove exercícios. Isso exige atualização do código do site principal.
- Se o GitHub Pages não estiver habilitado, configure **Settings → Pages → Deploy from a branch → main → / (root)** em cada repositório.

Os arquivos do site antigo continuam no histórico e no repositório por compatibilidade, mas a página `index.html` agora abre o painel administrativo.
