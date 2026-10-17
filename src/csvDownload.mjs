export const csvText = (rows) =>
  "\uFEFF" +
  rows
    .map((row) =>
      row
        .map((value) => '"' + String(value).replaceAll('"', '""') + '"')
        .join(","),
    )
    .join("\r\n");

export function downloadCsv(filename, rows) {
  const url = URL.createObjectURL(
    new Blob([csvText(rows)], { type: "text/csv;charset=utf-8" }),
  );
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
