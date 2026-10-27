---
name: sdd-qa
description: Roda o QA adversarial de uma feature contra o PRD e o techspec — testa requisito por requisito, refaz os bugs já conhecidos, tenta quebrar a feature de propósito, e só aprova com veredicto escrito por requisito. Entre o sdd-tasks e o sdd-review no pipeline SDD (sdd-prd → sdd-techspec → sdd-tasks → sdd-qa → sdd-review). Use quando o usuário pedir QA, teste da feature, validação no navegador, reteste depois de corrigir bug, ou antes de abrir o PR.
---

# sdd-qa

O papel aqui não é mostrar que a feature funciona — é descobrir onde ela não funciona, enquanto ela ainda está na sua mão. Bug achado em desenvolvimento custa uma linha de conversa; o mesmo bug achado pelo cliente custa a confiança dele, um hotfix com pressa e, quando mexe em dado, uma correção manual em produção.

Um QA que só percorre o caminho feliz não é QA, é demonstração. Cada requisito sai daqui com veredicto próprio, e cada requisito leva pelo menos uma tentativa deliberada de quebrá-lo.

<critical>Nenhum requisito numerado do PRD e nenhuma decisão do techspec sai desta skill sem veredicto escrito e evidência</critical>
<critical>Requisito que você não conseguiu testar é "NÃO TESTADO", com o motivo. Nunca é aprovado por parecer certo no código</critical>
<critical>Todo bug entra no relatório com reprodução — inclusive o de severidade baixa e inclusive o que já existia antes da feature</critical>
<critical>Depois de cada ação que grava algo, confira o estado persistido, não só o que a tela diz</critical>
<critical>Se achar perda ou corrupção de dado, ou furo de permissão, PARE e reporte na hora</critical>

## Pré-requisito

`specs/prd-[feature]/prd.md` e `specs/prd-[feature]/techspec.md` precisam existir — são eles o contrato contra o qual tudo é medido. Sem contrato escrito não há QA, há passeio pela tela; nesse caso diga isso e pare.

## Mentalidade

Sete ideias que mudam o que você faz, não só o que você escreve no relatório:

1. **Teste mostra a presença de defeito, nunca a ausência.** "Passou" significa "não achei nada por este caminho", e é assim que vai escrito.
2. **Testar tudo é impossível** — então o esforço vai para onde o estrago seria maior: dinheiro, dado que não volta, permissão, integração externa, e o fluxo que o cliente usa todo dia.
3. **Bug anda em bando.** Onde apareceu um, procure mais: mesma tela, mesmo use case, mesmo autor de mudança, mesmo tipo de erro.
4. **Paradoxo do pesticida.** Repetir o mesmo roteiro para de achar bug. A cada rodada, varie a ordem, os dados e o caminho — reteste não é reexecutar o script, é refazer o cenário de outro jeito.
5. **Zero bug não é sucesso.** Se todos os requisitos passam e a feature continua ruim de usar, contraditória com a tela vizinha, ou resolve o problema errado, isso é achado e vai no relatório.
6. **Você precisa de um oráculo.** Antes de chamar algo de bug, saiba contra o que está comparando: o PRD, o techspec, o comportamento da tela vizinha, a versão anterior, a regra de negócio, a expectativa óbvia de quem usa. Divergência sem oráculo é pergunta ao usuário, não bug.
7. **Bug só serve se for corrigido.** O relatório existe para o bug ser consertado, então ele mostra o pior caso, não o caso mais fácil de achar, e é escrito sem drama e sem culpa.

## Passo 0 — ambiente, e deixá-lo registrado

Suba o que a feature precisa e anote, para o relatório: branch e commit de cada repositório envolvido, portas, qual banco (local, compartilhado, réplica), e se outra pessoa ou sessão escreve nesse mesmo banco durante o teste.

Dirija a aplicação de verdade, pela interface, com a ferramenta de navegador que esta sessão tiver — de preferência o navegador embutido, à vista do usuário. Não troque isso por roteiro headless que faz login com credencial de arquivo de ambiente, a menos que o usuário peça.

Quando algum passo depender de coisa que **o usuário controla à mão** (túnel de webhook, fila, serviço externo, celular, câmera, leitor), toda mensagem que pedir uma ação a ele termina dizendo em que estado aquilo precisa estar naquele passo, e por quê. Ele não tem como adivinhar o que o próximo cenário espera.

Problema que for do ambiente, e não da feature, entra no relatório como problema de ambiente — separado dos bugs, para ninguém confundir depois.

## Passo 1 — extrair o contrato

Leia `prd.md` e `techspec.md` inteiros e monte a lista de verificação:

- **Cada requisito funcional numerado do PRD**, com o resultado esperado e o oráculo que você vai usar para julgá-lo.
- **Cada decisão e cada interface do techspec** — contrato de endpoint, formato de retorno, efeito em banco, permissão exigida, ordem de deploy.
- **O "Fora de escopo" também vira verificação**: a feature não pode ter feito o que o documento disse que ela não faria.
- **O "Histórico" dos dois documentos**, que mostra o que mudou de ideia no meio do caminho — requisito que mudou tarde é requisito com mais chance de ter sobrado código do jeito antigo.

Se o resultado esperado de um requisito não estiver escrito em lugar nenhum, pergunte ao usuário antes de testar. Inventar o esperado produz "aprovado" que não vale nada.

Então ordene por risco (chance de quebrar × tamanho do estrago) e teste de cima para baixo. Se o tempo acabar no meio, o que ficou de fora foi o menos arriscado, e isso fica dito.

## Passo 2 — recuperar o que já quebrou antes

Antes de desenhar caso novo, descubra o que já se sabe:

- `specs/prd-[feature]/bugs.md`, se existir — **todo bug marcado como corrigido vira caso de teste de novo**, nesta rodada, sem exceção.
- Os `bugs.md` das features vizinhas que tocam a mesma tela ou o mesmo use case.
- O histórico do repositório nos arquivos que a feature mudou: `fix(...)` e `hotfix` ali contam onde a coisa costuma quebrar.
- Bug conhecido e ainda não corrigido, de qualquer origem — reproduza para confirmar se continua lá e se a feature o deixou pior.

## Passo 3 — desenhar os casos

Para cada requisito, pelo menos: um caminho feliz, um limite e uma negativa. As técnicas, aplicadas onde cabem:

- **Partição e valor de borda.** Para todo campo, faixa ou contagem: vazio, nulo, zero, um, o máximo, o máximo mais um, negativo, gigante, duplicado. O bug mora na borda, não no meio da faixa.
- **Tabela de decisão.** Quando o comportamento depende de uma combinação de condições (perfil × status × flag), monte a tabela e cubra as combinações que mudam o resultado — não só a que o desenvolvedor tinha em mente.
- **Transição de estado.** Toda máquina de status ganha dois testes: as transições válidas, e as **inválidas** — pular etapa, voltar, repetir a mesma, e chegar no estado final por dois caminhos diferentes.
- **Combinação aos pares.** Com muitos filtros ou opções independentes, cubra os pares em vez da explosão completa.
- **CRUD inteiro.** Criar não é o fim: ler, listar, editar, apagar, e o que acontece com o registro em outra tela depois de cada um.
- **Grande demais, pequeno demais, no ponto.** Lista vazia, um item, mais itens do que cabe na página.

Olhe o código só para achar superfície de ataque — branch sem cobertura, retorno não tratado, campo opcional. O esperado continua vindo do PRD; se você derivar o esperado do código, você só confirma o bug que já está lá.

## Passo 4 — provar que a feature existe

Percorra o caminho principal de cada requisito, na interface, e guarde evidência: print do estado relevante em `specs/prd-[feature]/qa/`, com nome que diz o que ele mostra.

Depois de **cada ação que grava**, consulte a linha inteira da tabela afetada e compare antes e depois — flags, status, contagem de filhos, campos de auditoria. A tela mentir sobre o que foi gravado é um dos bugs mais caros e um dos mais fáceis de não ver. Mantenha a consulta num script no scratchpad e rode sempre a mesma.

Com o console e a rede abertos o tempo todo: erro de JavaScript, requisição que falhou em silêncio, chamada repetida e resposta que vaza dado demais são bugs mesmo quando a tela parece certa.

## Passo 5 — a rodada adversarial

Aqui a feature é tratada como adversária. Rode o que fizer sentido para ela, e anote o que não se aplica:

**Repetição e concorrência**
- Clicar duas vezes no botão de confirmar; dar Enter repetido no formulário.
- Duas abas na mesma tela, agindo sobre o mesmo registro; a segunda aba com o estado antigo.
- Dois usuários (ou duas sessões) na mesma linha, ao mesmo tempo — quem ganha, e o perdedor fica sabendo?
- Reenviar o mesmo evento externo duas vezes (webhook, job, mensagem de fila): o efeito dobra?

**Interrupção**
- Voltar no navegador depois de salvar e reenviar; recarregar logo após a gravação; fechar a aba no meio da operação.
- Rede lenta e rede caída no meio da requisição; dependência externa (fila, storage, IA, provedor) fora do ar — a tela avisa, ou mente que deu certo?
- Operação longa cuja sessão ou token expira no meio.

**Entrada hostil**
- Texto no limite e além dele, emoji, acento, HTML e script, espaços nas pontas e no meio.
- Número com vírgula e com ponto, zero à esquerda, negativo, casas decimais a mais.
- Data no futuro, no passado distante, virada de mês, fuso.
- Identificador de outro registro, de outra empresa, de outro usuário — colado direto na URL.

**Permissão e caminho de trás**
- O mesmo fluxo com usuário sem a permissão exigida pelo techspec: a tela esconde, e o servidor recusa? Esconder sem recusar é furo.
- Chamar o endpoint direto, sem passar pela tela, com entrada que a tela nunca deixaria passar.

**Dado do mundo real**
- Registro legado, anterior à feature, sem o campo novo ou com o formato antigo.
- Registro no estado raro: cancelado, estornado, duplicado, órfão, com relacionamento faltando.
- Volume de produção, não três linhas de teste — a consulta aguenta?

**Coerência**
- O total bate com a soma do detalhado; a tela bate com o relatório; a listagem bate com a página de detalhe.
- O mesmo número em dois lugares da aplicação continua o mesmo depois da feature.

Se nada quebrar, varie antes de concluir: outra ordem, outro dado, outro perfil. "Tentei quebrar e não consegui" só vale quando a tentativa está escrita no relatório, caso a caso.

## Passo 6 — acessibilidade e aparência

Contra o WCAG 2.2, nível AA:

- Navegação por teclado completa: Tab na ordem visual, Enter e Espaço acionando, Escape fechando e devolvendo o foco a quem abriu, foco sempre visível e nunca perdido no `body` depois que um elemento some.
- Rótulo acessível em todo controle, inclusive botão só de ícone; campo ligado ao seu rótulo; mensagem de erro anunciada, não só colorida.
- Contraste **medido**, com o número no relatório — opinião sobre cor não é verificação.
- Imagem com texto alternativo que diz o que ela significa ali.
- Os estados todos: vazio, carregando, erro, com muito dado. Tela larga, celular, e zoom a 200%.

Inconsistência visual que veio de componente compartilhado e não da feature vai no relatório como observação fora de escopo — registrada, não contada como bug da feature.

## Passo 7 — o raio de alcance

A feature mudou código que outras telas usam? Componente compartilhado, endpoint reusado, use case tocado, permissão renomeada, migration que mexeu em tabela antiga. Teste pelo menos um fluxo vizinho de cada coisa que ela tocou.

É a parte que o desenvolvedor mais pula e a que mais aparece em produção no dia seguinte.

## Passo 8 — registrar os bugs

Cada bug vai para `specs/prd-[feature]/bugs.md`, e cada um passa por seis coisas antes de ser escrito:

1. **Reproduzir** — passos determinísticos, do zero, que funcionam na mão de outra pessoa.
2. **Isolar** — tire uma variável de cada vez até sobrar o mínimo que ainda quebra.
3. **Maximizar** — procure a pior manifestação. O que parece erro de formatação pode gravar errado; o que parece lentidão pode perder dado. A severidade é a do pior caso que você conseguir provar, não a do primeiro sintoma.
4. **Generalizar** — acontece com outro registro, outro perfil, outra tela, outro navegador? Um bug geral é um bug; três bugs específicos viram "caso de borda" e morrem na fila.
5. **Externalizar** — diga o efeito em quem usa e em quem paga: o que o cliente perde, o que precisa de correção manual depois.
6. **Escrever curto e sem drama** — fato observado, fato esperado, causa quando você souber, correção sugerida quando for óbvia, evidência. Nada de adjetivo e nada de culpa.

Severidade (tamanho do estrago) e prioridade (pressa para corrigir) são campos diferentes: erro de grafia na tela que o cliente vê todo dia é baixa severidade e prioridade alta.

Bug que já existia antes da feature também entra, marcado como anterior a ela — corrigir agora ou não é decisão do usuário, não sua.

```markdown
## BUG-01 — [uma linha, o sintoma]

- **Severidade:** alta/média/baixa. **Prioridade:** alta/média/baixa. **RF afetado:** [id ou "anterior à feature"]. **Status:** aberto / corrigido em [commit]
- **Como reproduzir:** [passos numerados, do zero]
- **Esperado:** [o oráculo, com a referência ao PRD/techspec]
- **Obtido:** [o que aconteceu, com número quando houver]
- **Pior caso:** [até onde o estrago chega]
- **Também acontece em:** [onde mais, ou "só neste caminho"]
- **Causa:** [arquivo e trecho, quando identificada]
- **Correção sugerida:** [quando for óbvia]
- **Evidência:** [print, consulta de banco, log]
```

## Passo 9 — veredicto e relatório

O veredicto é um dos três, e as regras não são negociáveis:

- **REPROVADO** — qualquer requisito do PRD não atendido, ou qualquer bug que perca dado, corrompa dado ou fure permissão, mesmo que seja o único achado da rodada.
- **APROVADO COM RESSALVA** — todos os requisitos atendidos, com algum que não deu para testar neste ambiente. A ressalva diz qual, por que não deu, e o que precisa para testar.
- **APROVADO** — todos os requisitos atendidos e testados, bugs achados corrigidos e retestados.

Bug de severidade baixa não reprova sozinho, mas aparece no resumo. Aprovar com requisito não testado sem dizer que não testou é o pior resultado possível desta skill.

O relatório vai em `specs/prd-[feature]/qa-report.md`:

```markdown
# Relatório de QA: [feature]

## Resumo
- **Data:** [data]
- **Status:** APROVADO / APROVADO COM RESSALVA / REPROVADO
- **Requisitos:** [total], [n] atendidos, [n] não testados
- **Bugs encontrados:** [n] ([quantos da feature, quantos anteriores a ela])

### Ambiente
[branch e commit por repositório, portas, banco, quem mais escreve nele, estado das dependências externas]

### Ferramentas
[como os fluxos foram dirigidos e como a evidência foi gravada]

### Massa de teste
| Caso | Dado |
|---|---|

## Requisitos verificados
| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|

## Decisões do techspec verificadas
| Decisão | Status | Como foi verificada |
|---|---|---|

## Fluxos executados
| Fluxo | Resultado | Observações |
|---|---|---|

## Rodada adversarial
| Tentativa de quebra | Resultado | Observações |
|---|---|---|

## Bugs conhecidos retestados
| Origem | Bug | Resultado |
|---|---|---|

## Acessibilidade (WCAG 2.2 AA)
[por item, com os números de contraste]

## Verificação visual
[estados, larguras, observações fora de escopo]

## Bugs encontrados
| ID | Descrição | Severidade | Prioridade | Evidência |
|----|-----------|------------|------------|-----------|

## Não testado
| ID | Por que não deu | O que falta |
|---|---|---|

## Conclusão
[o veredicto e o que o sustenta]
```

Reteste **acrescenta uma rodada** ao relatório, com data, commits e o que mudou desde a rodada anterior — nunca reescreve a rodada que reprovou. O histórico de reprovação é o que mostra que o QA mordeu.

No fim, atualize a linha da feature em `specs/README.md` com o resultado e o link para o relatório, e poste um resumo curto na conversa: veredicto, bugs por severidade, e o que ficou pendente.

## Condições de parada

Pare e reporte na hora, sem continuar a rodada:

- Perda ou corrupção de dado, em qualquer caminho
- Furo de permissão: servidor aceitando o que a tela esconde, ou acesso a dado de outra empresa, loja ou usuário
- Segredo, credencial ou dado pessoal em log, resposta de API ou URL
- Requisito cujo resultado esperado não está escrito em lugar nenhum — pergunte antes de testar
- Ambiente quebrado a ponto de o resultado não significar nada — diga o que está quebrado, não produza veredicto falso

## Checklist de qualidade

- [ ] PRD e techspec lidos inteiros, com o Histórico dos dois
- [ ] Ambiente registrado: branch, commit, portas, banco, quem mais escreve nele
- [ ] Lista de verificação com todo requisito numerado, toda decisão do techspec e o Fora de escopo
- [ ] Requisitos ordenados por risco
- [ ] `bugs.md` desta feature e das vizinhas lidos; todo bug corrigido retestado
- [ ] Cada requisito com caminho feliz, limite e negativa
- [ ] Estado persistido conferido depois de cada ação que grava
- [ ] Console e rede acompanhados durante os fluxos
- [ ] Rodada adversarial executada e escrita caso a caso
- [ ] Permissão testada pela tela e pelo endpoint direto
- [ ] Fluxos vizinhos do que a feature tocou verificados
- [ ] Acessibilidade verificada, com contraste medido
- [ ] Estados vazio, carregando, erro e cheio verificados, em tela larga e celular
- [ ] Bugs reproduzidos, isolados, maximizados, generalizados e escritos com evidência
- [ ] Severidade e prioridade separadas em cada bug
- [ ] Requisitos não testados declarados como não testados
- [ ] `qa-report.md` e `bugs.md` salvos, `specs/README.md` atualizado
