# Git不完全指南

[Learn Git Branching](https://learngitbranching.js.org/?locale=zh_CN)

## git 命令

> git 不太常用和常用的自己不熟悉的指令大全
> git cli learn <https://learngitbranching.js.org/?locale=zh_CN>
> 如果想看 HEAD 指向，可以通过 `cat .git/HEAD` 查看， 如果 HEAD 指向的是一个引用，还可以用 `git symbolic-ref HEAD`

tips：windows 中 `^` 代表换行，在使用 `HEAD^` 时，可以用引号包裹`"HEAD^"`，或使用 `~1` 替代

### remote

``` bash
# 添加远程仓库地址
$ git remote add origin <url>

# 重置远程仓库地址
$ git remote set-url origin <url>

# 查看 git fetch/push 仓库地址
$ git remote -v

# 更新本地远程仓库列表
$ git remote update origin --prune
```

### add

``` bash
# 将指定文件或目录暂存
$ git add [file|dir]

# 提交新文件(new)和被修改(modified)文件，不包括被删除(deleted)文件
$ git add . # 他会监控工作区的状态树，使用它会把工作时的所有变化提交到暂存区，包括文件内容修改(modified)以及新文件(new)，但不包括被删除的文件。

# 提交被修改(modified)和被删除(deleted)文件，不包括新文件(new)
$ git add -u # 他仅监控已经被add的文件（即tracked file），他会将被修改的文件提交到暂存区。add -u 不会提交新文件（untracked file）。（git add --update的缩写）
# 提交所有变化
$ git add -A # 是上面两个功能的合集（git add --all的缩写）

# 查看暂存区文件
$ git ls-files 

# 删除暂存区文件
$ git rm --cache <filename>
```

### commit

``` bash
# 提交
$ git commit -m "<update>"

# 不进行规则校验
$ git commit --no-verify -m "<update>"

# 空提交
$ git commit --allow-empty -m "<update>"

# 对上一次的提交进行修改
$ git commit --amend
```

### diff

``` bash
# 查看变更
$ git diff
# 查看 filename 具体有那些修改
$ git diff <filename>
```

### status

``` bash
# 查看git当前状态
$ git status 
```

### stash

``` bash
# 将工作区储藏起来，等以后恢复后继续工作
$ git stash 

# 存储工作区并添加说明
$ git stash save [message]

# 查看存储的工作区
$ git stash list

# 恢复第n条工作区内容, 默认第一条
$ git stash apply [stash@{n}]

# 删除第n条工作区内容, 默认第一条
$ git stash drop [stash@{n}]

# 清空工作区存储
$ git stash clear

# 弹出第n条工作区内容, 默认第一条
$ git stash pop [stash@{n}]

# 存储工作区，类似git save
$ git stash push [-m | --message <message>]

# 查看stash差异 [-p]查看变更详情
$ git stash show [-p]

# 根据指定的 stash 创建一个新的分支，然后删除该 stash
$ git stash branch <branchName> [stash@{n}]
```

### fetch

> 本地仓库中的远程分支更新成了远程仓库相应分支最新的状态。

``` bash
# 获取远程主机所有更新
$ git fetch

# 获取指定分支更新
$ git fetch origin <branchName|tagName>

# 以远程分支|标签为基准切换分支
$ git fetch origin <localBranchName>:<originBranchName>
```

### log

``` bash
# 查看最近提交日志
$ git log

# 单行显示提交日志
$ git log --pretty=oneline

# 查看分支合并图
$ git log --graph --pretty=oneline --abbrev-commit
```

### show

``` bash
# 查看某次提交记录或标签记录
$ git show <HEAD|branchName|commitId>[^|~]] | tagname
```

### reflog

``` bash
# 查看命令的历史，可以找到git log看不到的commitID
# 因为git log只显示当前的提交日志，如果你提交了一次，退回版本后又后悔了，就能查看上次提交的commitID
$ git reflog
```

### branch

``` bash

# 查看本地分支
$ git branch

# 查看远程分支
$ git branch -r

# 查看所有分支
$ git branch -a

# 重命名分支
$ git branch -m <oldName> <newName>
$ git push origin <newName>

# 定义本地默认对应的远程分支, 即 git push 不指定分支，则按默认分支进行推送
# git version: 2.15.2 新版本修改了 --set-upstream 命令
# the '--set-upstream' option is no longer supported. Please use '--track' or '--set-upstream-to' instead.
# --set-upstream-to 简写 -u
$ git branch --set-upstream <remote-branch>
# 等同于
$ git branch -u <remote-branch>

# 删除分支 | 强制删除分支
$ git branch -d|-D <branchName>

# 新建分支
$ git branch <branchName>

# 将分支指向另一个提交[参考git checkout]
$ git branch -f <branchName> <HEAD|branchName|commitID>

# 关联远程仓库
$ git branch --set-upstream branch-name origin/branch-name
```

### checkout

``` bash
# 切换分支
$ git checkout <branchName>

# 新建分支并切换到该分支
$ git checkout -b <branchName>

# 新建远程分支到本地
$ git checkout -b <localBranchName> origin/<originBranchName>

# 分离HEAD 指向指定提交记录
$ git checkout <commitID>

# 向上移动head, 从指定提交节点向上移动n位（n为‘^’个数）
$ git checkout <HEAD|branchName|commitID>^
$ git checkout <HEAD|branchName|commitId>^^

# 向上移动head, 从指定提交节点向上移动n位
$ git checkout <HEAD|branchName|commitId>~<n>

```

### reset & git revert

- git reset 通过把分支记录回退几个提交记录来实现撤销改动。你可以将这想象成“改写历史”。git reset 向上移动分支，原来指向的提交记录就跟从来没有提交过一样。
- git revert 虽然在你的本地分支中使用 git reset 很方便，但是这种“改写历史”的方法对大家一起使用的远程分支是无效的哦！  
为了撤销更改并分享给别人，我们需要使用 git revert。

``` bash
# 撤销提交 回滚历史记录 (git log 无记录，可以通过git reflog 查看记录)
$ git reset <HEAD|branchName|commitId>[^|~]

# 仅仅只是撤销已提交的版本库，不会修改暂存区和工作区
$ git reset --soft <HEAD|branchName|commitId>[^|~]

# 仅仅只是撤销已提交的版本库和暂存区，不会修改工作区
$ git reset --mixed <HEAD|branchName|commitId>[^|~]

# 彻底将工作区、暂存区和版本库记录恢复到指定的版本库
$ git reset --hard <HEAD|branchName|commitId>[^|~]

# 撤销提交 生成新的提交记录
$ git revert <HEAD|branchName|commitId>[^|~]
```

### tag

``` bash
# 查看所有标签
$ git tag

# 创建标签 默认当前，可指定某次提交
$ git tag <tagName> [<HEAD|branchName|commitId>[^|~]]

# 删除标签
$ git tag -d <tagName>

# 添加标签备注
$ git tag -a <tagName> -m <tagMessage>

# 提交标签
$ git push origin <tagName> # 提交指定标签

$ git push origin --tags    # 提交本地所有标签

# 缩略commitID并单行显示提交信息
$ git log --pretty=oneline --abbrev-commit
```

### push

``` bash
# 提交远程并关联
$ git push -u 

# 提交分支|标签
$ git push origin <branchName> | <tagName>

# 提交本地所有分支到远程
$ git push origin --tags

# 删除远程分支|标签
$ git push origin --delete <branchName> | <tagName>

# 将远程分支代码拉取到本地
$ git pull origin <originBranchName>:<localBranchName>
```

### merge

``` bash
# 合并指定分支到当前分支
$ git merge <branchName>
```

### cherry-pick

``` bash
# 自由修改提交树
# 将指定的提交复制到当前分支下
$ git cherry-pick <HEAD|branchName|commitId>[^|~]...
```

### rebase

交互式 rebase 指的是使用带参数 --interactive 的 rebase 命令, 简写为 -i

``` bash
git rebase -i
```

## .gitignore 语法

**语法解释**

在 .gitignore 文件中，每一行的忽略规则的语法如下：  

1. 空格不匹配任意文件，可作为分隔符，可用反斜杠转义；

2. 以“＃”开头的行都会被 Git 忽略。即#开头的文件标识注释，可以使用反斜杠进行转义；

3. 可以使用标准的`glob`模式匹配。所谓的`glob`模式是指shell所使用的简化了的正则表达式；

4. 以斜杠 "/" 开头表示目录；"/" 结束的模式只匹配该文件夹以及在该文件夹路径下的内容，但是不匹配该文件；"/"开始的模式匹配项目跟目录；如果一个模式不包含斜杠，则它匹配相对于当前 .gitignore 文件路径的内容，如果该模式不在 .gitignore 文件中，则相对于项目根目录；

5. 以星号 "*" 通配多个字符，即匹配多个任意字符；使用两个星号 "**" 表示匹配任意中间目录，比如`a/**/z`可以匹配 a/z, a/b/z 或 a/b/c/z等；

6. 以问号"?"通配单个字符，即匹配一个任意字符；

7. 以方括号“ [] ”包含单个字符的匹配列表，即匹配任何一个列在方括号中的字符。比如[abc]表示要么匹配一个a，要么匹配一个b，要么匹配一个c；如果在方括号中使用短划线分隔两个字符，表示所有在这两个字符范围内的都可以匹配。比如[0-9]表示匹配所有0到9的数字，[a-z]表示匹配任意的小写字母）；

8. 以叹号"!"表示不忽略(跟踪)匹配到的文件或目录，即要忽略指定模式以外的文件或目录，可以在模式前加上惊叹号（!）取反；

**例子**

``` bash
#注释           .gitignore的注释

*.txt           # 忽略所有 .txt 后缀的文件
!src.a          # 忽略除 src.a 外的其他文件
/todo           # 仅忽略项目根目录下的 todo 文件，不包括 src/todo
build/          # 忽略 build/目录下的所有文件，过滤整个build文件夹；
doc/*.txt       # 忽略doc目录下所有 .txt 后缀的文件，但不包括doc子目录的 .txt 的文件
  
bin/:           # 忽略当前路径下的 bin 文件夹，该文件夹下的所有内容都会被忽略，不忽略 bin 文件
/bin:           # 忽略根目录下的 bin 文件
/*.c:           # 忽略 cat.c，不忽略 build/cat.c
debug/*.obj:    # 忽略debug/io.obj，不忽略 debug/common/io.obj和tools/debug/io.obj
**/foo:         # 忽略/foo, a/foo, a/b/foo等
a/**/b:         # 忽略a/b, a/x/b, a/x/y/b等
!/bin/run.sh    # 不忽略bin目录下的run.sh文件
*.log:          # 忽略所有 .log 文件
config.js:      # 忽略当前路径的 config.js 文件
  
/mtk/           # 忽略整个文件夹
*.zip           # 忽略所有.zip文件
/mtk/do.c       # 忽略某个具体文件
```

## problem

``` bash
error: cannot lock ref 'refs/remotes/origin/master': unable to resolve reference 'refs/remotes/
```

``` bash
rm .git/refs/remotes/origin/master
```

## 参考文献

[git 常用命令](https://www.cnblogs.com/xiaogangfan/p/6038597.html)

[Pro Git（中文版）](http://git.oschina.net/progit/)

[Ignoring files](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files)
