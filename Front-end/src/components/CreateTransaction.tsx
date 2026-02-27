import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Person, Category } from "../types";
import { transactionApi, personApi, categoryApi } from "../services/api";
import { TRANSACTION_TYPES, isCategoryCompatible } from "../utils/enums";
import {
  isAgeRestricted,
  isPositiveNumber,
  isValidInteger,
} from "../utils/validators";

/**
 * COMPONENTE DE CRIAÇÃO DE TRANSAÇÃO
 * Formulário para criar nova transação financeira
 * Validações:
 * - Menores de 18 anos só podem ter despesas
 * - Categoria deve ser compatível com tipo da transação
 */
const CreateTransaction = () => {
  const [form, setForm] = useState({
    description: "",
    value: "",
    type: Number(TRANSACTION_TYPES.DESPESA),
    categoryId: "",
    personId: "",
  });
  const [persons, setPersons] = useState<Person[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [personRes, catRes] = await Promise.all([
        personApi.getAll(),
        categoryApi.getAll(),
      ]);
      setPersons(personRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Busca pessoa selecionada
      const selectedPerson = persons.find(
        (p) => p.id !== undefined && p.id.toString() === form.personId,
      );
      if (selectedPerson && isAgeRestricted(selectedPerson.age, form.type)) {
        alert("Menores de idade só podem ter despesas.");
        return;
      }

      const value = parseFloat(form.value);
      if (!isPositiveNumber(value)) {
        alert("Valor deve ser um número positivo.");
        return;
      }

      if (!isValidInteger(form.categoryId)) {
        alert("Selecione uma categoria válida.");
        return;
      }
      const categoryId = parseInt(form.categoryId);

      if (!isValidInteger(form.personId)) {
        alert("Selecione uma pessoa válida.");
        return;
      }
      const personId = parseInt(form.personId);

      await transactionApi.create({
        description: form.description,
        value: value,
        type: form.type,
        categoryId: categoryId,
        personId: personId,
      });
      navigate("/transactions");
    } catch (error) {
      console.error("Erro ao criar transação", error);
      alert("Erro ao criar transação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Filtra categorias compatíveis com o tipo de transação selecionado
  const filteredCategories = categories.filter((cat) =>
    isCategoryCompatible(cat.purpose, form.type),
  );

  const categoriesToShow =
    filteredCategories.length > 0 ? filteredCategories : categories;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Criar Transação
            </h1>
            <button
              onClick={() => navigate("/transactions")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Voltar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                placeholder="Digite a descrição da transação"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                maxLength={400}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.description.length}/400 caracteres
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                  min="0.01"
                  max="999999999.99"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={TRANSACTION_TYPES.DESPESA}>Despesa</option>
                  <option value={TRANSACTION_TYPES.RECEITA}>Receita</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categoriesToShow.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pessoa
                </label>
                <select
                  value={form.personId}
                  onChange={(e) =>
                    setForm({ ...form, personId: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma pessoa</option>
                  {persons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 transition delay-100 duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-100 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
              >
                {loading ? "Criando..." : "Criar Transação"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/transactions")}
                className="flex-1 bg-gray-200 transition delay-100 duration-200 hover:-translate-y-0.5 hover:bg-gray-300 active:scale-100 text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction;
