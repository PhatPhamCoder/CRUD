import React, { useState, useEffect, useRef } from "react";
import { object, string, date } from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { alert } from "../../utils/Contants";
import { selectGroupDevice } from "../../redux/slices/groupDevice";
let formSchema = object({
  name: string().required(alert.name),
  createdOn: date().default(() => new Date()),
});

export default function Form(props) {
  const { addData, isUpdate, updateData, setOpen } = props;
  const [name, setName] = useState("");
  const [publish, setPublish] = useState(true);

  const groupDeviceState = useSelector(selectGroupDevice);
  const { dataUpdate } = groupDeviceState;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name,
      publish: publish,
    },
    validationSchema: formSchema,
  });

  // create data
  const handleAddData = (e) => {
    e.preventDefault();

    let data = {
      name: formik.values.name,
      publish: formik.values.publish,
    };
    addData(data);
  };

  const handelChangeActive = (e) => {
    formik.setFieldValue("publish", e.target.checked);
  };

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  // get and Fill Data when update
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
        if (dataUpdate[0]?.publish !== undefined) {
          setPublish(dataUpdate[0]?.publish);
        }
      }
    }
  }, [isUpdate, dataUpdate]);

  // update data
  const handleUpdateData = (e) => {
    e.preventDefault();
    const id = dataUpdate[0].id;
    let dataUpdateNew = {
      name: formik.values.name,
      publish: formik.values.publish,
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
    <form className="d-flex gap-2 mt-2 align-items-center">
      <div>
        <div>
          <label>Tên nhóm</label>
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
        <div className="mt-3">
          <label className="mx-1">Hiển thị</label>
          <input
            type="checkbox"
            checked={formik.values.publish ? true : false}
            onChange={handelChangeActive}
          />
        </div>
        <div className="text-danger mt-1">
          {formik.touched.publish && formik.errors.publish}
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
  );
}
