pipeline {
    agent any

    environment {
        // Load credentials from Jenkins credential store (recommended)
        USERNAME = credentials('docker_username')
        PASSWORD = credentials('docker_password')
    }

  

    parameters {
        string(defaultValue: 'main', description: 'Branch to build and deploy from (default: main)', name: 'BRANCH_NAME')
        booleanParam(defaultValue: false, description: 'Trigger build on tag creation?', name: 'IS_TAG_BUILD')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${params.BRANCH_NAME}", url: 'https://github.com/Khanjanpurani/Jenkins-Tag-and-Branch-Build.git' // Replace with your Git repository URL
            }
        }

        stage('Build Image') {
            steps {
                script {
                    // Handle potential IOException during build (adjust based on your build command)
                    try {
                        if (env.OS == 'windows') {
                            bat 'docker build -t my-image:latest .' // Use bat command on Windows
                        } else {
                            sh 'docker build -t my-image:latest .' // Use sh for shell commands on other OS
                        }
                    } catch (java.io.IOException e) {
                        echo "Error during build: ${e.message}"
                    }
                }
            }
        }

        stage('Push Image (Tag Build Only)') {
            when {
                expression { return params.IS_TAG_BUILD } // Only run on tag builds
            }
            steps {
                script {
                    def username = credentials('docker_username').username
                    def password = credentials('docker_password').password
                    docker.withRegistry('https://hub.docker.com/repository/docker/puranikhanjan307/jenkins-projects', credentialsId: 'docker_credentials') { // Replace with your DockerHub URL
                        echo "Pushing image to DockerHub..."
                        docker.push('my-image:latest')
                    }
                }
            }
        }

        stage('Deploy to Local (Branch Build Only)') {
            when {
                expression { return !params.IS_TAG_BUILD } // Only run on branch builds
            }
            steps {
                // Local deployment steps (adjust based on your local environment)
                sh 'docker run -p 8080:80 my-image:latest' // Example: Run image locally on port 8080
            }
        }
    }

    post {
        always {
            cleanWs() // Clean workspace after each build
        }
        success {
            // Add your success actions here (e.g., send notifications)
            // Example: Send email notification on success
            emailext body: 'Build Successful!', subject: 'Jenkins - Build Success for ${JOB_NAME}', to: 'your_email@example.com'
        }
        failure {
            // Add your failure actions here (e.g., send notifications, trigger manual intervention)
            // Example: Send email notification on failure
            emailext body: 'Build Failed!', subject: 'Jenkins - Build Failure for ${JOB_NAME}', to: 'your_email@example.com'
        }
    }
}
