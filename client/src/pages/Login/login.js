import React, { useEffect, useState } from "react";
import { object, string } from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin, selectAdmin } from "../../redux/slices/adminSlice";
import { Link, useNavigate } from "react-router-dom";
import configs from "../../configs";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { alert } from "../../utils/Contants";

let loginSchema = object({
  account: string().required(alert.account),
  password: string().required(alert.password),
});
function Login() {
  const dispatch = useDispatch();
  const [isHidden, setIsHidden] = useState();
  const selectorAdmin = useSelector(selectAdmin);
  const { userAuth } = selectorAdmin;
  const formik = useFormik({
    initialValues: {
      account: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginAdmin(values));
    },
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (userAuth?.token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuth]);

  return (
    <div style={{ backgroundColor: "#47C683", height: "100vh" }}>
      <div className="container">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className="bg-white login-page">
            <h4 className="title-login fw-bold fs-3">Đăng nhập hệ thống</h4>
            <form onSubmit={formik.handleSubmit}>
              <div className="d-flex flex-column text-left">
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập tại đây"
                  value={formik.values.account}
                  onChange={formik.handleChange("account")}
                  onBlur={formik.handleBlur("account")}
                />
                <div className="text-danger mt-1">
                  {formik.touched.account && formik.errors.account}
                </div>
              </div>
              <div className="d-flex flex-column text-left position-relative">
                <label>Mật khẩu</label>
                <input
                  type={isHidden ? "text" : "password"}
                  placeholder="Nhập mật khẩu tại đây"
                  value={formik.values.password}
                  onChange={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                />
                <div
                  className="position-absolute hidden-password"
                  onClick={() => setIsHidden(!isHidden)}
                >
                  {!isHidden ? (
                    <AiFillEye size={20} />
                  ) : (
                    <AiFillEyeInvisible size={20} />
                  )}
                </div>
                <div className="text-danger mt-1">
                  {formik.touched.password && formik.errors.password}
                </div>
              </div>
              <Link to={configs.routes.forgot} className="forrgot-pasword">
                Quên mật khẩu
              </Link>
              <button
                type="submit"
                className="btn btn-primary d-flex mx-auto mt-2"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
