import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchUserAttributes, type FetchUserAttributesOutput } from 'aws-amplify/auth';

export function configureWorkerAuth() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_WORKER_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_WORKER_USER_POOL_CLIENT_ID!,
        identityPoolId: process.env.NEXT_PUBLIC_WORKER_IDENTITY_POOL_ID!,
        loginWith: {
          email: true,
        },
        signUpVerificationMethod: "code" as const,
        userAttributes: {
          email: {
            required: true,
          },
          given_name: {
            required: true,
          },
          family_name: {
            required: true,
          },
          phone_number: {
            required: true,
          },
          birthdate: {
            required: true,
          },
          address: {
            required: true,
          }
        },
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: true,
        },
      },
    },
  });
}

// Type for authenticated worker data
export type AuthenticatedWorker = {
  userId: string;
  username: string;
  attributes: FetchUserAttributesOutput;
  signInDetails: any; // Using any for signInDetails to avoid import issues
};

// Helper function to get the current authenticated worker
export async function getAuthenticatedWorker(): Promise<AuthenticatedWorker | null> {
  try {
    const currentUser = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    
    return {
      userId: currentUser.userId,
      username: currentUser.username,
      attributes,
      signInDetails: currentUser.signInDetails,
    };
  } catch (error) {
    console.error("Error getting authenticated worker:", error);
    return null;
  }
}

// Type for worker application data
export type WorkerApplication = {
  account: { 
    plan: "free" | "preferred";
    type?: string;
  };
  contact: {
    username: string;
    firstName: string;
    lastName: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  roles: {
    onDemand: string[];
    warehouse: string[];
  };
  password?: string;
};

// Helper function to format worker application data from Cognito attributes
export function formatWorkerApplicationFromCognito(attributes: FetchUserAttributesOutput): WorkerApplication {
  // Create a safe getter function for attributes that handles undefined values
  const getAttr = (key: string): string => {
    const value = attributes[key];
    return typeof value === 'string' ? value : '';
  };
  
  // Get account type and convert to plan
  const accountType = getAttr('custom:accountType') || 'free';
  const plan = accountType === 'preferred' ? 'preferred' as const : 'free' as const;
  
  return {
    account: { 
      plan: plan,
      type: accountType
    },
    contact: {
      username: getAttr('preferred_username') || (getAttr('email') ? getAttr('email').split('@')[0] : ''),
      firstName: getAttr('given_name'),
      lastName: getAttr('family_name'),
      city: getAttr('custom:city') || '',
      state: getAttr('custom:state') || '',
      zip: getAttr('custom:zip') || '',
      email: getAttr('email'),
      phone: getAttr('phone_number'),
      dateOfBirth: getAttr('birthdate') || '',
    },
    roles: {
      onDemand: getAttr('custom:onDemandRoles') ? getAttr('custom:onDemandRoles').split(',') : [],
      warehouse: getAttr('custom:warehouseRoles') ? getAttr('custom:warehouseRoles').split(',') : [],
    }
  };
}
