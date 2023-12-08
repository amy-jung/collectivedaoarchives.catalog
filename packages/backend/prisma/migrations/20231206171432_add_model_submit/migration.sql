-- CreateTable
CREATE TABLE "Submit" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "address" VARCHAR(42),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Submit_url_key" ON "Submit"("url");
