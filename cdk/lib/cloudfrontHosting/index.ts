import { Construct } from 'constructs'
import { Stack, StackProps } from 'aws-cdk-lib'
import { HostingConstruct, HostingProps } from './hosting'
import { PipelineConstruct } from './deployment'

export interface Props extends StackProps {
  projectId: string;
  branch: string;
  connectionARN: string;
  envVars: Record<string, string>;
  HostingProps?: HostingProps;
  domain?: string;
  domainType: 'internal' | 'external' | 'staging' | 'none';
  accessControl?: {
    username: string;
    password?: string;
  };
  cachePolicyId?: string;
}

export class CloudfrontHostingStack extends Stack {
  constructor (scope: Construct, id: string, props: Props) {
    super(scope, id, props)

    const {
      branch,
      projectId,
      connectionARN,
      envVars,
      domain,
      domainType,
      accessControl,
      cachePolicyId
    } = props

    const hosting = new HostingConstruct(this, 'Hosting', {
      branch,
      projectId,
      domain,
      domainType,
      lambdaUrl: envVars.LAMBDA_URL,
      accessControl,
      cachePolicyId
    })

    new PipelineConstruct(this, 'Pipeline', {
      deployBucket: hosting.deployBucket,
      projectId,
      branch,
      connectionArn: connectionARN,
      envVars
    })
  }
}
