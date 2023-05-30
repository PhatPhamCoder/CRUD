import configs from "../configs";
import Customer from "../pages/Customer";
import Dashboard from "../pages/Dashboard";
import Device from "../pages/Device";
import Feedback from "../pages/Feedback";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import GroupDevice from "../pages/GroupDevice";
import Login from "../pages/Login/login";
import Role from "../pages/Role";
import SeriThueBao from "../pages/SeriThueBao";
import SoThueBao from "../pages/SoThueBao";
import User from "../pages/User";
import Home from "../pages/admin";

const publishRouter = [
  { path: configs.routes.login, component: Login },
  { path: configs.routes.forgot, component: ForgotPassword },
];

const privateRouter = [
  { path: configs.routes.dashboard, component: Dashboard },
  { path: configs.routes.home, component: Home },
  { path: configs.routes.customer, component: Customer },
  { path: configs.routes.role, component: Role },
  { path: configs.routes.feedback, component: Feedback },
  { path: configs.routes.serithuebao, component: SeriThueBao },
  { path: configs.routes.groupdevice, component: GroupDevice },
  { path: configs.routes.device, component: Device },
  { path: configs.routes.user, component: User },
  { path: configs.routes.sothuebao, component: SoThueBao },
];

export { publishRouter, privateRouter };
