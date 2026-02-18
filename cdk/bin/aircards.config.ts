import * as path from "path";

export type TCdkConfig = {
  REPO_NAME: string;
};

export const CdkConfig: TCdkConfig = {
  REPO_NAME: path.basename(path.resolve(__dirname, "../..")) || "",
};

export type TAwsAccount = {
  ACCOUNT_NUMBER: string;
  CONNECTION_ARN: string;
  CACHE_POLICY_ID?: string;
};

export const AircardsStaging: TAwsAccount = {
  ACCOUNT_NUMBER: "275649731663",
  CONNECTION_ARN:
    "arn:aws:codestar-connections:us-east-1:275649731663:connection/ffe5c3a4-4ed2-4847-bf86-a0a3f2286c41",
  CACHE_POLICY_ID: "e08982f0-49be-440e-9527-68026b3347b5",
};
export const AircardsProduction: TAwsAccount = {
  ACCOUNT_NUMBER: "104924253456",
  CONNECTION_ARN:
    "arn:aws:codestar-connections:us-east-1:104924253456:connection/b3448cd1-e41f-4a96-8bed-d72a655c9c3b",
};
