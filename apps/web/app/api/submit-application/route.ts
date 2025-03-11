import { NextRequest, NextResponse } from "next/server";
import { useAuth } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = useAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { account, contact, roles } = body;

    // Validate required fields
    if (!account || !contact || !roles) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Here you would typically store the application data in your database
    // For example, using Prisma, MongoDB, or another database client

    // For now, we'll just log the data and return a success response
    console.log("Application submitted:", {
      userId,
      account,
      contact,
      roles,
      submittedAt: new Date().toISOString(),
    });

    // Return success response
    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: `app-${Date.now()}-${userId.substring(0, 8)}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
