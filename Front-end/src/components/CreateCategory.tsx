import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../services/api";

const CreateCategory = () => {
  const [form, setForm] = useState({
    description: "",
    purpose: 0, // 0: Despesa, 1: Receita, 2: Ambas
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const categoryData = {
        description: form.description,
        purpose: form.purpose,
      };

      await categoryApi.create(categoryData);
      navigate("/categories");
    } catch (error) {
      console.log("Erro:", error);
      console.error("Error creating category", error);
      alert("Erro ao criar categoria. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Criar Categoria
            </h1>
            <button
              onClick={() => navigate("/categories")}
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
                placeholder="Digite a descrição da categoria"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finalidade
              </label>
              <select
                value={form.purpose}
                onChange={(e) =>
                  setForm({
                    ...form,
                    purpose: parseInt(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Despesa</option>
                <option value={1}>Receita</option>
                <option value={2}>Ambas</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 transition delay-100 duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-100 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
              >
                {loading ? "Criando..." : "Criar Categoria"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/categories")}
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

export default CreateCategory;
