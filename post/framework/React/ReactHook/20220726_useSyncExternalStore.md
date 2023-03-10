# useSyncExternalStore

@Author: 张吉成  
@Date: 2022-07-26

> `useSyncExternalStore` 的诞生并非偶然，和 v18 的更新模式下外部数据的 `tearing` 有着十分紧密的关联。`useSyncExternalStore` 能够让 React 组件在 `concurrent` 模式下安全地有效地读取外接数据源，在组件渲染过程中能够检测到变化，并且在数据源发生变化的时候，能够调度更新。当读取到外部状态发生了变化，会触发一个强制更新，来保证结果的一致性。

## 用法