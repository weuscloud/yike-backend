#!/bin/bash

version=$(cat package.json | grep -m1 version | awk -F: '{print $2}' | sed 's/[", ]//g')
# 读取版本号
major=$(echo $version | cut -d. -f1)
minor=$(echo $version | cut -d. -f2)
patch=$(echo $version | cut -d. -f3)

# 提交更新到Git
read -p "请输入提交信息: " commit_message
branch_name=$(git symbolic-ref --short HEAD)
git add .
git commit -m "$commit_message $branch_name $major.$minor.$patch"
git tag -a "$major.$minor.$patch" -m "版本号 $major.$minor.$patch"

# 推送到远程分支
remote_branch="origin/$branch_name"
if git rev-parse --verify "$remote_branch" >/dev/null 2>&1; then
  git push
else
  read -p "远程分支 $remote_branch 不存在，请输入要推送到的远程地址仓库名称: " remote_name
  git remote add origin "$remote_name"
  git push -u origin "$branch_name"
fi

