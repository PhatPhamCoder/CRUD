import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";

import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { MdModeEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { deleteDevice, getAllDevice } from "../../redux/slices/deviceSlice";
import { FaUserCheck, FaUserNinja } from "react-icons/fa";
export default function ListItem({
  data = [],
  openFormUpdate,
  openFormMoveUser,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDevice());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };

  const handleDelete = async (id, imei) => {
    console.log(id);
    Swal.fire({
      title: `Bạn có chắc muốn xóa Imei ${imei} không?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteDevice(id));
        if (deleteDevice.fulfilled.match(action)) {
          const msg = action.payload.msg;
          toast.success(msg);
        } else {
          const msg = action.payload;
          toast.error(msg);
        }
      }
    });
  };

  const handleOpenMoveOneUser = (id) => {
    openFormMoveUser(id);
  };

  return (
    <>
      {data?.map((item, index) => {
        return (
          <tr key={index} className="fs-5">
            <td className="text-center">{index + 1}</td>
            <td>{item.imei}</td>
            <td>{item.seri}</td>
            <td className="text-center">
              {format(
                new Date(item.updated_at ? item.updated_at : item.created_at),
                "dd/MM/yyyy",
              )}
            </td>

            <td className="text-center d-flex align-items-center justify-content-center gap-2">
              <button onClick={() => handleOpenMoveOneUser(item.id)}>
                {item.seri ? (
                  <FaUserCheck size="20" />
                ) : (
                  <FaUserNinja size="20" />
                )}
              </button>
              <button onClick={() => handleOpenFormUpdate(item.id)}>
                <MdModeEdit size={30} color="blue" />
              </button>
              <button onClick={() => handleDelete(item?.id, item.imei)}>
                <AiFillDelete size={30} color="red" />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
