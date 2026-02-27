import { useState, useEffect } from "react";
import type { Person } from "../types";
import { personApi } from "../services/api";

const Persons = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editing, setEditing] = useState<Person | null>(null);
  const [filters, setFilters] = useState({ name: "", age: "" });

  useEffect(() => {
    loadPersons();
  }, []);

  useEffect(() => {
    filterPersons();
  }, [persons, filters]);

  const loadPersons = async () => {
    try {
      const response = await personApi.getAll();
      setPersons(response.data);
    } catch (error) {
      console.error("Erro ao carregar pessoas", error);
    }
  };

  const filterPersons = () => {
    let filtered = persons;
    if (filters.name) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }
    if (filters.age) {
      filtered = filtered.filter((p) => p.age.toString().includes(filters.age));
    }
    setFilteredPersons(filtered);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await personApi.update(editing.id, {
          ...editing,
          name: form.name,
          age: parseInt(form.age),
        });
        setEditing(null);
      } else {
        await personApi.create({ name: form.name, age: parseInt(form.age) });
      }
      setForm({ name: "", age: "" });
      loadPersons();
    } catch (error) {
      console.error("Erro ao salvar pessoa", error);
    }
  };

  const handleEdit = (person: Person) => {
    setEditing(person);
    setForm({ name: person.name, age: person.age.toString() });
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "Tem certeza? Isso excluirá todas as transações desta pessoa.",
      )
    ) {
      try {
        await personApi.delete(id);
        loadPersons();
      } catch (error) {
        console.error("Erro ao deletar pessoa", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Pessoas</h1>

        {/* Formulário Criar/Editar */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editing ? "Editar Pessoa" : "Criar Pessoa"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={200}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Idade"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                required
                min="0"
                max="99"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 transition delay-100 duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-100 text-white font-medium py-2 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
              >
                {editing ? "Atualizar" : "Criar"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", age: "" });
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Filtros</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Filtrar por nome"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Filtrar por idade"
              value={filters.age}
              onChange={(e) => setFilters({ ...filters, age: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabela */}
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
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPersons.map((person: Person, index: number) => (
                  <tr key={`person-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {person.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {person.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {person.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPersons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma pessoa encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Persons;
