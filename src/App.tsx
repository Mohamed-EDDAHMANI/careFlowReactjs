import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";

const AppRoutes = () => useRoutes(routes);

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
