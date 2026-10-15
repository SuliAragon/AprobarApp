import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { b3t6QuestionBank } from "../src/data/b3t6-practice.mjs";

const directory = mkdtempSync(join(tmpdir(), "aprobarapp-b3t6-"));
const coded = b3t6QuestionBank.filter((question) => question.code);
const expected = (question) => question.options.find((option) => option.id === question.correctOption).label;
const run = (command, args, options = {}) => execFileSync(command, args, {
  encoding: "utf8", timeout: 120000, maxBuffer: 8 * 1024 * 1024, ...options,
});

try {
  for (const [language, compiler, standard] of [["C", "clang", "c11"], ["C++", "clang++", "c++17"]]) {
    const questions = coded.filter((question) => question.codeLanguage === language);
    for (const question of questions) {
      const source = join(directory, language === "C" ? "program.c" : "program.cpp");
      const executable = join(directory, "program");
      writeFileSync(source, question.code);
      run(compiler, [`-std=${standard}`, "-Wall", "-Wextra", "-Werror", source, "-o", executable]);
      assert.equal(run(executable, []).trim(), expected(question), question.id);
    }
    console.log(`${language}: ${questions.length} programas compilados y resultados verificados.`);
  }

  const java = coded.filter((question) => question.codeLanguage === "Java");
  const javaFiles = java.map((question, index) => {
    const name = `Programa${index}`;
    const file = join(directory, `${name}.java`);
    writeFileSync(file, question.code.replace(/\bPrograma\b/g, name));
    return file;
  });
  run("javac", ["-d", directory, ...javaFiles]);
  for (const [index, question] of java.entries()) {
    assert.equal(run("java", ["-cp", directory, `Programa${index}`]).trim(), expected(question), question.id);
  }
  console.log(`Java: ${java.length} programas compilados y resultados verificados.`);

  const csharp = coded.filter((question) => question.codeLanguage === "C#");
  const csDirectory = join(directory, "csharp");
  mkdirSync(csDirectory);
  for (const [index, question] of csharp.entries()) {
    writeFileSync(join(csDirectory, `Programa${index}.cs`), question.code.replace(/\bPrograma\b/g, `Programa${index}`));
  }
  const sdkMajor = Number.parseInt(run("dotnet", ["--version"]), 10);
  const project = join(csDirectory, "Verification.csproj");
  writeFileSync(project, `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net${sdkMajor}.0</TargetFramework><StartupObject>Runner</StartupObject><RestoreSources></RestoreSources><NuGetAudit>false</NuGetAudit></PropertyGroup></Project>`);
  writeFileSync(join(csDirectory, "Runner.cs"), `class Runner { public static void Main() { ${csharp.map((_, index) => `Programa${index}.Main(); System.Console.WriteLine();`).join(" ")} } }`);
  const env = { ...process.env, DOTNET_CLI_HOME: join(directory, "dotnet-home"), NUGET_PACKAGES: join(directory, "packages"), DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_SKIP_FIRST_TIME_EXPERIENCE: "1", DOTNET_GENERATE_ASPNET_CERTIFICATE: "false" };
  run("dotnet", ["build", project, "--nologo", "--verbosity", "quiet", "--ignore-failed-sources", "-o", join(csDirectory, "out")], { env });
  const csOutput = run("dotnet", [join(csDirectory, "out", "Verification.dll")], { env }).trim().split(/\r?\n/);
  assert.deepEqual(csOutput, csharp.map(expected));
  console.log(`C#: ${csharp.length} programas compilados y resultados verificados.`);
  assert.equal(coded.length, 80);
  console.log("B3T6: las 80 salidas coinciden con las respuestas de practica.");
} finally {
  rmSync(directory, { recursive: true, force: true });
}
