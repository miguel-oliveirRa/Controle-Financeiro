export interface Person {
  id: number;
  name: string;
  age: number;
}

export interface Category {
  id: number;
  description: string;
  purpose: number;
}

export interface Transaction {
  id: number;
  description: string;
  value: number;
  type: number;
  categoryId: number;
  personId: number;
}

export interface PersonTotals {
  id: number;
  name: string;
  age: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryTotals {
  id: number;
  description: string;
  purpose: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface OverallTotals {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface TotalsReportByPerson {
  persons: PersonTotals[];
  overall: OverallTotals;
}

export interface TotalsReportByCategory {
  categories: CategoryTotals[];
  overall: OverallTotals;
}
