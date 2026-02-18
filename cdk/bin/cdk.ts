#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import {
  CdkConfig,
  AircardsStaging,
  AircardsProduction
} from './aircards.config'
import { ProjectStack } from '../lib/project'

const region = 'us-east-1'
const projectId = CdkConfig.REPO_NAME
const app = new cdk.App()

new ProjectStack(app, `${projectId}-Staging`, {
  env: {
    account: AircardsStaging.ACCOUNT_NUMBER,
    region,
  },
  branch: "staging",
  connectionARN: AircardsStaging.CONNECTION_ARN,
  cachePolicyId: AircardsStaging.CACHE_POLICY_ID,
  accessControl: {
    username: "abc",
    password: "123",
  },
  projectId,
  domainType: "staging",
});

new ProjectStack(app, `${projectId}-Production`, {
  env: {
    account: AircardsProduction.ACCOUNT_NUMBER,
    region
  },
  branch: 'production',
  connectionARN: AircardsProduction.CONNECTION_ARN,
  // accessControl: {
  //   username: 'abc',
  //   password: '123'
  // },
  projectId,
  domainType: 'internal',
  domain: 'example.domain.com'
})

cdk.Tags.of(app).add('PROJECT', projectId)
