# SUSTech Auto Scheduler

基于 Vue 3 + TypeScript + Vite 的排课/选课小工具。支持课程搜索、多方案排课、导出日历/图片/CSV 等。

## 功能概览
- 课程搜索：按课程名、教师、课程代码、班次名称（rwmc）检索，支持示例关键词快捷填充。
- 选课清单：支持拖拽排序、单课开关；空状态有引导和快速填充示例。
- 排课算法：将同一课程的理论/实验组成 bundle，生成最多 100 个无冲突方案；必要时允许跳过部分课程尝试生成可行表。
- 方案浏览：左右翻页或键盘快捷键查看多方案，展示课程总数（按 bundle 计数）。
- 导出：支持导出 PNG 截图、CSV、ICS 日历（可指定学期开始日期）。
- 适配移动端：进入时自动检测并提示。

## 快速开始
### 环境要求
- Node.js 18+（建议 LTS）

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
# 打开控制台提示的本地/网络地址
```

### 生产构建
```bash
npm run build
# 可选：预览构建产物
npm run preview
```

## 使用说明
1) 打开“搜索课程”页面，输入关键词或点击示例标签填充后搜索。
2) 点击课程卡片可加入/移除已选；右侧可拖拽调整优先级，或单独关闭某门课。
3) 点击“开始排课”生成方案；若无方案会提示减少或调低课程。
4) 在课表页面可翻页查看方案，必要时导出 PNG/CSV/ICS。

### 快捷键（搜索页）
- `Ctrl+Shift+A`：全选当前搜索结果
- `Ctrl+Shift+D`：取消当前搜索结果中的已选课程
- `I`：聚焦搜索框
- `Enter`：在输入框中时触发排课

### 快捷键（课表页）
- `←/→` 或 `H/L`：上一/下一方案
- `Shift + ←/→` 或 `Shift + H/L`：按 10% 方案数量跳转
- `Backspace`（非输入状态）：返回选课页

## 目录结构（摘录）
- `src/`
	- `views/`：`CourseSelectionView.vue`（搜索/选课）、`ScheduleResultView.vue`（方案查看）等
	- `utils/`: `scheduleAlgo.ts`（排课算法）、`icsExporter.ts` 等
	- `store/`: `courseStore.ts`（选课状态）
	- `api/`: `course.ts`（课程数据获取）

## 备注
- 当前学期与更新时间在搜索页展示，需调整可在 `CourseSelectionView.vue` 中修改常量。
- 示例关键词列表同样可在该文件中修改。

## 许可证
MIT
