---
name: resume-bullets
description: Turn a project or a working session into resume bullet points, in the X-Y-Z format, packed with the literal terms job postings use, and with every number traceable to evidence.
---

# Resume bullets

Turn what was actually built into 3 to 5 bullets for a resume. Output is Portuguese, first person, past tense.

The bullets have two readers and both have to be satisfied in the same sentence. A filter matching literal strings, and a person deciding in six seconds whether to keep reading. Optimising for one at the cost of the other fails.

## Output shape

```
**<Título do projeto ou cargo>** – <Empresa ou "Projeto pessoal"> · <Período>

- <Verbo no passado> <o que> <a medida> <como, com os nomes literais>.
- ...

**Tech Stack:** <nomes literais, separados por vírgula>
```

Strongest bullet first. One or two lines each, never three.

## Start from the vacancies

Read three or four real postings for the roles this resume targets before writing a single bullet. Pull the **literal strings** out of them and keep the list in view. For a Brazilian full stack role that list usually contains, verbatim:

`CI/CD` · `Docker` · `Node.js` · `React.js` · `TypeScript` · `PostgreSQL` · `AWS` · `Infraestrutura como Código` · `Terraform` · `testes unitários e de integração` · `observabilidade` · `logging` · `monitoramento` · `APIs REST` · `arquitetura orientada a eventos` · `Git/GitHub`

Confirm the list against current postings instead of trusting this one. It ages.

### How the keywords get in

**Aim for three or more literal terms per bullet.** A bullet with one is a wasted line.

**Write the product name and the generic name when both are true.** Aurora Serverless v2 *com PostgreSQL*. Terraform *e Infraestrutura como Código (IaC)*. A pipeline that validates and also deploys is *CI/CD*, never just CI. The product name convinces the human, the generic term matches the filter.

**Use the command and feature names the postings use.** `terraform plan`, `terraform apply`, `multi-stage`, `Auto Scaling`, `permissions boundary`, `rate limit`, `OIDC`. Naming the practice with its industry name is worth more than describing it in your own words: "build multi-stage em quatro estágios" beats "separei o Dockerfile em quatro estágios".

**Repeat the anchor technology across bullets.** If the role is Terraform, the word appears in three bullets, not one, and it appears because those bullets are genuinely about it.

**Audit the Skills section too.** A resume with a Terraform project and no "Terraform" string in Skills is invisible to a search for Terraform. Same for ECS, GitHub Actions, PostgreSQL, CI/CD. If the person prefers no Skills section at all, check that every term it would have carried survives inside a bullet or a per-project Tech Stack line.

**Never claim a term the work does not support.** If the posting wants Kubernetes and the project ran ECS, the resume says ECS. A keyword that collapses in the interview costs more than a keyword you never had.

## Never invent a number

This rule outranks the keyword goal, because they never actually conflict: density comes from naming true things precisely, not from claiming false ones. An inflated metric survives the screen and dies when someone asks how it was measured, taking the rest of the resume with it.

Name the source before writing any figure. Stop at the first level that holds:

1. **Measured.** It came out of a log, a test run, a CI job, a dashboard, a commit. `Apply complete! Resources: 78`, `318 tests passed`, `Passed checks: 327`.
2. **Measurable right now.** If a comparison can be produced by running something, run it. Building the project's Dockerfile against a naive single-stage version turned "otimizei a imagem" into "de 1,72 GB para 235 MB, 86% menor". Look for these before settling for a weaker level.
3. **Derived, with the arithmetic visible.** `max_capacity = 10` times `1000 req/min` is a ceiling of 10.000 req/min. Say "dimensionada para", not "suportou": a ceiling is a design decision, not a load test.
4. **Scope instead of result.** Modules, resources, environments, alarms, workflows, tests. Honest when impact was never measured.
5. **Qualitative delta.** "de manual para automatizado", "sem nenhuma rota para internet", "sem chave estática".
6. **Nothing.** Write the bullet without a metric, or drop it.

Ask before using a figure that cannot be sourced from the repository or the conversation. Vendor pricing needs the person to confirm the current table.

## Choosing what to tell

The best bullets are not the feature list. In order of value:

- **a known bad practice, and what replaced it.** Static keys in CI, an image shipping the compiler, a health check that queries the database, everything in one root module. The reader already has an opinion, so the bullet is judged on judgement.
- **a bullet that crosses layers.** Application log leaving Node.js through a driver, becoming a metric, firing an alarm. For a full stack role this is the most valuable shape there is, because it proves the two halves connect.
- something removed, simplified or made cheaper
- a number that moved, with both sides of the move

Two failures to avoid:

**Session minutiae.** A permission that was missing, a tag that did not exist, a claim format that changed. These feel important to whoever lived through them and read as noise to everyone else. If a bullet only makes sense to someone who was in the room, cut it.

**Bare verbs.** "`terraform apply` com aprovação manual" does not say what apply does. Add the consequence: "que provisiona do zero a infraestrutura". Keep it short: when the specific list bloats the sentence, the generic phrase wins, since the service names are already in the Tech Stack line.

## Where the material comes from

Read the evidence, do not summarise from memory. `git log` for what was built, CI runs for machine-produced numbers, READMEs and calibration docs for the decisions and their reasons, the conversation for causes.

## Sounding human

Around half of hiring managers reject a resume they read as AI-written. Avoid the tells: every bullet in the same shape, triads everywhere, "leveraged", "spearheaded", "robusto", "escalável" with no fact behind it. Vary the sentence structure between bullets. Keep verbs concrete.

## Before finishing

- Does every bullet carry three or more literal terms from the vacancy list?
- Can the person defend each number when asked how it was measured?
- Would someone who did not build it understand what changed?
- Does the resume contain the terms the bullets rely on, whether in a Skills section or in the Tech Stack lines?
- Does it say what the person did, and not what the team or the tool does?

Close by reporting which bullets have measured numbers, which have scope only, and which have neither, plus any vacancy term that the work supports and the resume still does not mention.
