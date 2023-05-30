import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { privateRouter, publishRouter } from "./routes/routes";
import PrivateProtectedRoute from "./utils/PrivateProtectedRoutes";
import DefaultLayout from "./layouts/DefaultLayout";
import { Helmet } from "react-helmet";
import ChildComponent from "./ChildComponent";
function App() {
  return (
    <>
      <Helmet>
        <title>Admin DashBoard</title>
        <meta
          name="description"
          content="App Description"
          data-react-helmet="true"
        />
        <meta name="theme-color" content="#008f68" data-react-helmet="true" />
      </Helmet>
      <ChildComponent />
      <BrowserRouter>
        <Routes>
          {publishRouter.map((route, index) => {
            const Page = route.component;
            const path = route.path;

            return <Route key={index} path={path} element={<Page />} />;
          })}
          <Route element={<PrivateProtectedRoute />}>
            {privateRouter?.map((route, index) => {
              const Page = route.component;
              const path = route.path;
              const Layout = route.layout || DefaultLayout;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
