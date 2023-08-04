-- CreateTable
CREATE TABLE "Record" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "organization" TEXT NOT NULL,
  "link" TEXT NOT NULL,
  "date" TIMESTAMP(3),
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "categoryId" INTEGER,
  "author" TEXT NOT NULL,
  "textSearch" TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', title) || ' ' ||
    to_tsvector('english', content) || ' ' ||
    to_tsvector('simple', organization) || ' ' ||
    to_tsvector('simple', author)
  ) STORED,

  CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,

  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Record_slug_key" ON "Record"("slug");

-- CreateIndex
CREATE INDEX "Record_search_idx" ON "Record" USING GIN ("textSearch");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
