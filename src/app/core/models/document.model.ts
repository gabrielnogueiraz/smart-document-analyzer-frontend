export interface Document {
  id: string;
  title: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  userId: string;
}

export interface DocumentText {
  id: string;
  text: string;
  extractedAt: string;
}

export interface UploadResponse {
  document: Document;
  message: string;
}
