#!/bin/bash

# 提交更新到Git
read -p "请输入提交信息: " commit_message

# 获取当前的版本号
# 最大99.9.9
version=$(cat package.json | grep -m1 version | awk -F: '{print $2}' | sed 's/[", ]//g')

# 将版本号按照 . 分隔为三个部分，并转换成整数
major=$(echo $version | cut -d. -f1)
minor=$(echo $version | cut -d. -f2)
patch=$(echo $version | cut -d. -f3)
version_number=$((major*100 + minor*10 + patch))

# 计算新的版本号
version_number=$((version_number + 1))
major=$((version_number / 100))
minor=$(((version_number / 10) % 10))
patch=$((version_number % 10))

# 更新package.json中的版本号
sed -i "s/\"version\": \"$version\"/\"version\": \"$major.$minor.$patch\"/g" package.json


branch_name=$(git symbolic-ref --short HEAD)
git add .
git commit -m "[$branch_name] $major.$minor.$patch $commit_message"
git tag -a "$major.$minor.$patch" -m "$major.$minor.$patch"

echo "版本号已更新为 $major.$minor.$patch，并提交到Git并设置tag。"
