// Lets plain CSS side-effect imports (e.g. globals.css in the root layout) type-check
// under TypeScript's noUncheckedSideEffectImports, which newer versions enable by default.
declare module "*.css";
