import { Construct } from 'constructs'
import { RemovalPolicy, Duration } from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53_targets from 'aws-cdk-lib/aws-route53-targets'
import { BasicAuthFunction } from './BasicAuth'

// import { SlackNotificationsConstruct } from "../slackbot/index.js";

export interface HostingProps {
  branch: string;
  domain?: string;
  projectId: string;
  secrets?: boolean;
  domainType: 'internal' | 'external' | 'staging' | 'none';
  lambdaUrl: string;
  accessControl?: {
    username: string;
    password?: string;
  };
  cachePolicyId?: string;
}

export class HostingConstruct extends Construct {
  readonly deployBucket: s3.Bucket
  constructor (scope: Construct, id: string, envProps: HostingProps) {
    super(scope, id)

    const { branch, domain, projectId } = envProps

    // auth function
    const functionAssociations = envProps.accessControl
      ? [
          {
            function: new BasicAuthFunction(
              this,
              'BasicAuth',
              envProps.accessControl
            ),
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST
          }
        ]
      : undefined

    // define s3 bucket
    const deployBucket = new s3.Bucket(this, 'DeployBucket', {
      bucketName: `${projectId}-${branch}-deployment`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })
    this.deployBucket = deployBucket

    const { certificate, hostedZone, domainNames } = handleDomainName({
      scope: this,
      branch,
      projectId,
      domainName: domain,
      domainType: envProps.domainType
    })
    const s3Origin = new origins.S3Origin(deployBucket, {})
    const cachePolicy = envProps.cachePolicyId? cloudfront.CachePolicy.fromCachePolicyId(this, 'CachePolicy', envProps.cachePolicyId)
     : 
    new cloudfront.CachePolicy(this, 'CachePolicy', {
      defaultTtl: Duration.seconds(30),
      minTtl: Duration.seconds(10),
      maxTtl: Duration.seconds(600),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true
    })
    
    // define cloudfront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      additionalBehaviors: {
        'index.html': {
          origin: s3Origin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          // cachePolicy: cloudfront.CachePolicy.fromCachePolicyId(this, 'CachePolicy', 'e08982f0-49be-440e-9527-68026b3347b5')
          cachePolicy,
          functionAssociations
        }
        // '*.wasm': {
        //   origin: s3Origin,
        //   viewerProtocolPolicy:
        //     cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        //   responseHeadersPolicy: new cloudfront.ResponseHeadersPolicy(
        //     this,
        //     'ResponseHeadersPolicy',
        //     {
        //       comment: 'Add correct MIME type for wasm files',
        //       customHeadersBehavior: {
        //         customHeaders: [
        //           {
        //             header: 'Content-Type',
        //             value: 'application/wasm',
        //             override: true
        //           }
        //         ]
        //       }
        //     }
        //   )
        // }
      },
      defaultRootObject: 'index.html',
      domainNames,
      certificate,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(0)
        }
      ]
    })
    if (domainNames && hostedZone) {
      for (const recordName of domainNames) {
        new route53.ARecord(this, `AliasRecord${recordName}`, {
          zone: hostedZone,
          recordName,
          target: route53.RecordTarget.fromAlias(
            new route53_targets.CloudFrontTarget(distribution)
          )
        })
      }
    }
  }
}

interface handleDomainNameProps {
  domainType: 'internal' | 'external' | 'staging' | 'none';
  domainName?: string;
  branch: string;
  projectId: string;
  scope: Construct;
}

function handleDomainName (props: handleDomainNameProps) {
  const { domainType, domainName, branch, projectId, scope } = props
  const ans: {
    hostedZone?: route53.IHostedZone;
    domainNames?: string[];
    certificate?: acm.ICertificate;
  } = {}

  switch (domainType) {
    case 'internal':
      return handleInternalDomain()
    case 'external':
      return handleExternalDomain()
    case 'staging':
      return handleStagingDomain()
    case 'none':
      return handleNoDomain()
    default:
      throw new Error('invalid domain type')
  }
  // if internal domain
  function handleInternalDomain () {
    if (!domainName) throw new Error('domain name is required')
    ans.domainNames = [domainName, `www.${domainName}`]
    ans.hostedZone = route53.HostedZone.fromLookup(scope, 'HostedZone', {
      domainName: ans.domainNames[0]
    })
    ans.certificate = new acm.Certificate(scope, 'Certificate', {
      domainName,
      subjectAlternativeNames: [`www.${domainName}`],
      validation: acm.CertificateValidation.fromDns(ans.hostedZone)
    })
    return ans
  }
  function handleExternalDomain () {
    ans.certificate = acm.Certificate.fromCertificateArn(
      scope,
      'Certificate',
      'arn:aws:acm:us-east-1:104924253456:certificate/75cbf4aa-b8a0-4df8-91fc-f413435ee529'
    )
    ans.domainNames = ['arkuwait.com', 'www.arkuwait.com']
    // if (!domainName) throw new Error('domain name is required')
    // console.log('External domain type selected: Manual configuration of domain name and certificate required.')
    return ans
  }
  function handleStagingDomain () {
    if (branch === 'staging') {
      ans.domainNames = [`${projectId}.staging.aircards.io`]
    } else {
      ans.domainNames = [`${projectId}-${branch}.staging.aircards.io`]
    }
    ans.certificate = acm.Certificate.fromCertificateArn(
      scope,
      'staging-cert',
      'arn:aws:acm:us-east-1:275649731663:certificate/e1748548-af7f-4266-b5a7-9df75876a4ae'
    )
    ans.hostedZone = route53.HostedZone.fromLookup(scope, 'HostedZone', {
      domainName: 'staging.aircards.io'
    })
    return ans
  }
  function handleNoDomain () {
    return { domainNames: undefined, hostedZone: undefined, certificate: undefined }
  }
}
