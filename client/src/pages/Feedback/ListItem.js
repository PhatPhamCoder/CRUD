import { format } from "date-fns";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { deleteFeedback } from "../../redux/slices/feedBackSlice";
import { toast } from "react-toastify";

export default function ListItem({ data = [] }) {
  const dispatch = useDispatch();
  const handleView = (msg, email) => {
    Swal.fire({
      titleText: `Nội dung phản hồi từ ${email}`,
      text: `Nội dung: ${msg}`,
      showDenyButton: true,
      showConfirmButton: false,
      denyButtonText: "Đóng",
    });
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Bạn có chắc muốn xóa Feedback ${name || id} không?`,
      showDenyButton: true,
      confirmButtonText: "Xóa",
      denyButtonText: `Hủy`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteFeedback(id));
        if (deleteFeedback.fulfilled.match(action)) {
          const msg = action.payload.msg;
          toast.success(msg);
          window.location.reload();
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
          <tr className="fs-5">
            <td>{index + 1}</td>
            <td>{item?.email}</td>
            <td>{item?.phone}</td>
            <td className="text-center">
              {format(new Date(item?.created_at), "dd-MM-yyyy")}
            </td>
            <td className="text-center d-flex align-items-center justify-content-center gap-2">
              <button onClick={() => handleView(item?.msg, item?.email)}>
                <AiFillEye size={30} color="blue" />
              </button>
              <button onClick={() => handleDelete(item?.id, item?.email)}>
                <AiFillDelete size={30} color="red" />
              </button>
            </td>
          </tr>
        );
      })}
    </>
  );
}
