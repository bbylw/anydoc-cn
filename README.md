# anydoc

[![Crates.io](https://img.shields.io/crates/v/anydoc.svg)](https://crates.io/crates/anydoc)
[![npm](https://img.shields.io/npm/v/@firecrawl/anydoc.svg)](https://www.npmjs.com/package/@firecrawl/anydoc)
[![PyPI](https://img.shields.io/pypi/v/firecrawl-anydoc.svg)](https://pypi.org/project/firecrawl-anydoc/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/firecrawl/anydoc/blob/main/LICENSE)
[![skills.sh](https://skills.sh/b/firecrawl/anydoc)](https://skills.sh/firecrawl/anydoc)

快速 Rust 库，可将文档（Word、PowerPoint、Excel、OpenDocument、RTF、EPUB、CSV 和 PDF）转换为干净的 GitHub 风格 Markdown。包含 [Node.js](https://github.com/firecrawl/anydoc/blob/main/node/README.md) 和 [Python](https://github.com/firecrawl/anydoc/blob/main/python/README.md) 绑定。

由 [Firecrawl](https://firecrawl.dev) 构建，旨在将任何办公文档在个位数毫秒内转换为 LLM 就绪的 Markdown，无论输入哪种格式，输出始终一致。它为 [Firecrawl Parse](https://firecrawl.dev/parse) 提供支撑，因此如果您不想自行运行，托管 API 可提供相同的转换能力，并额外提供 OCR 模型来处理 anydoc 无法直接识别的扫描页面。

## 快速开始

### Agent 技能

anydoc 以 [Agent Skill](https://agentskills.io) 形式发布，因此您的智能体可以读取遇到的任何文档：

```bash
npx skills add firecrawl/anydoc
```

该 [技能](https://github.com/firecrawl/anydoc/blob/main/skills/convert-documents-to-markdown/SKILL.md) 教会智能体使用 anydoc CLI 转换文档。兼容 [Claude Code](https://claude.ai/code)、[Codex](https://openai.com/codex/)、[Cursor](https://cursor.com)、[OpenCode](https://opencode.ai) 及其他[兼容智能体](https://agentskills.io/clients)。

### CLI

```bash
npx @firecrawl/anydoc report.docx               # Markdown 输出到 stdout
npx @firecrawl/anydoc slides.pptx -o slides.md  # 或输出到文件
npx @firecrawl/anydoc - --format csv < data.csv # 从 stdin 读取
```

首次运行时 `npx` 会下载对应平台的预编译二进制文件。如需永久安装 `anydoc` 命令，可使用 `npm install -g @firecrawl/anydoc`。运行 `anydoc --help` 查看所有选项。

### Node.js

```bash
npm install @firecrawl/anydoc
```

```js
import { toDocument, toMarkdown, toMarkdownBytes } from '@firecrawl/anydoc';

// 从文件路径：
const markdown = await toMarkdown('report.docx');

// 从字节，格式从内容中自动检测：
const fromBytes = await toMarkdownBytes(bytes);

// 或指定格式名称，无签名格式（如 CSV）需要：
const fromCsv = await toMarkdownBytes(bytes, 'csv');

// 或停留在文档模型，该模型还携带嵌入的资源：
const document = await toDocument(bytes);
```

> 完整 API 参考：[node/README.md](https://github.com/firecrawl/anydoc/blob/main/node/README.md)

### Python

```bash
pip install firecrawl-anydoc
```

```python
import anydoc

# 从文件路径：
markdown = anydoc.to_markdown("report.docx")

# 从字节，格式从内容中自动检测：
markdown = anydoc.to_markdown_bytes(data)

# 或指定格式名称，无签名格式（如 CSV）需要：
markdown = anydoc.to_markdown_bytes(data, "csv")

# 或停留在文档模型，该模型还携带嵌入的资源：
document = anydoc.to_document(data)
```

> 完整 API 参考：[python/README.md](https://github.com/firecrawl/anydoc/blob/main/python/README.md)

### Rust

```bash
cargo add anydoc
```

```rust
// 从文件路径：
let markdown = anydoc::to_markdown("report.docx")?;

// 从字节，格式从内容中自动检测：
let markdown = anydoc::to_markdown_bytes(&bytes, None)?;

// 或指定格式名称，无签名格式（如 CSV）需要：
let markdown = anydoc::to_markdown_bytes(&bytes, anydoc::Format::Csv)?;

// 或停留在文档模型，该模型还携带嵌入的资源：
let document = anydoc::to_document(&bytes, None)?;
```

## 特性

- **所有格式统一输出。** 每种格式解析为共享文档模型，并通过单一的 Markdown 序列化器渲染，因此无论是 2003 年的 `.doc` 还是昨天的 `.pptx`，转义、表格、标题锚点和脚注的行为都完全一致。
- **完整的文档结构。** 带锚点的标题、粗体/斜体/删除线、行内代码和代码块、链接和内部交叉引用、带原始编号的列表符号/编号/嵌套/任务列表、带合并单元格和标题行的表格、块引用、脚注和尾注，以及演讲者备注。
- **嵌入资源。** 图片和嵌入对象在 Markdown 中渲染为替代文本，原始字节保留在文档模型上并标记媒体类型。带外部 URL 的图片则转为普通 Markdown 图片。
- **基于内容的格式检测。** 格式从字节本身读取（PDF 头、RTF 开组、OLE 流名称、ZIP 包 mimetype），因此文件扩展名错误也能正确转换。
- **快速。** 纯 Rust 实现，无需机器学习模型，无需外部服务。单文档转换中位数低于 5 毫秒。
- **无侵入式绑定。** Node.js 转换在 libuv 线程池上运行，从不阻塞事件循环；Python 释放 GIL 让其他线程继续运行。TypeScript 类型和 Python 存根随包一起发布。
- **内置 PDF 支持。** 基于文本的 PDF 通过 [pdf-inspector](https://github.com/firecrawl/pdf-inspector) 在本地转换，无需 OCR 服务。
- **智能体就绪。** 以 [Agent Skill](#agent-skill) 形式发布：一条 `npx skills add firecrawl/anydoc` 即可让任何智能体读取办公文档。

## 支持的格式

| 格式             | 扩展名                                                     |
| ---------------- | ---------------------------------------------------------- |
| Word             | `.doc`, `.docx`, `.docm`                                   |
| PowerPoint       | `.ppt`, `.pps`, `.pot`, `.pptx`, `.pptm`, `.ppsx`, `.ppsm` |
| Excel            | `.xls`, `.xlsx`, `.xlsm`, `.xlsb`                          |
| OpenDocument     | `.odt`, `.ods`, `.odp`                                     |
| Rich Text Format | `.rtf`                                                     |
| EPUB             | `.epub`                                                    |
| CSV              | `.csv`                                                     |
| PDF              | `.pdf`                                                     |

## 基准测试

anydoc 在 100 个真实文档上与六个其他转换器进行对比测试，涵盖十四种格式。分数从 0 到 100，越高越好；速度为单文档转换的中位数时间。

| 工具         | 格式      | 中位数毫秒 | 评判文档数 | 总分   | 完整性   | 结构     | 格式     | 整洁度   |
| ------------ | --------- | ---------- | ---------- | ------ | -------- | -------- | -------- | -------- |
| anydoc       | **14/14** | **4.7**    | 94         | **80** | **88**   | **78**   | **77**   | **79**   |
| libreoffice  | 12/14     | 1129.5     | 87         | 40     | 59       | 43       | 43       | 24       |
| unstructured | 8/14      | 572.9      | 58         | 65     | 76       | 62       | 52       | 67       |
| markitdown   | 6/14      | 134.8      | 33         | 65     | 80       | 67       | 61       | 53       |
| pandoc       | 5/14      | 102.1      | 34         | 57     | 75       | 57       | 58       | 39       |
| docling      | 4/14      | 513.6      | 21         | 57     | 63       | 59       | 57       | 52       |
| mammoth      | 1/14      | 52.5       | 8          | 70     | 85       | 68       | 74       | 55       |

逐格式对比：

| 格式 | anydoc | libreoffice | unstructured | markitdown | pandoc | docling | mammoth |
| ------ | ------ | ----------- | ------------ | ---------- | ------ | ------- | ------- |
| doc    | **88** | 58          | 68           | -          | -      | -       | -       |
| docm   | **82** | 49          | -            | -          | -      | -       | -       |
| docx   | **86** | 53          | 56           | 72         | 68     | 68      | 70      |
| epub   | 74     | -           | 74           | **77**     | 53     | -       | -       |
| odp    | **87** | 22          | -            | -          | -      | -       | -       |
| ods    | **82** | 42          | -            | -          | -      | -       | -       |
| odt    | **80** | 52          | 70           | -          | 61     | -       | -       |
| ppt    | **80** | 25          | -            | -          | -      | -       | -       |
| pptx   | **76** | 22          | -            | 59         | -      | 50      | -       |
| rtf    | **89** | 58          | 48           | -          | 46     | -       | -       |
| xls    | **77** | 40          | 68           | 64         | -      | -       | -       |
| xlsm   | **70** | 30          | -            | -          | -      | -       | -       |
| xlsx   | **70** | 31          | 69           | 55         | -      | 51      | -       |

**质量评分方式：** 由 LLM 评判（Claude Sonnet 5）在盲测条件下将两个工具的输出与基准真相（文档前六页由 LibreOffice 渲染为图像）进行对比。每个输出按完整性、结构、格式和整洁度评分。每对工具评判两次并交换输出顺序以消除位置偏差，共计 479 次裁决。每个工具的 `总分` 是对其支持格式的分数取平均，因此某种格式占比过大的语料不会造成偏差。这也意味着每行平均的是不同集合的格式（mammoth 的 70 分仅来自 docx，而 anydoc 的 80 分涵盖全部十四种格式），因此逐格式对比表才是公平比较。

速度测试在 Ryzen 9 9950X3D（Windows 11，64 GB DDR5-6400）上单线程执行，每个文档测量一次预热后的转换。anydoc 和 Python 库的计时排除了进程启动开销；CLI 工具包含进程启动时间，因为它们的使用方式就是如此。测试框架位于 [`bench/`](https://github.com/firecrawl/anydoc/blob/main/bench/README.md)；语料不可重新分发，不在仓库中。

**最佳适用场景：** 接收混合办公文档并需要统一结构化 Markdown 输出的流水线。在此对比中，anydoc 是唯一覆盖全部十四种格式的工具，除 EPUB 外在所有被评判格式上得分最高，且转换速度比次快工具高出一个数量级。

## 格式检测

格式从文件内容中读取，使用其规范指定的标记：PDF 头、RTF 开组、OLE 流名称、ZIP 包的 mimetype 和内容类型。CSV 没有此类标记，因此通过扩展名或显式格式名称来识别。

```rust
Format::from_bytes(&bytes); // Some(Format::Docx)，无匹配时返回 None
Format::from_extension("pptm"); // Some(Format::Pptx)
Format::from_path(Path::new("report.odt")); // Some(Format::Odt)
```

Node（`formatFromBytes` 等）和 Python（`anydoc.format_from_bytes` 等）中也有相同的三个函数。

## 工作原理

```
文档字节
  │
  ├─► 格式检测       → 基于内容标记，而非扩展名
  │
  ├─► 格式解析器      → 每种格式一个（doc, docx, ppt, pptx, xls,
  │                            xlsx, odt/ods/odp, rtf, epub, csv）
  │         │
  │         └─► 文档模型  → 共享模型：块、内联、表格、
  │                           脚注、资源
  │               │
  │               └─► GFM 序列化器 → Markdown
  │
  └─► PDF → pdf-inspector  → 直接输出 Markdown
```

由于所有格式都流经相同的文档模型和序列化器，输出问题只需修复一次。docx 的表格转义修复会自动成为 rtf、odt 及其他所有格式的表格转义修复。

## 开发

```bash
cargo test
cd node && npm install && npm run build && npm test
cd python && pip install maturin && maturin develop && python -m unittest discover -s tests
```

`tests/fixtures/` 下的固定语料库进行快照测试，`tests/robustness.rs` 对每个语料进行变异测试，`fuzz/` 包含每种格式的 cargo-fuzz 目标。速度和质量基准测试位于 [`bench/`](https://github.com/firecrawl/anydoc/blob/main/bench/README.md)。

版本以 `v<version>` 标签发布，该标签会从 [`.github/workflows/release.yml`](https://github.com/firecrawl/anydoc/blob/main/.github/workflows/release.yml) 发布 crate、npm 包和 PyPI 轮子。版本号存在于三个地方，发布时一起更新：

- [`Cargo.toml`](https://github.com/firecrawl/anydoc/blob/main/Cargo.toml)：crate
- [`node/package.json`](https://github.com/firecrawl/anydoc/blob/main/node/package.json)：npm 包
- [`python/Cargo.toml`](https://github.com/firecrawl/anydoc/blob/main/python/Cargo.toml)：轮子（`python/pyproject.toml` 读取它）

## 许可证

[MIT](https://github.com/firecrawl/anydoc/blob/main/LICENSE)
