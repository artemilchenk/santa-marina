# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template



# To Deploy

## Create a profile
Login to https://aircards.awsapps.com/start#/
Click on Command line or programmatic access and follow instructions to create a profile
Name the profile agency-staging or agency-production
Login with `aws sso login --profile agency-staging`

## Deploying
Make sure to run commands from cdk directory
`cdk deploy tiger-festive-Staging/* --profile agency-staging`
`cdk deploy tiger-festive-Production/* --profile agency-production`
