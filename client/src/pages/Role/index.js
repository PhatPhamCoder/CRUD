import React, { useEffect, useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import Form from "./Form";
import { useDispatch, useSelector } from "react-redux";
import {
  createRole,
  getAllRole,
  getByIdRole,
  selectRole,
  updateByID,
} from "../../redux/slices/roleSlice";
import { toast } from "react-toastify";
import ListItem from "./ListItem";
import Pagination from "../../components/Pagination";
import Search from "./Search";

export default function Role() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState();

  const [keyword, setKeyword] = useState("");
  const [setRoleID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const params = {
    keyword: keyword,
    limit: 10,
  };

  const getData = () => {
    dispatch(getAllRole(params));
  };

  useEffect(() => {
    getData();
    dispatch(getAllRole());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleState = useSelector(selectRole);
  const { data, totalPage } = roleState;

  const handleCloseForm = () => {
    setOpen(false);
  };

  const handleAddData = async (data) => {
    const action = await dispatch(createRole(data));
    const msg = action.payload;
    if (createRole.fulfilled.match(action)) {
      setOpen(false);
      setTimeout(() => {
        toast.success(msg);
        handleCloseForm();
        window.location.reload();
      }, 500);
    } else {
      const msgError = action.payload[0].msg;
      toast.error(msgError);
    }
  };

  const handleOpenFormUpdate = (id) => {
    setOpen(true);
    setIsUpdate(true);
    dispatch(getByIdRole(id));
  };

  const handleUpdateData = (id, data) => {
    const dataUpdate = {
      id: id,
      data: data,
    };
    dispatch(updateByID(dataUpdate));
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
    <div>
      <div className="d-flex align-items-center mt-3 justify-content-between">
        <div
          className="bg-primary text-white p-2 rounded d-flex align-items-center gap-2 fs-5 fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(true)}
        >
          Thềm quyền mới <TbCirclePlus size={30} />
        </div>
        <Search handleSearch={handleSearch} />
      </div>
      {open && displayForm()}
      <div>
        <table className="table">
          <thead>
            <tr className="fw-bold">
              <th className="text-center">#</th>
              <th>Tên người dùng</th>
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
      </div>
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
