import type { Browser, CreditCard } from "appwrite";

export type AvatarType =
  | "card"
  | "browser"
  | "country"
  | "image"
  | "favicon"
  | "qr"
  | "initials";

export type Avatar =
  | AvatarInitials
  | AvatarImage
  | AvatarBrowser
  | AvatarFavicon
  | AvatarQrCode
  | AvatarCard;

export type AvatarInitials = {
  type: "initials";
  name?: string;
  dimensions?: AvatarDimensions;
  background?: string;
};

export type AvatarFavicon = {
  type: "favicon";
  url: string;
};

export type AvatarCard = {
  type: "card";
  code: CreditCard;
  dimensions?: AvatarDimensions;
  quality?: number;
};

export type AvatarQrCode = {
  type: "qr";
  text: string;
  size?: number;
  margin?: number;
  download?: boolean;
};

export type AvatarBrowser = {
  type: "browser";
  code: Browser;
  dimensions?: AvatarDimensions;
  quality?: number;
};

export type AvatarImage = {
  type: "image";
  url: string;
  dimensions?: AvatarDimensions;
};

export type AvatarDimensions = {
  width?: number;
  height?: number;
};
