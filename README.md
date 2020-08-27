# moleculer-mysql-service-generator

读取 mysql 表结构并生成 moleculer 服务，用于迁移现有项目到 moleculer

read mysql table structures and generate moleculer services, used to port existing project to moleculer

## 使用 | useage

在你的 moleculer 项目目录下按提示输入  | inside your moleculer project path

```
npx moleculer-mysql-service-generator

# prompt: path for generated restful files (services):  (services)
# prompt: where your mysql hosts? (localhost):  (localhost)
# prompt: on port? (3306):  (3306)
# prompt: user? (root):  (root)
# prompt: password? (empty):
# prompt: database? (test):  (test)
# prompt: charset? (utf8):  (utf8)
# done! files generated in services
```

然后运行 | then run 

```
npm run dev
```

新的服务就会随之启动 | the new services will up