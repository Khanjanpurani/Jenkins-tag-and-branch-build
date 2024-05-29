pipeline {
    agent any

    environment {
        USERNAME = credentials('docker_username')
        PASSWORD = credentials('docker_password')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Khanjanpurani/Jenkins-tag-and-branch-build.git'
            }
        }

        stage('Build Image') {
            steps {
                script {
                    bat 'docker build -t my-image:latest .'
                }
            }
        }

        stage('Push Image (Tag Build Only)') {
            when {
                expression { return params.IS_TAG_BUILD } 
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker_credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        bat 'docker login -u %USERNAME% -p %PASSWORD%'
                        bat 'docker push my-image:latest'
                    }
                }
            }
        }

        stage('Deploy to Local (Branch Build Only)') {
            when {
                expression { return !params.IS_TAG_BUILD } 
            }
            steps {
                script {
                    // Stop any running containers to avoid conflicts
                    bat 'docker stop my-container || true'
                    bat 'docker rm my-container || true'
                    
                    // Run the container in detached mode
                    bat 'docker run -d --name my-container -p 8000:80 my-image:latest'

                    // Check running containers
                    bat 'docker ps'

                    // Show logs for the new container
                    bat 'docker logs my-container'
                }
            }
        }
    }

    post {
        always {
            cleanWs() // Clean workspace after each build
        }
    }
}
