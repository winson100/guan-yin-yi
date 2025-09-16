# 手机银行组件库文件结构规范

## 目录结构总览

```
src/
├── assets/                        # 静态资源目录
│   ├── icons/                     # 图标资源（SVG等，所有UI用icon）
│   └── images/                    # 图片资源（PNG/JPG等，所有UI用图片）
├── components/                    # 组件目录（所有UI组件HTML）
│   ├── bar/                       # 栏类组件（如导航栏、标签栏等）
│   │   ├── nav-bar.html           # 导航栏
│   │   ├── phone-speaker.html     # 手机顶部扬声器区域
│   │   ├── search-bar.html        # 搜索栏
│   │   ├── status-bar.html        # 状态栏
│   │   ├── tab-bar.html           # 底部标签栏
│   │   └── top-tabs.html          # 顶部标签页
│   ├── base/                      # 基础组件（通用UI元件）
│   │   ├── accordion.html         # 折叠面板
│   │   ├── button-combination.html# 按钮组合
│   │   ├── carousel.html          # 轮播
│   │   ├── element.html           # 元件集合
│   │   ├── scroll-picker.html     # 滚动选择器
│   │   └── tag-button.html        # 标签按钮
│   ├── business/                  # 业务相关组件
│   │   ├── amount-display.html    # 金额显示
│   │   ├── card-id-upload.html    # 身份证上传
│   │   ├── product-card.html      # 产品卡片
│   │   ├── product-detail.html    # 产品详情
│   │   ├── regular-list.html      # 常规列表
│   │   └── steps.html             # 步骤条
│   ├── feedback/                  # 反馈类组件
│   │   ├── bottom-popup-actionsheet.html # 底部弹出-操作表
│   │   ├── bottom-popup-gradient.html    # 底部弹出-渐变
│   │   ├── bottom-popup-icons.html       # 底部弹出-图标
│   │   ├── bottom-popup-options.html     # 底部弹出-选项
│   │   ├── bottom-popup-password.html    # 底部弹出-密码
│   │   ├── bottom-popup-sms.html         # 底部弹出-短信
│   │   ├── bottom-popup-text.html        # 底部弹出-文本
│   │   ├── bottom-popup-title.html       # 底部弹出-标题
│   │   ├── bottom-popup-wheel.html       # 底部弹出-滚轮
│   │   ├── complex-dialog.html           # 复合对话框
│   │   ├── dialog.html                   # 对话框
│   │   ├── empty-page.html               # 空页面
│   │   └── result-page.html              # 结果页
│   ├── form/                             # 表单类组件
│   │   ├── date-filters.html             # 日期筛选器
│   │   ├── filters.html                  # 筛选器
│   │   ├── form-options.html             # 表单选项
│   │   ├── form.html                     # 基础表单
│   │   └── special-inputs.html           # 特殊输入框
│   ├── components.html                   # 组件索引页（全量罗列）
│   └── iphone-preview.html               # iPhone预览框架
├── js/                                   # 组件JS逻辑目录
│   ├── bar/                              # 栏类组件JS
│   │   ├── search-bar.js
│   │   ├── tab-bar.js
│   │   └── top-tabs.js
│   ├── base/                             # 基础组件JS
│   │   ├── carousel.js
│   │   └── element.js
│   ├── business/                         # 业务组件JS
│   │   ├── amount-display.js
│   │   ├── card-id-upload.js
│   │   └── product-card.js
│   ├── form/                             # 表单组件JS
│   │   ├── date-filters.js
│   │   ├── filters.js
│   │   └── form-options.js
├── styles/                               # 样式目录
│   ├── base/                             # 基础样式
│   │   ├── display-page.css              # 展示页面样式
│   │   ├── element.css                   # 元件样式
│   │   ├── iphone-preview.css            # iPhone预览框架样式
│   │   ├── section.css                   # 容器样式
│   │   └── variables.css                 # 变量定义
│   └── components/                       # 组件样式
│       ├── bar/                          # 栏类组件样式
│       │   ├── nav-bar.css
│       │   ├── phone-speaker.css
│       │   ├── search-bar.css
│       │   ├── status-bar.css
│       │   ├── tab-bar.css
│       │   └── top-tabs.css
│       ├── base/                         # 基础组件样式
│       │   ├── button-combination.css
│       │   ├── carousel.css
│       │   ├── scroll-picker.css
│       │   └── tag-button.css
│       ├── business/                     # 业务组件样式
│       │   ├── amount-display.css
│       │   ├── card-id-upload.css
│       │   ├── product-card.css
│       │   ├── product-detail.css
│       │   └── steps.css
│       ├── feedback/                     # 反馈类组件样式
│       │   ├── bottom-popup-actionsheet.css
│       │   ├── bottom-popup-gradient.css
│       │   ├── bottom-popup-icons.css
│       │   ├── bottom-popup-password.css
│       │   ├── bottom-popup-sms.css
│       │   ├── bottom-popup-text.css
│       │   ├── bottom-popup-title.css
│       │   ├── bottom-popup-wheel.css
│       │   ├── complex-dialog.css
│       │   ├── dialog.css
│       │   ├── empty-page.css
│       │   └── result-page.css
│       └── form/                         # 表单类组件样式
│           ├── date-filters.css
│           ├── filters.css
│           ├── form-options.css
│           ├── form.css
│           └── special-inputs.css
```


## 元件分类说明（element.html 全量罗列）

元件是构成界面的最基础UI元素，通常不包含业务逻辑，适用于多种场景。主要分为以下几类：

### 1. 按钮元件
- 大/中/小尺寸，主/次/辅助/禁用等多种状态的按钮

### 2. 选择与开关元件
- 选择框（checkbox）
- 普通/带开关的输入框

### 3. 文本选项元件
- 单行文本选项按钮
- 双行文本选项按钮
- 单/双行文本选项（有无图标、选中/未选中）

### 4. 折叠与分割元件
- 折叠器（展开、收起、带文字和图标）
- 模块分割线、元素分割线

### 5. 标签与徽章元件
- 产品详情标签、回底部标签
- 属性标签（金色、蓝色、橘黄）
- 状态标签（待办事项、私享产品等）
- 额度标签（列表额度、详情额度）

### 6. 装饰与品牌元件
- 电子印章
- IP形象

### 7. 提示与反馈元件
- 辅助提示、强调提示（含带关闭按钮、带图标等）
- 一般提示（含带下拉箭头）
- Toast（加载、信息提示）
- 气泡提示

### 8. 表单输入元件
- 普通输入框（含禁用、带图标、带操作描述、带开关等多种变体）
- 双行文本输入框（含带图标、带开关等多种变体）
- 金额输入
- 输入框错误提示、辅助提示
- 验证码输入框（普通、独立、已输入等状态）
- 交易密码输入框（普通、已输入、点状密码等）

### 9. 滚动与日期选择元件
- 日期滚动选择器
- 滚动选择器（一列/两列/三列）

### 10. 列表与选项元件
- 常规列表标题、列表项
- 双行文本列表项（含带类型）

### 11. 特殊元件
- 数字安全键盘
- 遮罩层元件


## 组件清单（components.html 全量罗列）

### 基础组件
- 一行两个按钮组合
- 一行三个按钮组合
- 带图标的单按钮
- 带图标的双按钮
- 全宽按钮
- 底部按钮组件（带复选框和按钮）
- 折叠器（展开、收起、带文字和标记）
- 轮播组件-点状（小型/大型）
- 轮播组件-条状
- 右侧漂浮按钮——产品详情
- 右侧漂浮按钮——回底部
- 横向步骤条（默认/带进度/双文本/双文本带进度）
- 竖向步骤条（默认/带进度）
- 常规列表
- 常规类标无标题-带展开
- 双行文本列表项（无类型/带类型）

### 导航与定位组件
- 导航栏-白色背景-右侧图标按钮
- 导航栏-白色背景-右侧操作按钮
- 导航栏-透明背景-左侧图标按钮
- 导航栏-透明背景-右侧操作按钮
- 手机话筒
- 搜索栏（有取消按钮/有清除图标/输入状态/透明背景-右侧操作按钮）
- 状态栏（白色背景/透明背景）
- 底部tab栏（首页/财富/贷款/生活/我的）
- 顶部Tabs（一类/二类/一级/二级）

### 金融业务展示组件
- 基础金额展示（带显示隐藏金额/无显示隐藏金额）
- 组合样式（三栏金额展示/两栏金额展示/带按钮的金额展示）
- 上传银行卡
- 卡片选择样式
- 上传身份证
- 一级页面列表样式
- 二级页面列表样式
- 一级页面卡片
- 一级页面卡片轮播
- 产品详情（两栏/三栏/有图标和带下拉箭头的一般提示）

### 弹窗与提示组件
- 底部弹窗-标题（单行文本/双行文本）
- 底部弹窗-验证码和交易密码（默认/输入状态）
- 底部弹窗-图标按钮（两图标/三图标）
- 底部弹窗-选项列表（基础/带图标/带副标题/带图标和副标题）
- 底部弹窗-操作表单（基础/最后一个是取消按钮）
- 底部弹窗-交易密码（基础/有错误提示/有辅助提示）
- 底部弹窗-短信验证码（基础/错误提示）
- 底部弹窗-文本式（同意按钮默认/按钮禁用状态）
- 底部弹窗-滚轮选择器（单列/两列/三列/时间范围）
- 弹层组件（长文本类型/卡片信息类型/基础单按钮/辅助描述/强调描述/输入框/双按钮/垂直按钮排列/垂直三按钮/垂直四按钮）

### 其他组件
- 空白页组件（基础/带按钮）
- 基础结果页
- 带描述结果页


## 样式组织

样式目录结构与组件目录结构保持一致，方便样式与组件的对应关系：
- 基础样式放置在 `styles/base` 目录下
  - display-page.css 展示页面样式，在使用组件搭建页面时不使用此css样式
  - element.css 元件样式
  - iphone-preview.css iPhone预览框架样式
  - section.css 容器样式
  - variables.css 变量定义
- 组件样式放置在 `styles/components` 目录下，并按组件类型进行分类

## 布局规范

### 1. 容器职责划分

#### 1.1 Section 级别（外层容器）
- 控制整体宽度
- 设置模块背景色
- 控制与浏览器边框的间距
- 管理模块之间的间距，在section.css样式中并没有模块间距样式，需要根据实际需求写在html中

#### 1.2 容器级别（中层容器）
- 控制模块内部布局结构
- 管理内容之间的间距
- 不设置与浏览器边框的间距

#### 1.3 内容级别（内层容器）
- 负责元素或子模块的样式
- 控制背景色、圆角、边框等装饰样式
- 不设置容器级别的间距

### 2. 间距规范

#### 2.1 模块间距
- 模块上下之间标准间距：10px
- 使用 margin-bottom 控制模块间距
- 避免使用 padding 控制模块间距

#### 2.2 容器宽度
- 标准模块容器宽度：343px
- 左右边距：var(--spacing-lg)
- 全屏宽度：375px

### 3. 常见问题与解决方案

#### 3.1 边距叠加问题
- 避免在多个嵌套层级同时设置同目的的边距
- 外层容器负责整体布局和间距
- 内层容器专注于内容布局

#### 3.2 容器嵌套原则
- 避免重复设置与浏览器边框的间距
- 避免 section.css 嵌套使用
- 保持容器层级的职责划分

### 4. 注意事项

1. 避免在内容容器中设置与浏览器边框的间距
2. 模块之间统一使用 10px 的间距
3. 注意容器层级的职责划分
4. 保持样式的一致性和可维护性
5. 弹层样式需要单独处理
6. 禁止子容器宽度+边距+边框超出父容器宽度
7. 内容级别容器增加左右padding要慎重
8. 所有自定义容器、卡片、内容区等样式，必须加上box-sizing: border-box;

## 资源管理

静态资源统一放置在 `assets` 目录下：
- 图标资源：`assets/icons`
- 图片资源：`assets/images`


## JavaScript说明

本项目的 JavaScript 文件统一放置在 `src/js/` 目录下，结构与组件分类保持一致，便于维护和查找。

### 目录结构
- js/bar/      # 栏类组件相关JS（如导航栏、标签栏等）
- js/base/     # 基础组件相关JS
- js/business/ # 业务组件相关JS
- js/feedback/ # 反馈类组件相关JS
- js/form/     # 表单类组件相关JS

### 主要说明
- 每个组件的 JS 文件负责该组件的交互逻辑、事件绑定、状态切换等。
- JS 文件命名与 HTML 组件文件保持一致，便于一一对应。
- 组件 JS 通常以全局对象或模块方式暴露接口，便于页面调用。

### 典型组件 JS 接口示例

#### tab-bar.js（底部标签栏）
- 通过 `TabBar.init({defaultActiveTab: 'home'})` 初始化标签栏
- 通过 `TabBar.setActiveTab(selector, tabName)` 切换指定tab
- 通过 `TabBar.getConfig()` 获取当前配置
- 支持 HTML 属性、URL参数、JS配置多种激活优先级
- 监听 `tabChange` 事件响应tab切换

#### top-tabs.js（顶部标签栏）
- 通过 `TopTabs.init()` 初始化标签栏
- 通过 `TopTabs.setActiveTab(selector, index)` 切换指定tab
- 通过 `TopTabs.getActiveTab(selector)` 获取当前激活tab索引
- 监听 `topTabChange` 事件响应tab切换

### 事件监听通用写法
```js
// 监听tab切换
// tab-bar
 document.addEventListener('tabChange', function(e) {
   console.log('Tab切换到:', e.detail.tabName, '索引:', e.detail.tabIndex);
 });
// top-tabs
 document.addEventListener('topTabChange', function(e) {
   console.log('TopTab切换到:', e.detail.tabIndex);
 });
```

### 其他说明
- 业务组件、表单组件等JS文件，通常只在对应页面或业务场景下按需引入。
- 如需自定义交互，可参考各组件js文件的接口和事件。


## 注意事项

1. **组件结构与内容**
   - 使用 @components.html 组件时，**不能改变组件结构**，只能修改内容。要把组件代码完整复制过来再修改内容。
   - 复制组件代码后，如果有不需要的内容（文字、图片、图标、元件等），可以把内容删掉，但**必须保持组件代码结构**不变。
   - 使用组件时，**务必同时引入该组件对应的 CSS 样式文件**，否则组件将无法正常显示预期效果。

2. **元件与容器**
   - 元件是容器中的基础UI元素，**没有自带容器**，需要放在 section.css 对应的容器或自定义容器中。
   - 多个组件和元件混合组装时，**不能直接给外层容器使用 section.css**，避免 section.css 嵌套 section.css。可以自定义外层容器样式，或只给需要的部分加 section.css。

3. **组件/元件命名规范**
   - 复制组件或元件时，如需自定义 class 名称，建议遵循统一命名规范，避免与原有样式冲突，保证样式可控、易维护。

4. **页面结构与容器**
   - 页面由多个独立组件组成，**组件之间一般不嵌套**（底部弹窗的标题栏等特殊情况除外），每个组件自成体系，互不干扰。
   - 元件和组件组合时，建议统一放在一个容器或自定义容器内，**保持页面结构清晰**，便于维护。

5. **图片与资源路径**
   - **确保使用组件时图片资源路径正确**，避免图片丢失或加载异常。

6. **内容为空的处理**
   - 使用组件时，如果需求没有相关文字内容和图片内容，内容可以为空，**但不能删除父级容器**，以保证结构完整。

7. **页面预览规范**
   - 由组件和元件拼装生成的每一个页面，**都必须嵌入到 `iphone-preview.html` 的 `<div class="content-area">` 区域内进行浏览和校验**，以保证页面在手机端的真实展示效果。

8. **资源图、插画和图标使用规范**

   - 所有图片、插画、图标均需本地化存储，禁止直接外链。
   - 图片路径使用绝对路径。
   - 资源命名需简洁明了，便于维护和查找。
   - 后续可以使用download_pixabay_images.py文件轮训相关文件夹文件批量从 https://pixabay.com 网站搜索、下载资源图片。需要html图片中需要添加相关图片需求参数例如：<img class="branch-detail-staff-avatar" data-pixabay='{"q": "营销人员", "lang": "zh", "image_type": "photo", "colors": "blue", "category": "people"}' src="/downloaded_images/营销人员.jpg"/>
   

## Pixabay图片下载API主要参数说明

| 参数名         | 类型   | 说明                                                                 |
| -------------- | ------ | -------------------------------------------------------------------- |
| key            | str    | 必填，API Key                                                        |
| q              | str    | 搜索关键词，需 URL 编码，最大 100 字符                               |
| lang           | str    | 搜索语言，默认 "en"，支持多种语言（如 zh、en、ja、fr 等）           |
| image_type     | str    | 图片类型，"all"（默认）、"photo"、"illustration"、"vector"         |
| orientation    | str    | 图片方向，"all"（默认）、"horizontal"、"vertical"                   |
| category       | str    | 图片类别，如 business、nature、people、food、travel 等               |
| min_width      | int    | 最小宽度，默认 0                                                     |
| min_height     | int    | 最小高度，默认 0                                                     |
| colors         | str    | 颜色筛选，支持多种颜色英文单词，如 red、blue、green、black、white 等 |
| editors_choice | bool   | 是否只返回编辑推荐图片，默认 false                                   |
| safesearch     | bool   | 是否只返回适合所有年龄的图片，默认 false                             |
| order          | str    | 排序方式，"popular"（默认）、"latest"                                |
| page           | int    | 分页，默认 1                                                         |
| per_page       | int    | 每页返回数量，3-200，默认 20                                         |

**category 参数支持的类型（官方文档）：**

backgrounds、fashion、nature、science、education、feelings、health、people、religion、places、animals、industry、computer、food、sports、transportation、travel、buildings、business、music

9. **使用组件库开发页面时新增样式处理**

   - 不能修改组件库中任何文件html、css、js等文件。如果要修改新增css样式。
   - 不要把项目css文件放到组件库中，存放项目html目录里增加一个styles文件夹，存放新的样式文件。

