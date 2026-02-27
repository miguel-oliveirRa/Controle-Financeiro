import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import {
  Persons,
  Categories,
  Transactions,
  Reports,
  CreateCategory,
  CreateTransaction,
} from "./components";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white text-lg p-4">
          <div className="container mx-auto flex space-x-4">
            <NavLink
              to="/persons"
              className={({ isActive }) =>
                isActive ? "underline font-bold" : "hover:underline"
              }
            >
              Pessoas
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive ? "underline font-bold" : "hover:underline"
              }
            >
              Categorias
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "underline font-bold" : "hover:underline"
              }
            >
              Transações
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                isActive ? "underline font-bold" : "hover:underline"
              }
            >
              Relatórios
            </NavLink>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/persons" element={<Persons />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/create" element={<CreateCategory />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route
              path="/transactions/create"
              element={<CreateTransaction />}
            />
            <Route path="/reports" element={<Reports />} />
            <Route
              path="/"
              element={
                <div className="text-center text-5xl font-bold">
                  Bem Vindo ao Aplicativo Financeiro
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
