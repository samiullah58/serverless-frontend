import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute
} from "amazon-cognito-identity-js"

// ---------------------------
// Utility: Get Cognito User Pool
// ---------------------------
const getUserPool = () => {
  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID

  if (!userPoolId || !clientId) {
    console.error(
      "[v0] Missing Cognito configuration. Please set NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_CLIENT_ID environment variables."
    )
    throw new Error("Cognito configuration is missing. Please check your environment variables.")
  }

  // Validate format (should look like: us-east-1_xxxxx)
  const userPoolIdRegex = /^[\w-]+_[0-9a-zA-Z]+$/
  if (!userPoolIdRegex.test(userPoolId)) {
    console.error("[v0] Invalid UserPoolId format:", userPoolId)
    throw new Error(
      `Invalid UserPoolId format. Expected format: region_id (e.g., us-east-1_AbCdEf), got: ${userPoolId}`
    )
  }

  return new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId
  })
}

let userPool: CognitoUserPool | null = null
const getPool = () => {
  if (!userPool) userPool = getUserPool()
  return userPool
}

// ---------------------------
// Types
// ---------------------------
export interface AuthUser {
  username: string
  email: string
  token: string
}

// ---------------------------
// Sign up
// ---------------------------
export const signUp = (email: string, password: string, username: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const pool = getPool()
      const attributes = [
        new CognitoUserAttribute({ Name: "email", Value: email })
      ]

      pool.signUp(username, password, attributes, [], (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// ---------------------------
// Sign in
// ---------------------------
export const signIn = (username: string, password: string): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    try {
      const pool = getPool()
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      })

      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: pool
      })

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const token = result.getIdToken().getJwtToken()
          const user: AuthUser = {
            username,
            email: result.getIdToken().payload.email || "",
            token
          }

          // Save in localStorage for persistence
          if (typeof window !== "undefined") {
            localStorage.setItem("authToken", token)
            localStorage.setItem("authUser", JSON.stringify(user))
          }

          resolve(user)
        },
        onFailure: (err) => reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// ---------------------------
// Confirm sign up (OTP verification)
// ---------------------------
export const confirmSignUp = (username: string, code: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const pool = getPool()
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: pool
      })

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// ---------------------------
// Resend confirmation code
// ---------------------------
export const resendConfirmationCode = (username: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const pool = getPool()
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: pool
      })

      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// ---------------------------
// Sign out
// ---------------------------
export const signOut = (): void => {
  try {
    const pool = getPool()
    const cognitoUser = pool.getCurrentUser()
    if (cognitoUser) cognitoUser.signOut()
  } catch (error) {
    console.error("[v0] Error during sign out:", error)
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
  }
}

// ---------------------------
// Get current authenticated user
// ---------------------------
export const getCurrentUser = (): Promise<AuthUser | null> => {
  return new Promise((resolve) => {
    try {
      const pool = getPool()
      const cognitoUser = pool.getCurrentUser()

      // 🟢 Fallback: if CognitoUser not found, read from localStorage
      if (!cognitoUser && typeof window !== "undefined") {
        const saved = localStorage.getItem("authUser")
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as AuthUser
            return resolve(parsed)
          } catch {
            localStorage.removeItem("authUser")
          }
        }
      }

      if (!cognitoUser) {
        resolve(null)
        return
      }

      cognitoUser.getSession((err: any, session: any) => {
        if (err || !session?.isValid()) {
          resolve(null)
          return
        }

        const token = session.getIdToken().getJwtToken()
        const user: AuthUser = {
          username: cognitoUser.getUsername(),
          email: session.getIdToken().payload.email || "",
          token
        }

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token)
          localStorage.setItem("authUser", JSON.stringify(user))
        }

        resolve(user)
      })
    } catch (error) {
      console.error("[v0] Error getting current user:", error)
      resolve(null)
    }
  })
}

// ---------------------------
// Get raw token
// ---------------------------
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}
