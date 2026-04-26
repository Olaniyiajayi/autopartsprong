// AWS Cognito direct USER_PASSWORD_AUTH client (no SDK).
// User Pool: us-east-1_A7UFJyK0Y

export const COGNITO_REGION = "us-east-1";
export const COGNITO_USER_POOL_ID = "us-east-1_A7UFJyK0Y";
export const COGNITO_CLIENT_ID = "28aapkp4rdnku436vjgp40unij";
const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`;

const TOKEN_STORAGE_KEY = "cognito.session";

export type CognitoSession = {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // epoch ms
  email: string;
};

export type CognitoError = {
  __type?: string;
  message?: string;
};

async function cognitoCall<T>(target: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(COGNITO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as CognitoError;
    const msg = err.message || err.__type || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

type InitiateAuthResponse = {
  AuthenticationResult?: {
    IdToken: string;
    AccessToken: string;
    RefreshToken?: string;
    ExpiresIn: number;
    TokenType: string;
  };
  ChallengeName?: string;
  Session?: string;
  ChallengeParameters?: Record<string, string>;
};

export async function signInWithPassword(email: string, password: string): Promise<CognitoSession> {
  const data = await cognitoCall<InitiateAuthResponse>("InitiateAuth", {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  if (!data.AuthenticationResult) {
    throw new Error(
      data.ChallengeName
        ? `Additional challenge required: ${data.ChallengeName}`
        : "Authentication failed",
    );
  }

  const result = data.AuthenticationResult;
  const session: CognitoSession = {
    idToken: result.IdToken,
    accessToken: result.AccessToken,
    refreshToken: result.RefreshToken,
    expiresAt: Date.now() + result.ExpiresIn * 1000,
    email,
  };
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function getSession(): CognitoSession | null {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as CognitoSession;
    if (!s.idToken || !s.expiresAt) return null;
    if (Date.now() >= s.expiresAt) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function signOut() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
