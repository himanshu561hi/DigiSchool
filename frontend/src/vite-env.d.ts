/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.jsx" {
  import type { ComponentType } from "react";

  const Component: ComponentType<unknown>;
  export default Component;
}
