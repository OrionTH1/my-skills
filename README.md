# my-skills

Skills que eu uso no Claude Code, versionadas aqui porque configuração local não sobrevive a uma limpeza de diretório.

## O que tem

| Skill | O que faz |
|---|---|
| [`prose`](skills/prose/SKILL.md) | Como escrever documentação que não soa gerada por máquina |
| [`commit`](skills/commit/SKILL.md) | Convenção de commit: uma linha, sem corpo, sem escopo e sem trailer de co-autor, com a divisão por intenção |
| [`resume-bullets`](skills/resume-bullets/SKILL.md) | Transforma um projeto ou uma sessão de trabalho em bullet points de currículo, no formato X-Y-Z, com os termos literais que as vagas usam e com toda métrica rastreável a uma evidência |

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
