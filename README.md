# Tá Liso — Web App

Aplicação web de controle financeiro pessoal. Permite organizar gastos por categorias, registrar lançamentos em linguagem natural via chat e acompanhar resumo e orçamento do mês.

## Sobre o projeto

- **Stack:** Vue 3, Vite, TypeScript, Tailwind CSS v4, Vue Router, Pinia
- **Layout:** Responsivo — mobile (barra inferior de navegação) e desktop (sidebar + topbar). Telas de login e token também se adaptam ao tamanho da tela.
- **Rotas:** Login, Token (código por e-mail), Início, Categorias, Chat, Resumo, Configurações. O scroll da área de conteúdo é resetado ao trocar de página.

### Principais telas

| Rota | Descrição |
|------|-----------|
| `/login` | Entrada por e-mail (envio de código) |
| `/token` | Inserção do código de 6 caracteres |
| `/` | Início: saldo do mês, alertas e categorias |
| `/categorias` | Nova categoria e lista de categorias com orçamento |
| `/chat` | Assistente para registrar gastos em linguagem natural; no desktop, sidebar com saldos por categoria |
| `/resumo` | Seletor de mês, saldo, gasto por categoria e lançamentos |
| `/configuracoes` | Perfil, notificações, orçamento, dados e sair da conta |

O avatar com iniciais no header da Home redireciona para Configurações.

### Estrutura do código

```
src/
├── assets/          # CSS global (Tailwind)
├── components/      # AppShell, BottomNav, DesktopSidebar, DesktopTopbar, TokenCodeInput
├── router/          # Rotas e reset de scroll
├── stores/          # Pinia (ex.: counter)
├── views/           # Uma view por rota principal
└── main.ts
```

## Pré-requisitos

- **Node.js** `^20.19.0` ou `>=22.12.0` (ver `engines` em `package.json`)

## Como executar

### Instalar dependências

```sh
npm install
```

### Desenvolvimento (hot-reload)

```sh
npm run dev
```

O app abre em `http://localhost:5173` (ou a URL exibida no terminal).

### Build para produção

```sh
npm run build
```

Saída em `dist/`. Para preview local:

```sh
npm run preview
```

### Testes

```sh
npm run test:unit
```

### Lint e formatação

```sh
npm run lint
npm run format
```

### Verificação de tipos

```sh
npm run type-check
```

## IDE e ferramentas

- **VS Code:** use a extensão [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (e desative o Vetur).
- **Navegador:** [Vue DevTools](https://devtools.vuejs.org/) para inspecionar componentes e roteamento.

## Configuração

- **Vite:** `vite.config.ts`
- **TypeScript:** `tsconfig.json` / `tsconfig.app.json`
- **Tailwind:** `src/assets/main.css` (directives `@import 'tailwindcss'` e `@source` para escanear arquivos)
- **ESLint / Prettier:** configurados no projeto
