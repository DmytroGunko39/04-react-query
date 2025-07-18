import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalP: number;
  onChange: (nextPage: number) => void;
  currentPage: number;
}

export default function Pagination({
  totalP,
  onChange,
  currentPage,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalP}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      breakLabel="..."
      onPageChange={({ selected }) => onChange(selected + 1)}
      forcePage={currentPage - 1}
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
