import { NextRequest, NextResponse } from "next/server";
import { getApplication } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";

// Mock data for development when Redis is not available
const mockApplication = {
  account: { type: "free" },
  contact: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567"
  },
  roles: {
    onDemand: ["driver"],
    warehouse: []
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === "development";
    
    // The middleware.ts file already protects this route with auth.protect()
    // We can get the authenticated user ID from the auth() function
    const authObject = await auth();
    const authenticatedUserId = authObject.userId;
    
    // Log for debugging
    console.log("Auth check:", { authenticatedUserId, requestedUserId: params.userId });
    
    // Only allow users to access their own data (skip in development if needed)
    if (!isDev && (!authenticatedUserId || authenticatedUserId !== params.userId)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Try to get the application data from Redis
    try {
      const application = await getApplication(params.userId);
      
      if (application) {
        return NextResponse.json(application);
      }
      
      // If we're in development and no application is found, return mock data
      if (isDev) {
        console.log("Using mock application data for development");
        return NextResponse.json(mockApplication);
      }
      
      // In production, return a 404 if no application is found
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    } catch (redisError) {
      console.error("Redis error:", redisError);
      
      // In development, return mock data if Redis fails
      if (isDev) {
        console.log("Redis error in development, using mock data");
        return NextResponse.json(mockApplication);
      }
      
      throw redisError; // Re-throw for production error handling
    }

  } catch (error) {
    console.error("Error in application API:", error);
    return NextResponse.json(
      { error: "Failed to fetch application", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
