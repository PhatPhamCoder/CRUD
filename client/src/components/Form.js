import React, { useState, useEffect, useRef } from "react";
import { object, string, date } from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { selectAdmin } from "../redux/slices/adminSlice";
import axiosClient from "../api/axiosClient";

let formSchema = object({
  name: string(),
  account: string(),
  email: string().email(),
  password: string(),
  createdOn: date().default(() => new Date()),
});

export default function Form(props) {
  const { isUpdate, updateData, setOpen } = props;
  const [dataRole, setDataRole] = useState();
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role_id, setRole_Id] = useState();
  const [active, setActive] = useState(true);
  const adminState = useSelector(selectAdmin);
  const { userAuth } = adminState;
  const [edit, setEdit] = useState(true);
  const [userData, setUserData] = useState();
  const [roleUser, setRoleUser] = useState();

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

  // get data
  useEffect(() => {
    axiosClient
      .get(`/role/getbyid/${userData?.[0]?.role_id}`)
      .then((response) => {
        setRoleUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name,
      account: account,
      password: password,
      email: email,
      role_id: role_id,
      active: active,
    },
    validationSchema: formSchema,
  });

  const handelChangeActive = (e) => {
    formik.setFieldValue("active", e.target.checked);
  };

  // get data role
  useEffect(() => {
    axiosClient
      .get("/role/getall?publish=1")
      .then((response) => {
        setDataRole(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  const inputRef = useRef();

  const focus = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (userData) {
        if (userData[0]?.roleUser !== undefined) {
          setName(userData[0]?.roleUser);
        }
        if (userData[0]?.name !== undefined) {
          setName(userData[0]?.name);
        }
        if (userData[0]?.account !== undefined) {
          setAccount(userData[0]?.account);
        }
        if (userData[0]?.email !== undefined) {
          setEmail(userData[0]?.email);
        }
        if (userData[0]?.text_pass !== undefined) {
          setPassword(userData[0]?.text_pass);
        }
        if (userData[0]?.role_id !== undefined) {
          setRole_Id(userData[0]?.role_id);
        }
        if (userData[0]?.active !== undefined) {
          setActive(userData[0]?.active);
        }
      }
    }
  }, [isUpdate, userData]);

  // update data event
  const handleUpdateData = (e) => {
    e.preventDefault();
    const id = userData[0].id;
    let dataUpdateNew = {
      name: formik.values.name,
      account: (formik.values.account =
        formik.values.account.toLocaleLowerCase()),
      email: formik.values.email,
      role_id: formik.values.role_id,
      active: formik.values.active,
      password: formik.values.password,
    };
    updateData(id, dataUpdateNew);
  };

  // show button update or add
  const showButtonAction = () => {
    if (isUpdate && edit) {
      return (
        <button
          type="button"
          onClick={() => setEdit(false)}
          className="btn btn-primary mt-2"
        >
          Cập nhật
        </button>
      );
    } else {
      return (
        <button
          type="button"
          onClick={(e) => handleUpdateData(e)}
          className="btn btn-primary mt-2"
        >
          Lưu
        </button>
      );
    }
  };

  return (
    <>
      <form className="row">
        <div className="col-12">
          <div>
            <label className="mb-1 text-dark">Chọn nhóm quyền</label>
            <select
              placeholder="Chọn nhóm quyền ..."
              value={formik.values.role_id}
              onChange={formik.handleChange("role_id")}
              onBlur={formik.handleBlur("role_id")}
              className="form-control"
              disabled={edit}
            >
              {isUpdate ? (
                <option value={roleUser?.[0]?.id}>{roleUser?.[0]?.name}</option>
              ) : (
                <option value="">--Chọn nhóm quyền--</option>
              )}
              {dataRole?.map((item, index) => (
                <option key={index} value={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-danger mt-1">
            {formik.touched.role_id && formik.errors.role_id}
          </div>
        </div>
        <div className="col-12">
          <div>
            <label className="text-dark">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên ở dây ..."
              value={formik.values.name}
              onChange={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
              className="form-control"
              disabled={edit}
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.name && formik.errors.name}
          </div>
        </div>
        <div className="col-12">
          <div>
            <label className="text-dark">Email</label>
            <input
              type="email"
              placeholder="Nhập họ và tên ở dây ..."
              value={formik.values.email}
              onChange={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              className="form-control"
              disabled={edit}
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.email && formik.errors.email}
          </div>
        </div>
        <div className="col-12">
          <div>
            <label className="text-dark">Tên tài khoản</label>
            <input
              type="text"
              placeholder="Nhập tên tài khoản ở dây ..."
              value={formik.values.account}
              onChange={formik.handleChange("account")}
              onBlur={formik.handleBlur("account")}
              className="form-control"
              disabled={edit}
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.account && formik.errors.account}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between gap-4">
          <div className="d-flex flex-column text-left position-relative">
            <label className="text-dark">Mật khẩu hiện tại</label>
            <input
              type={"text"}
              placeholder="Nhập mật khẩu tại đây"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              disabled
            />
            <div className="text-danger mt-1">
              {formik.touched.password && formik.errors.password}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="mt-3">
            <label className="mx-1 text-dark">Hiển thị</label>
            <input
              type="checkbox"
              checked={formik.values.active ? true : false}
              onChange={handelChangeActive}
              disabled={edit}
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.password && formik.errors.password}
          </div>
        </div>
        <div className="d-flex gap-2 align-items-center justify-content-center">
          {showButtonAction()}
          <div>
            <button onClick={handleClose} className="btn btn-danger mt-2">
              Hủy
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
