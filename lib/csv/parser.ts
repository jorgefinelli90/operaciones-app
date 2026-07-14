import Papa from "papaparse";

export function parseCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),

      complete: (results) => {
        const fatalErrors = results.errors.filter(
          (error) => error.code !== "TooFewFields",
        );

        if (fatalErrors.length > 0) {
          console.error(fatalErrors);
          reject(new Error("Error leyendo el archivo CSV."));
          return;
        }

        resolve(results.data);
      },

      error: (error) => reject(error),
    });
  });
}
