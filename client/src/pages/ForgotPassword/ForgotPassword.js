import React from "react";
import { object, string } from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { forgotPasssWordAction } from "../../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import { alert } from "../../utils/Contants";
let forgotSchema = object({
  email: string().email().required(alert.email),
});
function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotSchema,
    onSubmit: (values) => {
      dispatch(forgotPasssWordAction(values));
      setTimeout(() => {
        navigate("/login");
      }, 200);
    },
  });
  return (
    <div style={{ backgroundColor: "#47C683", height: "100vh" }}>
      <div className="container">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className="bg-white forgot-page">
            <h4 className="title-login fw-bold fs-3">Lấy lại mật khẩu</h4>
            <form onSubmit={formik.handleSubmit}>
              <div className="d-flex flex-column text-left">
                <label
                  style={{
                    textAlign: "left !important",
                  }}
                >
                  Địa chỉ Email
                </label>
                <input
                  type="text"
                  placeholder="Nhập email tại đây"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                />
                <div className="text-danger mt-1">
                  {formik.touched.email && formik.errors.email}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary d-flex mx-auto mt-2"
              >
                Gửi Email
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
