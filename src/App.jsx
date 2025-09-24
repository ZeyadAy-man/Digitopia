import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { Canvas } from "@react-three/fiber";
import { noEvents } from "@react-three/xr";
import { PCFSoftShadowMap } from "three";
import { Suspense } from "react";

// Layouts
import SellerLayout from "./Seller/SellerLayout";
import SellerDashboard from "./Seller/SellerDashboard/SellerDashboard.jsx";
import SellerOrders from "./Seller/SellerOrders/SellerOrders.jsx";
// Pages
import Welcome1 from "./Components/Welcome/welcome1";
import Home from "./Components/HomePage/Home/Home";
import ShopProducts from "./Components/HomePage/ShopProduct/ShopProduct";
import ProductModal from "./Components/HomePage/ShopProduct/ProductModel.jsx";
import Login from "./Components/Form/Login/Login";
import SignUp from "./Components/Form/SignUp/Signup";
import ForgetPassword from "./Components/Form/ForgotPassword/Forgotpassword";
import BagsShop from "./Pages/BagsStore";
import ProtectedRoute from "./Components/ProtectedRoute";
import AboutUs from "./Components/AboutUs/AboutUs";
import Activate from "./Components/Form/ActivateAccount/activateAccount";
import ResetPassword from "./Components/Form/ForgotPassword/ResetPassword";
import Cart from "./Pages/Cart";
import Wish from "./Pages/Wish";
import Profile from "./Components/HomePage/Profile/Profile";
import Address from "./Components/AddressPage/Address";
import Unauthorized from "./Pages/Unauthorized";
import ShoesShop from "./Pages/ShoesShop";
import SportsShop from "./Pages/SportStore";
import { Room } from "./Pages/Room.jsx";
import Dashboard from "./Admin/Dashboard/AdminDashboard.jsx";
import Checkout from "./Pages/Checkout.jsx";
import UserOrders from "./Pages/UserOrders.jsx";

// Admin Components
import AdminLayout from "./Admin/AdminLayout.jsx";
import CreateModel from "./Admin/Dashboard/CreateModel/CreateModel.jsx";
import AdminShopDetails from "./Admin/ShopDetails/AdminShopDetails.jsx";
import Users from "./Admin/Users/Users";
import AdminProfile from "./Admin/Profile/Profile.jsx";
import Model from "./Admin/Model/Model.jsx";
import EditModel from "./Admin/Model/EditModel/EditModel.jsx";


import CreateShop from "./Seller/Create/createShop.jsx";
import EditShop from "./Seller/Edit/editShop.jsx";
import ShopAssets from "./Seller/Models/shopAssets.jsx";
import ShopList from "./Seller/List/shopList.jsx";
import ShopDetails from "./Seller/Details/shopDetail.jsx";
import ModelPreview from "./Seller/Preview/ModelPreview.jsx";
import SellerProfile from "./Seller/Profile/Profile.jsx";
import ProductsPage from "./Seller/Product/ProductDetail/Details.jsx";
import CreateProduct from "./Seller/Product/CreateProduct/CreateProduct.jsx";
import EditProduct from "./Seller/Product/EditProduct/EditProduct.jsx";
import ProductVariants from "./Seller/Product/ProductVariant/ProductVariant.jsx";
import ProductAssets from "./Seller/Product/ProductAssets/ProductAssets.jsx";
import ProductView from "./Seller/Product/ProductView/ProductView.jsx";

import Loader from "./Utils/Loader/Loader";

import { DemoRoom } from "./Pages/DemoRoom.jsx";

const CanvasContainer = () => {
  const location = useLocation();
  const threeDRoutes = [
    "/shoes/:shopId",
    "/sports/:shopId",
    "/room/:shopId",
    "/bags/:shopId",
    "/room/:shopId",
  ];
  const shouldShowCanvas = threeDRoutes.includes(location.pathname);

  if (!shouldShowCanvas) {
    return null;
  }

  return (
    <Canvas
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      shadows="soft"
      camera={{ position: [-0.5, 0.5, 0.5] }}
      events={noEvents}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;
      }}
    >
      <Suspense fallback={<Loader />}></Suspense>
    </Canvas>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <CanvasContainer />
      <Routes>
        <Route path="/" element={<Welcome1 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wish" element={<Wish />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/address" element={<Address />} />
        <Route path="/activate-account" element={<Activate />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/:shopId/products" element={<ShopProducts />} />
        <Route path="/SearchResult" element={<ShopProducts />} />
        <Route path="/productInfo/:productId" element={<ProductModal />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/Orders" element={<UserOrders />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/auth/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="AdminProfile" element={<AdminProfile />} />
            <Route path="model" element={<Model />} />
            <Route path="model/create-model" element={<CreateModel />} />
            <Route path="model/edit-model/:modelId" element={<EditModel />} />
            <Route path="shops/:shopId" element={<AdminShopDetails />} />
            {/* <Route path="showAdmin" element={<ShowAdminPage />} /> */}
          </Route>
        </Route>

        <Route path="/test" element={<DemoRoom />} />

        {/* <Route
          path="/seller-shop"
          element={<ProtectedRoute allowedRoles={["ROLE_SELLER"]} />}
        > */}
        <Route path="/seller-shop" element={<SellerLayout />}>
          <Route index element={<ShopList />} />
          <Route path="create" element={<CreateShop />} />
          <Route path="seller-dashboard" element={<SellerDashboard />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="sellerProfile" element={<SellerProfile />} />
          <Route path="details/:shopId" element={<ShopDetails />} />
          <Route path="details/:shopId/edit" element={<EditShop />} />
          <Route path=":shopId/assets" element={<ShopAssets />} />
          <Route
            path=":shopId/assets/ModelPreview"
            element={<ModelPreview />}
          />
          <Route path=":shopId/Product" element={<ProductsPage />} />
          <Route
            path="details/:shopId/Product/createProduct"
            element={<CreateProduct />}
          />
          <Route
            path="details/:shopId/Product/:productId/edit"
            element={<EditProduct />}
          />
          <Route
            path="details/:shopId/Product/:productId/variants"
            element={<ProductVariants />}
          />
          <Route
            path="details/:shopId/Product/:productId/ProductAssets"
            element={<ProductAssets />}
          />
          <Route
            path="details/:shopId/Product/:productId/View"
            element={<ProductView />}
          />
        </Route>

        <Route path="/:shopName/:shopId" element={<GenericShop />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </AuthProvider>
  );
};

import { useParams } from "react-router-dom";
import ClothesShop from "./Pages/ClothesShop.jsx";
import OAuth2RedirectHandler from "./Components/OAuth2RedirectHandler/OAuth2RedirectHandler.jsx";

const GenericShop = () => {
  const { shopName } = useParams();

  if (shopName === "shoes") return <ShoesShop />;
  if (shopName === "sports") return <SportsShop />;
  if (shopName === "room") return <Room />;
  if (shopName === "bags") return <BagsShop />;
  if (shopName === "clothes") return <ClothesShop/>
};

export default GenericShop;
