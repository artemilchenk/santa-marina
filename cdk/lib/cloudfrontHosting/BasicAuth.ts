/* eslint-disable no-tabs */
import { Construct } from 'constructs'
import { Function, FunctionCode } from 'aws-cdk-lib/aws-cloudfront'
import { getRandomValues } from 'crypto'

interface BasicAuthProps {
  username: string;
  password?: string;
}
const generateRandomPassword = (length: number): string => {
  const randomBytes = new Uint8Array(length)
  getRandomValues(randomBytes)
  return Buffer.from(randomBytes).toString('base64').toLowerCase()
}

export class BasicAuthFunction extends Function {
  readonly password: string
  constructor (scope: Construct, id: string, props: BasicAuthProps) {
    if (!props.password) {
      props.password = generateRandomPassword(6)
    }
    super(scope, id, {
      comment: 'Basic Auth',
      functionName: props.password,
      code: FunctionCode.fromInline(`
			function handler(event) {
				var authHeaders = event.request.headers.authorization;
				var expected = "Basic ${Buffer.from(
					props.username + ':' + props.password
				).toString('base64')}";
				if (authHeaders && authHeaders.value === expected) {
					return event.request;
				}
				var response = {
					statusCode: 401,
					statusDescription: "Unauthorized",
					headers: {
						"www-authenticate": {
							value: 'Basic realm="Enter credentials"',
						},
					},
				};

				return response;
			}
			`)
    })

    this.password = props.password
  }
}
