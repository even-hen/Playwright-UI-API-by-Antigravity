import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export default class AiFailureReporter implements Reporter {
  async onTestEnd(test: TestCase, result: TestResult) {
    // Only run on failures/timeouts
    if (result.status !== 'failed' && result.status !== 'timedOut') {
      return;
    }

    if (!apiKey) {
      // Just print a small reminder, but do not fail or crash
      return;
    }

    const testName = test.title;
    const testFile = `${test.location.file}:${test.location.line}`;
    const errorMessage = result.error?.message || 'No direct error message';
    const errorStack = result.error?.stack || 'No stack trace available';

    // Format steps for richer context
    const stepsSummary = result.steps
      .map((step) => {
        const statusIcon = step.error ? '❌' : '✅';
        return `  ${statusIcon} [${step.category}] ${step.title} (${step.duration}ms)`;
      })
      .join('\n');

    const prompt = `
      You are an expert Test Automation and Debugging Engineer. A test in our Playwright TypeScript suite has failed.
      Please analyze the error message, the stack trace, and the steps leading up to the failure.
      Explain the likely root cause of the failure and suggest a specific code fix, selector repair, or config adjustment.

      ==================================================
      🚨 FAILING TEST DETAILS:
      ==================================================
      Test Name: "${testName}"
      Location: ${testFile}
      Status: ${result.status.toUpperCase()}
      
      ==================================================
      📜 EXECUTED STEPS:
      ==================================================
      ${stepsSummary || 'No step metadata recorded.'}
      
      ==================================================
      💥 ERROR MESSAGE & STACK TRACE:
      ==================================================
      Error: ${errorMessage}
      
      Stack:
      ${errorStack}
    `;

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });

      const analysis = response.text || 'Unable to generate analysis.';

      console.log(`\n🤖 Playwright AI Failure Diagnostics 🤖`);
      console.log(`======================================================================`);
      console.log(`Test: "${testName}"`);
      console.log(`File: ${testFile}`);
      console.log(`======================================================================`);
      console.log(analysis);
      console.log(`======================================================================\n`);
    } catch (err: any) {
      console.error('⚠️ Playwright AI Failure Diagnostics failed to execute:', err.message || err);
    }
  }
}
