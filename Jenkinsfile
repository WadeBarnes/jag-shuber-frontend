node {
    stage('build') {
        echo "Building..."
        openshiftBuild bldCfg: 'client', showBuildLogs: 'true'
        openshiftTag destStream: 'client', verbose: 'true', destTag: '$BUILD_ID', srcStream: 'client', srcTag: 'latest'
    }
        
    // stage('checkout for static code analysis') {
    //     echo "checking out source"
    //     echo "Build: ${BUILD_ID}"
    //     checkout scm
    // }

  //   stage('code quality check') {
  //       SONARQUBE_PWD = sh (
  //           script: 'oc env dc/sonarqube --list | awk  -F  "=" \'/SONARQUBE_ADMINPW/{print $2}\'',
  //           returnStdout: true
  //       ).trim()
  //       echo "SONARQUBE_PWD: ${SONARQUBE_PWD}"

  //       SONARQUBE_URL = sh (
  //           script: 'oc get routes -o wide --no-headers | awk \'/sonarqube/{ print match($0,/edge/) ?  "https://"$2 : "http://"$2 }\'',
  //           returnStdout: true
  //       ).trim()
  //       echo "SONARQUBE_URL: ${SONARQUBE_URL}"

	// //disable the functional test asoc  only there is only one test case available
  //       dir('sonar-runner') {
  //           //sh returnStdout: true, script: "./gradlew sonarqube -Dsonar.lanuage=js -Dsonar.projectKey=org.sonarqube:tfrs-client -Dsonar.projectName='TFRS Client Project'   -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.verbose=true --stacktrace --info  -Dsonar.sources=client"
  //       }
  //   }

	
//	stage('validation') {
//        dir('functional-tests') {
//			try {
//				sh './gradlew --debug --stacktrace phantomJsTest'
//			} catch(Throwable t) {
//mail (from: "${env.EMAIL_FROM}", to: "${env.EMAIL_TO}", subject: "TFRS Client Pipeline '${env.JOB_NAME}' build ${env.BUILD_NUMBER} functional test failed", body: "See ${env.BUILD_URL} for details. ");
//	                  throw t;
//			} finally {
//				archiveArtifacts allowEmptyArchive: true, artifacts: 'build/reports/**/*'
//			}
//      }
//    }
}

node{
    stage('deploy-dev') {
        echo "Deploying to dev..."
        openshiftTag destStream: 'client', verbose: 'true', destTag: 'dev', srcStream: 'client', srcTag: 'latest'
    }
}


// stage('deploy-test') {
//     node {
//         openshiftTag destStream: 'client', verbose: 'true', destTag: 'test', srcStream: 'client', srcTag: '$BUILD_ID'
//     }
// }

// stage('deploy-prod') {
//     node {
//         openshiftTag destStream: 'client', verbose: 'true', destTag: 'prod', srcStream: 'client', srcTag: '$BUILD_ID'
//     }
// }