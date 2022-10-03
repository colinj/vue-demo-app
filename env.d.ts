/// <reference types="vite/client" />
/// <reference types="@histoire/plugin-vue/components" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue-router" {
  interface RouteMeta {
    layout?: string;
    store?: (params: RouteParams) => Promise<unknown>;
  }
}

export {};
