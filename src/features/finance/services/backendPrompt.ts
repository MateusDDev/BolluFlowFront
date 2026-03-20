export const financeBackendPrompt = `Extend the existing backend of this confectionery management system with Finance capabilities. Do not replace the current backend architecture. Add only the missing entities, endpoints, service logic and integrations required for the frontend flows below.

GOAL
Add a Finance module that supports:
- /finance/overview
- /finance/transactions
- /finance/fixed-costs

The frontend will call the real backend through a configurable external base URL.
The backend remains the single source of truth for persistence, calculations, recurrence and integrity rules.

LANGUAGE RULES
- All code, entities, endpoints, payloads, responses and business logic must be in English.
- Keep REST endpoints explicit and readable.
- Responses must be browser-readable and easy to inspect in the network tab.

BACKEND EXTENSION SCOPE
1. Keep all existing authentication, customer, order, ingredient, supply, recipe and product modules.
2. Add a new Finance domain without breaking existing APIs.
3. Reuse existing sale/order flows and inventory flows whenever possible.
4. Add or extend purchase flows for ingredients and supplies if they do not already exist.

NEW OR EXTENDED ENTITIES
1. FinancialTransaction
- id: uuid
- type: 'income' | 'expense'
- sourceType: 'manual' | 'sale' | 'ingredient_purchase' | 'supply_purchase' | 'fixed_cost'
- description: string
- amount: decimal(12,2)
- eventDate: date
- month: string (YYYY-MM) or derivable server-side
- notes?: string
- sourceEntityType: 'manual' | 'sale' | 'purchase' | 'fixed_cost'
- sourceEntityId?: uuid
- isAutomatic: boolean
- metadata?: json
- deletedAt?: datetime
- createdAt: datetime
- updatedAt: datetime

2. FixedCost
- id: uuid
- name: string
- amount: decimal(12,2)
- startMonth: string (YYYY-MM)
- endMonth?: string | null
- notes?: string
- deletedAt?: datetime
- createdAt: datetime
- updatedAt: datetime

3. Purchase
- id: uuid
- itemType: 'ingredient' | 'supply'
- itemId: uuid
- itemNameSnapshot: string
- conversionNameSnapshot: string
- quantity: decimal(12,3)
- quantityInBaseUnit: decimal(12,3)
- totalCost: decimal(12,2)
- purchasedAt: date
- notes?: string
- deletedAt?: datetime
- createdAt: datetime
- updatedAt: datetime

4. Recipe extension
- Recipes are produced, not purchased.
- Recipes may have stock and conversions, but must not generate purchase records or automatic finance expenses.
- If recipe stock/conversion support already exists, keep it and align behavior with ingredients and supplies.

REQUIRED ENDPOINTS
Finance overview
GET /api/finance/overview?month=2026-03
Response example:
{
  "month": "2026-03",
  "incomeTotal": 1800.00,
  "expenseTotal": 1820.00,
  "monthBalance": -20.00,
  "projectedBalance": -560.00,
  "recentTransactions": [
    {
      "id": "txn_1",
      "type": "expense",
      "sourceType": "fixed_cost",
      "description": "Kitchen rent",
      "amount": 1200.00,
      "eventDate": "2026-03-01",
      "month": "2026-03",
      "sourceEntityType": "fixed_cost",
      "sourceEntityId": "fixed_1",
      "isAutomatic": true,
      "notes": null,
      "metadata": { "recurring": true }
    }
  ]
}

Transactions
GET /api/finance/transactions?month=2026-03
Response example:
[
  {
    "id": "txn_manual_1",
    "type": "expense",
    "sourceType": "manual",
    "description": "Manual expense - packaging refund",
    "amount": 45.50,
    "eventDate": "2026-03-20",
    "month": "2026-03",
    "sourceEntityType": "manual",
    "sourceEntityId": null,
    "isAutomatic": false,
    "notes": "Supplier adjustment",
    "metadata": null
  }
]

POST /api/finance/transactions
Request example:
{
  "type": "expense",
  "description": "Manual expense - packaging refund",
  "amount": 45.50,
  "eventDate": "2026-03-20",
  "notes": "Supplier adjustment"
}
Response example:
{
  "id": "txn_manual_1",
  "type": "expense",
  "sourceType": "manual",
  "description": "Manual expense - packaging refund",
  "amount": 45.50,
  "eventDate": "2026-03-20",
  "month": "2026-03",
  "sourceEntityType": "manual",
  "sourceEntityId": null,
  "isAutomatic": false,
  "notes": "Supplier adjustment",
  "metadata": null
}

DELETE /api/finance/transactions/:id
Behavior:
- Always support UI confirmation on the frontend.
- Manual transaction: soft delete only the transaction.
- Automatic transaction from ingredient/supply purchase: delete or cancel the transaction and the linked purchase according to existing inventory integrity rules.
- Automatic transaction from sale: either block deletion or define a safe domain-specific cascade.
Response example:
{
  "deleted": true,
  "cascade": true,
  "sourceEntityType": "purchase"
}

Fixed costs
GET /api/finance/fixed-costs
POST /api/finance/fixed-costs
PUT /api/finance/fixed-costs/:id
DELETE /api/finance/fixed-costs/:id?mode=until-this-month&month=2026-03
DELETE /api/finance/fixed-costs/:id?mode=from-this-month-forward&month=2026-03
DELETE /api/finance/fixed-costs/:id?mode=permanent&month=2026-03

Create request example:
{
  "name": "Internet",
  "amount": 89.90,
  "startMonth": "2026-03",
  "endMonth": null,
  "notes": "Business fiber link"
}
Response example:
{
  "id": "fixed_1",
  "name": "Internet",
  "amount": 89.90,
  "startMonth": "2026-03",
  "endMonth": null,
  "notes": "Business fiber link",
  "createdAt": "2026-03-20T12:00:00.000Z",
  "updatedAt": "2026-03-20T12:00:00.000Z"
}

Delete response example:
{
  "deleted": true,
  "mode": "from-this-month-forward",
  "month": "2026-03"
}

Purchases
If ingredient and supply purchase endpoints already exist, extend them to create finance transactions automatically.
If they do not exist, add:
POST /api/inventory/purchases
Request example:
{
  "itemType": "ingredient",
  "itemId": "ingredient_1",
  "itemName": "Premium chocolate",
  "conversionName": "5 kg pack",
  "quantity": 2,
  "quantityInBaseUnit": 10,
  "totalCost": 560.00,
  "purchasedAt": "2026-03-08",
  "notes": "Monthly replenishment"
}
Response example:
{
  "purchase": {
    "id": "purchase_1",
    "itemType": "ingredient",
    "itemId": "ingredient_1",
    "itemName": "Premium chocolate",
    "conversionName": "5 kg pack",
    "quantity": 2,
    "quantityInBaseUnit": 10,
    "totalCost": 560.00,
    "purchasedAt": "2026-03-08",
    "notes": "Monthly replenishment"
  },
  "transaction": {
    "id": "txn_purchase_1",
    "type": "expense",
    "sourceType": "ingredient_purchase",
    "description": "Ingredient purchase - Premium chocolate",
    "amount": 560.00,
    "eventDate": "2026-03-08",
    "month": "2026-03",
    "sourceEntityType": "purchase",
    "sourceEntityId": "purchase_1",
    "isAutomatic": true,
    "notes": "Monthly replenishment",
    "metadata": {
      "conversionName": "5 kg pack",
      "quantityInBaseUnit": 10
    }
  }
}

BUSINESS RULES
1. Sale -> automatic income
- When a sale/order becomes financially confirmed, create one income transaction.
- Preserve traceability to the original sale/order entity.

2. Ingredient purchase / supply purchase -> automatic expense
- Every ingredient or supply purchase must create one Purchase record and one automatic expense transaction.
- Finance transaction creation must happen in the backend, not in the frontend.

3. Fixed cost recurrence
- Fixed costs represent recurring monthly expenses.
- The backend must expand recurrence for every applicable future month.
- The frontend must not duplicate or calculate recurring rows locally.

4. Fixed cost deletion logic
- Delete only until this month
- Delete from this month forward
- Delete permanently
- Implement the real recurrence strategy in the backend so auditability is preserved.

5. Projected balance
- Must be cumulative.
- Each month impacts the next month.
- The backend must calculate and return the projected balance.
- The frontend must only render the returned value.

6. Inventory and conversions
- Ingredients: stock + units + conversions + purchases + automatic finance expense.
- Supplies: stock + units + conversions + purchases + automatic finance expense.
- Recipes: stock + units + conversions, but no purchase endpoint and no automatic purchase expense.
- Reuse the same conversion behavior across ingredients, supplies and recipes whenever possible.

7. UX terminology
Prefer these labels in payload descriptions and any response metadata intended for UI rendering:
- Ingredient purchase
- Supply purchase
- Stock replenishment
- Manual income
- Manual expense

INTEGRATION NOTES
- Keep the existing backend architecture and coding conventions.
- Prefer soft deletion where financial traceability matters.
- Return enough source metadata for audit trails.
- Make date/month fields explicit.
- Do not move financial calculations to the frontend.
- Keep the implementation simple, functional and scalable.`
