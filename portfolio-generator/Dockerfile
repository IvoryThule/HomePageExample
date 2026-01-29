FROM nginx:alpine

# 安装Node.js用于构建
RUN apk add --no-cache nodejs npm

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 复制构建结果到nginx目录
RUN cp -r dist/* /usr/share/nginx/html/

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]