import { Construct } from 'constructs'
import * as codepipelines from 'aws-cdk-lib/aws-codepipeline'
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions'
import * as codebuild from 'aws-cdk-lib/aws-codebuild'
import { Bucket } from 'aws-cdk-lib/aws-s3'

// import { SlackNotificationsConstruct } from "../slackbot/index.js";

interface envProps {
  deployBucket: Bucket;
  projectId: string;
  branch: string;
  connectionArn: string;
  envVars: Record<string, string>;
}

export class PipelineConstruct extends Construct {
  constructor (scope: Construct, id: string, envProps: envProps) {
    super(scope, id)

    const { deployBucket, projectId, branch, connectionArn, envVars } = envProps

    // define pipeline
    const pipeline = new codepipelines.Pipeline(this, 'Pipeline', {
      pipelineName: `${projectId}-pipeline-${branch}`,
      restartExecutionOnUpdate: true,
      crossAccountKeys: false
    })

    // define source
    const sourceOutput = new codepipelines.Artifact()
    const sourceAction =
      new codepipeline_actions.CodeStarConnectionsSourceAction({
        actionName: 'GitHub_Source',
        owner: 'Aircards',
        repo: projectId,
        output: sourceOutput,
        branch,
        connectionArn
      })

    const buildOutput = new codepipelines.Artifact()
    const codebuildVars: { [name: string]: codebuild.BuildEnvironmentVariable; } = {
      AWS_BRANCH: {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: branch
      },
      NODE_ENV: {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: branch
      },
      JSON_SECRET: {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: '{}'
      }
    }
    for (const [key, value] of Object.entries(envVars)) {
      codebuildVars[key] = {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value
      }
    }

    const codeBuildProject = new codebuild.PipelineProject(this, 'CodeBuild', {
      description: 'Build project for static hosting',
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM),
      buildSpec: codebuild.BuildSpec.fromAsset(
        './lib/cloudfrontHosting/buildspec.yml'
      ),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        computeType: codebuild.ComputeType.SMALL
      }
    })

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project: codeBuildProject,
      input: sourceOutput,
      outputs: [buildOutput],
      environmentVariables: codebuildVars
    })

    const deployAction = new codepipeline_actions.S3DeployAction({
      actionName: 'S3Deploy',
      input: buildOutput,
      bucket: deployBucket,
      runOrder: 1
    })

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    })
    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction]
    })
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction]
    })
  }
}
