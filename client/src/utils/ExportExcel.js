import * as XLSX from "xlsx-js-style";
class ExportExcel {
  static getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  static exportExcel(data, nameSheet, nameFile) {
    return new Promise((resolve, reject) => {
      try {
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(data);
        // ws.getStyle('A1').getFont.setBold(true);

        const style = { font: { bold: true } };
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = XLSX.utils.encode_cell({ r: 0, c: col });
          ws[cell].s = style;
        }
        XLSX.utils.book_append_sheet(wb, ws, nameSheet);
        XLSX.writeFile(wb, `${nameFile}.csv`);
        resolve("Success");
      } catch (error) {
        reject({ error, message: "Error Export File" });
      }
    });
  }
}
export default ExportExcel;
