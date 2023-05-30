import { number, object, string } from "yup";
import { useFormik } from "formik";
import { alert } from "../../utils/Contants";

let formSchema = object({
  msg: string().required(alert.msg),
  phone: number().required(alert.phone),
  email: string().email().required(alert.email),
});

export default function Form({ setOpen, addData }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      msg: "",
      phone: "",
      email: "",
    },
    validationSchema: formSchema,
  });

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  const handleAddData = (e) => {
    e.preventDefault();
    const data = {
      msg: formik.values.msg,
      phone: formik.values.phone,
      email: formik.values.email,
    };
    addData(data);
  };

  return (
    <form className="d-flex gap-2 mt-2 align-items-center">
      <div className="row">
        <div className="col-6">
          <div>
            <label className="mb-2">Địa chỉ Email</label>
            <input
              type="email"
              placeholder="Nhập tên ở dây ..."
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
        <div className="col-6">
          <div>
            <label className="mb-2">Số điện thoại</label>
            <input
              type="number"
              placeholder="Nhập SĐT ở dây ..."
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
        <div className="col-12">
          <div>
            <label className="my-2">Nội dung phản hồi</label>
            <textarea
              type="text"
              placeholder="Nhập nội dung ở dây ..."
              value={formik.values.msg}
              onChange={formik.handleChange("msg")}
              onBlur={formik.handleBlur("msg")}
              className="form-control"
            />
          </div>
          <div className="text-danger mt-1">
            {formik.touched.msg && formik.errors.msg}
          </div>
        </div>
        <div>
          <div className="d-flex gap-2">
            <button
              onClick={(e) => handleAddData(e)}
              className="btn btn-primary mt-2"
            >
              Thêm
            </button>
            <div>
              <button onClick={handleClose} className="btn btn-danger mt-2">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
