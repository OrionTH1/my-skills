---
name: gh-pr
description: Abre pull requests com o gh no padrão do usuário. Roda os checks obrigatórios (typecheck, testes e build) em cada repositório envolvido, envia a branch, cria a PR em draft contra a branch de desenvolvimento do repositório e escreve a descrição com exatamente duas seções, "Descrição" e "Alterações realizadas". Use quando o usuário pedir para abrir PR, criar pull request, subir a branch para revisão ou reescrever a descrição de uma PR.
---

# Abrir PR com gh

Abre uma PR por repositório envolvido na feature, sempre em draft, depois de conferir que o código compila, passa nos testes e builda. A descrição conta a feature para quem revisa; não é relatório do desenvolvimento.

<critical>Toda PR nasce em draft, com base na branch de desenvolvimento do repositório, a não ser que o usuário peça outra base. Nunca abra PR contra a `main` ou a `master` sem o usuário pedir. Esta skill nunca tira uma PR do draft.</critical>

## 1. Repositórios, base e branches

Descubra em quais repositórios a feature mexeu. Uma feature pode ocupar mais de um (por exemplo, API e front): cada um com commits à frente da sua base ganha a sua PR.

### Base

A base é a branch de desenvolvimento do repositório, onde as features entram antes de chegar à produção. Ela não é a branch padrão do GitHub: em muitos repositórios a padrão é a `main`, e abrir PR de feature contra ela pularia a etapa de desenvolvimento. Descubra a base de cada repositório, nesta ordem:

1. A documentação do repositório (`CLAUDE.md`, `CONTRIBUTING.md`, `README.md`, regras em `.claude/rules/` ou equivalente) diz para qual branch as PRs vão.
2. A branch de onde a branch atual saiu, quando o upstream dela aponta para uma branch de desenvolvimento (`git rev-parse --abbrev-ref @{upstream}`).
3. Uma branch remota com nome de desenvolvimento: `git branch -r` com `developer`, `develop`, `development`, `dev` ou `staging`.
4. A base das PRs de feature recentes: `gh pr list --state all --limit 20 --json baseRefName,headRefName`.

Se as fontes discordarem, ou se só sobrar a `main`/`master`, pare e pergunte ao usuário qual é a base. Quando a feature tem PR em mais de um repositório, descubra a base de cada um separadamente.

### Branches

Para cada repositório:

1. Busque a base: `git fetch origin <base>`.
2. Confira a branch atual e os commits que vão para a PR: `git log origin/<base>..HEAD --oneline`. Sem commits, não há PR para abrir nesse repositório.
3. Se a branch atual for a própria base, a `main` ou a `master`, pare e pergunte em qual branch a PR deve sair.
4. Se houver alteração não commitada, pergunte se ela entra na PR. Não commite por conta própria.

## 2. Checks obrigatórios

Em cada repositório que vai ter PR, rode os três checks:

| Check | Exemplo de comando |
|---|---|
| Typecheck | `npx tsc --noEmit` |
| Testes | o script de testes unitários (`npm run test:run`, `npx vitest run`) |
| Build | o script de build (`npm run build`, `npm run build:dev`) |

Descubra os comandos do projeto no `CLAUDE.md`, nas regras do repositório (`.claude/rules/` ou equivalente) e no `package.json`. Quando o projeto documenta uma suíte completa para fechar uma feature (testes de integração, lint), rode também. Não assuma o comando de outro projeto.

Se algum check falhar, pare. Mostre ao usuário o comando e a saída do erro, e não abra a PR desse repositório. Não rode outros checks além destes, como revisão de segurança ou busca de `console.log`, a não ser que o usuário peça.

## 3. Enviar a branch

```bash
git push -u origin <branch>
```

Nunca `git push` puro. Se o hook de pre-push falhar, mostre a saída e pergunte o que fazer. Nunca use `--no-verify` sem permissão explícita do usuário para aquele push.

## 4. Título

O título segue o padrão dos títulos recentes do repositório (`gh pr list --state all --limit 10`), em geral Conventional Commits no idioma das PRs: `feat: remover pedidos do lote de envio em lote`. Quando a feature tem PR em mais de um repositório, use o mesmo título em todos.

## 5. Descrição

O corpo tem exatamente estas duas seções, nesta ordem, e nada antes ou depois delas:

```markdown
## Descrição

<a feature: o que é, para quem, qual problema resolve e por quê>

## Alterações realizadas

1. <peça do diff e o que ela faz na feature>
2. ...
```

<critical>Nunca adicione outra seção (Checklist, QA, Testes, Prints, Deploy, Notas, Dependências, Screenshots ou qualquer outra). Se algo parecer exigir uma seção a mais, como prints de uma feature visual ou scripts de deploy que o projeto manda colocar na PR, pergunte ao usuário antes e só adicione com permissão explícita para aquela PR.</critical>

A permissão vale para a PR em que foi dada. Numa PR nova, pergunte de novo.

### Descrição

Conte a feature para quem não acompanhou o desenvolvimento:

- o que ela é e onde aparece (tela, endpoint, rotina);
- para quem ela foi feita;
- o problema que resolve e por que vale a pena resolver.

Quando existir um PRD da feature (`specs/prd-<feature>/prd.md`, `tasks/prd-<feature>/prd.md` ou equivalente), tire dele o problema, o usuário e o motivo: a visão geral e as histórias de usuário respondem exatamente isso. Sem PRD, deduza dos commits e do diff, e pergunte ao usuário se o motivo não estiver claro.

Um a três parágrafos curtos. Pode citar uma regra de negócio que o revisor precisa conhecer para entender o comportamento, descrita como regra da feature. Quando a feature tem PR em outro repositório, uma frase no fim da Descrição aponta para ela (`A parte da API está em org/api#123.`).

Não entram na Descrição:

- decisões tomadas durante a conversa com o usuário, alternativas descartadas, mudanças de rumo ("primeiro fizemos X, depois trocamos por Y");
- qualquer menção à conversa, ao chat, a ferramentas, a IA ou a skills;
- histórico de QA, bugs achados e corrigidos durante o desenvolvimento, status de testes, build, lint ou hooks;
- números de medição, consultas ao banco ou conferências feitas durante o trabalho;
- links para documentos fora do repositório.

### Alterações realizadas

Um resumo do diff que diz ao revisor o que ele vai ver e o que cada peça faz na feature.

- Lista numerada, um item por peça que implementa a feature: endpoint, use case, repository, entidade, action, hook, componente, tela, migration e assim por diante.
- Cada item diz o nome da peça (em `código`) e a lógica dela na feature, em uma ou duas linhas.
- Ordene pelo caminho da feature (de onde o usuário interage até o banco, ou o contrário), para o revisor seguir o fluxo.
- Inclua mudança de comportamento em algo que já existia, quando ela faz parte da feature (por exemplo, "remover um pedido deixa de levar junto os itens de troca vinculados a ele").

Não entram, a não ser que sejam a própria mudança da PR (uma PR só de testes, por exemplo):

- testes, mocks, fixtures, specs;
- ajustes de tipo, formatação, lint, imports, renomeações mecânicas;
- documentação, configuração, dependências;
- mocks ou implementações de teste atualizados por causa de uma interface nova.

### Como escrever

1. Leia o PRD da feature, se existir, o diff contra a base (`git diff origin/<base>...HEAD --stat` e os arquivos que importam) e os commits.
2. Escreva no idioma das PRs e commits recentes do repositório, com frases diretas e detalhe concreto (nome da peça, o que ela faz). Evite travessão, tríades forçadas e frases de efeito no fim dos parágrafos.
3. Confira o texto contra a lista do passo 7.

## 6. Criar a PR

Grave o corpo num arquivo temporário (no scratchpad da sessão, quando houver) e crie:

```bash
gh pr create --draft --base <base> --head <branch> --title "<título>" --body-file <arquivo>
```

Se já existir PR aberta para a branch (`gh pr view <branch>`), não crie outra. Avise o usuário e só reescreva a descrição (`gh pr edit <número> --body-file <arquivo>`) se ele pedir.

Com PRs em mais de um repositório, crie todas e depois acrescente a frase de referência cruzada na Descrição de cada uma, com `gh pr edit`.

Confirme o resultado com `gh pr view <número> --json isDraft,baseRefName,url`.

## 7. Conferência

- [ ] Checks obrigatórios passaram em cada repositório com PR
- [ ] Push com `git push -u origin <branch>`, sem `--no-verify` não autorizado
- [ ] PR em draft, com base na branch de desenvolvimento do repositório (ou na que o usuário pediu), nunca na `main`/`master` sem pedido
- [ ] Só as seções `## Descrição` e `## Alterações realizadas`, nesta ordem, sem texto fora delas
- [ ] A Descrição diz o que é a feature, para quem, qual problema resolve e por quê
- [ ] Nenhuma menção a conversa, decisões do desenvolvimento, QA, testes, build ou ferramentas
- [ ] Cada item de Alterações realizadas é uma peça que faz a feature funcionar, com o que ela faz
- [ ] Nenhum item sobre testes, tipos, formatação, docs ou config (salvo se forem a própria mudança)
- [ ] Seção extra só se o usuário permitiu para esta PR

## 8. Entregar

Mostre o link de cada PR e lembre que elas estão em draft: o usuário revisa e tira do draft quando quiser.

## Exemplo de descrição

```markdown
## Descrição

Na tela de Lotes de Envio, a equipe de expedição tira pedidos de um lote que ainda não saiu. Até aqui isso era feito um pedido por vez, pelo botão de remover de cada linha, com uma confirmação para cada; quem precisava tirar dezenas de pedidos de um lote repetia o mesmo clique dezenas de vezes.

Agora o usuário marca os pedidos que quer tirar, clica em Remover do lote na barra de ações da seleção, confere a lista no diálogo e confirma uma vez, qualquer que seja a quantidade. Um pedido só sai do lote inteiro: a remoção fica bloqueada enquanto algum pedido estiver só parcialmente marcado.

A parte da API está em org/api#123.

## Alterações realizadas

1. `ShipmentSelectionBar` ganha o botão Remover do lote, desabilitado com um aviso que diz quais pedidos completar quando há pedido parcial.
2. `checkSelectionRemoval` transforma a seleção de itens em pedidos a remover, ou nos pedidos incompletos que bloqueiam a remoção.
3. `useRemoveSelectionFromShipment` guarda a lista confirmada ao abrir o diálogo, chama a remoção e trata sucesso, falha parcial e erro, atualizando a lista e os totais do lote.
4. `RemoveFromShipmentDialog` mostra o que vai sair (itens e peso por pedido e um total) e, na falha parcial, o que não foi removido com o motivo.
```
