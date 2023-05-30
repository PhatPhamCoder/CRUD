import React, { useEffect } from "react";
import { AiFillFire } from "react-icons/ai";
import { BiAtom, BiError } from "react-icons/bi";
import { MdFiberNew } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getStatistics, selectSeri } from "../../redux/slices/serithuebaoSlice";
import { Column } from "@ant-design/plots";
import { Helmet } from "react-helmet";
export default function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getStatistics());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SeriState = useSelector(selectSeri);
  const { dataStatic } = SeriState;

  const DemoColumn = () => {
    const data = [
      {
        type: "Tổng cộng",
        value: dataStatic?.[0]?.total,
      },
      {
        type: "Lỗi",
        value: dataStatic?.[0]?.error,
      },
      {
        type: "Thuê bao mới",
        value: dataStatic?.[0]?.new,
      },
      {
        type: "Đang sử dụng",
        value: dataStatic?.[0]?.using,
      },
    ];
    const config = {
      data,
      seriesField: "type",
      xField: "type",
      yField: "value",
      columnWidthRatio: 0.8,
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
          position: "middle",
          content: (item) => {
            return item.value.toFixed(2);
          },
        },
        interactions: [
          {
            type: "active-region",
            enable: false,
          },
        ],
      },
    };
    return <Column {...config} />;
  };

  return (
    <>
      <Helmet>
        <title>Admin DashBoard</title>
        <meta
          name="description"
          content="App Description"
          data-react-helmet="true"
        />
        <meta name="theme-color" content="#008f68" data-react-helmet="true" />
      </Helmet>
      <h1 className="fw-bold text-center fs-1">Quản lý hệ thống</h1>
      <div className="row bg-primary text-white rounded-3 py-1 mt-3 mt-0">
        <div className="col-3">
          <h4 className="d-flex align-items-center gap-2 justify-content-center fw-bold">
            <BiAtom size={30} />
            Tổng cộng thuê bao
          </h4>
          <div className="fs-3 text-center">{dataStatic?.[0]?.total}</div>
        </div>
        <div className="col-3">
          <h4 className="d-flex align-items-center gap-2 justify-content-center fw-bold">
            <BiError size={30} color="yellow" />
            Trạng thái lỗi
          </h4>
          <div className="fs-3 text-center">{dataStatic?.[0]?.error}</div>
        </div>
        <div className="col-3">
          <h4 className="d-flex align-items-center gap-2 justify-content-center fw-bold">
            <MdFiberNew size={30} />
            Thuê bao mới
          </h4>
          <div className="fs-3 text-center">{dataStatic?.[0]?.new}</div>
        </div>
        <div className="col-3">
          <h4 className="d-flex align-items-center gap-2 justify-content-center fw-bold">
            <AiFillFire size={30} color="red" />
            Đang sử dụng
          </h4>
          <div className="fs-3 text-center">{dataStatic?.[0]?.using}</div>
        </div>
      </div>
      <div className="mt-5">
        <DemoColumn />
      </div>
    </>
  );
}
