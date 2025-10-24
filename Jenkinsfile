// Declarative Jenkins Pipeline for branch-gated build & deploy
pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    disableConcurrentBuilds()
  }

  // Update this to the Credentials ID of your Jenkins Secret file
  // that contains the .env content
  environment {
    // Secret file credential that holds your .env content
    ENV_FILE_CREDENTIALS_ID = 'env-file-credential-id'

    // Remote deploy settings
    DEPLOY_SSH_CREDENTIALS_ID = 'deploy-ssh-key-credentials-id'
    DEPLOY_HOST = 'docker-server.example.com'
    CONTAINER_NAME = 'ubnd-phuong-fe'
    HOST_PORT = '8881'
    CONTAINER_PORT = '8881'
  }

  stages {
    stage('Guard: only main or PR->main') {
      when {
        expression {
          def b = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          def isMain = (b == 'main' || b == 'origin/main' || b == 'refs/heads/main')
          def isPRToMain = ((env.CHANGE_TARGET ?: '') == 'main')
          return !(isMain || isPRToMain)
        }
      }
      steps {
        echo "Skipping: not on 'main' nor PR targeting 'main'."
        script {
          currentBuild.result = 'NOT_BUILT'
        }
      }
    }

    stage('Checkout') {
      when {
        expression {
          def b = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          def isMain = (b == 'main' || b == 'origin/main' || b == 'refs/heads/main')
          def isPRToMain = ((env.CHANGE_TARGET ?: '') == 'main')
          return (isMain || isPRToMain)
        }
      }
      steps {
        checkout scm
      }
    }

    stage('Load .env from Secret file') {
      when {
        expression {
          def b = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          def isMain = (b == 'main' || b == 'origin/main' || b == 'refs/heads/main')
          def isPRToMain = ((env.CHANGE_TARGET ?: '') == 'main')
          return (isMain || isPRToMain)
        }
      }
      steps {
        withCredentials([file(credentialsId: "${ENV_FILE_CREDENTIALS_ID}", variable: 'ENV_FILE')]) {
          script {
            if (isUnix()) {
              sh 'cp "$ENV_FILE" .env'
            } else {
              bat 'copy "%ENV_FILE%" .env'
            }
          }
          }
        }
      }

    stage('Install & Build (optional)') {
      when {
        expression {
          def b = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          def isMain = (b == 'main' || b == 'origin/main' || b == 'refs/heads/main')
          def isPRToMain = ((env.CHANGE_TARGET ?: '') == 'main')
          return (isMain || isPRToMain)
        }
      }
      steps {
        script {
          if (fileExists('package.json')) {
            if (isUnix()) {
              sh 'node -v || true'
              sh 'npm ci'
              sh 'CI=false npm run build'
            } else {
              bat 'node -v'
              bat 'npm ci'
              bat 'set CI=false && npm run build'
            }
          } else {
            echo 'No package.json detected. Skipping build.'
          }
        }
      }
    }

    stage('Docker: Build & Push') {
      when {
        expression {
          def b = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          def isMain = (b == 'main' || b == 'origin/main' || b == 'refs/heads/main')
          def isPRToMain = ((env.CHANGE_TARGET ?: '') == 'main')
          return (isMain || isPRToMain)
        }
      }
      steps {
        script {
          def shortSha = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          def tag = "${env.BRANCH_NAME ?: 'branch'}-${env.BUILD_NUMBER}-${shortSha}"
          def imageRef = "${CONTAINER_NAME}:${tag}"

          echo "Will build image on remote server: ${imageRef}"


          if (false) {
          withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID, usernameVariable: 'REGUSER', passwordVariable: 'REGPASS')]) {
            if (isUnix()) {
              sh '''
                set -euxo pipefail
                echo "$REGPASS" | docker login "$DOCKER_REGISTRY" -u "$REGUSER" --password-stdin
                docker build \
                  --secret id=env,src=.env \
                  -t temp_build_image .
                docker tag temp_build_image '"'${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}'"'
                docker tag temp_build_image '"'${imageRef}'"'
                docker push '"'${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}'"'
                docker push '"'${imageRef}'"'
                docker logout "$DOCKER_REGISTRY"
              '''
            } else {
              bat """
                set DOCKER_BUILDKIT=1
                docker login %DOCKER_REGISTRY% -u %REGUSER% -p %REGPASS%
                docker build --secret id=env,src=.env -t temp_build_image .
                docker tag temp_build_image %DOCKER_REGISTRY%/%DOCKER_IMAGE%:%BUILD_NUMBER%
                docker tag temp_build_image ${imageRef}
                docker push %DOCKER_REGISTRY%/%DOCKER_IMAGE%:%BUILD_NUMBER%
                docker push ${imageRef}
                docker logout %DOCKER_REGISTRY%
              """
            }
          }
          }
          env.IMAGE_TAG = tag
          env.IMAGE_REF = imageRef
        }
      }
    }

    stage('Docker: Deploy to Remote') {
      when {
        expression {
          def b = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
          def isMain = (b == 'main' || b == 'origin/main' || b == 'refs/heads/main')
          def isPRToMain = ((env.CHANGE_TARGET ?: '') == 'main')
          return (isMain || isPRToMain)
        }
      }
      steps {
        script {
          echo "Deploying ${env.IMAGE_REF} to ${DEPLOY_HOST} as container ${CONTAINER_NAME}"

          // Upload source + .env, then build and run container on remote host
          def remoteScript = '''
            set -euo pipefail
            APP_DIR=/opt/apps/${CONTAINER_NAME}
            BUILD_DIR=/tmp/${CONTAINER_NAME}_build_${BUILD_NUMBER}
            SRC_TAR=/tmp/${CONTAINER_NAME}_src_${BUILD_NUMBER}.tar
            sudo mkdir -p "$APP_DIR"
            if [ -f /tmp/.env ]; then sudo mv /tmp/.env "$APP_DIR/.env"; fi
            rm -rf "$BUILD_DIR" && mkdir -p "$BUILD_DIR"
            tar -xf "$SRC_TAR" -C "$BUILD_DIR"
            cd "$BUILD_DIR"
            export DOCKER_BUILDKIT=1
            sudo docker build --secret id=env,src="$APP_DIR/.env" -t ${IMAGE_REF} .
            if sudo docker ps -a --format '{{.Names}}' | grep -q '^${CONTAINER_NAME}$'; then
              sudo docker rm -f ${CONTAINER_NAME} || true
            fi
            sudo docker run -d --restart=always \
              --name ${CONTAINER_NAME} \
              --env-file "$APP_DIR/.env" \
              -p ${HOST_PORT}:${CONTAINER_PORT} \
              ${IMAGE_REF}

            echo "Cleaning up old images; keeping latest 3 for ${CONTAINER_NAME}"
            # Build a list of image IDs for this repository, sorted by creation time desc
            TMP_LIST=$(mktemp)
            sudo docker images --format '{{.Repository}} {{.Tag}} {{.ID}}' "${CONTAINER_NAME}" \
              | awk '$2!="<none>" {print $1":"$2, $3}' \
              | while read REF ID; do \
                  CREATED=$(sudo docker image inspect -f '{{.Created}}' "$ID" 2>/dev/null || echo 0); \
                  echo "$CREATED $ID $REF"; \
                done \
              | sort -r > "$TMP_LIST"

            # Keep top 3 image IDs
            KEEP_IDS=$(head -n 3 "$TMP_LIST" | awk '{print $2}')
            ALL_IDS=$(awk '{print $2}' "$TMP_LIST")

            for ID in $ALL_IDS; do
              if echo "$KEEP_IDS" | grep -q "$ID"; then
                continue
              fi
              # Try to remove by ID; ignore if in use
              sudo docker rmi -f "$ID" || true
            done
            rm -f "$TMP_LIST"
          '''

          sshagent([DEPLOY_SSH_CREDENTIALS_ID]) {
            if (isUnix()) {
              sh '''
                set -euxo pipefail
                git archive -o app.tar HEAD
                scp -o StrictHostKeyChecking=no app.tar ${DEPLOY_HOST}:/tmp/${CONTAINER_NAME}_src_${BUILD_NUMBER}.tar
                scp -o StrictHostKeyChecking=no .env ${DEPLOY_HOST}:/tmp/.env
              '''
              sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_HOST} bash -lc '${remoteScript.replace("'", "'\\''")}'"
            } else {
              bat (
                """
                git archive -o app.tar HEAD
                scp -o StrictHostKeyChecking=no app.tar %DEPLOY_HOST%:/tmp/%CONTAINER_NAME%_src_%BUILD_NUMBER%.tar
                scp -o StrictHostKeyChecking=no .env %DEPLOY_HOST%:/tmp/.env
                ssh -o StrictHostKeyChecking=no %DEPLOY_HOST% "bash -lc \"${remoteScript.replace('"', '\\"')}\""
                """
              )
            }
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs(deleteDirs: true, notFailBuild: true)
    }
  }
}
