import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import {
  deleteAction,
  getAllAdmin as getAll,
  statusPublishAction,
} from "../../redux/slices/adminSlice";
import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { MdModeEdit } from "react-icons/md";

export default function ListItem({ data = [], openFormUpdate }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatus = async (e, id) => {
    const active = e.target.checked;
    await dispatch(statusPublishAction({ id, active }));
  };

  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };

  const handleDelete = (id, account) => {
    Swal.fire({
      title: `Bạn có chắc muốn xóa dữ liệu ${account} không?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteAction(id));
        if (deleteAction.fulfilled.match(action)) {
          const msg = action.payload.msg;
          // console.log(msg);
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            width: 500,
          });
          Toast.fire({
            icon: "success",
            title: msg,
          });
        } else {
          const msg = action.payload;
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            width: 500,
          });
          Toast.fire({
            icon: "error",
            title: msg,
          });
        }
      }
    });
  };
  return (
    <>
      {data?.map((item, index) => {
        return (
          <tr key={index} className="fs-5">
            <td className="text-center">{index + 1}</td>
            <td>{item.name_role}</td>
            <td>{item.name}</td>
            <td>{item.account}</td>
            <td>{item.email}</td>
            <td>
              <div
                className="d-flex text-center gap-2 align-items-center"
                style={{
                  marginLeft: "30px",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input d-flex text-center"
                  checked={item?.active}
                  onChange={(e) => handleStatus(e, item.id)}
                />
                <div>{item.active ? "Active" : "No Active"}</div>
              </div>
            </td>
            <td className="text-center">
              {format(
                new Date(item.updated_at ? item.updated_at : item.created_at),
                "dd/MM/yyyy",
              )}
            </td>

            <td className="text-center d-flex align-items-center justify-content-center gap-2">
              <button onClick={() => handleOpenFormUpdate(item.id)}>
                <MdModeEdit size={30} color="blue" />
              </button>
              <button onClick={() => handleDelete(item.id, item.account)}>
                <AiFillDelete size={30} color="red" />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
