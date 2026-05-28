import { useMemo, useState } from "react";

type UseTableSearchProps<T> = {
  data: T[];

  searchableKeys: (keyof T)[];
};

export function useTableSearch<T>({
  data,
  searchableKeys,
}: UseTableSearchProps<T>) {
  const [searchQuery, setSearchQuery] =
    useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const lowerCaseQuery =
      searchQuery.toLowerCase();

    return data.filter((item) =>
      searchableKeys.some((key) => {
        const value = item[key];

        return String(value)
          .toLowerCase()
          .includes(lowerCaseQuery);
      }),
    );
  }, [data, searchQuery, searchableKeys]);

  return {
    searchQuery,

    setSearchQuery,

    filteredData,
  };
}