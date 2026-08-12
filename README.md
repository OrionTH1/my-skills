# my-skills

Skills e regras que eu uso no Claude Code, versionadas aqui porque a configuração local não sobrevive a uma limpeza de diretório.

## O que tem

| Arquivo | O que faz |
|---|---|
| [`skills/resume-bullets`](skills/resume-bullets/SKILL.md) | Transforma um projeto ou uma sessão de trabalho em bullet points de currículo, no formato X-Y-Z, com os termos literais que as vagas usam e com toda métrica rastreável a uma evidência |
| [`rules/prose.md`](rules/prose.md) | Como escrever documentação que não soa gerada por máquina. Vale sempre, em qualquer projeto |

A diferença entre os dois: skill você invoca quando precisa, regra vale o tempo todo.

## Instalar

O Claude Code lê skills de `~/.claude/skills/` e regras globais de `~/.claude/rules/`. Link simbólico mantém os dois lugares em sincronia, então editar aqui já vale lá:

```bash
git clone https://github.com/OrionTH1/my-skills.git ~/Documents/Dev/my-skills
ln -s ~/Documents/Dev/my-skills/skills/resume-bullets ~/.claude/skills/resume-bullets
ln -s ~/Documents/Dev/my-skills/rules/prose.md ~/.claude/rules/prose.md
```

Skill também pode ser por projeto, em `.claude/skills/` dentro do repositório, quando a convenção só faz sentido ali.
