import { useEffect, useMemo, useState } from "react";

const usePagination = (data = [], pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const debut = (currentPage - 1) * pageSize;
    return data.slice(debut, debut + pageSize);
  }, [currentPage, data, pageSize]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
  };
};

export default usePagination;
