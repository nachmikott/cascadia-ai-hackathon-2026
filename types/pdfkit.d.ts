declare module "pdfkit" {
  import { Writable } from "stream";

  class PDFDocument extends Writable {
    constructor(options?: { size?: string; margin?: number });
    fontSize(size: number): this;
    font(name: string): this;
    text(text: string, options?: { align?: string }): this;
    text(text: string, x?: number, y?: number, options?: { align?: string }): this;
    moveDown(lines?: number): this;
    image(src: Buffer | string, options?: { fit?: [number, number]; align?: string }): this;
    image(src: Buffer | string, x?: number, y?: number, options?: { fit?: [number, number]; align?: string }): this;
    end(): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export default PDFDocument;
}
