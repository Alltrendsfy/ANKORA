# Ankora — especificação da demo (para colar no Google AI Studio, modo Build)

> Cole este texto inteiro como primeiro prompt e anexe o arquivo `ankora_pacote_IT-MO_demo.json`.
> Fonte de verdade do produto: PRD v0.4 da Ankora (AT Studio).

---

## 1. O que construir

Uma **demo navegável** de um app web mobile-first chamado **Ankora**: em até três toques e sem internet, ele mostra a um estrangeiro na Itália o destino oficial mais próximo numa emergência (área de espera da Proteção Civil, embaixada ou consulado), com distância, direção e um cartão com frases para pedir ajuda em italiano.

- Stack: React + TypeScript, sem backend. Todos os dados vêm do JSON anexado, carregado localmente.
- Layout para celular (390 × 844 de referência). Deve funcionar também no navegador do desktop, centralizado numa coluna de 430 px.
- Esta é uma **demo**. Exiba em todas as telas uma faixa discreta: "DEMO — não use em emergência real".

## 2. Fluxo (exatamente nesta ordem)

1. **Primeira abertura: perfil (uma tela, três perguntas)**
   - Idioma da interface (padrão: o do navegador).
   - "Você está…" → `Viajando pela Europa` | `Morando na Itália`.
   - Nacionalidade (lista de países, com a opção "Prefiro não dizer").
   - **Salvaguarda obrigatória:** "Mostrar o consulado do seu país como destino?" → `Sim` | `Não`. Texto de apoio: "Algumas pessoas preferem não procurar o próprio consulado. Você pode mudar isso depois." Se `Não`, o consulado e a embaixada do país do usuário **nunca** aparecem na lista.
   - Tudo fica salvo só no aparelho (localStorage). Nada é enviado a servidor.

2. **Tela inicial**
   - Topo: logo + nome da cidade detectada ("Modena, Itália"), ou "Localização desligada".
   - Botão principal grande: **"Preciso de ajuda"**.
   - Botão secundário, sempre visível: **"Ligar 112"** (link `tel:112`).
   - Linha discreta: "Dados verificados em 28/10/2026 · Pacote Itália/Modena".

3. **"Preciso de ajuda" → lista de destinos**
   - Primeiro item fixo: cartão "Ligue 112 — emergência na Europa".
   - Em seguida, os **3 destinos mais próximos** de cada grupo, em abas ou blocos:
     - *Áreas de espera* (somente `tipo = area_espera`, que são as abertas ao público).
     - *Seu consulado/embaixada* (do país escolhido no perfil, se a salvaguarda permitir).
     - *Outras embaixadas* (opcional, colapsado).
   - Cada cartão mostra: nome, tipo, distância (m/km), seta de direção, selo de verificação e botão "Ligar" quando houver `telefone_principal`.
   - **Selos:**
     - `verificacao = verificado` → selo verde-petróleo "Verificado".
     - `verificacao = em_verificacao` → selo âmbar "Endereço em verificação — ligue antes".
     - `servico_limitado = true` (consulado honorário) → selo âmbar "Serviço limitado — ligue antes de ir".
     - Selos sempre com ícone + texto, nunca só cor.
   - Se o país do usuário não tiver missão com coordenada, mostrar as entradas de `embaixadas_fora_da_italia` desse país: "Atende a Itália a partir de [cidade]", com o telefone.

4. **Detalhe do destino**
   - Bússola: uma seta grande que aponta para o destino, usando a orientação do aparelho (`DeviceOrientationEvent`; no iOS, pedir permissão com um toque). Sem bússola disponível: mostrar a direção cardeal ("Nordeste, 640 m").
   - Distância atualizada conforme o GPS (`navigator.geolocation.watchPosition`).
   - Botão "Abrir rota no mapa" (só funciona com internet): link para Google Maps / Apple Maps com as coordenadas.
   - Botão "Mostrar cartão de ajuda".

5. **Cartão de ajuda (tela cheia, alto contraste)**
   - Fundo branco, texto azul-petróleo grande, para mostrar a um taxista ou passante.
   - Endereço do destino em italiano (campo `endereco`) e o nome.
   - Frases em italiano, com a tradução no idioma do usuário em fonte menor embaixo:
     - "Ho bisogno di aiuto."
     - "Non parlo italiano."
     - "Mi può portare a questo indirizzo, per favore?"
     - "Per favore, chiami il 112."
   - Rodapé: "[DEMO] Traduções a validar por tradutor profissional."

## 3. Modo de teste sem GPS

Botão nas configurações: **"Simular localização"**, com três pontos fixos:
- Piazza Grande, Modena (44.6466, 10.9255)
- Estação ferroviária de Modena (44.6546, 10.9302)
- Roma, centro (41.9028, 12.4964)

## 4. Dados (arquivo anexado `ankora_pacote_IT-MO_demo.json`)

- `areas_emergencia_modena[]`: `id, tipo, nome, endereco, lat, lon, para_publico, fonte`. Tipos: `area_espera` (21), `acolhimento_ar_livre` (14), `acolhimento_coberto` (5), `concentracao_socorro` (3). **Só `area_espera` aparece para o usuário**; os demais tipos são ativados pelas autoridades durante o evento e ficam fora da demo.
- `missoes_com_coordenada[]`: `id, tipo (embaixada | consulado_carreira | consulado_honorario), pais_iso, pais_nome_it, cidade, endereco, telefones[], telefone_principal, lat, lon, verificacao, servico_limitado, fonte`.
- `embaixadas_fora_da_italia[]`: `pais_nome_it, sede_fora_da_italia, telefones[], telefone_principal, observacao`.
- `atribuicao[]`: mostrar numa tela "Sobre os dados", incluindo obrigatoriamente "© OpenStreetMap contributors (ODbL)".
- Distância: fórmula de haversine, calculada no aparelho.

## 5. Funcionamento offline

- Registrar um service worker que guarde em cache o app e o JSON na primeira abertura.
- Guardar o JSON também em IndexedDB.
- Toda a lógica de "Preciso de ajuda", distância, bússola e cartão deve funcionar com o modo avião ligado. Só "Abrir rota no mapa" depende de rede, e isso deve estar escrito no botão.

## 6. Idiomas

- Estrutura de i18n desde já para 12 idiomas: pt-BR, pt-PT, es, en, de, fr, it, ro, hy, uk, ar, tr.
- **Preencher na demo:** pt-BR, en, it, uk e ar. Os demais caem para inglês.
- O árabe deve espelhar o layout inteiro (`dir="rtl"`), incluindo setas de "voltar".
- Plurais e números via `Intl` (`Intl.PluralRules`, `Intl.NumberFormat`).

## 7. Identidade visual

| Papel | Hex |
|---|---|
| Base: textos, títulos, fundos escuros | #0F2B3D |
| Ação de emergência (somente botões de ajuda) | #F26A21 |
| Texto laranja sobre fundo claro | #B8470B |
| Fundo claro | #F3F5F7 |
| Texto secundário | #4A5C6A |
| Estado verificado | #0E7C74 |
| Estado atenção | #B45309 sobre #FFF4E5 |
| Modo noturno: fundo / texto / botão | #0A1720 / #E6EDF2 / #FF8A47 |

- **Botão de emergência: fundo #F26A21 com texto #0F2B3D.** Nunca texto branco sobre laranja (contraste 3,06:1 reprova no WCAG).
- O laranja é exclusivo das ações de emergência. Não usar em decoração.
- Fonte: Sora 600 no logo e nos títulos; fonte do sistema no corpo (garante árabe e cirílico).
- Áreas de toque de no mínimo 48 px; botão "Preciso de ajuda" com pelo menos 64 px de altura.
- Modo noturno automático (`prefers-color-scheme`).
- Proibido: cruz vermelha, crescente vermelho, estrelas da UE, cores de polícia.

Logo (SVG, viewBox 0 0 200 220):

```svg
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ankora">
  <path d="M100 206 C74 168 38 134 38 86 A62 62 0 0 1 162 86 C162 134 126 168 100 206 Z" fill="#0F2B3D"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <line x1="100" y1="64" x2="100" y2="138"/>
    <line x1="80" y1="80" x2="120" y2="80"/>
    <path d="M66 108 Q70 140 100 140 Q130 140 134 108"/>
    <path d="M58 116 L66 104 L74 116"/>
    <path d="M126 116 L134 104 L142 116"/>
  </g>
  <circle cx="100" cy="52" r="11" fill="none" stroke="#F26A21" stroke-width="8"/>
</svg>
```

Assinatura: o símbolo + a palavra "ankora" em minúsculas, Sora 600, cor #0F2B3D (branca sobre fundo escuro).

## 8. Privacidade (regras de produto, não opcionais)

- Localização, perfil e escolha de consulado **nunca saem do aparelho**. Sem analytics, sem login, sem cookies de terceiros na demo.
- Não exibir nomes de cônsules nem e-mails (os dados já vêm sem eles).

## 9. Fora da demo

Pagamento, contas de usuário, notificações push, alertas próprios, rotas offline passo a passo, outros países.

## 10. Critérios de aceite

1. Do toque em "Preciso de ajuda" até o detalhe do destino: no máximo 3 toques.
2. Com "Simular localização → Piazza Grande", a primeira área de espera listada é "Parcheggio PalaMolza", a cerca de 580 m, seguida de "Giardini Pubblici", a cerca de 640 m.
3. Com o modo avião ligado, após uma primeira abertura online, a lista, a bússola e o cartão de ajuda continuam funcionando.
4. Com a salvaguarda em "Não", nenhuma missão do país escolhido aparece.
5. Em árabe, o layout inteiro fica espelhado.
6. O botão "Ligar 112" está visível na tela inicial e no topo da lista de destinos.
