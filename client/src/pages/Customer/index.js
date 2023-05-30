import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCustomer,
  getAllAction,
  getByIdCustomer,
  selectCustomer,
  updateCustomerById,
} from "../../redux/slices/customerSlice";
import LisItem from "./ListItem";
import { MdAddCircleOutline } from "react-icons/md";
import Form from "./Form";
import { TbPackageExport } from "react-icons/tb";
import { CSVLink } from "react-csv";
import Pagination from "../../components/Pagination";
import Search from "./Search";
import { Helmet } from "react-helmet";
export default function Customer() {
  const dispatch = useDispatch();
  const customerData = useSelector(selectCustomer);
  const { data, totalPage } = customerData;
  const [open, setOpen] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [offset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isUpdate, setIsUpdate] = useState();
  useEffect(() => {
    dispatch(getAllAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseForm = () => {
    setOpen(false);
  };

  // Open Form Update
  const handleOpenFormUpdate = (id) => {
    setIsUpdate(true);
    setOpen(true);
    dispatch(getByIdCustomer(id));
  };

  const handleUpdateData = async (id, data) => {
    const dataUpdate = {
      id: id,
      data: data,
    };
    await dispatch(updateCustomerById(dataUpdate));
  };

  const displayForm = () => {
    if (open) {
      return (
        <Form
          closeForm={handleCloseForm}
          isUpdate={isUpdate}
          setOpen={setOpen}
          addData={handleAddData}
          updateData={handleUpdateData}
        />
      );
    }
  };

  const getData = () => {
    dispatch(getAllAction(params));
  };

  // Create Customer
  const handleAddData = (data) => {
    dispatch(createCustomer(data));
  };

  const params = {
    keyword: keyword,
    offset,
    limit: 10,
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

  // Handle Search
  const handleSearch = (keyword, roleID) => {
    params.keyword = keyword;
    params["role"] = roleID;
    setKeyword(keyword);
    getData();
  };

  // Format Data header When export Excel
  const headers = [
    { label: "Name", key: "name" },
    { label: "Account", key: "account" },
    { label: "Quyền tài khoản", key: "name_role" },
    { label: "Địa chỉ", key: "address" },
    { label: "SĐT", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Ngày", key: `${new Date().toLocaleDateString("vi-VN")}` },
  ];

  return (
    <div>
      <Helmet>
        <title>Danh sách khách hàng</title>
        <meta
          name="description"
          content="App Description"
          data-react-helmet="true"
        />
        <meta name="theme-color" content="#008f68" data-react-helmet="true" />
      </Helmet>
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
        <CSVLink
          data={data}
          headers={headers}
          filename={"Danh_Sách_Khách_Hàng.csv"}
          className="btn btn-danger d-flex align-items-center gap-2"
        >
          Export Data <TbPackageExport size={30} />
        </CSVLink>
      </div>
      {open && displayForm()}
      <table id="customers" className="mb-2 fs-5">
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Tên khách hàng</th>
          <th>Tài khoản</th>
          <th>Email</th>
          <th>SĐT</th>
          <th>Địa chỉ</th>
          <th>Trạng Thái</th>
          <th>Chức năng</th>
        </tr>
        <LisItem
          data={data}
          openFormUpdate={(id) => handleOpenFormUpdate(id)}
        />
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
