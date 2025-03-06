import { Layout } from "@/components/layout/Layout";
import { RouteObject } from "react-router-dom";

// Importaciones directas
import ItemsPage from "../pages/Items/Item";
import SpecialPricePage from "../pages/SpecialPrice/SpecialPrice";

// Configuración de rutas
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ItemsPage />,
      },
      {
        path: "specialPrices",
        element: <SpecialPricePage />,
      },
    ],
  },
];
