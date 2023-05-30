import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { object, string } from "yup";
import { useFormik } from "formik";
import { AiOutlineSearch } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
let searchSchema = object({
  roleID: string().required("Dữ liệu bắt buộc"),
});

export default function Search({ handleSearch }) {
  const [keySearch, setKeySearch] = useState("");
  const [role, setRole] = useState();
  const [roleID] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      roleID: roleID,
    },
    validationSchema: searchSchema,
  });
  useEffect(() => {
    axiosClient
      .get("/role/getall")
      .then((res) => setRole(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChangeSelect = (e) => {
    formik.setFieldValue("roleID", e.target.value);
  };

  const handleClickSearch = () => {
    handleSearch(keySearch.trim(), formik.values.roleID);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <select
        onChange={handleChangeSelect}
        value={formik.values.roleID}
        className="form-select"
      >
        <option value="">--Chọn nhóm quyền--</option>
        {role &&
          role?.map((item, index) => (
            <option key={index} value={item?.id}>
              {item?.name}
            </option>
          ))}
      </select>
      <div className="d-flex align-items-center">
        <input
          type="text"
          placeholder="Tìm kiếm ....."
          value={keySearch}
          className="input-search"
          onChange={(e) => setKeySearch(e.target.value)}
          onInput={(e) => {
            if (e.target.value.startsWith(" ")) {
              e.target.value = "";
            }
          }}
        />
      </div>

      <AiOutlineSearch
        size={80}
        onClick={() => handleClickSearch()}
        style={{ cursor: "pointer" }}
      />

      <div
        onClick={handleRefresh}
        style={{
          cursor: "pointer",
        }}
      >
        <TfiReload size={80} />
      </div>
    </div>
  );
}
