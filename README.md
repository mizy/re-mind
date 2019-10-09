# re-mind

a mind-map editor base on my-mind

# 基于My-Mind改造部分
* 部分css样式改造
* 部分canvas渲染逻辑改造
* 工程化改造
* 去除UI依赖
* 放大缩小改为transform方式
* 具体效果请查看dist下index.html的demo

# 调用
```
MM.App.init(document.getElementById("root"),{
	rootName:"未命名",
	data:{} // 数据
})
```

# 导出数据
```
MM.App.map.toJSON();
```