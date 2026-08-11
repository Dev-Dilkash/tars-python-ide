import { ExecutionResult } from '../types';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL?: string }) => Promise<any>;
    pyodideInstance?: any;
  }
}

let pyodidePromise: Promise<any> | null = null;

export async function getPyodideInstance(onStatusUpdate?: (msg: string) => void) {
  if (window.pyodideInstance) {
    return window.pyodideInstance;
  }

  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      onStatusUpdate?.("Initializing Python WebAssembly runtime...");
      if (typeof window.loadPyodide !== "function") {
        // Wait or load script if CDN wasn't fast enough
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide from CDN"));
          document.head.appendChild(script);
        });
      }

      const pyodide = await window.loadPyodide!({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      });

      onStatusUpdate?.("Python 3.11 environment ready.");
      window.pyodideInstance = pyodide;
      return pyodide;
    })();
  }

  return pyodidePromise;
}

/**
 * Executes Python code using Pyodide with custom stdout/stderr and pre-loaded or interactive stdin inputs.
 */
export async function runPythonCode(
  code: string,
  userInputs: string[] = [],
  onStatusUpdate?: (status: string) => void
): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    const pyodide = await getPyodideInstance(onStatusUpdate);

    // Python wrapper script to redirect stdout/stderr and override input()
    const pyScript = `
import sys
import io
import builtins

_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()

sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer

_user_inputs = ${JSON.stringify(userInputs)}
_input_index = 0

def _custom_input(prompt=""):
    global _input_index
    if prompt:
        sys.stdout.write(str(prompt))
        sys.stdout.flush()
    if _input_index < len(_user_inputs):
        val = _user_inputs[_input_index]
        _input_index += 1
        sys.stdout.write(str(val) + "\\n")
        sys.stdout.flush()
        return val
    else:
        raise EOFError("INPUT_NEEDED:" + str(prompt))

builtins.input = _custom_input

_execution_error = None
try:
    exec(${JSON.stringify(code)}, {'__name__': '__main__'})
except Exception as e:
    import traceback
    _execution_error = traceback.format_exc()

_out_val = _stdout_buffer.getvalue()
_err_val = _stderr_buffer.getvalue()

(_out_val, _err_val, _execution_error)
`;

    const [stdout, stderr, pyError] = await pyodide.runPythonAsync(pyScript);
    const executionTimeMs = Math.round(performance.now() - startTime);

    if (pyError && pyError.includes("EOFError: INPUT_NEEDED:")) {
      const promptText = pyError.split("EOFError: INPUT_NEEDED:")[1]?.trim() || "Enter input:";
      return {
        stdout: stdout || "",
        stderr: stderr || "",
        waitingForInput: true,
        inputPrompt: promptText,
        executionTimeMs,
      };
    }

    if (pyError) {
      return {
        stdout: stdout || "",
        stderr: stderr || "",
        error: pyError,
        executionTimeMs,
      };
    }

    return {
      stdout: stdout || "",
      stderr: stderr || "",
      executionTimeMs,
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      stdout: "",
      stderr: "",
      error: err.message || String(err),
      executionTimeMs,
    };
  }
}
