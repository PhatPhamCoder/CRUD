import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassWordAction,
  logoutAction,
  selectAdmin,
  updateDataAction,
} from "../redux/slices/adminSlice";
import axiosClient from "../api/axiosClient";
import { useEffect, useState } from "react";
import configs from "../configs";
import { HiOutlineLogout } from "react-icons/hi";
import Form from "./Form";
import ChangePass from "./ChangePass";

export default function HeaderTop() {
  const dispatch = useDispatch();
  const adminState = useSelector(selectAdmin);
  const { userAuth } = adminState;
  const [openModal, setOpenModal] = useState(false);
  const [openModalChangepass, setOpenModalChangepass] = useState(false);
  const [isUpdate, setIsUpdate] = useState();
  const [userData, setUserData] = useState();

  const handleCloseForm = () => {
    setOpenModal(false);
    setIsUpdate(false);
    setOpenModalChangepass(false);
  };
  const handleOpenForm = () => {
    setIsUpdate(true);
    setOpenModal(true);
  };

  const handleFormChangePass = () => {
    setOpenModalChangepass(true);
  };

  const handleUpdateData = async (id, data) => {
    const dataUpdate = {
      id: id,
      data: data,
    };
    await dispatch(updateDataAction(dataUpdate));
  };

  // get data
  useEffect(() => {
    axiosClient
      .get(`/admin/getbyid/${userAuth?.id}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userAuth]);

  // Change Password
  const handleChangePass = async (id, data) => {
    const changePass = {
      id: id,
      data: data,
    };
    await dispatch(changePassWordAction(changePass));
  };

  return (
    <>
      <div style={{ backgroundColor: "#333", height: "50px", color: "white" }}>
        <div className="container header-top d-flex justify-content-between pt-3 fs-4">
          <div>Logo</div>
          <ul className="d-flex justify-content-between gap-5 align-content-center">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/role">Nhóm quyền</a>
            </li>
            <li>
              <a href="/customer">Customer</a>
            </li>
            <li>
              <a href="/feedback">Phản hồi</a>
            </li>
            <li>
              <a href="/serithuebao">Seri Thuê Bao</a>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <div style={{ marginTop: "-40px", paddingRight: "10px" }}>
              Hi,{userData?.[0]?.name}
            </div>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle d-flex bg-danger"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUser size={20} />
              </button>
              <ul className="dropdown-menu">
                <li>
                  <div className="dropdown-item" onClick={handleOpenForm}>
                    Thông tin người dùng
                  </div>
                </li>
                <li>
                  <div className="dropdown-item" onClick={handleFormChangePass}>
                    Đổi mật khẩu
                  </div>
                </li>
                <li>
                  <a
                    href={configs.routes.login}
                    className="dropdown-item d-flex align-items-center p-3 justify-content-between"
                    onClick={() => dispatch(logoutAction())}
                  >
                    Logout <HiOutlineLogout size={20} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <div classname="modal-dialog modal-dialog-centered" tabindex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  Thông tin người dùng
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setOpenModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Form
                  closeForm={handleCloseForm}
                  isUpdate={isUpdate}
                  setOpen={setOpenModal}
                  updateData={handleUpdateData}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {openModalChangepass && (
        <div className="modal-dialog modal-dialog-centered" tabindex="-10">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Thay đổi mật khẩu</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setOpenModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ChangePass
                  closeForm={handleCloseForm}
                  isUpdate={isUpdate}
                  setOpenModalChangepass={openModalChangepass}
                  updateData={handleChangePass}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
