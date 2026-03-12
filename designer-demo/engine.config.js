
export default {
  id: 'engine.config',
  theme: 'light',
  // 物料源：基础内置 + 业务物料 + 主工程产出的 bundle（通过 http://localhost:3000/bundle.json 提供）
  material: [
    "/mock/bundle.json",
    // "/mock/business-materials.json",
    "http://localhost:3000/bundle.json"
  ],
  scripts: [],
  styles: [],
  platformId: 1
}
