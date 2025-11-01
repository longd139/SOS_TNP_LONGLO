pipeline {
  agent any
  options {
    timestamps()
    disableConcurrentBuilds()
  }
  environment {
    DOCKER_CLIENT_TIMEOUT = '300'
    // Disable BuildKit to avoid requiring docker buildx on agents where it's missing
    DOCKER_BUILDKIT = '0'
  }
  stages {
    stage('Init Config') {
      steps {
        script {
          def b = (env.BRANCH_NAME ?: env.GIT_BRANCH ?: '').replaceFirst(/^origin\//,'')
          // Map branch -> host port and Jenkins file credential ID
          def branchMap = [
            'longt2': [port: '8881', credId: 'ubnd_fe_env_file_longt2'],
            'staging': [port: '8883', credId: 'ubnd_fe_env_file_staging']
          ]

          if (branchMap.containsKey(b)) {
            env.DEPLOY = 'true'
            env.DEPLOY_BRANCH = b
            env.DEPLOY_PORT = branchMap[b].port
            env.ENV_CRED_ID = branchMap[b].credId
            env.IMAGE_NAME = 'ubnd-fe'
            env.CONTAINER_NAME = ("ubnd_fe_" + b).replaceAll('[^A-Za-z0-9_]','_')
            // Container listens on 8881 (nginx); map host ${DEPLOY_PORT} -> 8881
            env.CONTAINER_PORT = '8881'
          } else {
            env.DEPLOY = 'false'
          }
        }
      }
    }

    stage('Debug Info') {
      steps {
        sh 'echo BRANCH_NAME=$BRANCH_NAME && echo GIT_BRANCH=$GIT_BRANCH && hostname && docker --version && docker info >/dev/null || true'
      }
    }

    stage('Checkout') {
      when {
        expression { return env.DEPLOY == 'true' || env.CHANGE_ID }
      }
      steps {
        checkout scm
      }
    }

    stage('Prepare .env from Jenkins Secret') {
      when {
        expression { return env.DEPLOY == 'true' }
      }
      steps {
        script {
          if (!env.ENV_CRED_ID) {
            error 'ENV_CRED_ID is not set for this branch; check branchMap.'
          }
          withCredentials([file(credentialsId: env.ENV_CRED_ID, variable: 'ENV_FILE')]) {
            sh '''
              set -e
              cp "$ENV_FILE" ./.env
              # Mirror into src/.env as some setups read from src/.env
              mkdir -p src
              cp "$ENV_FILE" ./src/.env || true
            '''
          }
        }
      }
    }

    stage('Build Image') {
      when {
        expression { return env.DEPLOY == 'true' || env.CHANGE_ID }
      }
      steps {
        retry(3) {
          sh '''
            set -e
            IMAGE_NAME=${IMAGE_NAME:-ubnd-fe}
            IMAGE_TAG=$(echo ${GIT_COMMIT:-latest} | cut -c1-7)
            echo "Pulling base images (best-effort)"
            docker pull node:20-alpine || true
            docker pull nginx:alpine || true
            echo "Building ${IMAGE_NAME}:${IMAGE_TAG}"
            docker build --pull -t ${IMAGE_NAME}:${IMAGE_TAG} .
            echo ${IMAGE_TAG} > .image_tag
          '''
        }
      }
    }

    stage('Deploy') {
      when {
        expression { return env.DEPLOY == 'true' }
      }
      steps {
        sh '''
          set -e
          IMAGE_NAME=${IMAGE_NAME:-ubnd-fe}
          IMAGE_TAG=$(cat .image_tag)
          CONTAINER_NAME=${CONTAINER_NAME}
          HOST_PORT=${DEPLOY_PORT}
          CONTAINER_PORT=${CONTAINER_PORT:-8881}

          # Free the host port if any container is currently using it
          echo "Ensuring port ${HOST_PORT} is free..."
          INUSE_IDS=$(docker ps -q --filter "publish=${HOST_PORT}" || true)
          if [ -z "$INUSE_IDS" ]; then
            # Fallback detection by parsing Ports column
            INUSE_IDS=$(docker ps --format '{{.ID}} {{.Ports}}' | awk -v p=":${HOST_PORT}->" '$0 ~ p {print $1}')
          fi
          if [ -n "$INUSE_IDS" ]; then
            echo "Port ${HOST_PORT} in use by: $INUSE_IDS. Removing..."
            docker rm -f $INUSE_IDS || true
          fi

          # Stop/remove old container if exists
          docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
          # Run new container, mapping host port -> container 8881
          docker run -d \
            --name ${CONTAINER_NAME} \
            --restart unless-stopped \
            -p ${HOST_PORT}:${CONTAINER_PORT} \
            ${IMAGE_NAME}:${IMAGE_TAG}
        '''
      }
    }

    stage('Cleanup Old Images') {
      when {
        expression { return env.DEPLOY == 'true' }
      }
      steps {
        sh '''
          set -e
          IMAGE_NAME=${IMAGE_NAME:-ubnd-fe}
          KEEP=3
          # Get unique image IDs for the repository, newest first
          IDS=$(docker images --format '{{.Repository}} {{.ID}} {{.CreatedAt}}' | awk -v name="$IMAGE_NAME" '$1==name{print $2}' | awk '!seen[$0]++')
          COUNT=0
          DELETE_IDS=""
          for id in $IDS; do
            COUNT=$((COUNT+1))
            if [ $COUNT -gt $KEEP ]; then
              DELETE_IDS="$DELETE_IDS $id"
            fi
          done
          if [ -n "$DELETE_IDS" ]; then
            echo "Removing old images (keeping $KEEP): $DELETE_IDS"
            docker rmi -f $DELETE_IDS || true
          else
            echo "No old images to remove for $IMAGE_NAME"
          fi
          docker image prune -f || true
        '''
      }
    }
  }
  post {
    failure {
      echo 'Build failed. Check logs.'
    }
    success {
      script {
        if (env.DEPLOY == 'true') {
          echo "Build completed. Deployed ${env.DEPLOY_BRANCH} at port ${env.DEPLOY_PORT}."
        } else {
          echo 'Build completed. Deploy runs on branches: longt2, staging.'
        }
      }
    }
  }
}

