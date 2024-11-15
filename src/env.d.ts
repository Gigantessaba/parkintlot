/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRUCKPARK_API_URL: string
  readonly VITE_TRUCKPARK_API_KEY: string
  readonly VITE_TRUCKERPATH_API_URL: string
  readonly VITE_TRUCKERPATH_API_KEY: string
  readonly VITE_HERE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}