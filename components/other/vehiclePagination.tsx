import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface VehiclePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  onPrevChange: (pageNumber: number) => void;
  onNextChange: (pageNumber: number) => void;
}

export const VehiclePagination: React.FC<VehiclePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrevChange,
  onNextChange,
}) => {
  return (
    <Pagination className="self-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPrevChange(currentPage)}
            className={`${
              currentPage === 1 ? " opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              isActive={index + 1 === currentPage}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => onNextChange(currentPage)}
            className={`${
              currentPage === totalPages ? " opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
