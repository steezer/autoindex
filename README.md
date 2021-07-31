# Nginx自动文件索引美化
## 简介
nginx自带的文件索引列表太过丑陋，这个项目用于美化文件索引，同时支持图片预览以及图片懒加载。

## 使用方法
* 第一步： 开启nginx的文件索引支持
```
vim /etc/nginx/nginx.conf
# 在http节点下新增一下代码
http {
    .......
    charset utf-8; 
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;
    ......
}

# 使配置生效
nginx -s reload
```

* 第二步：安装项目文件
```
# 切换到网站根目录下，然后执行如下命令
git clone https://github.com/steezer/autoindex.git
```

* 第三步：访问文件   
打开浏览器输入站点网址（默认显示项目文件）:   
http://localhost/autoindex/app.html，   
你也可以切换到其它目录：   
http://localhost/autoindex/app.html?dir=/images   
说明： dir后的参数“/images”即是相对于网站根目录下的路径名称，也可以使用相对路径，如：../images