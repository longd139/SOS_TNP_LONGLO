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

    // Local deploy settings (no SSH)
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

    stage('Docker: Build') {
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

          echo "Building local Docker image: ${imageRef}"


          if (false) {
          withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID, usernameVariable: 'REGUSER', passwordVariable: 'REGPASS')]) {
            if (isUnix()) {
              sh ```
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
              ```
            } else {
              bat ```
                set DOCKER_BUILDKIT=1
                docker login %DOCKER_REGISTRY% -u %REGUSER% -p %REGPASS%
                docker build --secret id=env,src=.env -t temp_build_image .
                docker tag temp_build_image %DOCKER_REGISTRY%/%DOCKER_IMAGE%:%BUILD_NUMBER%
                docker tag temp_build_image ${imageRef}
                docker push %DOCKER_REGISTRY%/%DOCKER_IMAGE%:%BUILD_NUMBER%
                docker push ${imageRef}
                docker logout %DOCKER_REGISTRY%
              ```
            }
          }
          }
          if (isUnix()) {
            sh ```
              set -euxo pipefail
              export DOCKER_BUILDKIT=1
              docker build --secret id=env,src=.env -t ${IMAGE_REF} .
            ```
          } else {
            bat ```
              set DOCKER_BUILDKIT=1
              docker build --secret id=env,src=.env -t %IMAGE_REF% .
            ```
          }
          env.IMAGE_TAG = tag
          env.IMAGE_REF = imageRef
        }
      }
    }

    stage('Docker: Deploy') {
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
          echo "Deploying container locally: ${CONTAINER_NAME} from ${env.IMAGE_REF}"
          if (isUnix()) {
            sh ```
              set -euxo pipefail
              if docker ps -a --format '{{.Names}}' | grep -q '^${CONTAINER_NAME}$'; then
                docker rm -f ${CONTAINER_NAME} || true
              fi
              docker run -d --restart=always \
                --name ${CONTAINER_NAME} \
                --env-file .env \
                -p ${HOST_PORT}:${CONTAINER_PORT} \
                ${IMAGE_REF}

              echo "Cleaning up old images; keeping latest 3"
              TMP_LIST=$(mktemp)
              docker images --format '{{.Repository}} {{.Tag}} {{.ID}}' "${CONTAINER_NAME}" \
                | awk '$2!="<none>" {print $1":"$2, $3}' \
                | while read REF ID; do \
                    CREATED=$(docker image inspect -f '{{.Created}}' "$ID" 2>/dev/null || echo 0); \
                    echo "$CREATED $ID $REF"; \
                  done \
                | sort -r > "$TMP_LIST"
              KEEP_IDS=$(head -n 3 "$TMP_LIST" | awk '{print $2}')
              ALL_IDS=$(awk '{print $2}' "$TMP_LIST")
              for ID in $ALL_IDS; do
                echo "$KEEP_IDS" | grep -q "$ID" && continue
                docker rmi -f "$ID" || true
              done
              rm -f "$TMP_LIST"
            ```
          } else {
            bat ```
              for /f %%i in ('docker ps -a --format "{{.Names}}" ^| findstr /r /c:"^%CONTAINER_NAME%$"') do docker rm -f %CONTAINER_NAME%
              docker run -d --restart=always --name %CONTAINER_NAME% --env-file .env -p %HOST_PORT%:%CONTAINER_PORT% %IMAGE_REF%
            ```
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







