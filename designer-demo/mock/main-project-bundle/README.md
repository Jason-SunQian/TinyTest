# 主工程物料包验证用（模拟）

用于验证「从主工程 URL 加载物料到设计器」的完整流程，无需真实主工程参与。

- **bundle.json**：符合物料资产包协议，内含一个组件（MrDivider），`npm.script` 指向设计器已有的 `/mock/materials/mr-components.js`，设计器会将相对路径解析为当前 origin，故仅需对本目录提供静态服务即可。
- 真实主工程产出时，将 `bundle.json` 与组件 ESM/CSS 放在同一目录，对该目录 serve 后，用其 `bundle.json` 的 URL 替换下方验证步骤中的 URL 即可。

## 验证步骤

1. **启动「主工程」静态服务**（本目录，端口 3000）：
   ```bash
   npx serve . -p 3000
   ```
   或在 designer-demo 根目录执行：`pnpm run serve:main-project-bundle`

2. **启动设计器**（端口 8090）：
   ```bash
   pnpm run dev
   ```

3. **浏览器打开**（把主工程 bundle URL 通过参数传入）：
   ```
   http://localhost:8090/?materialBundle=http://localhost:3000/bundle.json
   ```

4. **预期**：物料面板中应出现「主工程组件」分组及「主工程-分隔线」，可拖入画布并正常渲染。若能看到并正常使用，即表示设计器已能正确拉取并合并外部物料包。
