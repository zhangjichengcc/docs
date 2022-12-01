/*
 * @Author: zhangjicheng
 * @Date: 2022-12-02 00:07:18
 * @LastEditors: zhangjicheng
 * @LastEditTime: 2022-12-02 00:47:04
 * @FilePath: /docs/.cz-config.js
 */
module.exports = {
  types: [
    {value: 'update',      name: 'Update:         更新 更新文章'},
    {value: 'add docs',    name: 'Docs:           文档 新增文章'},
    {value: 'merge',       name: 'Merge:          合并 合并代码'},
    {value: 'fix',          name: 'Fix             修复 修复一个Bug'},
    {value: 'feat',        name: 'Feat:           特性 一个新的特性'},
    {value: 'style',       name: 'Style:          格式 空格, 分号等格式修复'},
    {value: 'refactor',    name: 'Refactor:       重构 代码重构，注意和特性、修复区分开'},
    {value: 'revert',      name: 'Revert:         回滚 代码回退'}
  ],
  scopes: [
    {value: 'framework',   name: 'Framework:      框架'},
    {value: 'knowledge',   name: 'Knowledge:      知识点'},
    {value: 'memorandum',  name: 'Memorandum:     备忘录'},
    {value: 'performance', name: 'Performance:    优化'},
    {value: 'total',       name: 'Total:          项目整体'},
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
    scope: '选择一个scope (可选):',
    // used if allowCustomScopes is true
    // customScope: '选择变更范围(可选):',
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