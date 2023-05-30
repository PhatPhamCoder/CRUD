import { FiArrowRight, FiArrowLeft } from "react-icons/fi";

function Pagination({
  totalPage = 0,
  onchangePage,
  currentPage,
  onchangePrevPage,
  onchangeNextPage,
}) {
  const handleChangePage = (page) => {
    onchangePage(page);
  };
  const handlePrevPage = () => {
    onchangePrevPage();
  };
  const handlePage = () => {
    let arrTotalPage = [];
    if (totalPage > 0 && totalPage < 6) {
      for (let i = 1; i <= totalPage; i++) {
        arrTotalPage.push(i);
      }

      return arrTotalPage?.map((item, index) => (
        <li
          onClick={() => handleChangePage(item)}
          key={index}
          className={item === currentPage ? "pagination-active" : ""}
        >
          {item}
        </li>
      ));
    }
    if (totalPage > 4 && currentPage <= totalPage) {
      if (currentPage <= 3) {
        for (let i = 2; i < 4; ++i) {
          arrTotalPage = [...arrTotalPage, i];
        }
      }
      if (currentPage > 3 && currentPage <= totalPage - 3) {
        for (let i = currentPage - 1; i <= currentPage + 1; ++i) {
          arrTotalPage = [...arrTotalPage, i];
        }
      }
      if (currentPage > totalPage - 3 && totalPage > 5) {
        for (let i = totalPage - 2; i < totalPage; ++i) {
          arrTotalPage = [...arrTotalPage, i];
        }
      }
      return (
        <>
          <li
            onClick={() => {
              handleChangePage(1);
            }}
            className={currentPage === 1 ? "pagination-active" : ""}
          >
            1
          </li>
          {currentPage > 3 && <li>...</li>}

          {arrTotalPage?.map((item, i) => (
            <li
              onClick={() => {
                handleChangePage(item);
              }}
              key={i}
              className={item === currentPage ? "pagination-active" : ""}
            >
              {item}
            </li>
          ))}
          {totalPage > 4 &&
            currentPage < totalPage - 1 &&
            currentPage <= totalPage - 3 && <li>...</li>}
          <li
            onClick={() => {
              handleChangePage(totalPage);
            }}
            className={currentPage === totalPage ? "pagination-active" : ""}
          >
            {totalPage}
          </li>
        </>
      );
    }
  };
  const handleNextPage = () => {
    onchangeNextPage();
  };
  return (
    <div className="pagination container d-flex">
      <div className="pagination-item mx-auto">
        <ul>
          {totalPage > 0 && (
            <li
              disabled={currentPage <= 1}
              className="page-item"
              onClick={handlePrevPage}
            >
              <FiArrowLeft />
            </li>
          )}
          {handlePage()}
          {totalPage > 0 && (
            <li
              disabled={currentPage === totalPage}
              className="page-item"
              onClick={handleNextPage}
            >
              <FiArrowRight />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Pagination;
