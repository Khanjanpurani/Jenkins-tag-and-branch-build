pipeline {
    agent any

    environment {
        // Load credentials from Jenkins credential store (recommended)
        USERNAME = credentials('docker_username')
        PASSWORD = credentials('docker_password')
    }

    options {
        timestamps() // Enable timestamps for pipeline steps
        buildDiscarder(logRetention: numBuilds(5)) // Keep only the last 5 builds
        disableConcurrentBuilds() // Prevent concurrent builds of the same job
    }

    parameters {
        // Optional: Parameterize branch and tag names
        string(defaultValue: 'main', description: 'Branch to build and deploy from (default: main)', name: 'BRANCH_NAME')
        booleanParameter(defaultValue: false, description: 'Trigger build on tag creation?', name: 'IS_TAG_BUILD')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: "${params.BRANCH_NAME}", url: 'https://github.com/Khanjanpurani/Jenkins-tag-and-branch-build.git' // Replace with your Git repository URL
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t my-image:latest .' // Build Docker image (adjust tag as needed)
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
            // Post-build actions on success (e.g., send notifications)
        }
        failure {
            // Post-build actions on failure (e.g., send notifications, trigger manual intervention)
        }
    }
}
