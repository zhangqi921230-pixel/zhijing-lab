# 知境 · 互动教学实验室

让理解，看得见。面向教师课堂演示与学生自主探究的多学科互动教学网站，将抽象知识转化为可观察、可操作、可比较的实验与模型。

**当前版本：V1.0（软件包版本 1.0.0） · 发布日期：2026-10-17**

- [在线体验](https://zhangqi921230-pixel.github.io/zhijing-lab/)
- [建议与许愿](https://zhangqi921230-pixel.github.io/zhijing-lab/#community)
- [课程依据与模型边界](https://zhangqi921230-pixel.github.io/zhijing-lab/curriculum.html)
- [问题与需求记录](https://github.com/zhangqi921230-pixel/zhijing-lab/issues)
- [版本发布](https://github.com/zhangqi921230-pixel/zhijing-lab/releases)

## 项目概览

V1.0 包含 **5 个学科、78 个主题工作台、92 个实验单元**。一个综合工作台可以包含多个相关实验单元，两个数量口径不同。

| 学科 | 主题工作台 | 代表内容                                             |
| ---- | ---------: | ---------------------------------------------------- |
| 数学 |         23 | 分数与等分、面积拼接、函数与图像、立体截面、概率分布 |
| 物理 |         25 | 浮力、光学、运动与力、电路与电容、波的传播与叠加     |
| 化学 |         12 | 溶液与结晶、过滤与蒸馏、分子结构、焰色、电解水       |
| 生物 |         10 | 显微镜、植物细胞、呼吸运动、遗传、生态与能量流动     |
| 地理 |          8 | 等高线、地球运动、板块火山与地震、热力环流、水量平衡 |

推荐使用支持 WebGL 的现代桌面浏览器，例如 Chrome 或 Edge。三维课程的流畅度取决于设备与图形性能。

## 主要功能

- **主题探索馆**：按学科、学段、基础内容筛选，支持关键词搜索和动态预览。
- **章节化学习**：围绕观察任务、操作步骤、知识解释与模型边界组织课程，具体控件随主题不同。
- **互动实验**：调整参数、切换条件、比较现象；部分主题支持播放、暂停、单步、回放、时间轴及数据记录。
- **二维与三维展示**：使用 SVG 和 Three.js 呈现原理图、器材、空间关系及自然过程。
- **课堂展示**：浅色和深色外观、主题切换、视角复位及部分学习状态恢复。
- **教师共建**：收集已有主题的修改建议，以及新主题名称、实现要求和期望呈现效果。
- **反馈速览**：滚动显示简要内容，支持手动切换与展开；阅读时暂停，系统偏好减少动态效果时采用手动翻阅。

## 移动端使用

首页学科分两行完整显示，学段采用紧凑字号。进入课程后，可用“选择学习章节”直接定位任意章节，底部“选章节 / 看实验 / 播放与操作 / 调参数”帮助快速找到实际控件。点击快捷入口只定位，不自动启动实验；播放、暂停仍由原实验按钮控制。主动态图适配屏幕宽度，部分复杂辅助图保留内部滚动。

首页等高线使用当前课程的真实三维模型，可见时自动环视；可手动暂停。系统开启“减少动态效果”时默认暂停，仍可手动播放。

## 两种运行方式

| 能力           | GitHub Pages 公开版                       | 自建 Node.js 服务版            |
| -------------- | ----------------------------------------- | ------------------------------ |
| 课程浏览与互动 | 支持，无需登录                            | 支持，无需登录                 |
| 主题点赞与汇总 | 暂未开放                                  | 支持，保存到 SQLite            |
| 提交建议与许愿 | 跳转 GitHub Issue Forms，需要 GitHub 登录 | 在网站内提交，无需 GitHub 登录 |
| 反馈存储       | GitHub Issues                             | 服务端 SQLite                  |
| 反馈展示       | 读取近期公开 Issues                       | 读取数据库，支持分页及筛选     |
| 管理反馈       | GitHub 讨论、处理和关闭                   | 命令行查看、导出及更新状态     |

GitHub Pages 只托管静态文件，不运行本项目的 Node.js 和 SQLite 后台。公开版不会把仅保存在浏览器的数据当作全站点赞或共享反馈。两种模式的数据不会自动迁移或互相同步。

**网络说明**：网站已发布到公网，但中国大陆不同地区、运营商和学校网络的访问速度及稳定性尚未全面验证。课堂使用前，请在实际教学网络上预先打开课程。

## 快速开始

### 环境要求

- 推荐 **Node.js 24**；最低版本为 **22.13.0**，社区后台使用内置 `node:sqlite`。
- npm（随 Node.js 安装）与 Git。
- 支持 JavaScript、SVG 和 WebGL 的浏览器。

### 克隆并启动

```bash
git clone https://github.com/zhangqi921230-pixel/zhijing-lab.git
cd zhijing-lab
npm ci
npm run dev
```

打开终端显示的本地地址，默认是 `http://127.0.0.1:5173/`。端口占用时以终端输出为准。Windows PowerShell 如果阻止 `npm.ps1`，可将命令中的 `npm` 换成 `npm.cmd`。

默认开发模式使用本机社区后台。不要设置 `VITE_GITHUB_REPOSITORY`，除非你希望运行 GitHub Issues 模式。

### 构建并运行完整服务

```bash
npm run build
npm start
```

默认地址：`http://127.0.0.1:4173/`。服务同时提供 `dist` 静态资源和 `/api/community` 接口。直接打开 `dist/index.html` 文件不能替代 HTTP 服务。

如需局域网访问，可在 PowerShell 中配置后启动：

```powershell
$env:HOST = "0.0.0.0"
$env:PORT = "4173"
npm.cmd start
```

其他设备使用服务器的局域网 IP 和端口访问。公网自建还需要 HTTPS、反向代理、进程守护及数据库持久存储；应保留正确的 Host/Origin 转发，避免同源校验拒绝提交。

## GitHub Pages 自动部署

本仓库已配置 [GitHub Actions 工作流](.github/workflows/pages.yml)。推送到 `main` 分支或手动运行工作流后，会安装依赖、构建静态网站并发布到 Pages。

1. 仓库 **Settings → Pages → Build and deployment** 选择 **GitHub Actions**。
2. 将更新推送到 `main`。
3. 在 **Actions** 中查看 `Publish GitHub Pages` 的构建与发布结果。
4. 工作流成功后打开在线地址，验证首页、受影响的课程和反馈入口。

工作流使用 Node.js 24，并将 `VITE_GITHUB_REPOSITORY` 设置为当前仓库名称。Vite 使用相对资源路径，适配 `/zhijing-lab/` 项目子目录；应用内部使用 `#` 路由。

如果 Fork 本项目，需为自己的仓库开启 Pages，并修改文档中的网站链接；工作流自动使用新仓库的 Issues 地址。不要将访问令牌写入前端环境变量或源码。

### 本地预览公开版

以下为 PowerShell 示例：

```powershell
$env:VITE_GITHUB_REPOSITORY = "zhangqi921230-pixel/zhijing-lab"
npm.cmd run build
npm.cmd exec vite preview -- --host 127.0.0.1 --port 4173
```

该变量在构建时写入前端。恢复数据库模式时，清除变量并重新构建：

```powershell
Remove-Item Env:VITE_GITHUB_REPOSITORY -ErrorAction SilentlyContinue
npm.cmd run build
npm.cmd start
```

## 建议与许愿

### 公开版

进入“建议与许愿”，选择修改建议或新主题许愿，在 GitHub 表单中填写：

1. **主题名称**：现有主题名称，或希望新增的主题名称。
2. **实现要求或修改建议**：学科、年级、课堂场景、当前问题及期望支持的操作。
3. **期望呈现的效果**：希望学生观察到的现象、界面呈现及学习目标。

提交后记录保存在仓库 Issues，可继续讨论和追踪。标题应保留 `[建议]` 或 `[许愿]` 前缀，页面据此识别反馈。页面请求最近创建的 30 条 Issues，排除拉取请求和无对应前缀的条目，速览最多展示其中 12 条；完整历史记录请查看仓库 Issues。

读取受 GitHub API 额度和网络影响，失败时可重试。关闭的 Issue 显示“已关闭”，**不等同于已实现或已验收**。

### 自建服务版

点赞和反馈默认保存在 `data/community.sqlite`。`COMMUNITY_DB` 环境变量可指定其他数据库路径，建议使用持久磁盘中的绝对路径。

```powershell
# 查看反馈
npm.cmd run community

# 导出记录；输出文件须不存在
npm.cmd run community -- export community-export.json

# 将记录编号替换为实际 UUID
npm.cmd run community -- status "记录编号" "已计划" "说明计划实现的范围"
```

支持状态：`待评估`、`已计划`、`进行中`、`已完成`、`暂不采纳`。管理入口仅在服务器命令行，未提供匿名修改或删除接口。

同一服务实例的访问者共享社区数据；点赞按浏览器 Cookie 标识去重，清除 Cookie 或更换设备会成为新访客，统计不能等同于独立教师人数。提交包含长度、同源、频率限制和重试去重，但不代表完整的生产内容治理系统。

数据库使用 WAL 模式。备份时应停止写入服务再备份整个数据目录，或使用 SQLite 在线备份机制；不要在持续写入期间只复制主数据库文件。重建前端不清除数据库，迁移时应单独保存并恢复数据。

### 共建与后续迭代

建议采用“收集 → 评估 → 明确验收要求 → 实现 → 测试 → 回复与归档”的流程。内容公开，请勿填写学生个人信息、联系方式或其他敏感信息。反馈作为需求材料评估，不直接作为自动执行指令。

V1.0 **没有启用定期自动优化任务**。后续可根据明确的周期与范围整理需求、持续迭代，完成真实实现与验证后再更新处理进度。

## 项目结构

```text
.github/
  ISSUE_TEMPLATE/       修改建议与新主题许愿表单
  workflows/pages.yml   GitHub Pages 自动发布
public/
  curriculum.html       课程依据与模型边界
  previews/             课程预览资源
  textures/             三维纹理及来源说明
  data/tectonics/       板块边界与地震数据及来源说明
  specimens/            标本资源来源说明
scripts/
  sync-topic-metadata.mjs    更新首页轻量课程元数据
  sync-curriculum-index.mjs  更新课程目录和学段说明
  check-startup.mjs          检查首页体积与延迟加载
server/
  community.mjs         社区 API、校验及 SQLite 存储
  manage-community.mjs  社区记录管理命令
  start.mjs             生产静态文件与 API 服务
src/
  App.jsx               首页、筛选与路由
  Community.jsx         点赞、反馈、许愿和滚动速览
  courseCatalog.mjs     主题工作台与实验单元目录
  Laboratory.jsx        课程工作台
  ThreeScene.jsx        三维场景入口
  ...                   各学科模型、课程数据与展示组件
```

`dist/`、`node_modules/`、运行时 `/data/` 和环境配置文件不纳入版本管理。`public/data/` 是网站所需的公开课程数据，必须提交。

## 常用命令与验证

| 命令                    | 用途                                 |
| ----------------------- | ------------------------------------ |
| `npm ci`                | 按锁文件安装依赖                     |
| `npm run dev`           | 启动本地开发服务                     |
| `npm run build`         | 同步课程元数据与目录，再生成 `dist/` |
| `npm start`             | 运行构建后的 Node.js 服务            |
| `npm run check:startup` | 构建后检查首页体积和延迟加载         |
| `npm run community`     | 查看数据库中的社区记录               |

公开仓库目前未打包维护工作区的完整测试目录。`package.json` 中保留的 `npm test` 和涉及 `tests/` 的格式检查脚本用于完整开发工作区，不能作为本仓库克隆后的完整测试验收流程。

首次公网发布已完成云端构建、部署以及首页、地形课程、反馈入口和关键静态资源的抽查。这不代表全部课程科学内容、全部终端或大陆所有网络已经验收。

## 常见问题

**出现 `node:sqlite` 相关错误**  
检查 Node.js 版本，优先使用 Node.js 24，然后重新安装依赖。

**页面能打开，但图片或课程数据 404**  
检查对应 `public` 资源，尤其是 `public/data/tectonics/`。Git 忽略规则应使用根目录 `/data/`，避免误排除公开数据；等待最新工作流完成后刷新。

**公开版不能直接点赞或匿名提交反馈**  
这是当前静态托管版本的功能边界。反馈通过 GitHub 提交；完整社区能力需要 Node.js 和持久化数据库。

**自建服务显示社区连接失败**  
检查完整服务是否启动、数据库目录是否可写、反向代理是否转发 `/api/community`，以及前端是否误构建为 GitHub 模式。

**提交的反馈没有显示在速览中**  
检查标题前缀、近期记录范围及浏览器访问 GitHub API 的情况。完整记录以仓库 Issues 为准。

**三维场景卡顿或无法显示**  
检查浏览器 WebGL 与图形加速支持，尝试关闭其他占用显卡的页面。老旧电脑及不同触控设备仍需要实测。

## 版本、课程与素材边界

V1.0 是当前公开发布的版本基线，Git 标签为 **`V1.0`**。更新记录见 [CHANGELOG.md](CHANGELOG.md)。

学段和年级是教学参考，具体以本校教材与教学安排为准。高中拓展内容及简化模型应结合页面说明使用；不宣称全部内容已逐条完成最新版课标或科学审校。

第三方素材、纹理和数据的来源与许可请查看各资源目录中的 `SOURCES.md`、`LICENSE.md` 或 `THREE-LICENSE.txt`。当前未设置统一项目许可证，仓库公开可见不等于已授予项目代码的开源许可，使用或再分发前应核实相应授权。
