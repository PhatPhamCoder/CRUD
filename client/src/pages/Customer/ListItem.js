import React from "react";
import { useDispatch } from "react-redux";
import {
  deleteCustomer,
  getAllAction,
  updateStatusAction,
} from "../../redux/slices/customerSlice";
import { useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function LisItem({ data = [], openFormUpdate }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatus = async (e, id) => {
    const active = e.target.checked;
    await dispatch(updateStatusAction({ id, active }));
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };

  const handleDelete = async (id, account) => {
    Swal.fire({
      titleText: `Bạn có chắc muốn xóa dữ liệu tài khoản ${account} không?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteCustomer(id));
        if (deleteCustomer.fulfilled.match(action)) {
          const msg = action.payload.msg;
          toast.success(msg);
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          const msg = action.payload;
          toast.error(msg);
        }
      }
    });
  };
  return (
    <>
      {data?.map((item, index) => (
        <tr key={index} className="fs-6">
          <td>{index + 1}</td>
          <td>{item?.id}</td>
          <td>{item?.name}</td>
          <td>{item?.account}</td>
          <td>{item?.email}</td>
          <td>{item?.phone}</td>
          <td>{item?.address}</td>
          <td>
            <div
              className="d-flex gap-3 align-items-center"
              style={{ marginLeft: "10px" }}
            >
              <input
                type="checkbox"
                checked={item?.active}
                onChange={(e) => handleStatus(e, item?.id)}
              />
              {item?.active === 1 ? (
                <div className="text-primary fw-bold">Active</div>
              ) : (
                <div className="text-danger fw-bold">No Active</div>
              )}
            </div>
          </td>
          <td>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <button onClick={() => handleOpenFormUpdate(item.id)}>
                <MdModeEdit size={20} color="blue" />
              </button>
              <button onClick={() => handleDelete(item.id, item?.account)}>
                <AiFillDelete size={20} color="red" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
