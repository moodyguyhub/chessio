-- Add role field to User table
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';

-- Create SeoPage table
CREATE TABLE "SeoPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeoPage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SeoPage_slug_key" ON "SeoPage"("slug");
CREATE INDEX "SeoPage_slug_idx" ON "SeoPage"("slug");

-- Create SeoKeyword table
CREATE TABLE "SeoKeyword" (
    "id" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "intent" TEXT,
    "archetype" TEXT,
    "notes" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoKeyword_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SeoKeyword_phrase_key" ON "SeoKeyword"("phrase");
CREATE INDEX "SeoKeyword_priority_idx" ON "SeoKeyword"("priority");

-- Create ArticleStatus enum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'OUTLINED', 'WRITING', 'LIVE');

-- Create ArticleIdea table
CREATE TABLE "ArticleIdea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "targetKeyword" TEXT,
    "archetype" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleIdea_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ArticleIdea_status_idx" ON "ArticleIdea"("status");

-- Create AiPromptTemplate table
CREATE TABLE "AiPromptTemplate" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPromptTemplate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiPromptTemplate_role_idx" ON "AiPromptTemplate"("role");
