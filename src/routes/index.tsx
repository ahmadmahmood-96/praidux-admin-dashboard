import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import { PrivateRoutes, PublicRoutes } from "./privateRoutes";
import RoleBaseRoutes from "./roleBaseRoutes";
import AppLayout from "../components/layout";
import Login from "../pages/login";
import PageNotFound from "../pages/PageNotFound";
import Dashboard from "../pages/Dashboard";
import AddProject from "../pages/projectoperations/AddProject";
import UpdateProject from "../pages/projectoperations/UpdateProject";
import FAQS from "../pages/FAQS/Faqs";
import AddFaq from "../pages/FAQS/AddFAQ/AddFaq";
import UpdateFaq from "../pages/FAQS/updateFaq/updateFaq";
import Testimonials from "../pages/Testimonial/Testimonial";
import Blogs from "../pages/Blogs/Blog";
import AddVideoTestimonial from "../pages/Testimonial/videoTestimonial/AddVideoTest/AddVideoTestimonial";
import AddStaticTestimonial from "../pages/Testimonial/staticTestimonial/AddStaticTestimonial/AddStaticTestimonial";
import AddBlog from "../pages/Blogs/AddBlog/AddBlog";
import Contact from "../pages/contact/contact";
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
            path="contact"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <Contact />
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
            path="add-video-testimonial"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <AddVideoTestimonial />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="/add-static-testimonial"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <AddStaticTestimonial />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="/add-static-testimonial/:id"
            element={
              <RoleBaseRoutes
                element={
                  <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                    <AddStaticTestimonial />
                  </Suspense>
                }
                allowedRoles={["admin"]}
              />
            }
          ></Route>
          <Route
            path="/add-video-testimonial/:id"
            element={<AddVideoTestimonial />}
          />
           <Route
            path="/add-Blog/:id"
            element={<AddBlog />}
          />
           <Route
            path="/add-Blog"
            element={<AddBlog />}
          />
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

          {/* <Route
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
          </Route> */}
          {/* <Route
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
          </Route> */}
          {/* <Route
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
          </Route> */}
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
