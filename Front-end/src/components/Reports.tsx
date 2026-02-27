import { useState, useEffect } from "react";
import type {
  TotalsReportByPerson,
  TotalsReportByCategory,
  PersonTotals,
  CategoryTotals,
} from "../types";
import { reportApi } from "../services/api";
import { getPurposeText } from "../utils/enums";

/**
 * COMPONENTE DE RELATÓRIOS
 * Exibe agregações financeiras:
 * - Relatório por Pessoa: Total de receitas, despesas e saldo de cada pessoa
 * - Relatório por Categoria: Total de receitas, despesas e saldo de cada categoria
 * Inclui totalizadores gerais
 */
const Reports = () => {
  const [personReport, setPersonReport] = useState<TotalsReportByPerson | null>(
    null,
  );
  const [categoryReport, setCategoryReport] =
    useState<TotalsReportByCategory | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  // Busca ambos os relatórios em paralelo
  const loadReports = async () => {
    try {
      const [personRes, categoryRes] = await Promise.all([
        reportApi.getTotalsByPerson(),
        reportApi.getTotalsByCategory(),
      ]);
      setPersonReport(personRes.data);
      setCategoryReport(categoryRes.data);
    } catch (error) {
      console.error("Erro ao carregar relatórios", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Relatórios</h1>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Totais por Pessoa
          </h2>
          {personReport && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Idade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receitas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Despesas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {personReport.persons?.map((person: PersonTotals) => (
                        <tr
                          key={`person-${person.id}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {person.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {person.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {person.age}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            R$ {person.totalIncome.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                            R$ {person.totalExpenses.toFixed(2)}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              person.balance >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            R$ {person.balance.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totais Gerais de Pessoas */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Total Geral - Pessoas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      Total Receitas
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      R$ {personReport.overall.totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">
                      Total Despesas
                    </p>
                    <p className="text-2xl font-bold text-red-800">
                      R$ {personReport.overall.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      personReport.overall.balance >= 0
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        personReport.overall.balance >= 0
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      Saldo Líquido
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        personReport.overall.balance >= 0
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      R$ {personReport.overall.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Totais de Categorias */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Totais por Categoria
          </h2>
          {categoryReport && (
            <div className="space-y-6">
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
                          Finalidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receitas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Despesas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryReport.categories?.map(
                        (category: CategoryTotals) => (
                          <tr
                            key={`category-${category.id}`}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {category.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {category.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getPurposeText(category.purpose)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              R$ {category.totalIncome.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                              R$ {category.totalExpenses.toFixed(2)}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                category.balance >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              R$ {category.balance.toFixed(2)}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totais Gerais de Categorias */}
              <div className="bg-linear-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Total Geral - Categorias
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      Total Receitas
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      R$ {categoryReport.overall.totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-sm text-red-700 font-medium">
                      Total Despesas
                    </p>
                    <p className="text-2xl font-bold text-red-800">
                      R$ {categoryReport.overall.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      categoryReport.overall.balance >= 0
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        categoryReport.overall.balance >= 0
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      Saldo Líquido
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        categoryReport.overall.balance >= 0
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      R$ {categoryReport.overall.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
