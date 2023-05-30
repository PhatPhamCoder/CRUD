import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { useFormik } from "formik";
import { alert } from "../../utils/Contants";
import { selectSoThueBao } from "../../redux/slices/soThueBaoSlice";
import { useSelector } from "react-redux";

let soThueBaoSchema = object({
  sothuebao: string().required(alert.sothuebao),
});

export default function Form(props) {
  const { isUpdate, setOpen, addData, updateData } = props;
  const [sothuebao, setSoThueBao] = useState();
  const [status, setStatus] = useState();

  const soThueBaoState = useSelector(selectSoThueBao);
  const { dataUpdate } = soThueBaoState;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      sothuebao: sothuebao,
      status: status,
    },
    validationSchema: soThueBaoSchema,
  });

  const handleAddData = (e) => {
    e.preventDefault();
    const dataAdd = {
      sothuebao: formik.values.sothuebao,
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
      sothuebao: formik.values.sothuebao,
      status: formik.values.status,
    };
    updateData(id, dataupdateNew);
  };

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate?.[0]?.sothuebao !== undefined) {
          setSoThueBao(dataUpdate?.[0]?.sothuebao);
        }
        if (dataUpdate?.[0]?.status !== undefined) {
          setStatus(dataUpdate?.[0]?.status);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdate]);

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  return (
    <form>
      <div>
        <div>
          <label className="my-2">Nhập số Thuê Bao</label>
          <input
            type="number"
            placeholder="Nhập số seri thuê bao ở đây"
            value={formik.values.sothuebao}
            onChange={formik.handleChange("sothuebao")}
            onBlur={formik.handleBlur("sothuebao")}
            className="form-control"
          />
        </div>
        <div className="text-danger mt-1">
          {formik.touched.sothuebao && formik.errors.sothuebao}
        </div>
      </div>
      {isUpdate && (
        <div>
          <div className="mt-3">
            <label className="mx-1">Trạng thái</label>
            <input
              type="checkbox"
              checked={formik.values.status}
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
