import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import Protected from "../features/auth/components/Protected";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";
import Collections from "../features/products/pages/Collections";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products/:productId",
    element: <ProductDetail />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/products/create",
    element: (
      <Protected role="seller">
        <CreateProduct />
      </Protected>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Protected role="seller">
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/seller/product/:productId",
    element: (
      <Protected role="seller">
        <SellerProductDetails />
      </Protected>
    ),
  },
  {
    path: "/cart",
    element: <Cart />,
  },

  {
    path: "/collections",
    element: <Collections />,
  },
]);
