export interface DocumentOwner {
  documentOwner(documentId: string): Promise<string>;
}
