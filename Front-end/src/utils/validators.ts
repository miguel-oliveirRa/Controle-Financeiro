/**
 * Utilitários para validações
 * Centraliza regras de negócio validações
 */

// Valida se um número é positivo
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

// Valida idade mínima para realizar certos tipos de transações
export const isAgeRestricted = (age: number, transactionType: number): boolean => {
  const MIN_ADULT_AGE = 18;
  const EXPENSE_ONLY_TYPE = 0; // 0 = Despesa
  
  return age < MIN_ADULT_AGE && transactionType !== EXPENSE_ONLY_TYPE;
};

// Valida inteiros válidos
export const isValidInteger = (value: string): boolean => {
  const num = parseInt(value);
  return !isNaN(num) && num > 0;
};
