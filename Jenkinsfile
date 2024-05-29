pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        GIT_CREDENTIALS = credentials('github')
    }
    stages {
        stage('Print Environment Variables') {
            steps {
                script {
                    env.each { key, value -> echo "${key} = ${value}" }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    def imageName = "myimage:${env.BUILD_TAG}"
                    sh "docker build -t ${imageName} ."
                }
            }
        }
        stage('Push or Deploy Image') {
            steps {
                script {
                    def isTag = env.GIT_TAG_NAME != null
                    def imageName = "myimage:${env.BUILD_TAG}"

                    if (isTag) {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                            sh "echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USERNAME} --password-stdin"
                            sh "docker tag ${imageName} ${DOCKERHUB_USERNAME}/${imageName}"
                            sh "docker push ${DOCKERHUB_USERNAME}/${imageName}"
                        }
                    } else {
                        sh "docker tag ${imageName} local/${imageName}"
                        sh "docker run -d local/${imageName}"
                    }
                }
            }
        }
    }
}
