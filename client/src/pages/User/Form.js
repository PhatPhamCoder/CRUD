import React, { useState } from "react";
import { object, string, date, number } from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { selectCustomer } from "../../redux/slices/customerSlice";
import { alert } from "../../utils/Contants";
let formSchema = object({
  name: string().required(alert.name),
  phone: number(),
  address: string(),
  email: string().email().required(alert.email),
  createdOn: date().default(() => new Date()),
});

export default function Form(props) {
  const { isUpdate, setOpen, addData, updateData } = props;
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const CustomerData = useSelector(selectCustomer);
  const { dataUpdate } = CustomerData;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      parent_id: "",
      account: account,
      password: password,
      role_id: "4",
      active: "",
    },
    validationSchema: formSchema,
  });
  // create data event
  const handleAddData = (e) => {
    e.preventDefault();

    let data = {
      name: formik.values.name,
      phone: formik.values.phone,
      address: formik.values.address,
      email: formik.values.email,
      active: formik.values.active,
    };
    // console.log(data);
    addData(data);
  };

  const handelChangeActive = (e) => {
    formik.setFieldValue("active", e.target.checked);
  };

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  // update data event
  const handleUpdateData = (e) => {
    e.preventDefault();
    const id = dataUpdate?.[0].id;
    let dataUpdateNew = {
      name: formik.values.name,
      phone: formik.values.phone,
      email: formik.values.email,
      address: formik.values.address,
      active: formik.values.active,
    };
    // console.log(id, dataUpdateNew);
    updateData(id, dataUpdateNew);
  };

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
            <label>Số điện thoại</label>
            <input
              type="number"
              placeholder="Nhập số điện thoại ở dây ..."
              value={formik.values.phone}
              onChange={formik.handleChange("phone")}
              onBlur={formik.handleBlur("phone")}
              className="form-control"
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.phone && formik.errors.phone}
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
            <label>Địa chỉ</label>
            <input
              type="address"
              placeholder="Nhập địa chỉ ở dây ..."
              value={formik.values.address}
              onChange={formik.handleChange("address")}
              onBlur={formik.handleBlur("address")}
              className="form-control"
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.address && formik.errors.address}
          </div>
        </div>
        <div>
          <div className="mt-3">
            <label className="mx-1">Kích Hoạt</label>
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
    </>
  );
}
