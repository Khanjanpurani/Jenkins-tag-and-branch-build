pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "https://hub.docker.com/repository/docker/puranikhanjan307/jenkins-projects"  // Docker registry URL
        DOCKER_CREDENTIALS_ID = "docker-credentials"  // Jenkins credentials ID for Docker registry
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
                    // Check if it's a tag-based deployment
                    if (env.GIT_BRANCH.startsWith('refs/tags/')) {
                        echo "Tag-based deployment detected"
                        def tagName = env.GIT_BRANCH.replace('refs/tags/', '')
                        def imageName = "your_image_name:${tagName}"
                        
                        // Build the Docker image
                        def image = docker.build(imageName)
                        
                        // Push the Docker image to the registry
                        docker.withRegistry(DOCKER_REGISTRY, DOCKER_CREDENTIALS_ID) {
                            image.push()
                        }
                        
                    } else {
                        echo "Branch-based deployment detected"
                        
                        // Branch-based deployment
                        // Build the Docker image with the branch name
                        def imageName = "your_image_name:${env.GIT_BRANCH}"
                        def image = docker.build(imageName)
                        
                        // Deploy locally (customize as per your local deployment process)
                        // Example: Deploy using docker-compose
                        sh 'docker-compose up -d'
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
