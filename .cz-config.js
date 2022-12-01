/*
 * @Author: zhangjicheng
 * @Date: 2022-12-02 00:07:18
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2022-12-02 00:12:36
 * @FilePath: /docs/.cz-config.js
 */
module.exports = {
  types: [
    {value: 'update',    name: 'update:      更新 更新文章'},
    {value: 'add docs',  name: 'docs:        文档 新增文章'},
    {value: 'merge',     name: 'merge:       合并 合并代码'},
    {value: 'fix',        name: 'fix:          修复 修复一个Bug'},
    {value: 'feat',      name: 'feat:        特性 一个新的特性'},
    {value: 'style',     name: 'style:       格式 空格, 分号等格式修复'},
    {value: 'refactor',  name: 'refactor:    重构 代码重构，注意和特性、修复区分开'},
    {value: 'revert',    name: 'revert:      回滚 代码回退'}
  ],
  scopes: [
    {name: 'framework(框架)'},
    {name: 'knowledge(知识点)'},
    {name: 'memorandum(备忘录)'},
    {name: 'performance(优化)'}
  ],
  // it needs to match the value for field type. Eg.: 'fix'
  /*  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },  */
  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    // scope: '选择一个scope (可选):',
    // used if allowCustomScopes is true
    customScope: '选择变更范围(可选):',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    // breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?'
  },
  allowCustomScopes: true,
  // allowBreakingChanges: ['特性', '修复'],
  // limit subject length
  subjectLimit: 100
};