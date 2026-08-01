/**
 * Extracts relevant code blocks/lines safely from source file content.
 */
export function extractCodeContext(fileContent, options = {}) {
  if (!fileContent || typeof fileContent !== 'string') {
    return {
      content: '',
      lineCount: 0,
      truncated: false
    };
  }

  const lines = fileContent.split(/\r?\n/);
  const maxLines = options.maxLines || 300;

  if (lines.length <= maxLines) {
    return {
      content: fileContent,
      lineCount: lines.length,
      truncated: false
    };
  }

  // Extract head section for context trimming
  const headLines = lines.slice(0, maxLines);
  return {
    content: headLines.join('\n') + `\n/* ... Truncated remaining ${lines.length - maxLines} lines for prompt context boundary ... */`,
    lineCount: maxLines,
    truncated: true
  };
}
