pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "https://hub.docker.com/repository/docker/puranikhanjan307/jenkins-projects"  
        DOCKER_CREDENTIALS_ID = credentials('dockerhub')  
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
                    if (env.BRANCH_NAME.startsWith('tags/')) {
                        
                        def image = docker.build("your_image_name:${env.BUILD_TAG}")
                        docker.withRegistry("${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS_ID}") {
                            image.push()
                        }
                    } else {
                       
                        sh 'docker-compose up -d'
                    }
                }
            }
        }
    }
}
