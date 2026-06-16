type TableSkeletonProps = {
  rows?: number;

  columns?: number;
};

function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <tbody className="divide-y divide-slate-100 bg-white">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <td key={columnIndex} className="px-6 py-5">
              <div className="h-4 animate-pulse rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableSkeleton;
