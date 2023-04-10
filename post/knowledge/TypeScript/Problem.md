# Problem

## tsconfig.json 报 “无法写入文件,因为他会覆盖输入文件”

- 问题原因

使用了 `"allowJs": true` 这一项

- 解决方法

将 `"outDir"` 这一项指向打包的文件夹

``` diff
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "importHelpers": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "sourceMap": true,
    "baseUrl": "./",
    "strict": true,
    "paths": {
      "@/*": ["src/*"],
      "@@/*": ["src/.umi/*"]
    },
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": false,
    "allowJs": true,
+   "outDir": "dist"
  },
  // ...
}
```
