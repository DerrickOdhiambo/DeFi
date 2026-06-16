/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_TESTNETS: string;
  readonly VITE_ADMIN_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
