#!/bin/bash
set -x

starttime=`date +'%Y-%m-%d %H:%M:%S'`
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

nvm use v11.14.0
# update source code
if [ $tag = "none" ]; then
  git pull origin
  git stash
  git status
  git diff
  git checkout .
  git checkout $branch
  git pull
else
  git fetch --tags
  git checkout master
  git stash
  git checkout $tag
fi

npm install
echo 'current env is' $setenv
npm run $setenv &> /tmp/test.txt

# sync
DST_DIR="/data/nfs/kaikeba/kkb-crm/pre/cms_www"
rsync -av /data/nfs/kaikeba/kkb-crm/pre/kkb-cms/build/* ${DST_DIR}
rsync -av /data/nfs/kaikeba/kkb-crm/pre/kkb-cms/public ${DST_DIR}

grep -E "Failed to compile|Cannot find module" /tmp/test.txt

if [ $? -eq 0 ]; then
  cat /tmp/test.txt
  num=1
else
  num=0
fi

endtime=`date +'%Y-%m-%d %H:%M:%S'`
END_TIME=$(date +%s)
ELAPSED_TIME=$((END_TIME - START_TIME))

s_to_minute=60
RUN_MINUTE=`echo "scale=2; $ELAPSED_TIME/$s_to_minute" | bc`
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
