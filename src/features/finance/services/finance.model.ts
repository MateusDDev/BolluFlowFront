export type FinancialEntryType = 'entrada' | 'saida'

export type FinancialEntryOrigin = 'pedido' | 'insumo' | 'ingrediente'

export interface FinancialEntryModel {
    id: number
    tipo: FinancialEntryType
    valor: number
    descricao: string
    origem: FinancialEntryOrigin
    origem_id: number
    createdAt: string
}

export interface FinancialBalanceModel {
    totalEntradas: number
    totalSaidas: number
    saldo: number
}

export interface CreateFinancialEntryDataType {
    tipo: FinancialEntryType
    valor: number
    descricao: string
    origem: FinancialEntryOrigin
    origem_id: number
}
