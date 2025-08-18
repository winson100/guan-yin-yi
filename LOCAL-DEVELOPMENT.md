# 本地开发环境与服务启动说明

为了方便本地预览和开发，建议在本地安装并使用 http-server 工具搭建静态网站服务。这样可以统一资源路径，模拟线上环境，避免路径问题。

---

## 1. 安装 Node.js

1. 访问 [nodejs.org](https://nodejs.org/) 下载并安装 LTS 版本。
2. 安装完成后，在终端输入 `node -v` 和 `npm -v` 检查是否安装成功。

## 2. 安装 http-server

1. 打开终端，输入以下命令全局安装 http-server：
   ```bash
   npm install -g http-server
   ```
   > 如遇权限问题，可先执行：
   > ```bash
   > npm config set prefix ~/.npm-global
   > export PATH=~/.npm-global/bin:$PATH
   > ```
   > 然后重新安装。

2. 或者直接用 npx 临时运行（无需全局安装）：
   ```bash
   npx http-server
   ```

## 3. 启动本地服务

1. 在项目根目录（如"手机银行4"）下运行：
   ```bash
   http-server
   ```
   或指定端口：
   ```bash
   http-server -p 9000
   ```

2. 终端会显示服务地址，如：
   ```
   Available on:
     http://localhost:8080
   ```

3. 在浏览器输入完整路径访问页面，例如：
   ```
   http://localhost:8080/src/components/components.html
   ```

## 4. 资源路径建议

- 推荐所有图片、JS、CSS 等资源引用使用绝对路径（如 `/src/assets/images/xxx.png`），避免相对路径带来的问题。

## 5. 常见问题

- 如果 http-server 命令找不到，请检查 PATH 设置，或用 npx 方式运行。
- 启动服务后，终端窗口需保持开启，服务才会持续运行。
- 访问页面如遇 404，请确认路径拼写和文件实际存在。

---

如有更多本地开发环境相关问题，欢迎补充！ 