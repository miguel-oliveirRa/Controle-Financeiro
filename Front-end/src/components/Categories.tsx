import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "../types";
import { categoryApi } from "../services/api";
import { getPurposeText, stringToPurpose } from "../utils/enums";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({ description: "", purpose: "" });
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories(); // Carrega categorias ao montar
  }, []);

  useEffect(() => {
    filterCategories(); // Aplica filtros quando dados mudam
  }, [categories, filters]);

  // Busca todas as categorias da API
  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  // Filtra categorias por descrição e finalidade (purpose)
  const filterCategories = () => {
    let filtered = categories;
    if (filters.description) {
      filtered = filtered.filter((cat) =>
        cat.description
          .toLowerCase()
          .includes(filters.description.toLowerCase()),
      );
    }
    if (filters.purpose) {
      // Converte texto do filtro para número enum
      const purposeNumber = stringToPurpose(filters.purpose);
      if (purposeNumber !== -1) {
        filtered = filtered.filter((cat) => cat.purpose === purposeNumber);
      }
    }
    setFilteredCategories(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Categorias
          </h1>
          <button
            onClick={() => navigate("/categories/create")}
            className="bg-blue-600 transition delay-100 duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-100 text-white font-medium py-2 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
          >
            Criar Categoria
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filtros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              value={filters.purpose}
              onChange={(e) =>
                setFilters({ ...filters, purpose: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as finalidades</option>
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
              <option value="Ambas">Ambas</option>
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
                    Finalidade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category: Category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPurposeText(category.purpose)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma categoria encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
