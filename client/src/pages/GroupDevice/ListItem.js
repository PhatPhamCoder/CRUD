import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";

import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { MdModeEdit } from "react-icons/md";
import {
  deleteGroupDevice,
  getAllGroupDevice,
  updatePublish,
} from "../../redux/slices/groupDevice";
import { toast } from "react-toastify";

export default function ListItem({ data = [], openFormUpdate }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllGroupDevice());
  }, []);

  const handleStatus = async (e, id) => {
    const publish = e.target.checked;
    await dispatch(updatePublish({ id, publish }));
    window.location.reload();
  };

  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Bạn có chắc muốn xóa nhóm ${name} không?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteGroupDevice(id));
        if (deleteGroupDevice.fulfilled.match(action)) {
          const msg = action.payload.msg;
          toast.success(msg);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          const msg = action.payload;
          toast.error(msg);
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
            <td>{item?.name}</td>
            <td className="text-center">
              <div
                className="d-flex text-center gap-2 align-items-center"
                style={{
                  marginLeft: "30px",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input d-flex text-center"
                  checked={item?.publish}
                  onChange={(e) => handleStatus(e, item?.id)}
                />
                <div>{item?.publish ? "Active" : "No Active"}</div>
              </div>
            </td>
            <td className="text-center">
              {format(
                new Date(
                  item?.updated_at ? item?.updated_at : item?.created_at,
                ),
                "dd/MM/yyyy",
              )}
            </td>

            <td className="text-center d-flex align-items-center justify-content-center gap-2">
              <button onClick={() => handleOpenFormUpdate(item?.id)}>
                <MdModeEdit size={30} color="blue" />
              </button>
              <button onClick={() => handleDelete(item?.id, item?.name)}>
                <AiFillDelete size={30} color="red" />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
