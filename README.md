
---

# AI Social & Chatbot Templates – Combined README

This repository combines two powerful AI templates:

1. **Blaxel Social Post Generator Agent** – Automatically generates professional social media posts from URLs or themes.
2. **Nuxt AI Chatbot Template** – A full-featured AI chat application with authentication, chat history, model switching, and more.

You can use them independently or integrate both to build a unified platform that provides **content generation + conversational interaction**.

---

# 📑 Table of Contents

* [Overview](#overview)
* [Template 1 — Blaxel Social Post Generator](#template1)

  * Features
  * Quick Start
  * Installation
  * Usage
  * Deployment
  * Project Structure
* [Template 2 — Nuxt AI Chatbot Template](#template2)

  * Features
  * Quick Start
  * Environment Setup
  * Development & Production
  * Deployment
* [🛠 Troubleshooting](#troubleshooting)
* [🤝 Contributing](#contributing)
* [🆘 Support](#support)
* [📄 License](#license)

---

# <a id="overview"></a>Overview

This repository includes **two AI templates designed for different but complementary use cases**:

| Template                               | Purpose                                              | Tech Stack                                        |
| -------------------------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| **Blaxel Social Post Generator Agent** | Generate social media posts from URLs or text themes | TypeScript · Vercel AI SDK · Blaxel Platform      |
| **Nuxt AI Chatbot Template**           | Build a modern AI Chat Web App                       | Nuxt 3 · Nuxt UI · PostgreSQL · Vercel AI Gateway |

When combined, you can build a fully integrated solution:

➡ User interacts through **Chatbot**
➡ Chatbot triggers **Social Post Generator Agent**
➡ System outputs **high-quality social media content with conversational refinement**

---

# <a id="template1"></a>Template 1 — Blaxel Social Post Generator Agent

## Features

* Intelligent social media post generation from URLs or themes
* Built-in web crawler for public website extraction
* Semantic search integration for theme discovery
* Character-optimized, professional formatting
* Streaming responses
* Fully typed TypeScript implementation
* One-command deployment to Blaxel

---

## 🚀 Quick Start

```bash
git clone https://github.com/blaxel-ai/template-social-post-generator.git
cd template-social-post-generator
npm install
bl serve --hotreload
```

Test the agent:

```bash
bl chat --local social-post-generator
```

Example prompts:

```
https://blaxel.ai  
Latest AI trends in 2024  
```

---

## 💻 Installation

```bash
npm install
npm run build
```

---

## 🔧 Usage

Start development server with hot reload:

```bash
bl serve --hotreload
```

Production mode:

```bash
bl serve
```

Direct invocation:

```bash
bl run agent social-post-generator --local --data '{"input": "https://example.com"}'
```

---

## 🚀 Deployment

```bash
bl deploy
```

---

## 📁 Project Structure

| File                        | Description                                 |
| --------------------------- | ------------------------------------------- |
| `src/index.ts`              | Fastify server entrypoint                   |
| `src/agent.ts`              | Core agent logic                            |
| `src/prompt.md`             | System prompt for content rules             |
| `src/functions/webcrawl.ts` | Custom web crawler with Markdown conversion |
| `blaxel.toml`               | Deployment configuration                    |
| `tsconfig.json`             | TypeScript compiler config                  |

---

---

# <a id="template2"></a>Template 2 — Nuxt AI Chatbot Template

## Features

* ⚡ Streaming AI responses powered by **AI SDK v5**
* 🤖 Multiple model providers via **Vercel AI Gateway**
* 🔐 GitHub OAuth authentication
* 💾 Persistent chat history using PostgreSQL + Drizzle ORM
* 🌓 Light & dark mode
* 🎛 Collapsible sidebar, keyboard shortcuts, command palette
* 🚀 Zero-config deployment to Vercel

---

## 🚀 Quick Start

```bash
npm create nuxt@latest -- -t ui/chat
```

Or deploy instantly using the Vercel button in the official template repository.

---

## ⚙ Environment Setup

Create a `.env` file:

```env
DATABASE_URL=<your-postgresql-url>

# GitHub OAuth
NUXT_OAUTH_GITHUB_CLIENT_ID=<client-id>
NUXT_OAUTH_GITHUB_CLIENT_SECRET=<client-secret>

# Vercel AI Gateway (unified AI model API)
AI_GATEWAY_API_KEY=<vercel-ai-gateway-key>

# Minimum 32 characters
NUXT_SESSION_PASSWORD=<your-session-password>
```

Run database migrations:

```bash
pnpm db:migrate
```

---

## 🧪 Development

Start local development server:

```bash
pnpm dev
```

Access at:

> [http://localhost:3000](http://localhost:3000)

---

## 📦 Production

Build the production bundle:

```bash
pnpm build
```

Preview it locally:

```bash
pnpm preview
```

---

## 🚀 Deployment (Vercel)

Deploy via CLI:

```bash
npx vercel
```

Or connect your repository to Vercel for automatic deployments.

Powered by **Vercel AI Gateway**, which provides:

* Unified model API (OpenAI, Anthropic, Google, xAI, etc.)
* Automatic retries and fallback
* Spend monitoring
* Load balancing

---

# <a id="troubleshooting"></a>🛠 Troubleshooting

### Social Post Generator (Blaxel)

* Website not crawling → Check authentication or anti-bot rules
* Post quality too generic → Verify the prompt file loads correctly
* TypeScript errors → Reinstall deps or run `npm run build`

### Nuxt AI Chatbot

* OAuth login fails → Verify GitHub callback URL
* Database not connecting → Check `DATABASE_URL`
* AI model unavailable → Ensure `AI_GATEWAY_API_KEY` is set

---

# <a id="contributing"></a>🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

---

# <a id="support"></a>🆘 Support

* Blaxel Documentation: [https://docs.blaxel.ai](https://docs.blaxel.ai)
* Nuxt UI Docs: [https://ui.nuxt.com](https://ui.nuxt.com)
* Vercel AI SDK Docs: [https://sdk.vercel.ai](https://sdk.vercel.ai)
* Join relevant Discord communities for real-time help

---

# <a id="license"></a>📄 License

**MIT License** — both templates are MIT-licensed.

---


