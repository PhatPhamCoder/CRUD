import { useEffect, useState } from "react";
import { TbCirclePlus } from "react-icons/tb";
import Form from "./Form";
import ListItem from "./ListItem";
import { useDispatch, useSelector } from "react-redux";
import {
  createFeedBack,
  getAllFeedBack,
  selectFeedBack,
} from "../../redux/slices/feedBackSlice";
import Pagination from "../../components/Pagination";
import Search from "./Search";

export default function Feedback() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleCloseForm = () => {
    setOpen(false);
  };

  const params = {
    keyword: keyword,
    limit: 10,
  };

  const getData = () => {
    dispatch(getAllFeedBack(params));
  };

  useEffect(() => {
    getData();
    dispatch(getAllFeedBack());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const feedBackState = useSelector(selectFeedBack);
  const { data, totalPage } = feedBackState;

  // Create feedback
  const handleAddData = (data) => {
    dispatch(createFeedBack(data));
  };

  // Update feedback
  const handleUpdateData = () => {};

  const displayForm = () => {
    if (open) {
      return (
        <Form
          closeForm={handleCloseForm}
          // isUpdate={isUpdate}
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

  // Handle Search
  const handleSearch = (keyword) => {
    params.keyword = keyword;
    setKeyword(keyword);
    getData();
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <div
          className="bg-primary text-white p-2 mt-3 rounded d-flex align-items-center gap-2 fs-5 fw-bold"
          style={{ cursor: "pointer", width: "fit-content" }}
          onClick={() => setOpen(true)}
        >
          Thêm phản hồi <TbCirclePlus size={30} />
        </div>
        <div className="mt-3">
          <Search handleSearch={handleSearch} />
        </div>
      </div>
      {open && displayForm()}
      <div>
        <table className="table">
          <thead>
            <tr className="fw-bold fs-5">
              <th className="text-center">#</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th className="text-center">Ngày tạo</th>
              <th className="text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <ListItem data={data} />
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
