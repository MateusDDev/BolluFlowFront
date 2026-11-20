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
    emptyDescription: string
    emptyExample: string
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
    emptyDescription:
        'Cadastre o que você compra, com o preço que paga pelo pacote. O sistema calcula o custo por quilo ou litro e usa nas receitas.',
    emptyExample: 'Ex.: Leite condensado, R$ 7,49 a lata de 395 g',
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
    emptyDescription:
        'Embalagens e descartáveis que entram no produto final. Com eles na ficha técnica, a margem do produto fica completa.',
    emptyExample: 'Ex.: Caixa para bolo, R$ 25,00 o pacote com 10',
}
