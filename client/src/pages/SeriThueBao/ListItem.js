import React from "react";
import { format } from "date-fns";
import { AiFillDelete } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import { deleteSeri, updateStatus } from "../../redux/slices/serithuebaoSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
export default function ListItem({ data = [], openFormUpdate }) {
  const dispatch = useDispatch();
  const handleStatus = async (e, id) => {
    const status = e.target.value;
    const resultAction = await dispatch(updateStatus({ id, status }));
    const msg = resultAction.payload.msg;
    if (updateStatus.fulfilled.match(resultAction)) {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  };

  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };

  const handleDelete = (id, serithuebao) => {
    Swal.fire({
      title: `Bạn có chắc muốn xóa Seri ${serithuebao} không?`,
      showDenyButton: true,
      confirmButtonText: "Xóa",
      denyButtonText: `Hủy`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteSeri(id));
        if (deleteSeri.fulfilled.match(action)) {
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
            <td>{item?.serithuebao}</td>
            <td>
              <select
                value={item?.status}
                onChange={(e) => handleStatus(e, item?.id)}
                className="form-select form-control w-50 rounded"
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="1">Đang dùng</option>
                <option value="2">Hết hạn</option>
                <option value="0">Chưa dùng</option>
              </select>
            </td>
            <td className="text-center">
              {format(new Date(item?.created_at), "dd-MM-yyyy")}
            </td>
            <td className="text-center d-flex align-items-center justify-content-center gap-2">
              <button onClick={() => handleOpenFormUpdate(item.id)}>
                <MdModeEdit size={30} color="blue" />
              </button>
              <button onClick={() => handleDelete(item.id, item.serithuebao)}>
                <AiFillDelete size={30} color="red" />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
