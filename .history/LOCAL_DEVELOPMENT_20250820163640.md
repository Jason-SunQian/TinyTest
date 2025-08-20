# 本地开发环境配置

## 概述

本项目已经配置为使用本地workspace包引用，这样您就可以一边修改本地代码，一边在设计器中看到效果。

## 配置说明

### 1. 依赖引用已更新

`designer-demo/package.json` 中的以下依赖已经改为本地workspace引用：

```json
{
  "dependencies": {
    "@opentiny/tiny-engine": "workspace:*",
    "@opentiny/tiny-engine-meta-register": "workspace:*",
    "@opentiny/tiny-engine-utils": "workspace:*"
  },
  "devDependencies": {
    "@opentiny/tiny-engine-mock": "workspace:*",
    "@opentiny/tiny-engine-vite-config": "workspace:*"
  }
}
```

### 2. 启动本地开发环境

#### 方式一：使用新的本地开发命令（推荐）
```bash
# 在项目根目录执行
pnpm run dev:local
```

这个命令会：
1. 首先构建所有必要的包
2. 然后同时启动：
   - 后端mock服务
   - 前端设计器（运行在 http://localhost:8090）
   - 本地包的watch模式构建

#### 方式二：分别启动
```bash
# 终端1：启动后端mock服务
pnpm run serve:backend

# 终端2：启动前端设计器
pnpm run serve:frontend

# 终端3：启动本地包watch模式
pnpm run watch:packages
```

### 3. 开发流程

1. **启动开发环境**：使用上述任一方式启动
2. **验证启动成功**：访问 http://localhost:8090 确认设计器正常运行
3. **修改代码**：在 `packages/design-core/src/` 目录下修改代码
4. **自动构建**：代码修改后会自动重新构建
5. **刷新浏览器**：在设计器中刷新页面即可看到最新效果

### 4. 验证配置成功

当您看到以下情况时，说明本地workspace引用配置成功：

- ✅ 设计器在 http://localhost:8090 正常启动
- ✅ 没有出现 `Failed to resolve entry for package "@opentiny/tiny-engine"` 错误
- ✅ 浏览器控制台没有模块解析错误

### 4. 目录结构

```
packages/
├── design-core/          # 主要的引擎包
│   ├── src/             # 源代码
│   ├── dist/            # 构建输出
│   └── package.json     # 包配置
├── utils/               # 工具包
├── register/            # 注册包
└── ...
```

### 5. 注意事项

- 确保所有本地包都已经构建（`pnpm run build:plugin`）
- 如果遇到依赖问题，可以重新安装：`pnpm install`
- 修改代码后，需要刷新浏览器才能看到效果
- 某些配置修改可能需要重启开发服务器

### 6. 故障排除

如果遇到问题：

1. **清理并重新构建**：
   ```bash
   pnpm run build:plugin
   ```

2. **重新安装依赖**：
   ```bash
   pnpm install
   ```

3. **检查构建输出**：
   确保 `packages/*/dist/` 目录存在且包含构建文件

4. **查看控制台错误**：
   检查浏览器控制台和终端输出

## 优势

使用本地workspace引用的好处：

- ✅ 实时看到代码修改效果
- ✅ 无需发布npm包即可测试
- ✅ 支持断点调试
- ✅ 快速迭代开发
- ✅ 保持开发环境的一致性
