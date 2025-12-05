/**
 * API Error Handling Utilities
 *
 * Wraps backend errors to ensure no technical details leak to the client.
 * All API routes should use these helpers.
 */

import { NextResponse } from "next/server";

// User-friendly error messages
const FRIENDLY_MESSAGES = {
  default: "Something went wrong. Please try again.",
  notFound: "We couldn't find what you're looking for.",
  unauthorized: "Please sign in to continue.",
  forbidden: "You don't have permission to do that.",
  validation: "Please check your input and try again.",
  duplicate: "This already exists. Please try something different.",
  connection: "We're having trouble connecting. Please try again in a moment.",
} as const;

type ErrorType = keyof typeof FRIENDLY_MESSAGES;

// Prisma error detection using duck typing (works with Prisma 7 adapter pattern)
interface PrismaKnownError {
  code: string;
  name: string;
}

function isPrismaKnownError(error: unknown): error is PrismaKnownError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as PrismaKnownError).code === "string" &&
    (error as PrismaKnownError).code.startsWith("P")
  );
}

function isPrismaInitError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.name === "PrismaClientInitializationError"
  );
}

function isPrismaValidationError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.name === "PrismaClientValidationError"
  );
}

/**
 * Logs error server-side and returns a friendly message.
 * NEVER exposes technical details to the client.
 */
export function handleApiError(
  error: unknown,
  context?: string
): NextResponse<{ error: string }> {
  // Log full error server-side for debugging
  console.error(`[API Error]${context ? ` ${context}:` : ""}`, error);

  // Determine error type and status code
  let statusCode = 500;
  let errorType: ErrorType = "default";

  if (isPrismaKnownError(error)) {
    switch (error.code) {
      case "P2002": // Unique constraint violation
        statusCode = 409;
        errorType = "duplicate";
        break;
      case "P2025": // Record not found
        statusCode = 404;
        errorType = "notFound";
        break;
      case "P2003": // Foreign key constraint
      case "P2014": // Required relation violation
        statusCode = 400;
        errorType = "validation";
        break;
      default:
        statusCode = 500;
        errorType = "default";
    }
  } else if (isPrismaInitError(error)) {
    statusCode = 503;
    errorType = "connection";
  } else if (isPrismaValidationError(error)) {
    statusCode = 400;
    errorType = "validation";
  } else if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes("unauthorized") || error.message.includes("Unauthorized")) {
      statusCode = 401;
      errorType = "unauthorized";
    } else if (error.message.includes("forbidden") || error.message.includes("Forbidden")) {
      statusCode = 403;
      errorType = "forbidden";
    } else if (error.message.includes("not found") || error.message.includes("Not found")) {
      statusCode = 404;
      errorType = "notFound";
    }
  }

  return NextResponse.json(
    { error: FRIENDLY_MESSAGES[errorType] },
    { status: statusCode }
  );
}

/**
 * Creates a success response with consistent structure.
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

/**
 * Creates a friendly error response without logging.
 * Use when you want to return a specific error message.
 */
export function apiError(
  message: string,
  status = 400
): NextResponse<{ error: string }> {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Wraps an async API handler with automatic error handling.
 * Usage:
 *
 * export const POST = withErrorHandling(async (req) => {
 *   // Your logic here
 *   return apiSuccess({ data: "..." });
 * });
 */
export function withErrorHandling<T>(
  handler: (req: Request) => Promise<NextResponse<T>>,
  context?: string
) {
  return async (req: Request): Promise<NextResponse<T | { error: string }>> => {
    try {
      return await handler(req);
    } catch (error) {
      return handleApiError(error, context);
    }
  };
}
