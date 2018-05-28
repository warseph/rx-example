pipeline {
    agent any
    stages {
      stage('Prepare') {
        steps {
          sh 'docker --version'
          sh 'docker-compose --version'
          sh 'docker network inspect confluent_kafka > /dev/null 2>&1 ||\
              docker network create confluent_kafka'
          sh 'git config --global user.email "jenkins@comparaonline.com"'
          sh 'git config --global user.name "Jenkins"'
        }
      }
      stage('Build') {
          steps {
              sh 'docker-compose build'
          }
      }
      stage('Test') {
          steps {
              sh 'docker-compose run --rm app yarn test'
          }
      }
      stage ('Deploy') {
        when {
          expression {
            GIT_BRANCH = sh(returnStdout: true, script: 'echo $BRANCH_NAME').trim()
            return GIT_BRANCH == 'release' || GIT_BRANCH == 'master'
          }
        }
        steps {
          script {
            GIT_BRANCH = sh(returnStdout: true, script: 'echo $BRANCH_NAME').trim()
            STAGE = GIT_BRANCH == 'master' ? 'production' : 'staging';
            sh "STAGE=${STAGE} deploy -k /home/jenkins/google-cloud-sdk/bin/kubectl \
              -g /home/jenkins/google-cloud-sdk/bin/gcloud \
              test"
          }
        }
      }
      stage ('Accept Release') {
        when {
          expression {
            GIT_BRANCH = sh(returnStdout: true, script: 'echo $BRANCH_NAME').trim()
            return GIT_BRANCH == 'release'
          }
        }
        steps {
          script {
            env.PROMOTE_TO_PRODUCTION = input message: 'Accept changes and deploy to PRODUCTION?',
                parameters: [choice(name: 'Deploy to PRODUCTION', choices: 'no\nyes', description: 'Choose "yes" if you want to DEPLOY TO PRODUCTION')]
          }
        }
      }
      stage ('Merge to Master') {
        when {
          environment name: 'PROMOTE_TO_PRODUCTION', value: 'yes';
        }
        steps {
          sh 'git remote set-branches --add origin master'
          sh 'git fetch'
          sh 'git checkout master || git checkout -b master origin/master'
          sh 'git pull'
          sh 'git merge origin/release'
          sh 'git push origin master'
        }
      }
    }
    post {
      always {
        sh 'docker-compose stop'
      }
    }
}
