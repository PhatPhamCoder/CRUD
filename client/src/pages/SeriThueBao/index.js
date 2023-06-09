import React, { useEffect, useState } from "react";
import Form from "./Form";
import { useDispatch, useSelector } from "react-redux";
import {
  createSeriThueBao,
  getAllSeri,
  getByIdSeri,
  importExcel,
  // importExcel,
  selectSeri,
  updateByID,
} from "../../redux/slices/serithuebaoSlice";
import Papa from "papaparse";
import ListItem from "./ListItem";
import Pagination from "../../components/Pagination";
import Search from "./Search";
import { BiExport, BiImport } from "react-icons/bi";
import { TbCirclePlus } from "react-icons/tb";
import ExportExcel from "../../utils/ExportExcel";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function SeriThueBao() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState();

  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleCloseForm = () => {
    setOpen(false);
    setIsUpdate(false);
  };

  const params = {
    keyword: keyword,
    limit: 10,
  };

  const getData = () => {
    dispatch(getAllSeri(params));
  };

  useEffect(() => {
    getData();
    dispatch(getAllSeri());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Store Seri
  const SeriState = useSelector(selectSeri);
  const { data, totalPage } = SeriState;

  // Create Seri
  const handleAddData = async (dataAdd) => {
    const resultAction = await dispatch(createSeriThueBao(dataAdd));
    if (createSeriThueBao.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload.msg);
      handleCloseForm();
    }
  };

  // Update Seri
  const handleUpdateData = async (id, data) => {
    const dataUpdate = {
      id: id,
      data: data,
    };
    const resutlAction = await dispatch(updateByID(dataUpdate));
    if (updateByID.fulfilled.match(resutlAction)) {
      toast.success(resutlAction.payload.msg);
      handleCloseForm();
    }
  };

  const handleOpenFormUpdate = (id) => {
    setOpen(true);
    setIsUpdate(true);
    dispatch(getByIdSeri(id));
  };

  const displayForm = () => {
    if (open) {
      return (
        <Form
          isUpdate={isUpdate}
          setOpen={setOpen}
          addData={handleAddData}
          updateData={handleUpdateData}
        />
      );
    }
  };

  // ------Pagination--------
  const handelChangePage = (page) => {
    params.offset = (page - 1) * params.limit;
    getData();
    setCurrentPage(page);
  };
  const handelPrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      params.offset = (prevPage - 1) * params.limit;
      getData();
      setCurrentPage(prevPage);
    } else {
      return;
    }
  };

  const handelNextPage = async () => {
    if (currentPage < totalPage) {
      const nextPage = currentPage + 1;
      params.offset = (nextPage - 1) * params.limit;
      getData();
      setCurrentPage(nextPage);
    } else {
      return;
    }
  };

  // Search
  const handleSearch = (keyword) => {
    params.keyword = keyword;
    setKeyword(keyword);
    getData();
  };

  // export excel
  const handleExportExcel = () => {
    const newData = data?.map((item, index) => {
      const { status, serithuebao, created_at, updated_at } = item;
      return {
        Stt: index + 1,
        "Số thuê bao": serithuebao,
        "Trạng thái":
          status === 2 ? "Hết hạn" : status === 1 ? "Đang dùng" : "Chưa dùng",
        "Ngày cập nhật":
          created_at > updated_at
            ? new Date(created_at).toLocaleDateString("vi-VN")
            : new Date(updated_at).toLocaleDateString("vi-VN"),
      };
    });
    const codeSothuebao = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;
    ExportExcel.exportExcel(
      newData,
      "Sothuebao",
      "Sothuebao" +
        "-" +
        codeSothuebao.toString() +
        "-" +
        format(new Date(), "dd_MM_yyyy"),
    );
  };

  const handleFileChange = async (e) => {
    const formData = new FormData();
    if (e.target.files.length === 0) {
      return;
    }
    formData.append("excel", e.target.files[0]);

    const action = await dispatch(importExcel(formData));
    if (importExcel.fulfilled.match(action)) {
      toast.success("Thêm thành công");
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mt-1 justify-content-between">
        <div
          className="bg-primary text-white p-2 rounded d-flex align-items-center gap-2 fs-5 fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(true)}
        >
          Thềm quyền mới <TbCirclePlus size={30} />
        </div>
        <Search handleSearch={handleSearch} />
        <div className="bg-dark p-2 rounded text-white">
          <label
            htmlFor="importFile"
            className="d-flex align-items-center fw-bold gap-2"
          >
            <BiImport size={30} color="white" />
            Import Excel
          </label>
          <input
            id="importFile"
            type="file"
            hidden
            onChange={(e) => handleFileChange(e)}
            // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
        </div>
        <div
          onClick={handleExportExcel}
          className="bg-danger rounded-3 d-flex align-items-center text-white fw-bold gap-2 p-2"
          style={{ cursor: "pointer" }}
        >
          Export Excel
          <BiExport size={30} color="white" />
        </div>
      </div>
      {open && displayForm()}
      <table className="table">
        <thead>
          <tr className="fw-bold">
            <th className="text-center">#</th>
            <th>Số Seri Thuê bao</th>
            <th>Trạng thái</th>
            <th className="text-center">Ngày tạo</th>
            <th className="text-center">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          <ListItem
            data={data}
            openFormUpdate={(id) => handleOpenFormUpdate(id)}
          />
        </tbody>
      </table>
      <Pagination
        totalPage={totalPage}
        onchangePage={handelChangePage}
        currentPage={currentPage}
        onchangePrevPage={handelPrevPage}
        onchangeNextPage={handelNextPage}
      />
    </div>
  );
}
