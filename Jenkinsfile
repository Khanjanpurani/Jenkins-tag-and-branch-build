pipeline {
  // Use Docker agent with image containing Docker CLI
  agent {
    docker {
      image 'docker:19.03.12'
      args '-v /var/run/docker.sock:/var/run/docker.sock' // Mount Docker socket
    }
  }

  // Environment variables (consider using a secret manager for credentials)
  environment {
    DOCKER_REGISTRY = "https://hub.docker.com/repository/docker/puranikhanjan307/jenkins-projects"
    DOCKER_CREDENTIALS_ID = credentials('dockerhub') // Consider using secret manager plugin
    DOCKER_BINARY_PATH = "/usr/bin/docker"
  }

  // Stages
  stages {
    stage('Print Env Variables') { // Optional for debugging
      steps {
        script {
          env.each { key, value ->
            echo "${key} = ${value}"
          }
        }
      }
    }

    stage('Build and Deploy') {
      steps {
        script {
          def branchName = env.GIT_BRANCH
          if (branchName.startsWith('refs/tags/')) {
            // Tag-based deployment
            def tagName = branchName.replace('refs/tags/', '')
            def imageName = "your_image_name:${tagName}"

            // Build the Docker image (optimize to potentially reuse built image)
            def image = docker.build(imageName)

            // Push the Docker image to the registry
            docker.withRegistry(DOCKER_REGISTRY, DOCKER_CREDENTIALS_ID) {
              image.push()
            }
          } else {
            // Branch-based deployment
            def branchImageName = "your_image_name:${branchName.replace('origin/', '')}"
            def branchImage = docker.build(branchImageName)

            // Deploy locally using Docker
            branchImage.inside {
              // Option 1: Using single quotes (recommended)
            //  sh '''
            //    ${DOCKER_BINARY_PATH} run -d -p 8080:8080 your_image_name:latest
            //  '''

              // Option 2: Specifying full command path
               sh "/usr/bin/docker run -d -p 8080:8080 your_image_name:latest"

              // Option 3: Using different shell (less common)
              // sh '/bin/bash -c "/usr/bin/docker run -d -p 8080:8080 your_image_name:latest"'
            }
          }
        }
      }
    }
  }

  // Post section
  post {
    always {
      echo 'Pipeline execution finished.'
    }
    success {
      echo 'Pipeline completed successfully.'
    }
    failure {
      echo 'Pipeline failed.'
    }
  }
}
