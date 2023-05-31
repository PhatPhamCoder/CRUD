import { object, string } from "yup";
import { useFormik } from "formik";
import { alert } from "../../utils/Contants";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectSeri } from "../../redux/slices/serithuebaoSlice";

let seriSchema = object({
  serithuebao: string().required(alert.seri),
});

export default function Form(props) {
  const { isUpdate, setOpen, addData, updateData } = props;
  const [seriThueBao, setSeriThueBao] = useState();
  const [status, setStatus] = useState();

  const seriState = useSelector(selectSeri);
  const { dataUpdate } = seriState;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      serithuebao: seriThueBao,
      status: status,
    },
    validationSchema: seriSchema,
  });

  const handleAddData = (e) => {
    e.preventDefault();
    const dataAdd = {
      serithuebao: formik.values.serithuebao,
    };
    addData(dataAdd);
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
    formik.setFieldValue("status", e.target.checked);
  };

  const inputRef = useRef();

  const focus = () => {
    inputRef.current?.focus();
  };

  const handleUpdateData = (e) => {
    e.preventDefault();
    const id = dataUpdate?.[0]?.id;
    const dataupdateNew = {
      serithuebao: formik.values.serithuebao,
      status: formik.values.status,
    };
    updateData(id, dataupdateNew);
  };

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate?.[0]?.serithuebao !== undefined) {
          setSeriThueBao(dataUpdate?.[0]?.serithuebao);
        }
        if (dataUpdate?.[0]?.status !== undefined) {
          setStatus(dataUpdate?.[0]?.status);
        }
      }
    }
  }, [isUpdate, dataUpdate]);

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  return (
    <form>
      <div>
        <div>
          <label>Nhập số Seri Thuê Bao</label>
          <input
            type="text"
            placeholder="Nhập số seri thuê bao ở đây"
            value={formik.values.serithuebao}
            onChange={formik.handleChange("serithuebao")}
            onBlur={formik.handleBlur("serithuebao")}
            className="form-control"
          />
        </div>
        <div className="text-danger mt-1">
          {formik.touched.serithuebao && formik.errors.serithuebao}
        </div>
      </div>
      {isUpdate && (
        <div>
          <div className="mt-3">
            <label className="mx-1">Trạng thái</label>
            <input
              type="checkbox"
              checked={formik.values.status ? true : false}
              onChange={handelChangeActive}
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.status && formik.errors.status}
          </div>
        </div>
      )}
      <div className="d-flex gap-2">
        {showButtonAction()}
        <button onClick={handleClose} className="btn btn-danger mt-2">
          Hủy
        </button>
      </div>
    </form>
  );
}
