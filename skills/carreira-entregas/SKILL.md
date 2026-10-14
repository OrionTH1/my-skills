---
name: carreira-entregas
description: Ao terminar uma feature, transforma o PRD, o techspec, o git e a conversa inteira em entregas detalhadas para a aba Carreira do Portal de Vagas, em JSON pronto para colar no editor de Nova entrega. Separa uma feature grande em várias entregas, nunca inventa número e põe o contexto sigiloso nas notas internas. Use quando o usuário pedir para registrar a feature na Carreira, gerar as entregas da feature, ou rodar /carreira-entregas.
---

# Carreira: entregas da feature

Transforma uma feature terminada em entregas da Carreira. Cada entrega tem título, detalhes, resultados, tecnologias, período e notas internas, e o conjunto sai num JSON que o editor de Nova entrega do Portal de Vagas preenche ao colar. O dono revisa antes de salvar e escolhe ali em qual experiência elas entram, então o JSON não fala de empresa nem de experiência.

A Carreira existe para uma IA montar currículos por vaga **sem inventar nada**. Esta skill é a primeira a escrever nela, então é aqui que a regra mais pesa.

<critical>Nenhum número, resultado ou tecnologia que não esteja nas fontes. Na dúvida, o campo fica vazio e vira pergunta</critical>
<critical>Nenhum segredo em campo nenhum: chave, token, senha, valor de .env, string de conexão, URL com credencial</critical>

## Passo 1: juntar as fontes

Leia, não resuma de memória:

1. **PRD e techspec** da feature, em `docs/specs/prd-<feature>/` (ou onde o projeto guarda as specs). Se houver mais de uma feature recente e não estiver claro qual, pergunte.
2. **A conversa inteira.** Se o contexto foi resumido, o resumo aponta o arquivo `.jsonl` da transcrição completa: procure nele as decisões, os números e os problemas que o resumo cortou.
3. **O git:** `git log` da feature (a branch ou os commits do merge) para saber o que foi feito, quando e em que ordem. `git log --format='%ad %s' --date=format:%Y-%m` dá os meses.
4. **Saídas que produziram números:** testes, build, CI, logs de deploy, críticas de design, medições. Um número só vale se uma dessas fontes o mostrou.

## Passo 2: separar as entregas

Uma feature grande vira várias entregas. A pergunta que separa: **uma vaga poderia escolher esta parte sem a outra?** Uma vaga de back-end escolhe a integração com a IA; uma de front-end escolhe a revisão no celular; uma de qualidade escolhe a suíte de testes. Se cada parte responde a vagas diferentes, são entregas diferentes.

Costuma virar entrega própria:

- uma capacidade que o usuário vê e usa (a importação do currículo, o lembrete semanal);
- uma integração externa, com os modos de falha que ela exigiu (OpenRouter, push, um banco);
- uma decisão de arquitetura com troca real, alternativa descartada e motivo;
- um problema difícil investigado até a causa (o 400 do schema estrito, um deploy que quebrava);
- trabalho de qualidade com escala própria (testes, acessibilidade, observabilidade, desempenho);
- uma rodada de UX medida (crítica de 24 para 28, com o que mudou).

Não vira entrega: cada task do tasks.md, ajuste de lint, renomeação, a correção de um erro que você mesmo introduziu na mesma feature. Isso entra nos detalhes da entrega a que pertence, ou some.

Feature grande costuma dar de 3 a 7 entregas. Nenhum fato se repete em duas: se o mesmo número serve para duas, ele fica na que o produziu.

## Passo 3: preencher cada entrega

Escreva em português, primeira pessoa, passado. Os nomes técnicos ficam literais (Next.js, PostgreSQL, OpenRouter), porque é por eles que a IA casa a entrega com a vaga. Siga a skill `prose` nos detalhes: nada de "robusto", "escalável" ou "alavancar" sem um fato atrás.

**O processo de trabalho não aparece em campo nenhum, nem nas notas internas.** Sessão, conversa, agente, subagente, fork, "a outra sessão", "nesta conversa", o nome do assistente: nada disso é fato da carreira do dono. Tudo o que foi feito na feature foi feito por ele. Se uma parte veio de outro trabalho paralelo, ela entra como qualquer outra, pelo commit e pelo que mudou.

**title** (obrigatório, até 120 caracteres). Um nome curto que o dono reconheça na lista: "Importação de currículo em PDF com IA", não "Feature de importação".

**details** (até 10.000 caracteres). A parte mais rica, e o que o currículo nunca coube. Em parágrafos curtos:

- o problema e para quem;
- o que eu fiz, com as peças nomeadas;
- as decisões e o porquê, com a alternativa descartada;
- as dificuldades e como saíram;
- o tamanho: telas, endpoints, tabelas, volume, quanto tempo.

Só o que pode sair num currículo. O que é sigiloso vai para as notas internas.

**results** (até 10, cada um com até 300 caracteres). Um fato medido por linha, com número sempre que a fonte tiver. A Carreira só considera a entrega completa com pelo menos um resultado que traga número, mas um número inventado é pior que uma entrega incompleta. Escolha a fonte nesta ordem e pare no primeiro nível que se sustenta:

1. **Medido:** saiu de teste, build, log, CI, crítica ("302 testes de API passando").
2. **Medível agora:** dá para rodar e medir antes de escrever (tempo de build, tamanho de imagem). Rode.
3. **Derivado, com a conta à vista:** "dimensionado para", nunca "suportou".
4. **Escopo:** quantas telas, rotas, tabelas, testes, migrações.
5. **Mudança qualitativa:** "de manual para automático".

Meta do PRD não é resultado. "Importação em até 15 s" no techspec é expectativa; só vira resultado se um log mostrou.

Quando uma medida oscilou (uma nota que subiu e depois caiu, um tempo que piorou numa rodada), o resultado traz o par que a fonte sustenta e não esconde a última medida. A oscilação e o motivo vão para as notas internas, onde a IA entende o contexto sem que a linha publicável prometa mais do que a última medida.

**technologies** (até 30, cada nome com até 60 caracteres). Só o que esta entrega usou de fato, com o nome canônico que o mercado usa ("Next.js", não "next"). Uma biblioteca usada por toda a feature entra só nas entregas em que ela pesou.

**startMonth e endMonth** ("AAAA-MM"). Do git: o mês do primeiro e do último commit daquela parte. Sem como saber, `null`. Fim nunca antes do início.

**internalNotes** (até 10.000 caracteres). Contexto para a IA que nunca sai do portal: os caminhos do PRD e do techspec, a branch e os commits principais, números que não podem ser publicados, nomes de cliente ou de sistema interno, o que foi tentado e descartado, as discussões que levaram à decisão. Nada de segredo: aqui é onde ele mais tentaria aparecer.

**questions** (até 3, fora dos campos da Carreira). O que falta para a entrega valer mais e que só o dono sabe: "Quantos currículos você importou desde o deploy?". O editor mostra essas perguntas ao colar.

## Passo 4: validar e entregar

Monte o JSON neste formato, com as entregas na ordem em que aconteceram:

```json
{
  "format": "portal-vagas/carreira-entregas@1",
  "achievements": [
    {
      "title": "...",
      "startMonth": "2026-10",
      "endMonth": "2026-10",
      "technologies": ["..."],
      "results": ["..."],
      "details": "...",
      "internalNotes": "...",
      "questions": ["..."]
    }
  ]
}
```

Grave em `~/carreira/<feature>-<AAAA-MM-DD>.json` e valide:

```bash
node <skill-base-dir>/scripts/validate.mjs ~/carreira/<arquivo>.json
```

O script confere os limites, o formato dos meses e se escapou algo com cara de segredo. Corrija até passar.

Depois, tente copiar o JSON para a área de transferência, sempre com prazo e com a saída desligada do terminal, porque o `wl-copy` fica rodando para servir a cópia e trava um comando que espera por ele:

```bash
timeout 5 sh -c 'wl-copy < arquivo >/dev/null 2>&1' || timeout 5 sh -c 'xclip -selection clipboard < arquivo >/dev/null 2>&1'
```

A cópia é um extra: alguns ambientes (o GNOME, por exemplo) só deixam a janela em foco usar a área de transferência, e a cópia pode falhar sem aviso. Não diga que copiou sem conferir; diga que tentou, e dê sempre o caminho do arquivo como o caminho garantido.

Na resposta, antes de qualquer outra coisa:

- uma linha por entrega: o título, o período e a origem dos resultados (medido, escopo ou nenhum);
- as perguntas em aberto, juntas;
- onde está o arquivo, e se a cópia foi tentada.

Termine com uma frase sobre o que fazer: no Portal de Vagas, abrir "Nova entrega" na experiência certa e usar "Colar o JSON" no topo do editor (aceita a área de transferência, o arquivo .json ou o texto colado direto num campo), revisar a lista e adicionar. Não mostre o JSON inteiro na resposta, porque ele é longo e já está no arquivo e na área de transferência.

## Antes de terminar

- Cada número tem uma fonte que o dono consegue mostrar se perguntarem como foi medido?
- Alguma entrega só faz sentido para quem estava na conversa? Junte com outra ou corte.
- Algum campo cita sessão, conversa, agente ou fork? Reescreva como fato do dono ou corte.
- Os detalhes dizem o que **eu** fiz, e não o que a ferramenta ou o time fez?
- Nenhum segredo, em nenhum campo?
