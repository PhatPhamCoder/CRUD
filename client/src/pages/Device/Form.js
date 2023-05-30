import React, { useState, useEffect, useRef } from "react";
import { object, string, date } from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { alert } from "../../utils/Contants";
import { selectDevice } from "../../redux/slices/deviceSlice";
import axiosClient from "../../api/axiosClient";
let formSchema = object({
  imei: string().required(alert.imei),
  seri: string().required(alert.seri),
  user: string().required(alert.user),
  createdOn: date().default(() => new Date()),
});

export default function Form(props) {
  const { addData, isUpdate, updateData, setOpen, moveUser, moveOneUser } =
    props;
  const [imei, setImei] = useState("");
  const [seri, setSeri] = useState("");
  const [note, setNote] = useState("");
  const [userData, setUserData] = useState();
  const selectRef = useRef(null);

  const DeviceState = useSelector(selectDevice);
  const { dataUpdate } = DeviceState;

  useEffect(() => {
    axiosClient
      .get("/customer/getall")
      .then((res) => {
        setUserData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      imei: imei,
      seri: seri,
      user: "",
      note: note,
    },
    validationSchema: formSchema,
  });

  // create data event
  const handleAddData = () => {
    let data = {
      imei: formik.values.imei,
      seri: formik.values.seri,
      note: note,
    };
    // console.log(data);
    addData(data);
  };

  const handelChangePublish = (e) => {
    formik.setFieldValue("publish", e.target.checked);
  };

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };
  const inputRef = useRef();

  const focus = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!moveUser) {
      focus();
    }
    if (moveUser || moveOneUser) {
      selectRef.current.focus();
    }

    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate[0]?.imei !== undefined) {
          setImei(dataUpdate[0]?.imei);
        }
        if (dataUpdate[0]?.seri !== undefined) {
          setSeri(dataUpdate[0]?.seri);
        }
        if (dataUpdate[0]?.note !== undefined) {
          setNote(dataUpdate[0]?.note);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate, dataUpdate]);

  // update data event
  const handleUpdateData = () => {
    const id = dataUpdate?.[0].id;
    let dataUpdateNew = {
      imei: formik.values.imei,
      seri: formik.values.seri,
      user: formik.values.user,
      note: note,
    };
    updateData(id, dataUpdateNew);
  };

  const handleMoveUserData = () => {
    let data = {
      imei: formik.values.imei,
      user_id: formik.values.user,
    };
    console.log(data);
  };

  // show button update or add
  const showButtonAction = () => {
    if (isUpdate) {
      return (
        <button
          type="submit"
          onClick={() => handleUpdateData()}
          className="btn btn-primary mt-2"
        >
          Lưu
        </button>
      );
    }
    if (moveUser || moveOneUser) {
      return (
        <button
          type="submit"
          onClick={() => handleMoveUserData()}
          className="btn btn-primary mt-2"
        >
          Chuyển
        </button>
      );
    } else {
      return (
        <button
          type="submit"
          onClick={() => handleAddData()}
          className="btn btn-primary mt-2"
        >
          Thêm
        </button>
      );
    }
  };

  return (
    <form className="d-flex gap-2 mt-2 align-items-center">
      {(moveUser || moveOneUser) && (
        <div>
          <div>
            <label>Chọn người dùng</label>
            <select
              name="user"
              ref={selectRef}
              placeholder="Chọn người dùng ..."
              value={formik.values.user}
              onChange={formik.handleChange("user")}
              onBlur={formik.handleBlur("user")}
              className="form-control"
            />
            <option value="">---Chọn người dùng---</option>
            {userData &&
              userData?.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.account}
                  </option>
                );
              })}
          </div>
          <div className="text-danger mt-1">
            {formik.touched.user && formik.errors.user}
          </div>
        </div>
      )}
      <div>
        <div>
          <label>Số Imei</label>
          <input
            type="text"
            placeholder="Nhập IMEI ở dây ..."
            value={formik.values.imei}
            onChange={formik.handleChange("imei")}
            onBlur={formik.handleBlur("imei")}
            className="form-control"
          />
        </div>
        <div className="text-danger mt-1">
          {formik.touched.imei && formik.errors.imei}
        </div>
      </div>
      <div>
        <div>
          <label>Số Seri Thuê Bao</label>
          <input
            type="text"
            placeholder="Nhập số Seri ở dây ..."
            value={formik.values.seri}
            onChange={formik.handleChange("seri")}
            onBlur={formik.handleBlur("seri")}
            onInput={(e) => {
              if (e.target.value.includes(" ")) {
                e.target.value = e.target.value.replace(/\s/g, ""); // loại bỏ khoảng trắng
              }
            }}
            className="form-control"
          />
        </div>
        <div className="text-danger mt-1">
          {formik.touched.seri && formik.errors.seri}
        </div>
      </div>
      <div>
        <div>
          <label>Ghi Chú</label>
          <input
            type="text"
            placeholder="Nhập số Seri ở dây ..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="form-control"
          />
        </div>
      </div>
      <div>
        <div className="mt-3">
          <label className="mx-1">Kích hoạt</label>
          <input
            type="checkbox"
            checked={formik.values.publish ? true : false}
            onChange={handelChangePublish}
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
