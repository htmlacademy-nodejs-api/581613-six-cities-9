export interface DocumentAuthor {
  documentAuthor(documentId: string): Promise<string | null>;
}
