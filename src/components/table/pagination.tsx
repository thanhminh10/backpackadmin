interface Props {
  totalPages: number;
  pageIndex: number;
  onPaging: (pageIndex: number) => void;
}

export default function Pagination({ totalPages, pageIndex, onPaging }: Props) {
  const renderPageNumber = [];

  for (let i = 1; i <= totalPages; i++) {
    renderPageNumber.push(i);
  }

  return (
    <>
      <li>
        <button
          disabled={pageIndex == 1}
          className="rounded-s-lg paging_item"
          onClick={() => onPaging(pageIndex - 1)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19L9.66939 12.7809C9.2842 12.3316 9.2842 11.6684 9.66939 11.2191L15 5"
              stroke="#525655"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Trước
        </button>
      </li>
      {renderPageNumber.map((pageNumber, index) => {
        return (
          <li key={index}>
            <button
              onClick={() => onPaging(index + 1)}
              className={
                pageNumber === pageIndex ? "active paging_item" : "paging_item"
              }
            >
              {index + 1}
            </button>
          </li>
        );
      })}
      <li>
        <button
          disabled={pageIndex == totalPages}
          className="rounded-lg paging_item"
          onClick={() => onPaging(pageIndex + 1)}
        >
          Sau
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L14.3306 11.2191C14.7158 11.6684 14.7158 12.3316 14.3306 12.7809L9 19"
              stroke="#525655"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </li>
    </>
  );
}
