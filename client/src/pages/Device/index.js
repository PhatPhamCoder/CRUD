import { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import Form from "./Form";
import ListItem from "./ListItem";
import { useDispatch, useSelector } from "react-redux";
import {
  createDevice,
  getAllDevice,
  getByIdDevice,
  selectDevice,
  updateByID,
} from "../../redux/slices/deviceSlice";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import Search from "./Search";

export default function Device() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState();
  const [isUpdate, setIsUpdate] = useState();

  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [offset] = useState(0);

  const [moveUser, setMoveUser] = useState(false);
  const [moveOneUser, setMoveOneUser] = useState(false);

  const params = {
    keyword: keyword,
    offset,
    limit: 10,
  };

  // get all data
  const getData = () => {
    dispatch(getAllDevice(params));
  };

  useEffect(() => {
    getData();
    dispatch(getAllDevice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deviceState = useSelector(selectDevice);
  const { data, totalPage } = deviceState;

  const handleCloseForm = () => {
    setIsUpdate(false);
    setOpen(false);
    setMoveOneUser(false);
  };

  // Add Data
  const handleAddData = async (data) => {
    const action = await dispatch(createDevice(data));
    setMoveOneUser(false);
    const msg = action.payload;
    if (createDevice.fulfilled.match(action)) {
      setOpen(false);
      toast.success(msg);
    } else {
      const msgError = action.payload[0].msg;
      toast.error(msgError);
    }
  };

  const handleOpenFormUpdate = (id) => {
    // console.log(id);
    setOpen(true);
    setIsUpdate(true);
    setMoveOneUser(false);
    dispatch(getByIdDevice(id));
  };

  const handleUpdateData = async (id, data) => {
    const dataUpdate = {
      id: id,
      data: data,
    };
    await dispatch(updateByID(dataUpdate));
  };

  const handleOpenMoveOneUser = async (id) => {
    setOpen(true);
    setMoveOneUser(true);
    setMoveUser(false);
    await dispatch(getByIdDevice(id));
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
          moveUser={moveUser}
          MoveUserData={MoveUserData}
          moveOneUser={moveOneUser}
        />
      );
    }
  };

  const MoveUserData = () => {};

  // ------Pagination--------
  const handelChangePage = (page) => {
    // console.log(page);
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
  const handleSearch = (keyword) => {
    params.keyword = keyword;
    setKeyword(keyword);
    getData();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="bg-primary p-2 outline-none border-0 text-white rounded d-flex align-items-center"
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <h3 className="fs-5 mb-0">Thêm thiết bị</h3>
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
              <th>Số IMEI</th>
              <th>Số Seri Thuê Bao</th>
              <th className="text-center">Ngày tạo</th>
              <th className="text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <ListItem
              data={data}
              openFormUpdate={(id) => handleOpenFormUpdate(id)}
              openFormMoveUser={handleOpenMoveOneUser}
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
    </>
  );
}
