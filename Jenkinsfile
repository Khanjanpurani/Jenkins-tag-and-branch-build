pipeline {
    agent {
        docker {
            image 'docker:19.03.12' // Docker image with Docker CLI
            args '-v /var/run/docker.sock:/var/run/docker.sock' // Mount Docker socket
        }
    }
    
    environment {
        DOCKER_REGISTRY = "https://hub.docker.com/repository/docker/puranikhanjan307/jenkins-projects"  // Docker registry URL
        DOCKER_CREDENTIALS_ID = credentials('dockerhub')  // Jenkins credentials ID for Docker registry
        DOCKER_BINARY_PATH = "/usr/bin/docker" // Full path to Docker binary
    }
    
    stages {
        stage('Print Env Variables') {
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
                        
                        // Build the Docker image
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
                            sh "${DOCKER_BINARY_PATH} run -d -p 8080:8080 your_image_name:latest"
                        }
                    }
                }
            }
        }
    }
    
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
