import React, { useState, useEffect, useRef } from "react";
import { object, string, date } from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import axiosClient from "../../api/axiosClient";
import { alert } from "../../utils/Contants";
let formSchema = object({
  name: string().required(alert.name),
  account: string().required(alert.account),
  email: string().email().required(alert.email),
  password: string().required(alert.password),
  createdOn: date().default(() => new Date()),
});

export default function Form(props) {
  const { addData, isUpdate, updateData, setOpen } = props;
  const [dataRole, setDataRole] = useState();
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role_id, setRole_Id] = useState();
  const [active, setActive] = useState(true);
  const adminState = useSelector((state) => state?.admin);
  const { dataUpdate } = adminState;

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
  // create data event
  const handleAddData = (e) => {
    e.preventDefault();

    let data = {
      name: formik.values.name,
      account: formik.values.account.toLocaleLowerCase(),
      password: formik.values.password,
      email: formik.values.email,
      role_id: formik.values.role_id,
      active: formik.values.active,
    };
    addData(data);
  };

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
      if (dataUpdate) {
        if (dataUpdate[0]?.name !== undefined) {
          setName(dataUpdate[0]?.name);
        }
        if (dataUpdate[0]?.account !== undefined) {
          setAccount(dataUpdate[0]?.account);
        }
        if (dataUpdate[0]?.email !== undefined) {
          setEmail(dataUpdate[0]?.email);
        }
        if (dataUpdate[0]?.password !== undefined) {
          setPassword(dataUpdate[0]?.password);
        }
        if (dataUpdate[0]?.role_id !== undefined) {
          setRole_Id(dataUpdate[0]?.role_id);
        }
        if (dataUpdate[0]?.active !== undefined) {
          setActive(dataUpdate[0]?.active);
        }
      }
    }
  }, [isUpdate, dataUpdate]);

  // update data event
  const handleUpdateData = (e) => {
    e.preventDefault();
    const id = dataUpdate[0].id;
    let dataUpdateNew = {
      name: formik.values.name,
      account: formik.values.account.toLocaleLowerCase(),
      email: formik.values.email,
      role_id: formik.values.role_id,
      active: formik.values.active,
    };
    updateData(id, dataUpdateNew);
  };

  // show button update or add
  const showButtonAction = () => {
    if (isUpdate) {
      return (
        <button
          onClick={(e) => handleUpdateData(e)}
          className="btn btn-primary mt-2"
        >
          Lưu
        </button>
      );
    } else {
      return (
        <button
          onClick={(e) => handleAddData(e)}
          className="btn btn-primary mt-2"
        >
          Thêm
        </button>
      );
    }
  };

  return (
    <>
      <div>
        <form className="d-flex gap-2 mt-2 align-items-center">
          <div>
            <div>
              <label>Họ và tên</label>
              <input
                type="text"
                placeholder="Nhập họ và tên ở dây ..."
                value={formik.values.name}
                onChange={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
                className="form-control"
              />
            </div>
            <div className="text-danger mt-1">
              {formik.touched.name && formik.errors.name}
            </div>
          </div>
          <div>
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="Nhập họ và tên ở dây ..."
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                className="form-control"
              />
            </div>
            <div className="text-danger mt-1">
              {formik.touched.email && formik.errors.email}
            </div>
          </div>
          <div>
            <div>
              <label>Tên tài khoản</label>
              <input
                type="text"
                placeholder="Nhập tên tài khoản ở dây ..."
                value={formik.values.account}
                onChange={formik.handleChange("account")}
                onBlur={formik.handleBlur("account")}
                className="form-control"
              />
            </div>
            <div className="text-danger mt-1">
              {formik.touched.account && formik.errors.account}
            </div>
          </div>
          <div>
            <div>
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu ..."
                value={formik.values.password}
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                className="form-control"
              />
            </div>
            <div className="text-danger mt-1">
              {formik.touched.password && formik.errors.password}
            </div>
          </div>
          <div>
            <div>
              <label className="mb-1">Chọn nhóm quyền</label>
              <select
                placeholder="Chọn nhóm quyền ..."
                value={formik.values.role_id}
                onChange={formik.handleChange("role_id")}
                onBlur={formik.handleBlur("role_id")}
                className="form-control"
              >
                <option value="">--Chọn nhóm quyền--</option>
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
          <div>
            <div className="mt-3">
              <label className="mx-1">Hiển thị</label>
              <input
                type="checkbox"
                checked={formik.values.active ? true : false}
                onChange={handelChangeActive}
              />
            </div>
            <div className="text-danger mt-1">
              {formik.touched.password && formik.errors.password}
            </div>
          </div>
          <div>
            <div className="d-flex gap-2">
              {showButtonAction()}
              <div>
                <button onClick={handleClose} className="btn btn-danger mt-2">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
