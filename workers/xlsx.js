importScripts("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.3/xlsx.full.min.js")
let stock;
onmessage = (e) => {
    let data = e.data;
    let workbook = XLSX.read(data, { type: "binary", cellDates: true });
    workbook.SheetNames.forEach((sheet) => {
      let rawStock = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[sheet],
        { dateNF: "yyyy-mm" }
      );

      stock = rawStock.map((ele) => {
        return Object.assign(
          {},
          ...Object.keys(ele).map((key) => {
            let newKey = key.replace(/\n/g, " ").replace(/\s+/g, "_");
            return { [newKey]: ele[key] };
          })
        );
      });
    });
    postMessage(stock);
  };