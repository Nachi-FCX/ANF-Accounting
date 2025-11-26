// Type declarations for dynamically imported modules
declare module 'exceljs' {
  const content: any;
  export = content;
}

declare module 'jspdf' {
  export default class jsPDF {
    constructor(orientation?: string, unit?: string, format?: string);
    text(text: string, x: number, y: number, options?: any): void;
    setFontSize(size: number): void;
    addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): void;
    setDrawColor(r: number, g: number, b: number): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    save(filename: string): void;
    getNumberOfPages(): number;
    internal: {
      pageSize: {
        width: number;
        height: number;
        getHeight(): number;
      };
    };
  }
}

declare module 'jspdf-autotable' {
  export default function autoTable(doc: any, options: any): void;
}
