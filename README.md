# my-skills

Skills que eu uso no Claude Code, versionadas aqui porque configuração local não sobrevive a uma limpeza de diretório.

## O que tem

| Skill | O que faz |
|---|---|
| [`prose`](skills/prose/SKILL.md) | Como escrever documentação que não soa gerada por máquina |
| [`commit`](skills/commit/SKILL.md) | Convenção de commit: uma linha, sem corpo, sem escopo e sem trailer de co-autor, com a divisão por intenção |
| [`resume-bullets`](skills/resume-bullets/SKILL.md) | Transforma um projeto ou uma sessão de trabalho em bullet points de currículo, no formato X-Y-Z, com os termos literais que as vagas usam e com toda métrica rastreável a uma evidência |
| [`sdd-prd`](skills/sdd-prd/SKILL.md) | Fluxo de Spec Driven Development, passo 1 — cria ou atualiza o PRD de uma feature: o quê, por quê, sem implementação |
| [`sdd-techspec`](skills/sdd-techspec/SKILL.md) | SDD, passo 2 — traduz o PRD em decisão técnica e arquitetura, sem código além de assinatura de interface |
| [`sdd-tasks`](skills/sdd-tasks/SKILL.md) | SDD, passo 3 — cria todas as tasks de uma vez com código proposto, espera aprovação do lote, executa tudo sem parar em desvio |
| [`sdd-review`](skills/sdd-review/SKILL.md) | SDD, passo 4 — reconcilia PRD e techspec com a realidade, verifica contra convenção do projeto, abre PR só com confirmação |

As quatro `sdd-*` formam um pipeline: `sdd-prd` → `sdd-techspec` → `sdd-tasks` → `sdd-review`. PRD e techspec são documentos vivos, permanentes, com histórico datado; as tasks são descartadas depois que o review reconcilia tudo contra o código real. Nenhuma delas conhece fato de projeto específico — tudo vem do que a skill lê no repositório atual (`CLAUDE.md`, regras, docs), o que é o que as torna portáveis entre projetos.

## Instalar

Pelo [skills CLI](https://github.com/vercel-labs/skills), que funciona com Claude Code, Cursor, Codex e outros. Não precisa de registro: ele lê os `SKILL.md` direto do repositório.

```bash
npx skills add OrionTH1/my-skills -g          # todas, global
npx skills add OrionTH1/my-skills             # todas, só neste projeto
npx skills add OrionTH1/my-skills --skill prose
npx skills add OrionTH1/my-skills --list      # ver antes de instalar
```

Instalação de projeto escreve um `skills-lock.json` com o hash de cada skill. Vale versionar: `npx skills check` avisa quando a origem mudou, e `npx skills install` restaura tudo numa máquina nova.

## Editar

Skill instalada pelo CLI é cópia, então editar em `~/.claude/skills/` não volta para cá. Para mexer no conteúdo, edite neste repositório, faça o push, e sincronize com:

```bash
npx skills update
```
