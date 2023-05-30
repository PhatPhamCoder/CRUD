import { object, string } from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useSelector } from "react-redux";
import { selectAdmin } from "../redux/slices/adminSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { alert } from "../utils/Contants";

let formSchema = object({
  password: string().required(alert.passwordOld),
  passwordNew: string().required(alert.passwordNew),
});

export default function ChangePass(props) {
  const { updateData, closeForm } = props;
  const adminState = useSelector(selectAdmin);
  const { userAuth } = adminState;
  const [userData, setUserData] = useState();
  const [isHidden, setIsHidden] = useState(false);

  // get role by ID
  useEffect(() => {
    axiosClient
      .get(`/admin/getbyid/${userAuth?.id}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      passwordNew: "",
    },
    validationSchema: formSchema,
  });

  const handleCloseForm = () => {
    closeForm(true);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const id = userData?.[0]?.id;
    const dataChangePass = {
      password: formik.values.password,
      passwordNew: formik.values.passwordNew,
    };
    updateData(id, dataChangePass);
  };

  return (
    <>
      <form className="row">
        <div className="col-12">
          <div>
            <label className="text-dark">Mật khẩu cũ</label>
            <input
              type={isHidden ? "text" : "password"}
              className="form-control"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.password && formik.errors.password}
          </div>
        </div>
        <div className="col-12">
          <div className="position-relative">
            <label className="text-dark">Mật khẩu mới</label>
            <input
              type={isHidden ? "text" : "password"}
              className="form-control"
              value={formik.values.passwordNew}
              onChange={formik.handleChange("passwordNew")}
              onBlur={formik.handleBlur("passwordNew")}
            />
            <div
              className="position-absolute hidden-password"
              onClick={() => setIsHidden(!isHidden)}
            >
              {!isHidden ? (
                <AiFillEye size={20} color="#333" />
              ) : (
                <AiFillEyeInvisible size={20} color="#333" />
              )}
            </div>
          </div>
          <div className="text-danger mt-1">
            {formik.touched.passwordNew && formik.errors.passwordNew}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
          <button
            type="submit"
            className="btn btn-outline-danger"
            onClick={(e) => handleUpdatePassword(e)}
          >
            Thay đổi
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleCloseForm}
          >
            Hủy
          </button>
        </div>
      </form>
    </>
  );
}
