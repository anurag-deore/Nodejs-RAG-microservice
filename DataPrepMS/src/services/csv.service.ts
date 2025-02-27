import fs from "fs";
import { parse } from "csv-parse";
import logger from "../utils/logger";

interface CSVRow {
  [key: string]: string;
}

interface ProcessedRow {
  reviewTitle: string;
  rating: string;
  category: string;
  comments: string;
}

class CSVService {
  private readonly REQUIRED_COLUMNS = [
    "review title",
    "rating",
    "category",
    "comments",
  ];

  private normalizeColumnName(column: string): string {
    return column.toLowerCase().trim();
  }

  private validateColumns(headers: string[]): void {
    const normalizedHeaders = headers.map(this.normalizeColumnName);
    const missingColumns = this.REQUIRED_COLUMNS.filter(
      (col) => !normalizedHeaders.includes(col)
    );

    if (missingColumns.length > 0) {
      const error = new Error(
        `Missing required columns: ${missingColumns.join(", ")}`
      );
      logger.error("CSV validation failed:", error.message);
      throw error;
    }
  }

  private findColumnIndex(headers: string[], columnName: string): number {
    const normalizedColumnName = this.normalizeColumnName(columnName);
    return headers.findIndex(
      (header) => this.normalizeColumnName(header) === normalizedColumnName
    );
  }

  private processRow(row: CSVRow, headers: string[]): ProcessedRow {
    return {
      reviewTitle: row[headers[this.findColumnIndex(headers, "review title")]],
      rating: row[headers[this.findColumnIndex(headers, "rating")]],
      category: row[headers[this.findColumnIndex(headers, "category")]],
      comments: row[headers[this.findColumnIndex(headers, "comments")]],
    };
  }

  public async readCSV(filePath: string): Promise<ProcessedRow[]> {
    return new Promise((resolve, reject) => {
      const rows: ProcessedRow[] = [];
      let headers: string[] = [];
      let isFirstRow = true;

      fs.createReadStream(filePath)
        .on("error", (error) => {
          logger.error("Error reading CSV file:", error);
          reject(error);
        })
        .pipe(
          parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
            quote: '"',
            relax_quotes: true,
          })
        )
        .on("data", (row: CSVRow) => {
          try {
            if (isFirstRow) {
              headers = Object.keys(row);
              this.validateColumns(headers);
              isFirstRow = false;
            }
            rows.push(this.processRow(row, headers));
          } catch (error) {
            reject(error);
          }
        })
        .on("end", () => {
          if (rows.length === 0) {
            reject(new Error("CSV file is empty"));
          } else {
            logger.info(`Successfully read ${rows.length} rows from CSV`);
            resolve(rows);
          }
        })
        .on("error", (error) => {
          logger.error("Error parsing CSV:", error);
          reject(error);
        });
    });
  }

  public extractTextFromRow(row: ProcessedRow): string {
    return `${row.reviewTitle} ${row.rating} ${row.category} ${row.comments}`.trim();
  }

  public async processCSVFile(
    filePath: string
  ): Promise<{ texts: string[]; rows: ProcessedRow[] }> {
    try {
      const rows = await this.readCSV(filePath);
      console.log(`\nRead ${rows.length} rows from CSV file`);
      const texts = rows.map((row) => this.extractTextFromRow(row));

      console.log(`\nProcessed ${texts.length} rows from CSV file`);
      logger.info(`Processed ${texts.length} rows from CSV file`);
      return { texts, rows };
    } catch (error) {
      logger.error("Error processing CSV file:", error);
      throw error;
    }
  }
}

export default new CSVService();
