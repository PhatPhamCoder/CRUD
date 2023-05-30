import React, { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import Form from "./Form";
import LisItem from "./LisItem";
import { useDispatch, useSelector } from "react-redux";
import { getAllAction, selectUser } from "../../redux/slices/userSlice";
import Pagination from "../../components/Pagination";
import Search from "./Search";
export default function User() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState();

  const [keyword, setKeyword] = useState("");
  const [offset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const params = {
    keyword: keyword,
    offset,
    limit: 10,
  };
  const getData = () => {
    dispatch(getAllAction(params));
  };

  useEffect(() => {
    getData();
    dispatch(getAllAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userState = useSelector(selectUser);
  const { data, totalPage } = userState;

  const handleCloseForm = () => {};

  const handleAddData = () => {};

  // const handleUpdateData = () => {};

  const displayForm = () => {
    if (open) {
      return (
        <Form
          closeForm={handleCloseForm}
          // isUpdate={isUpdate}
          setOpen={setOpen}
          addData={handleAddData}
          // updateData={handleUpdateData}
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

  const handleSearch = (keyword) => {
    params.keyword = keyword;
    setKeyword(keyword);
    getData();
  };

  return (
    <div>
      <div className="mt-3 mb-3 d-flex justify-content-between">
        <div
          className="bg-primary p-1 outline-none border-0 text-white rounded d-flex align-items-center"
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer", width: "fit-content" }}
        >
          <h3 className="fs-5 mt-2">Thêm người dùng</h3>
          <MdAddCircleOutline size={30} className="mx-2" />
        </div>
        <Search handleSearch={handleSearch} />
      </div>
      {open && displayForm()}
      <table id="customers" className="mb-2 fs-5">
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Quyền</th>
          <th>Tên tài khoản</th>
          <th>Ngày tạo</th>
          <th>Trạng Thái</th>
        </tr>
        <LisItem data={data} />
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
