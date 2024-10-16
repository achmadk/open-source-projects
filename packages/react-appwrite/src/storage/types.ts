import type { ImageFormat, ImageGravity } from "appwrite";

export type StorageFileOperation = "create" | "update" | "delete";

export type PreviewCropGravity =
  | "center"
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export type PreviewOutputFormat = "jpeg" | "jpg" | "png" | "gif" | "webp";

export type Preview = {
  gravity?: ImageGravity;
  quality?: number;
  opacity?: number;
  rotation?: number;
  background?: string;
  output?: ImageFormat;
  border?: PreviewBorder;
  dimensions?: PreviewDimensions;
};

export type PreviewBorder = {
  color?: string;
  radius?: number;
  width?: number;
};

export type PreviewDimensions = {
  width?: number;
  height?: number;
};
