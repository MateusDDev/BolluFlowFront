# Prompt para backend (Produtos + Ingredientes + Insumos)

Quero que você implemente no backend o domínio de **Produto Final** separado de **Receita**, mantendo **Ingredientes** e adicionando **Insumos** com conversões próprias.

## Objetivo funcional

1. Receita continua existindo e não é produto final.
2. Produto final é a entidade vendida no pedido.
3. Ingredientes continuam sendo ingredientes alimentícios.
4. Insumos são itens operacionais (embalagem, colher, etiqueta etc.).
5. Produto final pode ser composto por receitas, ingredientes e insumos.
6. Pedido aceita somente produto final.
7. Produtos devem permitir ajuste manual de estoque na tela de detalhes.
8. Insumos devem ter conversões e entrada de estoque por conversão, igual ingredientes.

---

## 1) Entidades esperadas

### Ingredient (manter)

- id
- name
- baseUnit
- unitCost
- stockQuantity
- minimumStockQuantity?

### IngredientConversion (manter)

- id
- ingredientId
- name
- quantityInBaseUnit

### Supply (novo)

- id
- name
- baseUnit
- unitCost
- stockQuantity
- minimumStockQuantity?

### SupplyConversion (novo)

- id
- supplyId
- name
- quantityInBaseUnit

### Product (produto final)

- id
- name
- salePrice
- stockQuantity
- minimumStockQuantity?
- indirectCostPercentage
- markupPercentage
- finalPrice
- discountPercentage
- isActive

### ProductComponent

- id
- productId
- componentType: `Recipe | Ingredient | Supply`
- recipeId?
- ingredientId?
- supplyId?
- name
- baseUnit
- unitPrice
- stockQuantity
- quantityUsed

### OrderItem

- id
- orderId
- product: { id, name }
- quantity
- unitPrice
- totalPrice

---

## 2) Endpoints obrigatórios

### Ingredientes (já existem, manter compatíveis)

- `GET /ingredients`
- `GET /ingredients/{id}`
- `POST /ingredients`
- `PUT /ingredients/{id}`
- `DELETE /ingredients/{id}`

### Conversões de ingredientes (já existem, manter)

- `GET /ingredients/{ingredientId}/conversions`
- `POST /ingredients/{ingredientId}/conversions`
- `PUT /ingredients/{ingredientId}/conversions/{conversionId}`
- `DELETE /ingredients/{ingredientId}/conversions/{conversionId}`

### Insumos (novo)

- `GET /supplies`
- `GET /supplies/{id}`
- `POST /supplies`
- `PUT /supplies/{id}`
- `DELETE /supplies/{id}`

### Conversões de insumos (novo, espelhado de ingredientes)

- `GET /supplies/{supplyId}/conversions`
- `POST /supplies/{supplyId}/conversions`
- `PUT /supplies/{supplyId}/conversions/{conversionId}`
- `DELETE /supplies/{supplyId}/conversions/{conversionId}`

### Produtos finais

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PATCH /products/{id}`
    - precisa aceitar ao menos: `name`, `isActive`, `stockQuantity`, `minimumStockQuantity`
- `PATCH /products/{id}/pricing`

### Composição de produtos

- `GET /products/{productId}/components`
- `GET /products/{productId}/components/catalog`
- `POST /products/{productId}/components`
- `PUT /products/{productId}/components/{componentId}`
- `DELETE /products/{productId}/components/{componentId}`

#### Formato esperado para catálogo

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

### Pedidos

- `POST /orders/{orderId}/items` (somente `productId`)
- `GET /orders/{orderId}/items` (retornar `product`)
- `POST /orders/{id}/deliver` (baixa de estoque de produto e componentes)

---

## 3) Regras de negócio

1. `componentType` é obrigatório.
2. Se `Recipe`, exige `recipeId` e proíbe `ingredientId`/`supplyId`.
3. Se `Ingredient`, exige `ingredientId` e proíbe os demais ids.
4. Se `Supply`, exige `supplyId` e proíbe os demais ids.
5. `quantityUsed > 0`.
6. Não permitir componente duplicado no mesmo produto (mesmo type + mesmo id de origem).
7. Evitar ciclos de composição.
8. `stockQuantity >= 0`, `minimumStockQuantity >= 0`, `finalPrice >= 0`.

---

## 4) Consistência transacional

1. Operações de composição transacionais.
2. Entrega de pedido transacional (rollback total se faltar estoque).
3. Índices recomendados:
    - `supplies(name)`
    - `supply_conversions(supply_id)`
    - `product_components(product_id)`
    - `order_items(order_id)`

---

## 5) Formato de erro

```json
{
    "message": "Descrição legível",
    "code": "SUPPLY_CONVERSION_NOT_FOUND",
    "details": {}
}
```

Status sugeridos:

- 400 payload inválido
- 404 não encontrado
- 409 conflito de negócio
- 422 validação de regra

---

## 6) Definition of done

- [ ] Endpoints de supplies implementados
- [ ] Endpoints de supply conversions implementados
- [ ] Endpoints de products/components implementados
- [ ] PATCH de produto aceitando ajuste de estoque
- [ ] Pedido usando apenas productId
- [ ] Entrega com baixa de estoque consistente
- [ ] Testes de integração para fluxos críticos
- [ ] OpenAPI atualizado

Ao final, entregar:

1. resumo técnico das decisões
2. migrations criadas
3. exemplos de request/response
4. testes executados
