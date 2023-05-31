import React from "react";
import { format } from "date-fns";
import { AiFillDelete } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteRole, updatePublish } from "../../redux/slices/roleSlice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function ListItem({ data = [], openFormUpdate }) {
  // console.log(data);
  const dispatch = useDispatch();

  const handleStatus = async (e, id) => {
    const publish = e.target.checked;
    await dispatch(updatePublish({ id, publish }));
  };

  // Open Form Update
  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };

  // Delete Role
  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Bạn có chắc muốn xóa dữ liệu ${name} không?`,
      showDenyButton: true,
      confirmButtonText: "Xóa",
      denyButtonText: `Hủy`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteRole(id));
        if (deleteRole.fulfilled.match(action)) {
          const msg = action.payload.msg;
          toast.success(msg);
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
          <tr key={index}>
            <td className="text-center">{index + 1}</td>
            <td>{item?.name}</td>
            <td>
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="checkbox"
                  // className="form-check-input"
                  checked={item.publish}
                  onChange={(e) => handleStatus(e, item.id)}
                />
                <div>{item.publish ? "Active" : "No Active"}</div>
              </div>
            </td>
            <td className="text-center">
              {format(new Date(item.created_at), "dd-MM-yyyy")}
            </td>
            <td className="text-center d-flex align-items-center justify-content-center gap-2">
              <button onClick={() => handleOpenFormUpdate(item.id)}>
                <MdModeEdit size={30} color="blue" />
              </button>
              <button onClick={() => handleDelete(item.id, item.name)}>
                <AiFillDelete size={30} color="red" />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
