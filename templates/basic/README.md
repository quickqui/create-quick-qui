# <%= name %>

Quick-qui 应用模版项目生成成功。

## 本应用模版

本应用模版项目类型为 - <%= template%>，应用类型可以在生成时通过传入参数选择，默认为 `default` - 
```
npm init quick-qui [template]
```

关于应用类型及其进一步信息参考Quick-qui主文档 - https://github.com/quickqui/main  

## 运行
0. 首先 - 
```
npm install
```
1. 开发模式 - 用于模型开发者和应用开发者进行调试。  
model和extension代码以目录形式挂载于docker image，更改可以即时更新。
```
npm run compose:up
```
2. 生产模式 - 用于发布于测试环境和生产环境，  
将model和extension以docker image形式打包，对CI/CD比较友好。
```
npm run docker:build
npm run compose:up-prod
```

3. （Quick-qui开发者模式）- 用于开发和调试Quick-qui本身。  
(TODO)


## 模型开发

参照Quick-qui主文档 - https://github.com/quickqui/main 

已生成的项目内容包括 -

1. `./package.json ./tsconfig.json ./.gitignore` 如它们的名字所描述，没有特别的。
1. `./README.md` 本文档。
2. `./*-dev.yml ./*-pro.yml` 两个docker compose配置文件，分别对应于开发模式和生产模式。
3. `./cpToDir.sh ./Dockerfile` 两个用于将本项目打包为docker image的文件。
4. `./modelserver.http` 方便调试模型的一个文件，可以帮助访问model-server
5. `./model ./src` 模型所在的目录，分别对应模型定义和模型扩展所需的源代码。


## License

<%= license %>