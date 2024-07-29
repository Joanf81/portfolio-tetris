// Tailwind
export type TaildWindClass = string;

// General purpose types
export type Hash<K extends string, V> = {
  [key in K]?: V;
};
