import React, { useState } from "react";
import { object, string } from "yup";
import { useFormik } from "formik";
import { AiOutlineSearch } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";

let searchSchema = object({
  keySearch: string(),
});

export default function Search({ handleSearch }) {
  const [keySearch, setKeySearch] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      keySearch: keySearch,
    },
    validationSchema: searchSchema,
  });

  const handleClickSearch = () => {
    handleSearch(keySearch.trim());
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <input
        type="text"
        placeholder="Tìm kiếm ....."
        value={keySearch}
        className="input-search"
        onChange={(e) => setKeySearch(e.target.value)}
        onBlur={formik.handleBlur("keySearch")}
        onInput={(e) => {
          if (e.target.value.startsWith(" ")) {
            e.target.value = "";
          }
        }}
      />

      <AiOutlineSearch
        size={30}
        onClick={() => handleClickSearch()}
        style={{ cursor: "pointer" }}
      />

      <div
        onClick={handleRefresh}
        style={{
          cursor: "pointer",
        }}
      >
        <TfiReload size={30} />
      </div>
    </div>
  );
}
