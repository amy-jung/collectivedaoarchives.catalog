-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "address" VARCHAR(42),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Submission_url_key" ON "Submission"("url");
