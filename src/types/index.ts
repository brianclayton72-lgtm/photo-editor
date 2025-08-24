export interface ImageFile {
  file: File;
  blob: Blob | null;
  name: string;
  quality: number;
  originalSize: number;
  compressedSize: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageEditorState {
  originalImage: HTMLImageElement | null;
  isCropping: boolean;
  cropRect: CropRect;
}

export interface User {
  id: string;
  email: string;
  subscription_status: 'free' | 'premium' | 'cancelled';
  subscription_end_date?: string;
  stripe_customer_id?: string;
  created_at: string;
}

export interface EditHistory {
  id: string;
  user_id: string;
  image_name: string;
  operations: string[];
  created_at: string;
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
}

export interface BrushSettings {
  color: string;
  size: number;
  opacity: number;
}

export interface TextSettings {
  text: string;
  font: string;
  size: number;
  color: string;
  x: number;
  y: number;
}