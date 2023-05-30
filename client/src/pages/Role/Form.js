import { object, string } from "yup";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectRole } from "../../redux/slices/roleSlice";
import { alert } from "../../utils/Contants";

let formSchema = object({
  name: string().required(alert.name),
  publishs: string(),
});

export default function Form({ isUpdate, addData, updateData, setOpen }) {
  const [name, setName] = useState("");
  const [publish, setPublish] = useState();
  const roleState = useSelector(selectRole);
  const { dataUpdate } = roleState;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name,
      publish: publish,
    },
    validationSchema: formSchema,
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  const inputRef = useRef();

  const focus = () => {
    inputRef.current?.focus();
  };

  const handleUpdateData = (e) => {
    e.preventDefault();
    const id = dataUpdate?.[0]?.id;
    const dataupdateNew = {
      name: formik.values.name,
      publish: formik.values.publish,
    };
    updateData(id, dataupdateNew);
  };

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate?.[0]?.name !== undefined) {
          setName(dataUpdate?.[0]?.name);
        }
        if (dataUpdate?.[0]?.publish !== undefined) {
          setPublish(dataUpdate?.[0]?.publish);
        }
      }
    }
  }, [isUpdate, dataUpdate]);

  const handleAddData = (e) => {
    e.preventDefault();

    const data = {
      name: formik.values.name,
      publish: formik.values.publish,
    };
    addData(data);
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

  const handelChangeActive = (e) => {
    formik.setFieldValue("publish", e.target.checked);
  };
  return (
    <div>
      <form className="d-flex gap-2 mt-2 align-items-center">
        <div>
          <div>
            <label>Tên Quyền</label>
            <input
              type="text"
              placeholder="Nhập tên quyền ở dây ..."
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
    </div>
  );
}
