import React from "react";
import { useDispatch } from "react-redux";
import { getAllAction } from "../../redux/slices/customerSlice";
import { useEffect } from "react";
import { format } from "date-fns";

export default function LisItem({ data = [], openFormUpdate }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {data?.map((item, index) => (
        <tr key={index} className="fs-5">
          <td>{index + 1}</td>
          <td>{item?.id}</td>
          <td>{item?.name}</td>
          <td>{item?.account}</td>
          <td className="text-center">
            {format(
              new Date(item?.updated_at ? item?.updated_at : item?.created_at),
              "dd/MM/yyyy",
            )}
          </td>
          <td>
            <div
              className="d-flex gap-3 align-items-center justify-content-center"
              style={{ marginLeft: "10px" }}
            >
              {item?.active === 1 ? (
                <div className="text-primary fw-bold">Active</div>
              ) : (
                <div className="text-danger fw-bold">No Active</div>
              )}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
