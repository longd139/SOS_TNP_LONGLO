pipeline {
  agent any

  environment {
    IMAGE_NAME = 'ubnd-fe'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_LATEST = "${IMAGE_NAME}:latest"
    IMAGE_VERSIONED = "${IMAGE_NAME}:${IMAGE_TAG}"
    CONTAINER_NAME = 'ubnd-fe'
    HOST_PORT = '8881'
    CONTAINER_PORT = '8881' //aaa
  }

  options {
    timestamps()
    ansiColor('xterm')
    skipDefaultCheckout()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Detect Branch') {
      steps {
        script {
          // Prefer Jenkins-provided variables first
          def b = env.BRANCH_NAME ?: env.GIT_BRANCH

          // Fallback: parse refs from the commit when in detached HEAD
          if (!b || b.trim() == '') {
            b = sh(
              script: "git show -s --pretty=%D HEAD | sed 's/,/ /g'",
              returnStdout: true
            ).trim()
          }

          env.CURRENT_BRANCH = b

          def isTarget = false
          if (b) {
            isTarget = (
              b == 'longt2' ||
              b.endsWith('/longt2') ||
              b.contains('refs/heads/longt2') ||
              b.contains('origin/longt2')
            )
          }

          env.IS_TARGET = isTarget.toString()
          echo "Detected branch: ${b} | IS_TARGET=${env.IS_TARGET}"
        }
      }
    }

    stage('Prepare .env') {
      when { expression { return env.IS_TARGET == 'true' } }
      steps {
        withCredentials([file(credentialsId: 'env-file-credential-id', variable: 'ENV_FILE')]) {
          sh '''
            set -eux
            # Create .env in workspace from Jenkins secret file
            cp "$ENV_FILE" .env
            # Optionally mirror into src/.env for compatibility with current project layout
            mkdir -p src
            cp "$ENV_FILE" src/.env || true
          '''
        }
      }
    }

    stage('Build Docker Image') {
      when { expression { return env.IS_TARGET == 'true' } }
      steps {
        sh '''
          set -eux
          docker build -t ${IMAGE_VERSIONED} -t ${IMAGE_LATEST} .
        '''
      }
    }

    stage('Deploy Container') {
      when { expression { return env.IS_TARGET == 'true' } }
      steps {
        sh '''
          set -eux

          # Stop and remove any existing container with the same name
          if [ "$(docker ps -aq -f name=^${CONTAINER_NAME}$)" ]; then
            docker rm -f ${CONTAINER_NAME} || true
          fi

          # Run the container mapping host port to container port
          docker run -d \
            --name ${CONTAINER_NAME} \
            -p ${HOST_PORT}:${CONTAINER_PORT} \
            --restart unless-stopped \
            ${IMAGE_LATEST}
        '''
      }
    }

    stage('Cleanup Old Images') {
      when { expression { return env.IS_TARGET == 'true' } }
      steps {
        sh '''
          set -eux

          # Keep only the 3 most recent unique images for this repo
          # List image IDs in creation order (newest first), unique by ID
          ids=$(docker images --format '{{.ID}}' ${IMAGE_NAME} | awk '!seen[$0]++')
          echo "All image IDs for ${IMAGE_NAME}:\n$ids" || true

          # Select IDs beyond the first 3 and remove them
          echo "$ids" | awk 'NR>3' | xargs -r docker rmi -f || true
        '''
      }
    }
  }

  post {
    success {
      script { if (env.IS_TARGET == 'true') { echo "Deployment successful: http://103.48.193.165:${HOST_PORT}/" } }
    }
    always {
      script { if (env.IS_TARGET == 'true') { sh 'docker ps --filter name=${CONTAINER_NAME} --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" || true' } }
    }
  }
}

