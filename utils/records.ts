import fs from "fs";
import matter from "gray-matter";
import path from "path";

export type CatalogRecord = {
  slug: string;
  title: string;
  date: string;
  protocol: string;
  link: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
};

// Get all the file names from all records in /records
export function getRecordsNames() {
  const postsDirectory = path.join(process.cwd(), "records");
  // All files in records, lets remove the extension from the file name
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => fileName.replace(/\.md$/, ""));
}

// Get the record (metadata fields + contnet) of the given slug
export function getRecordBySlug(slug: string) {
  const recordsDirectory = path.join(process.cwd(), "records");
  const fullPath = path.join(recordsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  // Return a Record type with the data and content (but move data to the top level)
  return { ...data, content, slug } as CatalogRecord;
}

// This function returns all posts with the specified fields
export function getAllRecords(): CatalogRecord[] | null {
  const slugs = getRecordsNames();
  // filter out the null records

  return slugs.map(slug => getRecordBySlug(slug)).filter(record => record !== null) as CatalogRecord[];
}
