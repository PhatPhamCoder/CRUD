import { useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import Form from "./Form";
import ListItem from "./ListItem";
import { useDispatch, useSelector } from "react-redux";
import {
  createGroupDevice,
  getAllGroupDevice,
  getByIdGroupDevice,
  selectGroupDevice,
  updateByID,
} from "../../redux/slices/groupDevice";
import Pagination from "../../components/Pagination";
import Search from "./Search";

export default function GroupDevice() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState();

  const groupDeviceState = useSelector(selectGroupDevice);
  const { data, totalPage } = groupDeviceState;

  const [keyword, setKeyword] = useState("");
  const [offset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleUpdateData = (id, data) => {
    const dataUpdate = {
      id: id,
      data: data,
    };
    dispatch(updateByID(dataUpdate));
  };
  const handleAddData = (data) => {
    dispatch(createGroupDevice(data));
  };
  // const handleCloseForm = () => {};

  const handleOpenFormUpdate = (id) => {
    setOpen(true);
    setIsUpdate(true);
    dispatch(getByIdGroupDevice(id));
  };

  const params = {
    keyword: keyword,
    offset,
    limit: 10,
  };

  const getData = (params) => {
    dispatch(getAllGroupDevice(params));
  };

  useEffect(() => {
    getData();
    dispatch(getAllGroupDevice());
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

  // HandleSearch
  const handleSearch = (keyword) => {
    params.keyword = keyword;
    setKeyword(keyword);
    getData();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="bg-primary p-2 outline-none border-0 text-white rounded d-flex align-items-center"
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <h3 className="fs-5 mb-0">Thêm nhóm</h3>
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
              <th>Tên nhóm</th>
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
