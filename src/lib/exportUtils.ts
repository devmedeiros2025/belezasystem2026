interface ExportColumn {
  header: string;
  key: string;
}

interface ExportOptions {
  title: string;
  columns: ExportColumn[];
  data: Record<string, any>[];
  fileName: string;
}

export async function exportToPDF({ title, columns, data, fileName }: ExportOptions) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(60, 60, 60);
  doc.text(title, 14, 20);

  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 14, 28);

  // Table
  autoTable(doc, {
    startY: 35,
    head: [columns.map(c => c.header)],
    body: data.map(row => columns.map(c => String(row[c.key] ?? ""))),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [90, 75, 65], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 245, 242] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${fileName}.pdf`);
}

export async function exportToExcel({ title, columns, data, fileName }: ExportOptions) {
  const XLSX = await import("xlsx");

  const wsData = [
    [title],
    [`Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`],
    [],
    columns.map(c => c.header),
    ...data.map(row => columns.map(c => row[c.key] ?? "")),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws["!cols"] = columns.map(() => ({ wch: 18 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
