import React, { Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { PrivateRoutes, PublicRoutes } from "./privateRoutes";
import RoleBaseRoutes from "./roleBaseRoutes";
import AppLayout from "../components/layout";
import Login from "../pages/login";
import PageNotFound from "../pages/PageNotFound";
import Dashboard from "../pages/Dashboard";
import UsersHome from "../pages/users";
import UsersList from "../pages/users/components/usersList";
import AddUsers from "../pages/users/components/AddUsers";
import CarsHome from "../pages/cars";
import AddCar from "../pages/cars/components/addCar";
import CarsList from "../pages/cars/components/carsList";
import CarConfigHome from "../pages/car-config";
import CarConfigList from "../pages/car-config/components/makeModel/configList";
import AddCarConfig from "../pages/car-config/components/makeModel/addConfig";
import ColorsList from "../pages/car-config/components/colors/colorList";
import AddColor from "../pages/car-config/components/colors/addColor";
import AddProject from "../pages/projectoperations/AddProject";
import UpdateProject from "../pages/projectoperations/UpdateProject";
import FAQS from "../pages/FAQS/Faqs";
import AddFaq from "../pages/FAQS/AddFAQ/AddFaq";
import UpdateFaq from "../pages/FAQS/updateFaq/updateFaq";
import Testimonials from "../pages/Testimonial/Testimonial";
import Blogs from "../pages/Blogs/Blog";
const RenderRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route
          path="/login"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <Login />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <PageNotFound />
            </Suspense>
          }
        />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <AppLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <Dashboard />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="add-project"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <AddProject />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="update-project/:id"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <UpdateProject />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="Faqs"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <FAQS />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="add-Faq"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <AddFaq />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="update-faq/:id"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <UpdateFaq />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="testimonials"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <Testimonials />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="blogs"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <Blogs />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>

          <Route
            path="cars"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <Outlet />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          >
            <Route path="" element={<CarsHome />}>
              <Route index element={<CarsList />} />
              <Route path="add-car" element={<AddCar />} />
            </Route>
          </Route>
          <Route
            path="car-config"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <Outlet />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          >
            <Route path="" element={<CarConfigHome />}>
              <Route index element={<CarConfigList />} />
              <Route path="add-config" element={<AddCarConfig />} />
              <Route path="colors" element={<ColorsList />} />
              <Route path="add-colors" element={<AddColor />} />
            </Route>
          </Route>
          <Route
            path="users"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <Outlet />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          >
            <Route path="" element={<UsersHome />}>
              <Route index element={<UsersList />} />
              <Route path="add-user/:id" element={<AddUsers />} />
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                <PageNotFound />
              </Suspense>
            }
          />
          <Route
            path="unauthorized"
            element={
              <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                <PageNotFound />
              </Suspense>
            }
          />
          <Route
            path="404"
            element={
              <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                <PageNotFound />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default RenderRouter;
