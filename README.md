<div align="center">

# ANAMNESE

**Plataforma de Avaliação Contínua e Diagnóstico em Computação & Inteligência Artificial**

Um ambiente de avaliação técnica projetado para aprofundamento e consolidação de conceitos centrais de Ciência da Computação, disponível de forma nativa para plataformas Web e Android.

<br />

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-23272F?style=for-the-badge&logo=react&logoColor=149ECA)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-18181B?style=for-the-badge)](LICENSE)

<br />

</div>

---

## Sumário

- [Visão Geral](#visão-geral)
- [Trilhas de Avaliação](#trilhas-de-avaliação)
- [Recursos do Sistema](#recursos-do-sistema)
- [Instalação e Execução](#instalação-e-execução)
- [Ingestão Automatizada de Questões](#ingestão-automatizada-de-questões)
- [Build para Android Nativo](#build-para-android-nativo)
- [Esteira de Releases (CI/CD)](#esteira-de-releases-cicd)
- [Internacionalização](#internacionalização)
- [Licença](#licença)

---

## Visão Geral

O **Anamnese** opera como um motor unificado para verificação diagnóstica em tópicos estruturais de tecnologia. A plataforma integra execução contínua com tolerância a falhas, curadoria de artigos científicos sobre IA e sistemas distribuídos, processamento de pontuação ponderada e esteira de automação para empacotamento móvel.

---

## Trilhas de Avaliação

O banco de itens avaliativos está segmentado nas disciplinas basilares da Ciência da Computação:

| Disciplina | Foco Técnico |
| :--- | :--- |
| **Algoritmos e Estruturas de Dados** | Complexidade assintótica, árvores, grafos e programação dinâmica. |
| **Sistemas Operacionais** | Concorrência, escalonamento, paginação e condições de corrida. |
| **Redes de Computadores** | Modelo OSI, arquitetura TCP/IP, roteamento e segurança de camada. |
| **Sistemas de Bancos de Dados** | Propriedades ACID, normalização, álgebra relacional e indexação. |
| **Compiladores e Autômatos** | Análise léxica, sintática, árvores abstratas (AST) e linguagens formais. |
| **Inteligência Artificial** | Modelos de raciocínio, redes neurais profundas, transformers e otimização. |

---

## Recursos do Sistema

- **Modo Contínuo:** Fluxo ininterrupto de questões com multiplicadores de precisão, limiar de tentativas e justificativa técnica detalhada para cada item.
- **Boletim Técnico:** Canal com despachos, sumários de literatura técnica e pesquisas recentes em computação e aprendizado de máquina.
- **Classificação e Métricas:** Cálculo de experiência cumulativa (XP), níveis progressivos e monitoramento de consistência operacional.
- **Detecção de Idioma:** Localização automática de interface via `navigator.language` (Português, Inglês e Espanhol), com opção de chaveamento manual.
- **Arquitetura Híbrida:** Código único compatível com navegadores desktop/mobile e empacotável em APK nativo via Capacitor.

---

## Instalação e Execução

### Pré-requisitos
- Node.js versão 18 ou superior
- Gerenciador de pacotes npm

```bash
# Clonar o repositório
git clone https://github.com/samuelspineli34/anamnese.git
cd anamnese

# Instalar dependências
npm install

# Iniciar servidor local de desenvolvimento
npm run dev
```

---

## Ingestão Automatizada de Questões

O projeto possui um módulo de coleta programática capaz de extrair e catalogar questões de fontes técnicas abertas:

```bash
npm run crawl
```

O comando executa o script de ingestão, normaliza os esquemas de dados e compila o catálogo na base de consulta offline da aplicação.

---

## Build para Android Nativo

A compilação móvel utiliza o ecossistema Capacitor para gerar os artefatos nativos:

```bash
# 1. Gerar os ativos de produção
npm run build

# 2. Inicializar a plataforma Android (primeira execução)
npx cap add android

# 3. Sincronizar o build com o ambiente nativo
npx cap sync

# 4. Abrir no Android Studio para gerar o APK
npx cap open android
```

---

## Esteira de Releases (CI/CD)

O repositório possui automação configurada via GitHub Actions. O envio de uma Git Tag com padrão de versionamento semântico dispara o pipeline de compilação e publicação automática de releases:

```bash
git tag v1.0.0
git push origin v1.0.0
```

A ação compila a versão estável, gera o arquivo compactado de distribuição e anexa o pacote diretamente na aba de Releases do GitHub.

---

## Internacionalização

A alternância linguística abrange todos os rótulos de navegação, categorias e orientações diagnósticas:

| Código | Idioma | Modo de Seleção |
| :---: | :--- | :--- |
| `pt` | Português (Brasil) | Automático / Manual |
| `en` | Inglês (Internacional) | Automático / Padrão de contingência |
| `es` | Espanhol | Automático / Manual |

---

## Licença

Este projeto é licenciado sob os termos da [Licença MIT](LICENSE).