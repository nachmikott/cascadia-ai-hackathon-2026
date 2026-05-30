declare module "pdf-parse/lib/pdf-parse" {
  function pdf(buffer: Buffer): Promise<{ text: string; numpages: number; info: Record<string, unknown> }>;
  export default pdf;
}
