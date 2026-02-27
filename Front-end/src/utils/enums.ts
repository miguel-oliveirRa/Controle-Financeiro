/**
 * Utilitários para conversão de enums
 * Centraliza lógica de transformação entre valores numéricos e strings
 */

// Mapeamento: TransactionType (0 = Despesa, 1 = Receita)
export const TRANSACTION_TYPES = {
  DESPESA: 0,
  RECEITA: 1,
} as const;

// Mapeamento: Purpose (0 = Despesa, 1 = Receita, 2 = Ambas)
export const PURPOSE_TYPES = {
  DESPESA: 0,
  RECEITA: 1,
  AMBAS: 2,
} as const;

// Converte número de tipo de transação para texto
export const getTransactionTypeText = (type: number | undefined): string => {
  if (type === undefined || type === null) return "Desconhecido";
  switch (type) {
    case TRANSACTION_TYPES.DESPESA:
      return "Despesa";
    case TRANSACTION_TYPES.RECEITA:
      return "Receita";
    default:
      return "Desconhecido";
  }
};

// Converte número de purpose para texto
export const getPurposeText = (purpose: number | undefined): string => {
  if (purpose === undefined || purpose === null) return "Desconhecido";
  switch (purpose) {
    case PURPOSE_TYPES.DESPESA:
      return "Despesa";
    case PURPOSE_TYPES.RECEITA:
      return "Receita";
    case PURPOSE_TYPES.AMBAS:
      return "Ambas";
    default:
      return "Desconhecido";
  }
};

// Converte texto para número de tipo de transação
export const stringToTransactionType = (text: string): number => {
  switch (text) {
    case "Despesa":
      return TRANSACTION_TYPES.DESPESA;
    case "Receita":
      return TRANSACTION_TYPES.RECEITA;
    default:
      return -1;
  }
};

// Converte texto para número de purpose
export const stringToPurpose = (text: string): number => {
  switch (text) {
    case "Despesa":
      return PURPOSE_TYPES.DESPESA;
    case "Receita":
      return PURPOSE_TYPES.RECEITA;
    case "Ambas":
      return PURPOSE_TYPES.AMBAS;
    default:
      return -1;
  }
};

// Verifica se uma categoria é compatível com um tipo de transação
export const isCategoryCompatible = (
  categoryPurpose: number,
  transactionType: number,
): boolean => {
  // Categoria "Ambas" é sempre compatível
  if (categoryPurpose === PURPOSE_TYPES.AMBAS) return true;
  // Categoria específica deve corresponder ao tipo
  return categoryPurpose === transactionType;
};

