import { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'
import { CloudfrontHostingStack } from '../lib/cloudfrontHosting'
export interface ProjectProps extends cdk.StackProps {
  branch: string;
  connectionARN: string;
  projectId: string;
  domain?: string;
  domainType: 'internal' | 'external' | 'staging' | 'none';
  redirect_uri_base?: string;
  cachePolicyId?: string;
  accessControl?: {
    username: string;
    password?: string;
  };
}
export class ProjectStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props: ProjectProps) {
    const { branch, connectionARN, projectId, domain, accessControl,cachePolicyId } = props
    super(scope, id, props)
    // const lambda = new LambdaStack(this, 'Lambda', { env: props.env, branch: props.branch })
    new CloudfrontHostingStack(this, 'Hosting', {
      env: props.env,
      branch,
      connectionARN,
      projectId,
      domain,
      domainType: props.domainType,
      envVars: {},
      accessControl,
      cachePolicyId,
    })
  }
}
