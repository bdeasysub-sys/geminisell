import { parse } from "csv-parse/sync";

export function parseLinksCsv(csv: string) {
  const records = parse(csv, {
    bom: true,
    relaxColumnCount: true,
    skipEmptyLines: true,
    trim: true
  }) as string[][];

  if (records.length === 0) return [];

  const header = records[0]?.map((cell) => cell.toLowerCase());
  const linkColumnIndex = header?.findIndex((cell) => ["link", "url", "subscription_link"].includes(cell));
  const hasHeader = typeof linkColumnIndex === "number" && linkColumnIndex >= 0;
  const columnIndex = hasHeader ? linkColumnIndex : 0;
  const rows = hasHeader ? records.slice(1) : records;
  const links = rows
    .map((row) => row[columnIndex]?.trim())
    .filter((link): link is string => Boolean(link && link.length >= 5));

  return Array.from(new Set(links));
}

export function toCsv(rows: Array<Record<string, string | number | Date | null | undefined>>) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0] ?? {});
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return escapeCsvCell(value instanceof Date ? value.toISOString() : value ?? "");
        })
        .join(",")
    )
  ];

  return lines.join("\n");
}

function escapeCsvCell(value: string | number) {
  const text = String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}
