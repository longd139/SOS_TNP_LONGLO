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

    // Docker registry/image settings (override in Jenkins or folder defaults)
    DOCKER_REGISTRY = 'docker.io'
    DOCKER_IMAGE = 'your-namespace/ubnd-phuong-fe'
    DOCKER_REGISTRY_CREDENTIALS_ID = 'docker-registry-credentials-id'

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
        not {
          anyOf {
            branch 'main'
            changeRequest target: 'main'
          }
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
        anyOf {
          branch 'main'
          changeRequest target: 'main'
        }
      }
      steps {
        checkout scm
      }
    }

    stage('Load .env from Secret file') {
      when {
        anyOf {
          branch 'main'
          changeRequest target: 'main'
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
        anyOf {
          branch 'main'
          changeRequest target: 'main'
        }
      }
      steps {
        script {
          if (fileExists('package.json')) {
            if (isUnix()) {
              sh 'node -v || true'
              sh 'npm ci'
              sh 'npm run build'
            } else {
              bat 'node -v'
              bat 'npm ci'
              bat 'npm run build'
            }
          } else {
            echo 'No package.json detected. Skipping build.'
          }
        }
      }
    }

    stage('Docker: Build & Push') {
      when {
        anyOf {
          branch 'main'
          changeRequest target: 'main'
        }
      }
      steps {
        script {
          def shortSha = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          def tag = "${env.BRANCH_NAME ?: 'branch'}-${env.BUILD_NUMBER}-${shortSha}"
          def imageRef = "${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${tag}"

          echo "Building image: ${imageRef}"

          if (isUnix()) {
            sh '''
              set -euxo pipefail
              echo "Enabling BuildKit for better caching/secrets"
              export DOCKER_BUILDKIT=1
            '''
          }

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

          env.IMAGE_TAG = tag
          env.IMAGE_REF = imageRef
        }
      }
    }

    stage('Docker: Deploy to Remote') {
      when {
        anyOf {
          branch 'main'
          changeRequest target: 'main'
        }
      }
      steps {
        script {
          echo "Deploying ${env.IMAGE_REF} to ${DEPLOY_HOST} as container ${CONTAINER_NAME}"

          // Upload .env to remote and restart container with new image
          def remoteScript = '''
            set -euo pipefail
            APP_DIR=/opt/apps/${CONTAINER_NAME}
            sudo mkdir -p "$APP_DIR"
            if [ -f /tmp/.env ]; then sudo mv /tmp/.env "$APP_DIR/.env"; fi
            sudo docker pull ${IMAGE_REF}
            if sudo docker ps -a --format '{{.Names}}' | grep -q '^${CONTAINER_NAME}$'; then
              sudo docker rm -f ${CONTAINER_NAME} || true
            fi
            sudo docker run -d --restart=always \
              --name ${CONTAINER_NAME} \
              --env-file "$APP_DIR/.env" \
              -p ${HOST_PORT}:${CONTAINER_PORT} \
              ${IMAGE_REF}
          '''

          sshagent([DEPLOY_SSH_CREDENTIALS_ID]) {
            if (isUnix()) {
              sh "scp -o StrictHostKeyChecking=no .env ${DEPLOY_HOST}:/tmp/.env"
              sh "ssh -o StrictHostKeyChecking=no ${DEPLOY_HOST} bash -lc '${remoteScript.replace("'", "'\\''")}'"
            } else {
              bat (
                """
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
