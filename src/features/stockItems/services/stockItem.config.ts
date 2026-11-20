export type StockItemKind = 'ingredient' | 'supply'

export type StockItemConfig = {
    kind: StockItemKind
    apiPath: '/ingredients' | '/supplies'
    queryKey: 'ingredients' | 'supplies'
    conversionsQueryKey: 'ingredient-conversions' | 'supply-conversions'
    singular: string
    plural: string
    newLabel: string
    namePlaceholder: string
    packagePlaceholder: string
}

export const INGREDIENT_CONFIG: StockItemConfig = {
    kind: 'ingredient',
    apiPath: '/ingredients',
    queryKey: 'ingredients',
    conversionsQueryKey: 'ingredient-conversions',
    singular: 'ingrediente',
    plural: 'ingredientes',
    newLabel: 'Novo ingrediente',
    namePlaceholder: 'Ex.: Leite condensado',
    packagePlaceholder: 'Ex.: Lata',
}

export const SUPPLY_CONFIG: StockItemConfig = {
    kind: 'supply',
    apiPath: '/supplies',
    queryKey: 'supplies',
    conversionsQueryKey: 'supply-conversions',
    singular: 'insumo',
    plural: 'insumos',
    newLabel: 'Novo insumo',
    namePlaceholder: 'Ex.: Caixa para bolo',
    packagePlaceholder: 'Ex.: Pacote',
}
