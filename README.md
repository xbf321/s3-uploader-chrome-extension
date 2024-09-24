通过 Chrome 插件，把文件上传至 S3 服务器。

仅支持 AWS 协议的 S3 服务器。

## 使用方法

首先在 S3 配置 Tab 页，配置必要的 accessKeyId、secretAccessKey、endpoint、bucket 字段，就能上传成功至 S3 服务器，另外 fileDomain 也需要配置，不然返回的文件 URL 是不完整的。配置如下图。

![Config](https://static.ca01.cn/2024/09/1727164811114-config.png)

然后，就可以在 **文件上传** Tab 页进行文件上传。

![Upload](https://static.ca01.cn/2024/09/upload.png)

上传成功，返回结果，如下图所示，点击「复制」可以把文件连接粘贴到剪切板。

![Result](https://static.ca01.cn/2024/09/1727165768811-image.png)

## 本地开发

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

## 感谢

本插件基于[plasmo](https://docs.plasmo.com/)开发，开发过程很流畅，比自己手动按照官方教程效率高多了，推荐大家试试。
