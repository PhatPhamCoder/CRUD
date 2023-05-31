import React, { useEffect, useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import ListItem from "./ListItem";
import Form from "./Form";
import { useDispatch, useSelector } from "react-redux";
import {
  createSoThueBao,
  getAllThueBao,
  getById,
  selectSoThueBao,
  updateById,
} from "../../redux/slices/soThueBaoSlice";
import Pagination from "../../components/Pagination";
import Search from "./Search";
import { toast } from "react-toastify";

export default function SoThueBao() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState();

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [offset] = useState(0);

  const thueBaoState = useSelector(selectSoThueBao);
  const { data, totalPage } = thueBaoState;

  const handleCloseForm = () => {
    setOpen(false);
    setIsUpdate(false);
  };

  const handleAddData = async (data) => {
    const action = await dispatch(createSoThueBao(data));
    if (createSoThueBao.fulfilled.match(action)) {
      toast.success(action.payload.msg);
      handleCloseForm();
    }
  };

  const handleOpenFormUpdate = (id) => {
    setOpen(true);
    setIsUpdate(true);
    dispatch(getById(id));
  };

  const handleUpdateData = async (id, data) => {
    const datas = {
      id: id,
      data: data,
    };
    const action = await dispatch(updateById(datas));
    if (updateById.fulfilled.match(action)) {
      toast.success(action.payload.msg);
      handleCloseForm();
    }
  };

  const params = {
    keyword: keyword,
    status: status,
    offset,
    limit: 10,
  };

  const getData = () => {
    dispatch(getAllThueBao(params));
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  //---------pagination-----------
  const handelChangePage = async (page) => {
    params.offset = (page - 1) * params.limit;
    getData();
    setCurrentPage(page);
  };

  const handelPrevPage = async () => {
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

  return (
    <div>
      <div className="d-flex align-items-center mt-1 justify-content-between">
        <div
          className="bg-primary text-white p-2 rounded d-flex align-items-center gap-2 fs-5 fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(true)}
        >
          Thềm thuê bao <TbCirclePlus size={30} />
        </div>
        <Search handleSearch={handleSearch} />
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
