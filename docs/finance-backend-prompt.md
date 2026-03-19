# Prompt para o Back-end — Evolução do módulo Financeiro e Receitas

Preciso evoluir o back-end para suportar um mini sistema financeiro mais correto, rastreável e escalável para a doceria.

## Objetivos principais

1. Financeiro mensal com navegação clara por Resumo, Lançamentos e Contas Fixas
2. Entradas automáticas por venda
3. Despesas automáticas por compra/reposição de estoque
4. Contas fixas recorrentes com impacto em todos os meses futuros
5. Saldo projetado acumulado ao longo da linha do tempo
6. Suporte a receitas com estoque e conversões, semelhante ao que já existe para ingredientes

---

## 1) Endpoints REST legíveis

Quero endpoints claros e diretos, evitando padrões difíceis de inspecionar no browser.

### Lançamentos financeiros

#### Listar lançamentos

`GET /api/financeiro/lancamentos?month=YYYY-MM&type=income|expense&source=manual|auto-sale|auto-stock|auto-fixed&status=paid|pending`

#### Criar lançamento manual

`POST /api/financeiro/lancamentos`

```json
{
    "description": "Compra emergencial de embalagem",
    "type": "expense",
    "category": "Insumos",
    "amount": 120.5,
    "date": "2026-03-19",
    "status": "paid",
    "isFixed": false
}
```

#### Atualizar lançamento manual

`PUT /api/financeiro/lancamentos/{id}`

#### Atualizar status

`PATCH /api/financeiro/lancamentos/{id}/status`

```json
{
    "status": "pending"
}
```

#### Excluir lançamento manual

`DELETE /api/financeiro/lancamentos/{id}`

---

## 2) Exclusão controlada de lançamentos automáticos

### Problema

Lançamentos automáticos, especialmente compras de estoque, também precisam poder ser removidos do financeiro sem necessariamente apagar a movimentação de origem.

### Endpoint sugerido

`POST /api/financeiro/lancamentos/{id}/exclude`

```json
{
    "reason": "Movimentação lançada em duplicidade",
    "preserveSource": true
}
```

### Regra de negócio

- Se `preserveSource = true`, o lançamento financeiro é desconsiderado no extrato, mas a compra/entrada de estoque continua existindo na origem.
- Deve existir rastreabilidade dessa exclusão.
- A exclusão não deve apagar histórico bruto; idealmente marcar como `excluded`.

---

## 3) Entradas automáticas por venda

### Endpoint

`GET /api/financeiro/lancamentos/auto-sales?month=YYYY-MM`

### Regra

- Pedido `Delivered` gera entrada automática.
- Deve haver referência ao pedido.

### Exemplo

```json
[
    {
        "id": "fin-auto-sale-123",
        "description": "Venda pedido #2050 - Maria",
        "type": "income",
        "category": "Vendas",
        "amount": 240.0,
        "date": "2026-03-10",
        "status": "paid",
        "source": "auto-sale",
        "referenceType": "order",
        "referenceId": 123
    }
]
```

---

## 4) Despesas automáticas por compra de estoque

### Endpoint

`GET /api/financeiro/lancamentos/auto-stock?month=YYYY-MM`

### Regra

- Toda compra/reposição de ingrediente ou insumo deve gerar despesa automática.
- Deve haver origem rastreável da compra/movimentação.
- Terminologia semântica: usar “Compra de insumo”, “Compra de ingrediente” ou “Reposição de estoque”.

### Exemplo

```json
[
    {
        "id": "fin-auto-stock-77",
        "description": "Compra de ingrediente: açúcar",
        "type": "expense",
        "category": "Ingredientes",
        "amount": 320.0,
        "date": "2026-03-10",
        "status": "paid",
        "source": "auto-stock",
        "referenceType": "stock_purchase",
        "referenceId": 77
    }
]
```

---

## 5) Resumo financeiro com saldo projetado acumulado

### Endpoint

`GET /api/financeiro/resumo?month=YYYY-MM`

### Regra crítica

O saldo projetado deve ser acumulativo, não isolado por mês.

### Exemplo esperado

```json
{
    "selectedMonth": "2026-03",
    "totalIncomes": 9000.0,
    "totalExpenses": 4800.0,
    "pendingToReceive": 700.0,
    "pendingToPay": 950.0,
    "currentBalance": 15320.0,
    "forecastBalance": 15070.0,
    "fixedCostsInMonth": 2100.0,
    "recentEntries": []
}
```

### Interpretação

- `totalIncomes` e `totalExpenses` = valores do mês selecionado
- `currentBalance` = saldo acumulado até o fim do mês selecionado considerando apenas pagos/recebidos
- `forecastBalance` = saldo acumulado até o fim do mês selecionado considerando também pendências

---

## 6) Contas fixas recorrentes

### Criar conta fixa

`POST /api/financeiro/contas-fixas`

```json
{
    "description": "Conta de luz",
    "category": "Utilidades",
    "amount": 320.0,
    "startMonth": "2026-03",
    "defaultStatus": "pending"
}
```

### Listar contas fixas

`GET /api/financeiro/contas-fixas`

### Atualizar conta fixa

`PUT /api/financeiro/contas-fixas/{id}`

### Exclusão controlada de conta fixa

`POST /api/financeiro/contas-fixas/{id}/delete-range`

```json
{
    "mode": "until-month",
    "month": "2026-03"
}
```

### Modos possíveis

- `until-month`
- `from-month`
- `all`

### Regra

- Conta fixa impacta todos os meses futuros a partir do `startMonth` até ser encerrada.
- Nunca fazer exclusão cega sem perguntar o intervalo.

---

## 7) Receitas com estoque e conversões

Quero aplicar para **Receitas** um comportamento próximo ao de Ingredientes/Insumos, mas respeitando a natureza do domínio.

### Regras

- Receita é produzida, não comprada.
- Receita deve ter estoque próprio.
- Receita deve aceitar conversões/unidades, como “unidade”, “kg”, “fatia”, etc.
- Produção de receita deve gerar movimentação de estoque da própria receita.
- Se houver controle financeiro futuro de produção, isso pode alimentar custo interno, mas não é venda automática por si só.

### Endpoints sugeridos

- `GET /api/receitas`
- `GET /api/receitas/{id}`
- `PATCH /api/receitas/{id}`
- `GET /api/receitas/{id}/conversoes`
- `POST /api/receitas/{id}/conversoes`
- `PUT /api/receitas/{id}/conversoes/{conversionId}`
- `DELETE /api/receitas/{id}/conversoes/{conversionId}`
- `POST /api/receitas/{id}/producao`

### Exemplo de produção

```json
{
    "conversionId": 2,
    "quantity": 3,
    "productionDate": "2026-03-19"
}
```

---

## 8) Entidades sugeridas

### Financeiro

- `FinancialEntry`
- `FinancialEntryExclusion`
- `FixedAccount`
- `FixedAccountPeriod` (opcional, se quiser representar intervalos/encerramentos)
- `StockPurchase` ou `InventoryPurchaseMovement`

### Receitas

- `Recipe`
- `RecipeConversion`
- `RecipeStockMovement`

---

## 9) Relacionamentos esperados

- pedido entregue -> gera `FinancialEntry` de entrada
- compra/reposição de ingrediente ou insumo -> gera `FinancialEntry` de despesa
- conta fixa -> gera impacto recorrente mês a mês
- produção de receita -> gera `RecipeStockMovement`

---

## 10) Regras de negócio importantes

1. Valor monetário sempre maior que zero.
2. Usar decimal monetário (não float puro).
3. Endpoints REST legíveis e com payload/response fáceis de inspecionar.
4. Toda origem automática precisa de rastreabilidade (`referenceType`, `referenceId`, `source`).
5. Exclusões automáticas devem preservar histórico e auditoria.
6. Saldo projetado precisa ser calculado sobre uma linha do tempo acumulada.
7. Contas fixas precisam refletir corretamente todos os meses futuros.
8. Receitas devem ganhar estoque e conversões próprias.

---

## 11) Enums sugeridos

- `FinancialEntryType`: `income`, `expense`
- `FinancialEntryStatus`: `paid`, `pending`, `excluded`
- `FinancialEntrySource`: `manual`, `auto-sale`, `auto-stock`, `auto-fixed`
- `DeletionMode`: `until-month`, `from-month`, `all`

---

## 12) Entrega esperada

- endpoints implementados
- migrations
- documentação OpenAPI
- exemplos reais de request/response
- regras de negócio cobertas por testes
