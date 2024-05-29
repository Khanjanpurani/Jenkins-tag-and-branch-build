pipeline {
    agent any

    environment {
        USERNAME = credentials('docker_username')
        PASSWORD = credentials('docker_password')
    }

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch or tag to build')
        booleanParam(name: 'IS_TAG_BUILD', defaultValue: false, description: 'Is this a tag build?')
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    if (params.IS_TAG_BUILD) {
                        git url: 'https://github.com/Khanjanpurani/Jenkins-tag-and-branch-build.git', branch: "refs/tags/${params.BRANCH_NAME}"
                    } else {
                        git url: 'https://github.com/Khanjanpurani/Jenkins-tag-and-branch-build.git', branch: "${params.BRANCH_NAME}"
                    }
                }
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
                        bat 'docker tag my-image:latest puranikhanjan307/my-image:${params.BRANCH_NAME}'
                        bat 'docker push puranikhanjan307/my-image:${params.BRANCH_NAME}'
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
                    
                    bat '''
                    docker stop my-container || exit 0
                    docker rm my-container || exit 0
                    '''
        
                    bat 'docker run -d --name my-container -p 8000:80 my-image:latest'

                    bat 'docker ps'

                    bat 'docker logs my-container'
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
