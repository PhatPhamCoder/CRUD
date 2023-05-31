import React, { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import Form from "./Form";
import { useDispatch, useSelector } from "react-redux";
import {
  createAdmin,
  getAllAdmin,
  getByIdAction,
  logoutAction,
  selectAdmin,
  updateDataAction,
} from "../../redux/slices/adminSlice";
import { getAllAdmin as getAll } from "../../redux/slices/adminSlice";
import { toast } from "react-toastify";
import ListItem from "./ListItems";
import { useNavigate } from "react-router-dom";
import configs from "../../configs";
import Pagination from "../../components/Pagination";
import Search from "./Search";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [isUpdate, setIsUpdate] = useState();

  const [keyword, setKeyword] = useState("");
  const [roleID, setRoleID] = useState("");
  const [offset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCloseForm = () => {
    setOpen(false);
  };

  const params = {
    keyword: keyword,
    role_id: roleID,
    offset,
    limit: 10,
  };

  const getData = () => {
    dispatch(getAllAdmin(params));
  };

  useEffect(() => {
    getData();
    dispatch(getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const adminData = useSelector(selectAdmin);
  const { userAuth, data, totalPage, appError, serverError } = adminData;

  // create Account
  const handleAddData = async (data) => {
    const action = await dispatch(createAdmin(data));
    const msg = action.payload;
    if (createAdmin.fulfilled.match(action)) {
      setOpen(false);
      toast.success(msg);
    } else {
      const msgError = action.payload[0].msg;
      toast.error(msgError);
    }
  };

  // Update account
  const handleUpdateData = async (id, data) => {
    const dataUpdate = {
      id: id,
      data: data,
    };
    await dispatch(updateDataAction(dataUpdate));
  };

  useEffect(() => {
    const checkErr = async () => {
      if (
        appError?.message ===
          "Invalid token specified: Cannot read properties of undefined (reading 'replace')" ||
        !userAuth?.token ||
        serverError === "Network Error" ||
        appError?.message === "Network Error"
      ) {
        await dispatch(logoutAction());
        navigate(configs.routes.login);
        window.location.reload();
      }
    };
    checkErr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appError, userAuth, serverError]);

  // Open Form Update
  const handleOpenFormUpdate = (id) => {
    setIsUpdate(true);
    setOpen(true);
    dispatch(getByIdAction(id));
  };

  //
  const displayForm = () => {
    if (open) {
      return (
        <Form
          closeForm={handleCloseForm}
          isUpdate={isUpdate}
          setOpen={setOpen}
          addData={handleAddData}
          updateData={handleUpdateData}
          alert={alert}
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

  // Handle Search
  const handleSearch = (keyword, roleID) => {
    params.keyword = keyword;
    params["role"] = roleID;
    setKeyword(keyword);
    setRoleID(roleID);
    getData();
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <div
            className="bg-primary p-2 outline-none border-0 text-white rounded d-flex align-items-center"
            onClick={() => setOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="fs-5 mb-0">Thêm người dùng</h3>
            <MdAddCircleOutline size={30} className="mx-2" />
          </div>

          <Search handleSearch={handleSearch} />
        </div>
        {open && displayForm()}
        <div>
          <table className="table">
            <thead>
              <tr className="fw-bold fs-5">
                <th className="text-center">#</th>
                <th>Nhóm quyền</th>
                <th>Tên người dùng</th>
                <th>Tài khoản</th>
                <th>Địa chỉ Email</th>
                <th className="text-center">Trạng thái</th>
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
        </div>
      </div>
      <Pagination
        totalPage={totalPage}
        onchangePage={handelChangePage}
        currentPage={currentPage}
        onchangePrevPage={handelPrevPage}
        onchangeNextPage={handelNextPage}
      />
    </>
  );
}
