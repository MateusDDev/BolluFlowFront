# Prompt para implementar endpoints de dashboard no backend (BolluFlow)

Use este prompt no chat do repositório backend.

---

Quero implementar endpoints dedicados para o dashboard do frontend. Preciso que você crie **4 endpoints de leitura** com contratos estáveis e focados em confiança dos dados (agregação no backend, sem cálculo no frontend).

## Contexto

- O frontend vai consumir exclusivamente os endpoints abaixo para montar os KPIs/cards e listas do dashboard.
- Precisamos que as regras de cálculo fiquem no backend para evitar divergência entre telas.
- Retornar sempre payload consistente e ordenado.

## Endpoints necessários

### 1) GET `/dashboard/stock-alerts`

Retorna itens com estoque próximo ou abaixo do mínimo (prioridade por severidade).

#### Regra de negócio

- Considerar entidades: **Products**, **Ingredients**, **Supplies**.
- Só incluir itens com `minimumStockQuantity > 0`.
- Incluir item quando `stockQuantity <= minimumStockQuantity * 1.2`.
- Definir severidade:
    - `Critical` quando `stockQuantity <= minimumStockQuantity`
    - `Warning` quando `stockQuantity > minimumStockQuantity` e `<= minimumStockQuantity * 1.2`
- Ordenação:
    1. Severidade (`Critical` antes de `Warning`)
    2. Menor cobertura percentual (`stockCoveragePercent`) primeiro
    3. Nome ascendente
- Limite padrão: 10 itens (pode ser configurável por query param `limit`, default 10, max 50)

#### Response (200)

```json
[
    {
        "id": 1,
        "name": "Farinha",
        "category": "Ingredient",
        "stockQuantity": 8,
        "minimumStockQuantity": 10,
        "stockCoveragePercent": 80,
        "severity": "Critical"
    }
]
```

---

### 2) GET `/dashboard/orders-by-status`

Retorna quantidade de pedidos por status.

#### Regra de negócio

- Agrupar por status de pedido.
- Garantir retorno de todos os status esperados, mesmo com zero:
    - `Pending`
    - `InProduction`
    - `Ready`
    - `Delivered`
    - `Canceled`

#### Response (200)

```json
[
    { "status": "Pending", "total": 4 },
    { "status": "InProduction", "total": 2 },
    { "status": "Ready", "total": 1 },
    { "status": "Delivered", "total": 25 },
    { "status": "Canceled", "total": 3 }
]
```

---

### 3) GET `/dashboard/inventory-value-by-type`

Retorna valor em estoque por tipo de estoque.

#### Regra de negócio

- Retornar pelo menos os tipos:
    - `Products`
    - `Ingredients`
    - `Supplies`
- Fórmula por tipo:
    - Products: `sum(stockQuantity * finalPrice)` (ou `salePrice/finalPrice` conforme padrão oficial da regra de negócio; documentar escolha no código)
    - Ingredients: `sum(stockQuantity * unitCost)`
    - Supplies: `sum(stockQuantity * unitCost)`
- Retornar zero quando não houver itens.

#### Response (200)

```json
[
    { "type": "Products", "totalValue": 1250.5 },
    { "type": "Ingredients", "totalValue": 640.0 },
    { "type": "Supplies", "totalValue": 310.75 }
]
```

---

### 4) GET `/dashboard/recent-orders`

Retorna últimos pedidos para listagem clicável no frontend.

#### Regra de negócio

- Ordenar por `createdAt` desc.
- Limite padrão 5 (query param `limit`, default 5, max 20).
- Trazer campos prontos para renderização da listagem.

#### Response (200)

```json
[
    {
        "id": 101,
        "number": 2026,
        "customerName": "Maria Silva",
        "status": "Pending",
        "createdAt": "2026-03-12T10:00:00.000Z",
        "totalItems": 7,
        "totalValue": 230.9
    }
]
```

---

## Requisitos técnicos

1. Criar controller/route versionada dentro do padrão já usado no projeto.
2. Criar service com métodos separados por endpoint.
3. Criar DTOs de response com validação/serialização.
4. Adicionar testes automatizados:
    - unitário de regra de cálculo/agregação
    - integração dos 4 endpoints (incluindo caso vazio)
5. Atualizar documentação da API (Swagger/OpenAPI, se existente).
6. Garantir performance:
    - evitar N+1
    - usar agregações SQL quando possível
    - índices se necessário
7. Garantir multi-tenant/escopo por usuário/empresa se o sistema possuir esse conceito.

## Critérios de aceite

- [ ] Os 4 endpoints respondem 200 com contratos exatamente como descritos.
- [ ] Regras de negócio de severidade e filtros de estoque aplicadas no backend.
- [ ] Status de pedidos retorna todos os status esperados, mesmo com zero.
- [ ] Testes passando e documentação atualizada.

## Observação importante

Se houver divergência de nomenclatura de campos/tabelas no projeto, adapte internamente, mas **mantenha o contrato HTTP final exatamente igual** ao definido neste prompt, pois o frontend já está preparado para esse formato.

---

## Sugestões extras (opcional, mas útil)

Se der tempo, adicionar:

- `GET /dashboard/kpi-summary` consolidando contadores principais em uma chamada só.
- filtro temporal opcional (`from`, `to`) para `orders-by-status` e `recent-orders`.
- campo `lastUpdatedAt` em todas as respostas para rastreabilidade.
