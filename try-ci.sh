#!/bin/bash
set -x
#!/bin/bash
START_TIME=$(date +%s)
## do something 
npm run test
# sleep 3
END_TIME=$(date +%s)
ELAPSED_TIME=$((END_TIME - START_TIME))

s_to_minute=60
RUN_MINUTE=`echo "scale=2; $ELAPSED_TIME/$s_to_minute" | bc`
echo "Runtime: $ELAPSED_TIME seconds"
echo "Runtime: $RUN_MINUTE minute"

setenv=test
curl 'https://oapi.dingtalk.com/robot/send?access_token=b71e42428a5d9d75dfe96605626be60ac7aab3c663bb1d293dfac7f2c8ee86a4' \
   -H 'Content-Type: application/json' \
   -d '{"msgtype": "text", 
        "text": {
             "content":
             "try ci 环境构建成功，花费时间：'$RUN_MINUTE'分钟"
        }
      }'
