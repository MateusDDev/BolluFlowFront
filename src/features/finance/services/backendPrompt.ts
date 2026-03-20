export const financeBackendPrompt = `Build a Finance module for a confectionery management system.

GOAL
Create a simple, functional and scalable mini financial app with three pages:
- /finance/overview
- /finance/transactions
- /finance/fixed-costs

LANGUAGE RULES
- All code, entities, endpoints, payloads, responses and business logic must be in English.
- REST endpoints must be explicit and readable.
- Avoid framework-specific transport patterns such as RSC payloads or internal streaming.

ENTITIES
1. FinancialTransaction
- id: string | uuid
- type: 'income' | 'expense'
- sourceType: 'manual' | 'sale' | 'ingredient_purchase' | 'supply_purchase' | 'fixed_cost'
- description: string
- amount: decimal
- eventDate: date
- month: string (YYYY-MM)
- notes?: string
- sourceEntityType: 'manual' | 'sale' | 'purchase' | 'fixed_cost'
- sourceEntityId?: string
- isAutomatic: boolean
- metadata?: json
- deletedAt?: datetime
- createdAt: datetime
- updatedAt: datetime

2. FixedCost
- id: string | uuid
- name: string
- amount: decimal
- startMonth: string (YYYY-MM)
- endMonth?: string | null
- notes?: string
- deletedAt?: datetime
- createdAt: datetime
- updatedAt: datetime

3. Purchase
- id: string | uuid
- itemType: 'ingredient' | 'supply'
- itemId: string | uuid
- itemName: string
- conversionName: string
- quantity: decimal
- quantityInBaseUnit: decimal
- totalCost: decimal
- purchasedAt: date
- notes?: string
- deletedAt?: datetime
- createdAt: datetime
- updatedAt: datetime

4. Recipe
- Recipes are produced, not purchased.
- They can have stock and conversions, but they must not create purchase records and must not automatically generate finance expenses.

ENDPOINTS
Finance overview
GET /api/finance/overview?month=2026-03
Response:
{
  "month": "2026-03",
  "incomeTotal": 1800,
  "expenseTotal": 1820,
  "monthBalance": -20,
  "projectedBalance": -560,
  "recentTransactions": [
    {
      "id": "txn_1",
      "type": "expense",
      "sourceType": "fixed_cost",
      "description": "Kitchen rent",
      "amount": 1200,
      "eventDate": "2026-03-01",
      "month": "2026-03",
      "sourceEntityType": "fixed_cost",
      "sourceEntityId": "fixed_1",
      "isAutomatic": true
    }
  ]
}

Transactions
GET /api/finance/transactions?month=2026-03
POST /api/finance/transactions
Request example:
{
  "type": "expense",
  "description": "Manual expense - packaging refund",
  "amount": 45.5,
  "eventDate": "2026-03-20",
  "notes": "Supplier adjustment"
}
Response example:
{
  "id": "txn_manual_1",
  "type": "expense",
  "sourceType": "manual",
  "description": "Manual expense - packaging refund",
  "amount": 45.5,
  "eventDate": "2026-03-20",
  "month": "2026-03",
  "sourceEntityType": "manual",
  "isAutomatic": false,
  "notes": "Supplier adjustment"
}

DELETE /api/finance/transactions/:id
Behavior:
- Always require confirmation in the UI.
- Manual transaction: soft delete only the transaction.
- Automatic transaction from purchase: delete the transaction and the linked purchase.
- Automatic transaction from sale: reject or define a cascade based on the sales domain rules.
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
  "amount": 89.9,
  "startMonth": "2026-03",
  "endMonth": null,
  "notes": "Business fiber link"
}

Delete response example:
{
  "deleted": true,
  "mode": "from-this-month-forward",
  "month": "2026-03"
}

Purchases
POST /api/inventory/purchases
Request example:
{
  "itemType": "ingredient",
  "itemId": "ingredient_1",
  "itemName": "Premium chocolate",
  "conversionName": "5 kg pack",
  "quantity": 2,
  "quantityInBaseUnit": 10,
  "totalCost": 560,
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
    "totalCost": 560,
    "purchasedAt": "2026-03-08",
    "notes": "Monthly replenishment"
  },
  "transaction": {
    "id": "txn_purchase_1",
    "type": "expense",
    "sourceType": "ingredient_purchase",
    "description": "Ingredient purchase - Premium chocolate",
    "amount": 560,
    "eventDate": "2026-03-08",
    "month": "2026-03",
    "sourceEntityType": "purchase",
    "sourceEntityId": "purchase_1",
    "isAutomatic": true,
    "metadata": {
      "conversionName": "5 kg pack",
      "quantityInBaseUnit": 10
    }
  }
}

BUSINESS RULES
1. Sale -> automatic income
- Every confirmed sale must create one financial transaction with type = income and sourceType = sale.
- The transaction must preserve traceability to the original sale.

2. Ingredient purchase / supply purchase -> automatic expense
- Purchasing ingredients or supplies must create a Purchase record and an automatic expense transaction.
- Deleting the automatic purchase transaction must also remove or cancel the linked purchase according to the inventory policy.

3. Fixed cost recurrence
- Fixed costs represent recurring monthly expenses.
- They must automatically appear in every applicable future month.
- Do not require manual duplication for each month.

4. Fixed cost deletion logic
- Delete only until this month: keep the fixed cost active after the selected month, but stop or hide occurrences up to the selected month according to the agreed rule.
- Delete from this month forward: stop recurrence starting from the selected month.
- Delete permanently: remove the recurring schedule entirely.
- If preferred for consistency, split the recurring series into multiple records to preserve auditability.

5. Projected balance
- Must be cumulative.
- Each month affects the next month.
- If January ends negative, February projected balance must start negative.
- Fixed costs from future months must also affect future projected balances.

6. Inventory and conversions
- Ingredients: have stock, units and conversions; can be purchased; purchases generate expenses.
- Supplies: have stock, units and conversions; can be purchased; purchases generate expenses.
- Recipes: have stock, units and conversions; are produced, not purchased; must not generate automatic purchase expenses.
- Reuse the same conversion behavior for ingredients, supplies and recipes.

7. UX terminology
Use these labels instead of ambiguous ones:
- Ingredient purchase
- Supply purchase
- Stock replenishment
- Manual income
- Manual expense

IMPLEMENTATION NOTES
- Prefer soft deletion with deletedAt for financial traceability.
- Return enough source metadata for audit trails.
- Keep payloads simple and browser-readable.
- Make date/month fields explicit.
- Keep the design simple and scalable, avoid overengineering.`
