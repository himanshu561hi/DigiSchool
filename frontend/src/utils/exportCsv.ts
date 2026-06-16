export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  fileName = "export",
) {
  /*
   =========================
   NO DATA SAFETY
   =========================
  */

  if (!data.length) {
    return;
  }

  /*
   =========================
   CSV HEADERS
   =========================
  */

  const headers = Object.keys(data[0]);

  /*
   =========================
   CSV ROWS
   =========================
  */

  const csvRows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];

      /*
       =========================
       HANDLE COMMAS + QUOTES
       =========================
      */

      const escaped = String(value ?? "")
        .replace(/"/g, '""');

      return `"${escaped}"`;
    }),
  );

  /*
   =========================
   FINAL CSV CONTENT
   =========================
  */

  const csvContent = [
    headers.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  /*
   =========================
   CREATE FILE
   =========================
  */

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  /*
   =========================
   DOWNLOAD LINK
   =========================
  */

  const link = document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    `${fileName}.csv`,
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  /*
   =========================
   CLEANUP
   =========================
  */

  URL.revokeObjectURL(url);
}