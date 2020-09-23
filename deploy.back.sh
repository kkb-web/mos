#!/bin/bash
# set -x
START_TIME=$(date +%s)
if [ x$1 != x ]; then
  tag=$1
fi

if [ x$2 != x ]; then
  branch=$2
fi

if [ x$3 != x ]; then
  setenv=$3
fi

tag=${tag:-none}
branch=${branch:-develop}

nvm use --delete-prefix v11.14.0
# update source code
if [ $tag = "none" ]; then
  git pull origin
  git branch
  git remote prune origin
  git fetch origin
  git stash
  git status
  git diff
  git checkout .
  git checkout $branch
  git pull
else
  git checkout master
  git stash
  git pull
  git checkout $tag
fi

npm install
echo 'current env is' $setenv
npm run $setenv &> /tmp/test.txt

grep -E "Failed to compile|Cannot find module" /tmp/test.txt

if [ $? -eq 0 ]; then
  cat /tmp/test.txt
  num=1
else
  num=0
fi
DST_DIR="/data/nfs/kaikeba/cms_www/"
rsync -av /data/nfs/kaikeba/kkb-cms/build/* ${DST_DIR}
rsync -av /data/nfs/kaikeba/kkb-cms/public ${DST_DIR}

END_TIME=$(date +%s)
ELAPSED_TIME=$((END_TIME - START_TIME))

s_to_minute=60
RUN_MINUTE=`echo "scale=2; $ELAPSED_TIME/$s_to_minute" | bc`
echo endtime=`date +'%Y-%m-%d %H:%M:%S'`
echo "Runtime: $ELAPSED_TIME seconds"
echo "Runtime: $RUN_MINUTE minute"
curl 'https://oapi.dingtalk.com/robot/send?access_token=b71e42428a5d9d75dfe96605626be60ac7aab3c663bb1d293dfac7f2c8ee86a4' \
   -H 'Content-Type: application/json' \
   -d '{"msgtype": "text", 
        "text": {
             "content": "'${setenv}'环境构建成功，时间：'${RUN_MINUTE}分钟'"
        }
      }'
exit $num
