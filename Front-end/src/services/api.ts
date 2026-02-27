import axios from "axios";
import type {
  Person,
  Category,
  Transaction,
  TotalsReportByPerson,
  TotalsReportByCategory,
} from "../types";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Garante que só objetos literais sejam percorridos na conversão recursiva
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === "[object Object]";

// Converte primeira letra para minúscula: "CategoryId" -> "categoryId"
const toCamelKey = (key: string): string =>
  key.length > 0 ? key[0].toLowerCase() + key.slice(1) : key;

// O backend serializa enums como string (JsonStringEnumConverter), mas o frontend trabalha com enums numéricos nos tipos. Aqui convertemos apenas os campos de enum conhecidos.
const parseEnumToNumber = (key: string, value: unknown): unknown => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return value;

  if (key === "type" || key === "purpose") {
    switch (value) {
      case "Despesa":
        return 0;
      case "Receita":
        return 1;
      case "Ambas":
        return 2;
      default:
        return value;
    }
  }

  return value;
};

// Conversão profunda da resposta:
// 1) PascalCase -> camelCase
// 2) enum string -> enum number
const toCamelCaseDeep = (input: unknown): unknown => {
  if (Array.isArray(input)) {
    return input.map((item) => toCamelCaseDeep(item));
  }

  if (!isPlainObject(input)) {
    return input;
  }

  const obj = input as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const newKey = toCamelKey(key);
    const rawValue = obj[key];
    const convertedValue = toCamelCaseDeep(rawValue);
    result[newKey] = parseEnumToNumber(newKey, convertedValue);
  }

  return result;
};

// Normaliza tudo que vem da API para o formato esperado no frontend.
api.interceptors.response.use(
  (response) => {
    response.data = toCamelCaseDeep(response.data);
    return response;
  },
  (error) => Promise.reject(error),
);

/**
 * API de Pessoas - CRUD completo
 */
export const personApi = {
  getAll: () => api.get<Person[]>("/Persons"),
  get: (id: number) => api.get<Person>(`/Persons/${id}`),
  create: (person: Omit<Person, "id">) => api.post<Person>("/Persons", person),
  update: (id: number, person: Person) => api.put(`/Persons/${id}`, person),
  delete: (id: number) => api.delete(`/Persons/${id}`),
};

/**
 * API de Categorias - listar, buscar e criar
 */
export const categoryApi = {
  getAll: () => api.get<Category[]>("/Categories"),
  get: (id: number) => api.get<Category>(`/Categories/${id}`),
  create: (category: Omit<Category, "id">) =>
    api.post<Category>("/Categories", category),
};

/**
 * API de Transações - listar, buscar e criar
 */
export const transactionApi = {
  getAll: () => api.get<Transaction[]>("/Transactions"),
  get: (id: number) => api.get<Transaction>(`/Transactions/${id}`),
  create: (transaction: Omit<Transaction, "id">) =>
    api.post<Transaction>("/Transactions", transaction),
};

/**
 * API de Relatórios - agregações financeiras
 */
export const reportApi = {
  getTotalsByPerson: () =>
    api.get<TotalsReportByPerson>("/Reports/totals-by-person"),
  getTotalsByCategory: () =>
    api.get<TotalsReportByCategory>("/Reports/totals-by-category"),
};
