#!/bin/bash
set -x

#if [ $# -ne 3 ];then
#    echo -e "Usage: \e[33;1m./$0 [tag branch|none setenv]\e[0m"
#    exit 5
#fi

function BUILD {
    nvm use --delete-prefix v11.14.0
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
      git remote prune origin
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
}

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

TEST_DIR="/data/nfs/kaikeba/cms_www"
PRE_DIR="/data/nfs/kaikeba/kkb-crm/pre/cms_www/www_${tag}"
PROD_DIR="/data/nfs/kaikeba/kkb-crm/prod-new/cms_www/www_${tag}"

if [ ${setenv} == test ];then
    BUILD
    rsync -av /data/nfs/kaikeba/kkb-cms/{build/*,public} ${TEST_DIR}
elif [ ${setenv} == pre ];then
    if [ -d "${PRE_DIR}" ];then
        ln -svTf ${PRE_DIR}/www_${tag} ${PRE_DIR}/www
        if [ $? -eq 0 ];then
            echo "rollback Success. ======> ${tag}"
            exit 0
        else
            echo "rollback Failure."
            exit 2
        fi
    else
        BUILD
        rsync -av /data/nfs/kaikeba/kkb-crm/pre/kkb-cms/{build/*,public} ${PRE_DIR}/
        ln -svfT ${PRE_DIR} ${PRE_DIR%_*}
        echo "Update Success. ===== ${tag}"
        exit 0
    fi
elif [ ${setenv} == prod ];then
    if [ -d "${PROD_DIR}" ];then
        ln -svTf ${PROD_DIR}/www_${tag} ${PROD_DIR}/www
        if [ $? -eq 0 ];then
            echo "rollback Success. ======> ${tag}"
            exit 0
        else
            echo "rollback Failure."
            exit 3
        fi
    else
        BUILD
        rsync -av /data/nfs/kaikeba/kkb-crm/prod-new/kkb-mos/{build/*,public} ${PROD_DIR}
        ln -svfT ${PROD_DIR} ${PROD_DIR%_*}
        echo "Update Success. ===== ${tag}"
        exit 0
    fi
else
    echo -e "setenv: $setenv error."
    exit 4
fi
