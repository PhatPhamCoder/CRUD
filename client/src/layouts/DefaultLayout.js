import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import { FaUser, FaUserAlt } from "react-icons/fa";
import axiosClient from "../api/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassWordAction,
  logoutAction,
  selectAdmin,
  updateDataAction,
} from "../redux/slices/adminSlice";
import configs from "../configs";
import { HiClipboardList, HiOutlineLogout } from "react-icons/hi";
import Form from "../components/Form";
import ChangePass from "../components/ChangePass";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BiSupport } from "react-icons/bi";
import {
  MdAdminPanelSettings,
  MdPlaylistAddCheckCircle,
  MdSecurity,
} from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { Footer } from "antd/es/layout/layout";
import { AiFillDashboard, AiFillDatabase } from "react-icons/ai";
import { titlePage } from "../utils/Contants";
import { BsDeviceSsdFill, BsSimFill } from "react-icons/bs";
import { TbDeviceAnalytics } from "react-icons/tb";
const { Header, Sider, Content } = Layout;
function DefaultLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const urlName = location.pathname.split("/")[1];

  const adminState = useSelector(selectAdmin);
  const { userAuth } = adminState;

  const [userData, setUserData] = useState();
  const [isUpdate, setIsUpdate] = useState();

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

  const [openModal, setOpenModal] = useState(false);
  const [openModalChangepass, setOpenModalChangepass] = useState(false);

  const handleOpenForm = () => {
    setIsUpdate(true);
    setOpenModal(true);
  };

  const handleFormChangePass = () => {
    setOpenModalChangepass(true);
  };

  const handleCloseForm = () => {
    setOpenModal(false);
    setIsUpdate(false);
    setOpenModalChangepass(false);
  };

  const handleUpdateData = async (id, data) => {
    const dataUpdate = {
      id: id,
      data: data,
    };
    await dispatch(updateDataAction(dataUpdate));
  };

  // Change Password
  const handleChangePass = async (id, data) => {
    const changePass = {
      id: id,
      data: data,
    };
    await dispatch(changePassWordAction(changePass));
  };

  // Title Change
  const title = () => {
    if (urlName) {
      if (urlName === configs.routes.home.split("/")[1]) {
        return <h3>{titlePage.home}</h3>;
      }
      if (urlName === configs.routes.role.split("/")[1]) {
        return <h3>{titlePage.role}</h3>;
      }

      if (urlName === configs.routes.customer.split("/")[1]) {
        return <h3>{titlePage.customer}</h3>;
      }

      if (urlName === configs.routes.serithuebao.split("/")[1]) {
        return <h3>{titlePage.serithuebao}</h3>;
      }
      if (urlName === configs.routes.feedback.split("/")[1]) {
        return <h3>{titlePage.feedback}</h3>;
      }
      if (urlName === configs.routes.device.split("/")[1]) {
        return <h3>{titlePage.device}</h3>;
      }
      if (urlName === configs.routes.groupdevice.split("/")[1]) {
        return <h3>{titlePage.groupdevice}</h3>;
      }
      if (urlName === configs.routes.user.split("/")[1]) {
        return <h3>{titlePage.user}</h3>;
      }
      if (urlName === configs.routes.sothuebao.split("/")[1]) {
        return <h3>{titlePage.sothuebao}</h3>;
      }
    }
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ height: "100vh" }}
      >
        <Link
          to="https://www.optech.vn"
          className="demo-logo-vertical text-white text-center py-3 fs-5 fw-bold d-flex align-items-center justify-content-center"
          style={{ textTransform: "uppercase", textDecoration: "none" }}
        >
          Op
          <div
            style={{
              marginRight: "5px",
              color: "red",
            }}
          >
            tech
          </div>
          Company
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            navigate(key);
          }}
          items={[
            {
              key: `${configs.routes.dashboard}`,
              icon: <AiFillDashboard size={20} />,
              label: "Dashboard",
            },
            {
              icon: <MdSecurity size={20} color="#fff" />,
              label: "Admin",
              children: [
                {
                  key: `${configs.routes.role}`,
                  icon: <MdAdminPanelSettings size={20} />,
                  label: "Role",
                },
                {
                  key: `${configs.routes.home}`,
                  icon: <RiAdminFill size={20} />,
                  label: "Danh sách Admin",
                },
              ],
            },

            {
              key: `${configs.routes.customer}`,
              icon: <FaUserAlt size={20} />,
              label: "Customer",
            },
            {
              icon: <TbDeviceAnalytics size={20} />,
              label: "Thiết bị",
              children: [
                {
                  key: `${configs.routes.serithuebao}`,
                  icon: <MdPlaylistAddCheckCircle size={20} />,
                  label: "Seri thuê bao",
                },
                {
                  key: `${configs.routes.groupdevice}`,
                  icon: <AiFillDatabase size={20} />,
                  label: "Nhóm thiết bị",
                },
                {
                  key: `${configs.routes.sothuebao}`,
                  icon: <BsSimFill size={20} />,
                  label: "Danh sách thuê bao",
                },
                {
                  key: `${configs.routes.device}`,
                  icon: <BsDeviceSsdFill size={20} />,
                  label: "Danh sách thiết bị",
                },
              ],
            },
            {
              key: `${configs.routes.user}`,
              icon: <HiClipboardList size={20} />,
              label: "Danh sách người dùng",
            },
            {
              key: `${configs.routes.feedback}`,
              icon: <BiSupport size={20} />,
              label: "Phản hồi khách hàng",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout position-relative">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div>{title()}</div>
          <div className="d-flex align-items-center mt-5 mx-3">
            <div
              style={{
                marginTop: "-40px",
                paddingRight: "10px",
                fontSize: "18px",
              }}
            >
              Hi,{userData?.[0]?.name || <h5>Admin</h5>}
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
        </Header>
        <div className="position-absolute" style={{ top: "50%", left: "50%" }}>
          {openModal && (
            <div
              classname="modal-dialog"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                zIndex: 9999,
                transform: "translate(-50%, -50%)",
                position: "absolute",
                padding: "6rem 24.5rem",
              }}
            >
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
                    />
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
        </div>
        <div className="position-absolute" style={{ top: "50%", left: "50%" }}>
          {openModalChangepass && (
            <div
              className="modal-dialog"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                zIndex: 9999,
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                left: "-1rem",
                top: "-4rem",
              }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-danger">
                      Thay đổi mật khẩu
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => setOpenModalChangepass(false)}
                    />
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
        </div>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {children || <Outlet />}
          <Footer style={{ textAlign: "center" }}>
            &copy; {new Date().getFullYear()} Powered by Optech
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
}

export default DefaultLayout;
