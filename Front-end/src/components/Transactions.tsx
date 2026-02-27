import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction, Person, Category } from "../types";
import { transactionApi, personApi, categoryApi } from "../services/api";
import {
  getTransactionTypeText,
  stringToTransactionType,
} from "../utils/enums";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    description: "",
    type: "",
    personId: "",
    categoryId: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filters]);

  const loadData = async () => {
    try {
      const [transRes, personRes, catRes] = await Promise.all([
        transactionApi.getAll(),
        personApi.getAll(),
        categoryApi.getAll(),
      ]);
      setTransactions(transRes.data);
      setPersons(personRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;
    if (filters.description) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(filters.description.toLowerCase()),
      );
    }
    if (filters.type) {
      // Converter string do filtro para número para comparação
      const typeNumber = stringToTransactionType(filters.type);
      if (typeNumber !== -1) {
        filtered = filtered.filter((t) => t.type === typeNumber);
      }
    }
    if (filters.personId) {
      filtered = filtered.filter(
        (t) => t.personId.toString() === filters.personId,
      );
    }
    if (filters.categoryId) {
      filtered = filtered.filter(
        (t) => t.categoryId.toString() === filters.categoryId,
      );
    }
    setFilteredTransactions(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Transações
          </h1>
          <button
            onClick={() => navigate("/transactions/create")}
            className="bg-blue-600 transition delay-100 duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-100 text-white font-medium py-2 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
          >
            Criar Transação
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filtros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Filtrar por descrição"
              value={filters.description}
              onChange={(e) =>
                setFilters({ ...filters, description: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option key="all-types" value="">
                Todos os tipos
              </option>
              <option key="expense" value="Despesa">
                Despesa
              </option>
              <option key="income" value="Receita">
                Receita
              </option>
            </select>
            <select
              value={filters.personId}
              onChange={(e) =>
                setFilters({ ...filters, personId: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as pessoas</option>
              {persons.map((person: Person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            <select
              value={filters.categoryId}
              onChange={(e) =>
                setFilters({ ...filters, categoryId: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pessoa
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map(
                  (transaction: Transaction, index: number) => (
                    <tr
                      key={`transaction-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {(transaction.value || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getTransactionTypeText(transaction.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {
                          categories.find(
                            (c) => c.id === transaction.categoryId,
                          )?.description
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {
                          persons.find((p) => p.id === transaction.personId)
                            ?.name
                        }
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma transação encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
