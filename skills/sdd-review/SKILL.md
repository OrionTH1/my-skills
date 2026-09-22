---
name: sdd-review
description: Fecha o ciclo do SDD depois que o sdd-tasks implementou tudo — reconcilia PRD e techspec com a realidade, verifica contra o contrato e contra as convenções do projeto, roda teste, e abre o PR só com confirmação explícita. Quarto e último passo do pipeline SDD. Pode rodar em qualquer sessão, mesmo dias depois, mesmo sem memória da execução.
---

# sdd-review

O gate final. Não depende de nenhuma conversa anterior — reconstrói tudo que precisa a partir de `specs/prd-[feature]/` e do estado real do repositório, porque pode ser invocado numa sessão nova, dias depois de a implementação ter acontecido, inclusive depois de você mesmo ter mexido no código durante a revisão do PR.

<critical>NUNCA abra PR sem confirmação explícita sua, mesmo que todo o resto tenha passado. Essa confirmação vale a cada vez, não fica valendo pra sempre</critical>
<critical>Todo PR nasce em DRAFT, sempre, sem exceção. Nunca em estado pronto pra aprovar</critical>
<critical>tasks.md só é apagado como a ÚLTIMA ação desta skill, depois que os documentos permanentes já foram reconciliados</critical>
<critical>Se encontrar problema bloqueante ou de segurança, PARE e reporte. Não continue nem abra PR</critical>

## Pré-requisito

`specs/prd-[feature]/tasks.md` precisa existir — é dele que esta skill deriva o que foi aprovado, pra comparar contra o que foi de fato implementado. Se já foi apagado, esta skill já rodou antes; não há mais o que reconciliar por este caminho.

## Passo 1 — árvore de trabalho

Se houver alteração não commitada fora dos commits das tasks (por exemplo, um ajuste seu durante a revisão do PR), pergunte se deve entrar no commit de reconciliação ou se fica de fora.

## Passo 2 — testes, build e lint

Detecte os comandos deste projeto — em `CLAUDE.md`, no arquivo de manifesto da linguagem (`package.json`, `pyproject.toml`, ou equivalente), ou pergunte se não achar. Nunca assuma `npm test` ou qualquer comando fixo de outro projeto.

Rode tudo. Se falhar, corrija e rode de novo, **no máximo duas vezes**. Na terceira falha, pare e reporte o que está quebrado — não force passagem.

## Passo 3 — reconciliar contra o aprovado

Compare, task por task, o código que estava proposto em `tasks.md` contra o código que de fato foi commitado. Diferença além de formatação trivial é um desvio.

Esta comparação é como a lista de desvios é reconstruída, independente de qualquer resumo de conversa ter sobrevivido ou não — é por isso que `tasks.md` precisa continuar existindo até este ponto.

## Passo 4 — verificar contra o contrato e contra o padrão do projeto

Duas checagens, não uma:

**Contra o PRD e o techspec.** Todo requisito funcional numerado do PRD foi atendido? A implementação bate com as decisões e interfaces que o techspec registrou?

**Contra as boas práticas documentadas do projeto.** Leia `CLAUDE.md`, qualquer diretório de regras (`docs/ai-rules/`, `.claude/rules/`, ou equivalente), a documentação do projeto, e confira se cada task de fato usou as skills que `tasks.md` tinha listado pra ela. Trate violação real como bloqueante — não convenção descoberta na hora, só o que já está documentado. Não assuma nenhum framework de arquitetura específico (Clean Architecture, DDD, ou qualquer outro) a menos que este projeto o documente; a checagem é contra o que este repositório afirma sobre si mesmo, nunca contra o padrão de outro projeto.

## Passo 5 — reconciliar os documentos

Para cada desvio do Passo 3 e cada divergência do Passo 4 que represente mudança real de decisão (não erro a corrigir, decisão a registrar): atualize `prd.md` e/ou `techspec.md` no lugar, com entrada datada em Histórico dizendo o que mudou e por quê. Nunca deixe o documento descrever algo que o código já não faz mais.

**Se a implementação revelou que uma feature antiga tem decisão contradita**, pare, avise explicitamente, e atualize o `prd.md`/`techspec.md` daquela feature também, com entrada de Histórico própria — não é silencioso e não fica só nesta feature.

Isso entra no mesmo commit de reconciliação.

## Passo 6 — encerrar os artefatos efêmeros

Atualize a linha da feature em `specs/README.md` (status: implementado, com link pro PR quando existir).

`git rm specs/prd-[feature]/tasks.md`. Só agora, depois que todo o valor dele já foi extraído nos passos 3 a 5.

## Passo 7 — parar antes do PR

<critical>Pare aqui sempre. Pergunte: "Revisão passou, posso abrir o PR?"</critical>

Isso vale mesmo que esta skill já tenha rodado antes nesta mesma feature (por exemplo, depois de um ajuste seu no PR). Toda vez que o código muda depois da última reconciliação, rode este fluxo de novo antes do merge — é o gesto que impede o PRD e o techspec de ficarem mentindo sobre o que o código faz.

## Passo 8 — abrir o PR, em draft

Só depois da confirmação, e **sempre como draft** — nunca como PR pronto pra aprovação, mesmo quando teste, build, lint e as duas checagens do Passo 4 passaram limpos. Revisão desta skill não substitui revisão humana; ela é o que torna a revisão humana possível de fazer com confiança, não o que a dispensa. Um PR aberto pronto seria fácil demais de aprovar sem realmente olhar, principalmente depois de um review automático já ter dito que está tudo certo.

Descrição do PR resume o que foi implementado e linka o `techspec.md` (já atualizado) como contexto pra quem for revisar — evita reescrever a decisão na descrição do PR quando ela já está documentada em lugar permanente.

Mensagem final convida você a revisar e tirar do draft quando estiver satisfeito, com o link do PR. Esta skill nunca tira um PR do draft — isso é decisão sua, tomada fora dela.

## Condições de parada

Pare e reporte, sem prosseguir, quando:

- Achar problema bloqueante ou vulnerabilidade de segurança
- Teste, build ou lint continuar falhando depois de duas tentativas de correção
- Achar segredo ou credencial em qualquer diff
- Você recusar incluir alteração pendente no commit de reconciliação — espere o commit manual e rode de novo

## Checklist de qualidade

- [ ] Árvore de trabalho verificada
- [ ] Teste, build e lint passando (ou parado e reportado na terceira falha)
- [ ] Desvios reconstruídos comparando tasks.md contra o código real
- [ ] Verificado contra PRD e techspec
- [ ] Verificado contra CLAUDE.md, regras e skills documentadas do projeto
- [ ] prd.md e techspec.md reconciliados, com Histórico datado
- [ ] Features antigas afetadas, se houver, também reconciliadas
- [ ] specs/README.md atualizado
- [ ] tasks.md apagado, por último
- [ ] PR aberto em draft, só depois de confirmação explícita, nunca pronto pra aprovar
