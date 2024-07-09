echoIfContainerExcited() {

      BACKEND_CONTAINER_STATUS=$1
      FRONTEND_CONTAINER_STATUS=$2
      REDIS_CONTAINER_STATUS=$3

      if [ "$BLUE_STATUS" = "exited" ]; then
            sudo echo "컴포즈 빌드 에러 발생 $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/error.log
      fi

      if [ "$BACKEND_CONTAINER_STATUS" = "exited" ]; then
            sudo echo "백엔드 빌드 실패 $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/error.log
      fi

      if [ "$FRONTEND_CONTAINER_STATUS" = "exited" ]; then
            sudo echo "프론트엔드 빌드 실패 $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/error.log
      fi

      if [ "$REDIS_CONTAINER_STATUS" = "exited" ]; then
            sudo echo "레디스 빌드 실패 $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/error.log
      fi
}


moveFrontendStaticFile() {
      VERSION=$1
      sudo docker exec frontend-"${VERSION}" tar -czvf /frontend/dist/achieve_static_file.tar.gz -C /frontend/dist .
      sudo docker cp frontend-"${VERSION}":/frontend/dist/achieve_static_file.tar.gz /usr/share/nginx/html && echo "정적 파일 이동: achieve_static_file moved successfully!" >> /opt/deploy.log
      sudo tar -xzvf /usr/share/nginx/html/achieve_static_file.tar.gz -C /usr/share/nginx/html && echo "정적 파일 압축 해제: achieve_static_file tar successfully!" >> /opt/deploy.log
}


#!/usr/bin/env bash
REPOSITORY=/opt/achieve/project
cd $REPOSITORY

DOCKER_APP_NAME=achieve

EXIST_BLUE=$(sudo docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose-blue.yml ps | awk '{$1=""; $2=""; $3=""; $4=""; $5=""; print $0}' | sed 's/^[ \t]*//')


echo "======== 배포 시작일자: $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S') =========" >> /opt/deploy.log

if [ -z "$EXIST_BLUE" ]; then
  echo "blue 배포 시작 : $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/deploy.log

  sudo docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose-blue.yml up -d --build

  sleep 120

  BLUE_STATUS=$(sudo docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose-blue.yml ps | awk '{$1=""; $2=""; $3=""; $4=""; $5=""; print $0}' | sed 's/^[ \t]*//')

  BACKEND_CONTAINER_STATUS=$(sudo docker inspect backend-blue | grep '"Status":' | head -n 1 | awk -F: '{print $2}' | tr -d ' ",')
  FRONTEND_CONTAINER_STATUS=$(sudo docker inspect frontend-blue | grep '"Status":' | head -n 1 | awk -F: '{print $2}' | tr -d ' ",')
  REDIS_CONTAINER_STATUS=$(sudo docker inspect redis-blue | grep '"Status":' | head -n 1 | awk -F: '{print $2}' | tr -d ' ",')

  echo " " >> /opt/deploy.log

  echo "BLUE BACKEND STATUS: $BACKEND_CONTAINER_STATUS" >>  /opt/deploy.log
  echo "BLUE FRONTEND STATUS: $FRONTEND_CONTAINER_STATUS" >>  /opt/deploy.log
  echo "BLUE REDIS STATUS: $REDIS_CONTAINER_STATUS" >>  /opt/deploy.log

  echo " " >> /opt/deploy.log

  if [ -z "$BLUE_STATUS" ] || [ "$BACKEND_CONTAINER_STATUS" = "exited" ] || [ "$FRONTEND_CONTAINER_STATUS" = "exited" ] || [ "$REDIS_CONTAINER_STATUS" = "exited" ]; then
      echo "에러 발생" >> /opt/deploy.log
      sudo docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose-green.yml down -v --rmi all
      echoIfContainerExcited "$BACKEND_CONTAINER_STATUS" "$FRONTEND_CONTAINER_STATUS" "$REDIS_CONTAINER_STATUS" "$BLUE_STATUS"

      cat /opt/deploy-report-email/deploy-fail-email.txt | ssmtp -v -t

  else
      echo "green 중단 시작 : $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/deploy.log

      sudo docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose-green.yml down -v --rmi all

      sudo docker image prune -af # 사용 안하는 이미지

      moveFrontendStaticFile "blue"
      cat /opt/deploy-report-email/deploy-success-email.txt | ssmtp -v -t
      echo "green 중단 완료 : $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/deploy.log
  fi

else
      echo "green 배포 시작 : $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/deploy.log
      sudo docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose-green.yml up -d --build
      sleep 120


      GREEN_STATUS=$(sudo docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose-green.yml ps | awk '{$1=""; $2=""; $3=""; $4=""; $5=""; print $0}' | sed 's/^[ \t]*//')

      BACKEND_CONTAINER_STATUS=$(sudo docker inspect backend-green | grep '"Status":' | head -n 1 | awk -F: '{print $2}' | tr -d ' ",')
      FRONTEND_CONTAINER_STATUS=$(sudo docker inspect frontend-green | grep '"Status":' | head -n 1 | awk -F: '{print $2}' | tr -d ' ",')
      REDIS_CONTAINER_STATUS=$(sudo docker inspect redis-green | grep '"Status":' | head -n 1 | awk -F: '{print $2}' | tr -d ' ",')

      echo " " >> /opt/deploy.log

      echo "GREEN BACKEND STATUS: $BACKEND_CONTAINER_STATUS" >>  /opt/deploy.log
      echo "GREEN FRONTEND STATUS: $FRONTEND_CONTAINER_STATUS" >>  /opt/deploy.log
      echo "GREEN REDIS STATUS: $REDIS_CONTAINER_STATUS" >>  /opt/deploy.log

      echo " " >> /opt/deploy.log

    if [ -z "$GREEN_STATUS" ] || [ "$BACKEND_CONTAINER_STATUS" = "exited" ] || [ "$FRONTEND_CONTAINER_STATUS" = "exited" ] || [ "$REDIS_CONTAINER_STATUS" = "exited" ]; then
        echo "에러 발생" >> /opt/deploy.log
        sudo docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose-green.yml down -v --rmi all
        echoIfContainerExcited "$BACKEND_CONTAINER_STATUS" "$FRONTEND_CONTAINER_STATUS" "$REDIS_CONTAINER_STATUS" "$BLUE_STATUS"

        cat /opt/deploy-report-email/deploy-fail-email.txt | ssmtp -v -t


    else
      echo "blue 중단 시작 : $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/deploy.log


      sudo docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose-blue.yml down -v --rmi all

      moveFrontendStaticFile "green";

      cat /opt/deploy-report-email/deploy-success-email.txt | ssmtp -v -t

      echo "blue 중단 완료 : $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/deploy.log
    fi
fi
  echo "배포 종료  : $(TZ="Asia/Seoul" date '+%Y-%m-%d %H:%M:%S')" >> /opt/deploy.log

  sudo systemctl reload nginx

  echo "===================== 배포 종료 =====================" >> /opt/deploy.log
  echo >> /opt/deploy.log