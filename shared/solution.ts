import { execSync } from "child_process";

const [day, part] = process.argv.slice(2);

if (!day || !part) {
  console.error("Usage: npm run sln <day> <part>");
  process.exit(1);
}

const filePath = `day${day}/part${part}.ts`;

try {
  execSync(`tsx ${filePath}`, { stdio: "inherit" });
} catch (err) {
  console.error(`Failed to run ${filePath}`);
  process.exit(1);
}