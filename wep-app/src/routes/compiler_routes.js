const express = require("express");
const { v4: uuidv4 } = require("uuid");
var fs = require("fs");
const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const router = express.Router();

router.get("", (req, res) => {
  locals = {
    selectedLanguage: req.query.language || "c_cpp",
    fileExtension: "c",
    defaultFunction: "",
    terminalOutput: "",
  };

  if (req.session && req.session.terminalOutput) {
    locals.terminalOutput = req.session.terminalOutput;
  }

  switch (locals.selectedLanguage) {
    case "c_cpp":
      locals.fileExtension = "c";
      if (req.session && req.session.defaultFunction && req.session.language === "c")
        locals.defaultFunction = req.session.defaultFunction;
      else
        locals.defaultFunction =
          '// Online C compiler to run C program online\n#include <stdio.h>\n\nint main() {\n    // Write C code here\n    printf("Hello World from C!");\n\n    return 0;\n}';
      break;
    case "python":
      locals.fileExtension = "py";
      if (req.session && req.session.defaultFunction && req.session.language === "python")
        locals.defaultFunction = req.session.defaultFunction;
      else
        locals.defaultFunction =
          '# Online Python compiler (interpreter) to run Python online.\n# Write Python 3 code in this online editor and run it.\nprint("Hello World from Python!")';
      break;
    case "java":
      locals.fileExtension = "java";
      if (req.session && req.session.defaultFunction && req.session.language === "java")
        locals.defaultFunction = req.session.defaultFunction;
      else
        locals.defaultFunction =
          '// Online Java Compiler\n// Use this editor to write, compile and run your Java code online\n\nclass HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello World from Java");\n    }\n}';
      break;
  }
  return res.render("Home", { locals });
});

router.post("/c_cpp", async (req, res) => {
  const filepath = path.join("temp/", uuidv4() + ".c");
  const code = req.body.codeContent || "";
  req.session.defaultFunction = code;
  req.session.language = "c";

  fs.open(filepath, "w", (err, file) => {
    if (err) {
      console.error(err);
      throw err;
    }
    fs.write(
      file,
      code,
      (err,
      (writtenBytes) => {
        if (err) throw err;
      })
    );
    fs.close(file);
  });

  try {
    await exec(
      `gcc ${filepath} -o ./temp/program && chmod u+x ./temp/program && ./temp/program`,
      { timeout: 10000 },
      (err, stdout, stderr) => {
        if (err) {
          req.session.terminalOutput = err.stderr || err.message;
        } else {
          req.session.terminalOutput = stdout;
        }
        return res.redirect("/?language=c_cpp");
      }
    );
  } catch (e) {
    req.session.terminalOutput = e.message;
    return res.redirect("/?language=c_cpp");
  }

  return res.redirect("/?language=c_cpp");
});

router.post("/python", async (req, res) => {
  const filepath = path.join("temp/", uuidv4() + ".py");
  const code = req.body.codeContent || "";
  req.session.defaultFunction = code;
  req.session.language = "python";

  fs.open(filepath, "w", (err, file) => {
    if (err) throw err;
    fs.write(
      file,
      code,
      (err,
      (writtenBytes) => {
        if (err) throw err;
      })
    );
    fs.close(file);
  });

  try {
    await exec(
      `python3 ${filepath}`,
      { timeout: 10000 },
      (err, stdout, stderr) => {
        if (err) {
          req.session.terminalOutput = err.stderr || err.message;
        } else {
          req.session.terminalOutput = stdout;
        }
        return res.redirect("/?language=python");
      }
    );
  } catch (e) {
    req.session.terminalOutput = e.message;
    return res.redirect("/?language=python");
  }

  return res.redirect("/?language=python");
});

router.post("/java", async (req, res) => {
  const filepath = path.join("temp/", uuidv4() + ".java");
  const code = req.body.codeContent || "";
  const classNameMatch = code.match(/class\s+(\w+)\s*\{/);
  const className = classNameMatch ? classNameMatch[1] : null;
  req.session.defaultFunction = code;
  req.session.language = "java";

  fs.open(filepath, "w", (err, file) => {
    if (err) throw err;
    fs.write(
      file,
      code,
      (err,
      (writtenBytes) => {
        if (err) throw err;
      })
    );
    fs.close(file);
  });

  try {
    await exec(
      `javac ${filepath} && java -classpath temp ${className}`,
      { timeout: 10000 },
      (err, stdout, stderr) => {
        if (err) {
          req.session.terminalOutput = err.stderr || err.message;
        } else {
          req.session.terminalOutput = stdout;
        }
        return res.redirect("/?language=java");
      }
    );
  } catch (e) {
    req.session.terminalOutput = e.message;
    return res.redirect("/?language=java");
  }

  return res.redirect("/?language=java");
});

module.exports = router;
