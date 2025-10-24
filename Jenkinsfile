pipeline {
  agent any

  environment {
    IMAGE_NAME = 'ubnd-fe'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_LATEST = "${IMAGE_NAME}:latest"
    IMAGE_VERSIONED = "${IMAGE_NAME}:${IMAGE_TAG}"
    CONTAINER_NAME = 'ubnd-fe'
    HOST_PORT = '8881'
    CONTAINER_PORT = '8881'
  }

  options {
    timestamps()
    ansiColor('xterm')
    skipDefaultCheckout()
  }

  stages {
    stage('Checkout') {
      when {
        anyOf {
          branch 'main'
          expression { env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'main' }
        }
      }
      steps {
        checkout scm
      }
    }

    stage('Prepare .env') {
      when {
        anyOf {
          branch 'main'
          expression { env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'main' }
        }
      }
      steps {
        withCredentials([file(credentialsId: 'env-file-credential-id', variable: 'ENV_FILE')]) {
          sh '''
            set -euxo pipefail
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
      when {
        anyOf {
          branch 'main'
          expression { env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'main' }
        }
      }
      steps {
        sh '''
          set -euxo pipefail
          docker build -t ${IMAGE_VERSIONED} -t ${IMAGE_LATEST} .
        '''
      }
    }

    stage('Deploy Container') {
      when {
        anyOf {
          branch 'main'
          expression { env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'main' }
        }
      }
      steps {
        sh '''
          set -euxo pipefail

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
      when {
        anyOf {
          branch 'main'
          expression { env.GIT_BRANCH == 'origin/main' || env.BRANCH_NAME == 'main' }
        }
      }
      steps {
        sh '''
          set -euxo pipefail

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
      script {
        if (env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main') {
          echo "Deployment successful: http://103.48.193.165:${HOST_PORT}/"
        }
      }
    }
    always {
      script {
        if (env.BRANCH_NAME == 'main' || env.GIT_BRANCH == 'origin/main') {
          sh 'docker ps --filter name=${CONTAINER_NAME} --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" || true'
        }
      }
    }
  }
}
