import {
  SecretsManagerClient,
  GetSecretValueCommand
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "ap-south-1"
});


let secretsPromise;

const fetchSecrets = async () => {
      try {
        const secretId = process.env?.aws_secrete_maneger_id || process.env?.AWS_SECRET_MANAGER_ID;
        if (!secretId) {
          throw new Error("Secrets Manager id is missing in environment variables");
        }
        const command = new GetSecretValueCommand({
        SecretId: secretId
      });

      const response = await client.send(command);

      return JSON.parse(response.SecretString);
      } catch (error) {
        console.log("error while fetching the scerets", error)
        throw error
      }
}

export async function getSecrets() {
  if (!secretsPromise) {
    secretsPromise = fetchSecrets().catch((error) => {
      secretsPromise = undefined;
      throw error;
    });
  }
  return secretsPromise;
}
