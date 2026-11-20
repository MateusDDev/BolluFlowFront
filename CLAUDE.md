# BolluFlow Front

Front do BolluFlow (gestão para confeitaria/alimentação). API em `../BolluFlow` (.NET) — veja o CLAUDE.md de lá para regras de negócio.

## Fase atual do produto

Tudo que existe hoje é o plano gratuito e o foco é **polir o que já existe**. Funcionalidade nova não é implementada direto: entra primeiro no roadmap (`../BolluFlow/docs/roadmap.md`) como plano.

## Stack

- Next.js 16 (App Router, tudo client-side: páginas/containers com `'use client'`), React 19 + React Compiler
- TanStack Query 5 (dados) e TanStack Table 8 (tabelas via `ui/dataTable`)
- shadcn/ui (Radix) em `src/shared/components/ui` + Tailwind 4, lucide-react, recharts, sonner (toasts), zod
- Supabase Storage só para upload de imagens (`src/shared/lib/supabase.ts`)

## Comandos

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint    # eslint + prettier (warn)
```

Env (`.env-example`): `NEXT_PUBLIC_API_URL` (ex.: http://localhost:5143), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_BUCKET`.

Prettier: 4 espaços, sem ponto e vírgula, aspas simples, `trailingComma: es5`.

## Estrutura

```
src/app/(private)/...        rotas autenticadas (layout com AuthWrapper + AppSidebar + NavBar)
src/app/(public)/login       login
src/app/(public)/cardapio/[slug]  cardápio público para o cliente final fazer pedido
src/features/<feature>/
    services/<x>.api.ts      chamadas HTTP (apiClient)       services/<x>.model.ts  tipos
    hooks/queries|mutations  useGetX / useCreateX (React Query)
    components/atoms|molecules|organisms   (atomic design)
    containers/              componente de página que junta tudo
    list/ e details/         sub-divisão quando a feature tem listagem + página de detalhe
src/shared/api               apiClient (auth), publicClient (cardápio), fileClient (download PDF), provider (QueryClient)
src/shared/components        AppSidebar, NavBar, SearchableSelect, DatePicker, ImageUpload, ui/*
src/shared/navigation/items.ts   itens e seções do menu lateral (fonte única da navegação)
```

Aliases (tsconfig): `@/*` → `src/*`, `components/*`, `ui/*`, `lib/*`, `hooks/*`.

## Commits

- Padrão Conventional Commits, mensagem curta **em inglês**: `feat: add quick sale button`, `fix: ...`, `refactor: ...`, `docs: ...`, `chore: ...`.
- Um commit por mudança lógica, feito depois de testada (mesmo que só localmente, ponta a ponta).

## Convenções

- **Código em inglês**: componentes, hooks, funções, variáveis, tipos, nomes de arquivo e de pasta (ex.: `trackStock`, `useGetOnboardingProgress`). Só o texto exibido ao usuário fica em pt-BR. Rotas de página já existentes em pt-BR (`/financeiro`, `/configuracoes`, `/cardapio`) são URLs públicas e ficam como estão.
- **Não escreva comentários no código** (nem `//`, nem `/* */`, nem JSDoc). Nomes claros substituem comentários; contexto vai na mensagem de commit/PR.
- Páginas em `app/` são finas: só renderizam o container da feature.
- Toda chamada à API passa por `apiClient(endpoint, method, body)`; erro da API (`{ message, code, details }`) vira `Error(message)` — o toast mostra a mensagem do backend.
- Sessão: cookie `access_token` (`credentials: 'include'`); `useMe()` carrega o usuário e o `AuthWrapper` redireciona para `/login` em erro.
- Texto de UI em pt-BR.

## Dependências entre features

```
orders     -> customers, products, profile
products   -> ingredients, profile
recipes    -> ingredients
supplies   -> ingredients, stock
ingredients-> stock
dashboard  -> ingredients, orders
profile    -> orders
```

Estoque aparece embutido em várias telas: colunas/células de estoque em ingredients/supplies/recipes/products, modais de produção e ajuste, `insufficientProducts` em `orders/details/.../OrderStatusActions.tsx`, `revertStock` ao cancelar pedido e ao excluir lançamento financeiro.
