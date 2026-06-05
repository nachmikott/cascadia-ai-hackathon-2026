import fs from "fs";
import path from "path";

export default function ArchitecturePage() {
  const svg = fs.readFileSync(path.join(process.cwd(), "architecture-diagram.svg"), "utf-8");
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 1100 }} dangerouslySetInnerHTML={{ __html: svg }}/>
    </div>
  );
}
