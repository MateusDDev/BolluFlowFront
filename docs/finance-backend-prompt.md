# Prompt para o Back-end — Financeiro mensal (MVP prático da doceria)

Preciso evoluir o back-end para suportar um financeiro **simples e útil no dia a dia**, com visão por mês.

## Objetivo do MVP

Quero conseguir, para qualquer mês (`YYYY-MM`):

1. Ver saldo atual (entradas pagas - saídas pagas)
2. Ver saldo projetado (considerando pendências)
3. Registrar lançamentos manuais (entrada/saída)
4. Controlar contas fixas (água, luz, gás, aluguel etc.)
5. Ter receitas automáticas de vendas
6. Ter despesas automáticas de compras de estoque (ingredientes e insumos), hoje já refletidas no front quando a entrada de estoque é lançada manualmente

## Endpoints necessários

### 1) Lançamentos financeiros

#### Criar lançamento manual

`POST /financial/entries`

Payload:

```json
{
    "description": "Compra de embalagem",
    "type": "Expense",
    "category": "Insumos",
    "amount": 189.5,
    "date": "2026-03-12",
    "status": "Paid",
    "isFixed": false,
    "notes": "Fornecedor XP"
}
```

#### Listar lançamentos por mês

`GET /financial/entries?month=YYYY-MM&type=Income|Expense&status=Paid|Pending&page=1&pageSize=50`

#### Atualizar status

`PATCH /financial/entries/{entryId}/status`

Payload:

```json
{
    "status": "Paid"
}
```

#### Excluir lançamento manual

`DELETE /financial/entries/{entryId}`

> Observação: lançamentos automáticos não devem ser excluídos por esse endpoint.

### 2) Receitas automáticas de vendas

`GET /financial/entries/auto-sales?month=YYYY-MM`

Regra:

- pedidos `Delivered` geram entrada automática `Income`, com status `Paid`.

### 3) Despesas automáticas de compras de estoque

`GET /financial/entries/auto-stock-purchases?month=YYYY-MM`

Regra esperada:

- toda compra/entrada de estoque de ingredientes e insumos deve gerar saída automática `Expense` de forma nativa no back-end.
- incluir referência da compra/movimentação para rastreio.

Resposta exemplo:

```json
[
    {
        "id": "stock-purchase-77",
        "description": "Compra de ingrediente: açúcar",
        "type": "Expense",
        "category": "Ingredientes",
        "amount": 320.0,
        "date": "2026-03-10",
        "status": "Paid",
        "source": "AutoStockPurchase",
        "referenceId": 77
    }
]
```

### 4) Resumo do mês

`GET /financial/overview?month=YYYY-MM`

Retornar:

```json
{
    "month": "2026-03",
    "currentBalance": 4200.0,
    "forecastBalance": 3950.0,
    "totalIncomesPaid": 9000.0,
    "totalExpensesPaid": 4800.0,
    "pendingToReceive": 700.0,
    "pendingToPay": 950.0,
    "fixedCostsInMonth": 2100.0
}
```

### 5) Contas fixas

#### Criar conta fixa

`POST /financial/fixed-accounts`

Payload:

```json
{
    "description": "Conta de luz",
    "category": "Utilidades",
    "defaultAmount": 320.0,
    "dueDay": 10,
    "isActive": true
}
```

#### Listar contas fixas

`GET /financial/fixed-accounts`

#### Gerar lançamentos mensais de contas fixas

`POST /financial/fixed-accounts/generate-month?month=YYYY-MM`

## Entidades sugeridas

- `FinancialEntry`
- `FixedAccount`
- `StockPurchase` ou `InventoryPurchaseMovement`
- `FinancialEntrySourceLink` (opcional para rastreabilidade de origem)

## Relacionamentos esperados

- pedido entregue -> gera `FinancialEntry` de entrada
- compra de ingrediente/insumo -> gera `FinancialEntry` de saída
- conta fixa mensal -> gera `FinancialEntry` recorrente

## Regras de negócio importantes

1. Valor do lançamento deve ser maior que zero.
2. Usar decimal para dinheiro (não float puro).
3. Status permitido no MVP: `Paid` e `Pending`.
4. Paginação obrigatória nas listagens.
5. Lançamentos automáticos precisam de rastreabilidade (`source`, `referenceId`).
6. Não duplicar lançamento automático se o processo for reexecutado (idempotência).

## Enums sugeridos

- `FinancialEntryType`: `Income`, `Expense`
- `FinancialEntryStatus`: `Paid`, `Pending`
- `FinancialEntrySource`: `Manual`, `AutoSale`, `AutoStockPurchase`, `AutoFixedAccount`

## Entregáveis esperados

- endpoints implementados
- migrations
- validações de domínio
- documentação OpenAPI com exemplos
