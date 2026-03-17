# Prompt para o Back-end — Financeiro básico real da doceria

Preciso evoluir o back-end para suportar um **financeiro básico e real** no Bollu Flow, com foco em:

- entradas (vendas e outros recebimentos)
- saídas (compras de ingredientes/insumos e despesas)
- contas fixas (água, luz, gás, aluguel, internet etc.)
- saldo atual e saldo projetado

Sem necessidade de DRE complexa nesse momento.

## Objetivo funcional

A pessoa administradora da doceria precisa conseguir responder:

1. Quanto tenho em caixa hoje?
2. Quanto ainda tenho para receber?
3. Quanto ainda tenho para pagar?
4. Quais são minhas contas fixas do mês?

## Endpoints mínimos desejados

### 1) Lançamentos financeiros (extrato)

#### Criar lançamento

`POST /financial/entries`

Payload:

```json
{
    "description": "Compra de embalagens",
    "type": "Expense",
    "category": "Insumos",
    "amount": 185.9,
    "date": "2026-03-12",
    "status": "Paid",
    "isFixed": false,
    "notes": "Fornecedor XP"
}
```

#### Listar lançamentos

`GET /financial/entries?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&type=Income|Expense&status=Paid|Pending&isFixed=true|false&page=1&pageSize=20`

#### Atualizar status (pago/pendente)

`PATCH /financial/entries/{entryId}/status`

Payload:

```json
{
    "status": "Paid"
}
```

#### Excluir lançamento

`DELETE /financial/entries/{entryId}`

### 2) Receitas automáticas por venda

Quero que pedidos entregues gerem entradas automaticamente no financeiro.

Sugestão de endpoint para consumo no front:

`GET /financial/sales-entries?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

Resposta esperada:

```json
[
    {
        "id": "sale-order-123",
        "orderId": 123,
        "description": "Venda pedido #2050 - Maria",
        "amount": 240.0,
        "date": "2026-03-03",
        "status": "Paid"
    }
]
```

### 3) Resumo financeiro básico

`GET /financial/overview?month=YYYY-MM`

Retornar:

```json
{
    "currentBalance": 5230.5,
    "totalIncomesPaid": 8900.0,
    "totalExpensesPaid": 3669.5,
    "pendingToReceive": 950.0,
    "pendingToPay": 700.0,
    "forecastBalance": 5480.5,
    "fixedCostsInMonth": 1200.0
}
```

### 4) Contas fixas

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

> Isso pode criar lançamentos pendentes automaticamente para o mês.

## Regras importantes

1. Não permitir valor negativo ou zero em lançamentos.
2. Usar decimal monetário adequado no banco (evitar float puro).
3. Lançamento não pode mudar `type` depois de criado (ou justificar se permitir).
4. Status só pode ser `Paid` ou `Pending` nesse MVP.
5. Vendas automáticas não podem ser excluídas manualmente no financeiro.
6. Paginação obrigatória nas listagens.

## Enums sugeridos

- `FinancialEntryType`: `Income`, `Expense`
- `FinancialEntryStatus`: `Paid`, `Pending`

## Entregáveis esperados

- endpoints implementados
- migrations
- validações de domínio
- documentação OpenAPI com exemplos
