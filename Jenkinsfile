pipeline {
    agent any

    environment {
        USERNAME = credentials('docker_username')
        PASSWORD = credentials('docker_password')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${params.BRANCH_NAME}", url: 'https://github.com/Khanjanpurani/Jenkins-tag-and-branch-build.git'
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
                    def username = credentials('docker_username').username
                    def password = credentials('docker_password').password
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
                    bat 'start /B docker run -p 8000:80 my-image:latest'
                }
            }
        }
    }

    post {
        always {
            cleanWs() 
        }
    }
}
