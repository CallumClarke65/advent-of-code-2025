import { execSync } from "child_process";

const [day] = process.argv.slice(2);

if (!day) {
  console.error("Usage: npm run sln <day>");
  process.exit(1);
}

const filePath = `day${day}/debug.ts`;

try {
  execSync(`tsx ${filePath}`, { stdio: "inherit" });
} catch (err) {
  console.error(`Failed to run ${filePath}`);
  process.exit(1);
}