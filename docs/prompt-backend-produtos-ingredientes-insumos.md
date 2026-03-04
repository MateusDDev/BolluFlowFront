# Prompt para backend (Produtos + Ingredientes + Insumos)

Quero que você implemente no backend o domínio completo de **Produto Final** separado de **Receita**, mantendo **Ingredientes** como estão e criando **Insumos** como uma nova entidade separada.

## Objetivo funcional

1. Receita continua existindo e não é produto final.
2. Produto final é a entidade vendida no pedido.
3. Ingredientes continuam sendo ingredientes alimentícios.
4. Insumos são uma nova entidade para itens operacionais/embalagem (ex: colher plástica, embalagem, etiqueta, fita).
5. Produto final pode ser composto por:
    - receitas
    - ingredientes
    - insumos
6. Pedido deve aceitar somente produto final.

---

## 1) Entidades esperadas

### 1.1 Ingredient (já existente, manter)

Campos atuais esperados no front:

- id
- name
- baseUnit
- unitCost
- stockQuantity
- minimumStockQuantity?

### 1.2 Supply (nova entidade de insumos)

Campos esperados:

- id
- name
- baseUnit
- unitCost
- stockQuantity
- minimumStockQuantity?

### 1.3 Product (produto final)

Campos esperados:

- id
- name
- salePrice (opcional na criação)
- stockQuantity
- minimumStockQuantity?
- indirectCostPercentage
- markupPercentage
- finalPrice
- discountPercentage
- isActive

### 1.4 ProductComponent

Representa a composição do produto:

- id
- productId
- componentType: 'Recipe' | 'Ingredient' | 'Supply'
- recipeId?
- ingredientId?
- supplyId?
- name
- baseUnit
- unitPrice
- stockQuantity
- quantityUsed

### 1.5 OrderItem

Item de pedido deve conter:

- productId
- quantity
- unitPrice
- totalPrice
- product: { id, name }

---

## 2) Endpoints obrigatórios

## 2.1 Ingredientes (manter)

- manter contratos atuais de `/ingredients`

## 2.2 Insumos (novo)

1. `GET /supplies`
2. `GET /supplies/{id}`
3. `POST /supplies`
4. `PUT /supplies/{id}`
5. `DELETE /supplies/{id}`

Payload de criação/edição (exemplo):

```json
{
    "name": "Embalagem G",
    "unit": "unit",
    "unitCost": 1.25,
    "stockQuantity": 200,
    "minimumStockQuantity": 50
}
```

## 2.3 Produtos finais

1. `GET /products`
2. `GET /products/{id}`
3. `POST /products`
4. `PATCH /products/{id}`
5. `PATCH /products/{id}/pricing`

## 2.4 Composição do produto

1. `GET /products/{productId}/components`
2. `GET /products/{productId}/components/catalog`
3. `POST /products/{productId}/components`
4. `PUT /products/{productId}/components/{componentId}`
5. `DELETE /products/{productId}/components/{componentId}`

### Regra do catálogo

`GET /products/{productId}/components/catalog` deve retornar itens com shape:

```json
[
    {
        "id": 1,
        "name": "Massa de chocolate",
        "baseUnit": "unit",
        "sourceType": "Recipe"
    },
    {
        "id": 2,
        "name": "Leite condensado",
        "baseUnit": "g",
        "sourceType": "Ingredient"
    },
    {
        "id": 3,
        "name": "Embalagem G",
        "baseUnit": "unit",
        "sourceType": "Supply"
    }
]
```

## 2.5 Pedidos

1. `POST /orders/{orderId}/items` deve aceitar **somente** `productId`.
2. `GET /orders/{orderId}/items` deve retornar `product` com `id` e `name`.
3. `POST /orders/{id}/deliver` deve baixar estoque do produto e refletir consumo dos componentes (receitas, ingredientes e insumos).

---

## 3) Validações de negócio

1. `componentType` obrigatório.
2. Se `Recipe`, exige `recipeId` e proíbe `ingredientId` e `supplyId`.
3. Se `Ingredient`, exige `ingredientId` e proíbe os demais ids.
4. Se `Supply`, exige `supplyId` e proíbe os demais ids.
5. `quantityUsed > 0`.
6. Não permitir duplicidade de componente no mesmo produto (mesmo type + mesmo id de origem).
7. Não permitir produto referenciar ele mesmo direta/indiretamente por receita/composição (evitar ciclos).
8. `minimumStockQuantity >= 0`, `finalPrice >= 0`.

---

## 4) Consistência e transação

1. Operações de composição devem ser transacionais.
2. Entrega de pedido deve ser transacional (rollback total em estoque insuficiente).
3. Indexar chaves de busca:
    - supplies(name)
    - product_components(product_id)
    - order_items(order_id)

---

## 5) Formato de erros

Use respostas padronizadas:

```json
{
    "message": "Descrição legível",
    "code": "SUPPLY_NOT_FOUND",
    "details": {}
}
```

Status sugeridos:

- 400: payload inválido
- 404: não encontrado
- 409: conflito de negócio (duplicidade, estoque insuficiente, ciclo)
- 422: regra inválida

---

## 6) Definition of done

- [ ] Endpoints de supplies implementados
- [ ] Endpoints de products/components implementados
- [ ] Pedido usando apenas productId
- [ ] Entrega com baixa de estoque consistente
- [ ] Testes de integração para fluxos críticos
- [ ] Documentação OpenAPI atualizada

No final, entregue:

1. resumo técnico das decisões
2. lista de migrations
3. exemplos de request/response de todos endpoints
4. lista de testes executados
