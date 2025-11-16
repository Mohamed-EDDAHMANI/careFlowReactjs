import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import type { RootState } from "../app/store";

export default function Home() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      {/* Navbar */}
      <nav className={`${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'} shadow-lg`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>
            CareFlow
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className={`text-5xl font-bold mb-6 ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>
            Système de Gestion Hospitalière
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            CareFlow optimise la gestion des soins de santé avec une solution moderne et intuitive
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className={`${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'} p-6 rounded-lg shadow-lg`}>
              <div className="text-4xl mb-4">👥</div>
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>
                Gestion des Patients
              </h3>
              <p className="text-gray-600">
                Suivi complet des dossiers médicaux et historique des patients
              </p>
            </div>
            
            <div className={`${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'} p-6 rounded-lg shadow-lg`}>
              <div className="text-4xl mb-4">⚕️</div>
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>
                Équipe Médicale
              </h3>
              <p className="text-gray-600">
                Coordination efficace entre médecins, infirmiers et personnel
              </p>
            </div>
            
            <div className={`${theme === 'light' ? 'bg-light-primary' : 'bg-dark-primary'} p-6 rounded-lg shadow-lg`}>
              <div className="text-4xl mb-4">📊</div>
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'light' ? 'text-light-text' : 'text-dark-text'}`}>
                Administration
              </h3>
              <p className="text-gray-600">
                Outils de gestion et reporting pour les administrateurs
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-colors inline-block"
          >
            Commencer maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}
