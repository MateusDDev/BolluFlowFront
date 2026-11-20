import { toast } from 'sonner'

const STORAGE_PREFIX = 'tips.seen.'

export type TipKey =
    | 'first-purchase'
    | 'first-count'
    | 'first-sale'
    | 'first-custom-order'
    | 'first-recipe-ingredient'
    | 'first-product-component'
    | 'first-production'

const TIPS: Record<TipKey, { title: string; description: string }> = {
    'first-purchase': {
        title: 'Compra registrada',
        description:
            'O estoque subiu, o custo do item foi atualizado e a despesa entrou no Financeiro. Receitas e produtos que usam esse item já recalcularam o custo.',
    },
    'first-count': {
        title: 'Contagem salva',
        description:
            'Contagem só corrige a quantidade. Não mexe no Financeiro, porque nenhum dinheiro entrou ou saiu.',
    },
    'first-sale': {
        title: 'Primeira venda registrada!',
        description:
            'Ela já entrou no Financeiro e aparece nas métricas do Dashboard, com o lucro calculado pelo custo de hoje.',
    },
    'first-custom-order': {
        title: 'Primeira encomenda criada!',
        description:
            'Avance o status na tela do pedido. Ao marcar como entregue, o valor entra no Financeiro.',
    },
    'first-recipe-ingredient': {
        title: 'Ingrediente adicionado',
        description:
            'O custo da receita aparece na aba Detalhes e se atualiza sozinho quando o preço do ingrediente muda.',
    },
    'first-product-component': {
        title: 'Ficha técnica montada',
        description:
            'Agora o produto tem custo e margem calculados. Veja os produtos de menor margem no Dashboard.',
    },
    'first-production': {
        title: 'Produção registrada',
        description:
            'Os ingredientes saíram do estoque e o item produzido entrou. Nada muda no Financeiro.',
    },
}

export function showTipOnce(key: TipKey) {
    try {
        if (localStorage.getItem(STORAGE_PREFIX + key)) return
        localStorage.setItem(STORAGE_PREFIX + key, '1')
    } catch {
        return
    }

    const tip = TIPS[key]
    toast.success(tip.title, { description: tip.description, duration: 9000 })
}
