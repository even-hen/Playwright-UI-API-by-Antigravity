import { GoogleGenAI } from '@google/genai';
import { Page, expect } from '@playwright/test';

// Use standard environment variable or custom override
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Warn if API key is not present
if (!apiKey) {
  console.warn(
    '⚠️ GEMINI_API_KEY is not defined in the environment. AI Visual UX Auditor will soft-skip validation.',
  );
}

/**
 * Asserts that the current page's visual layout adheres to the provided natural-language UX requirements.
 * Under the hood, this uses Google Gemini Vision capabilities to inspect the rendered page.
 *
 * If GEMINI_API_KEY is not set, it will soft-skip and log a warning to ensure the test suite remains green.
 *
 * @param page The Playwright Page instance
 * @param uxRequirements Natural language requirements for the UI (e.g. "The button should be aligned and visible")
 */
export async function assertVisualLayout(page: Page, uxRequirements: string) {
  if (!apiKey) {
    console.info(
      `⏭️ AI Visual UX Auditor skipped: GEMINI_API_KEY is not configured. requirements: "${uxRequirements}"`,
    );
    return;
  }

  // Ensure page has rendered / settled
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500); // Allow smooth transitions to settle

  // Take screenshot as base64
  const screenshotBuffer = await page.screenshot({ type: 'png' });
  const base64Image = screenshotBuffer.toString('base64');

  const systemInstructions = `
    You are an expert QA Engineer and UX/UI Designer. Your task is to audit the visual appearance of a web application screenshot.
    You will check if the page looks correct and follows the natural language design requirements provided by the user.
    
    Examine the page for the following visual bugs:
    - Alignment issues, overlapping text or containers.
    - Truncated text or unreadable content.
    - Broken images, blank page states, or severe color/contrast readability issues.
    - Incorrect layout relative to the prompt instructions.

    Return your verdict in exactly this format:
    
    ### VISUAL AUDIT RESULTS
    - **Observed Layout**: [Briefly describe the layout you see]
    - **Issues Detected**: [List any UX/UI bugs or "None" if clean]
    - **Final Verdict**: [Write exactly "PASS" if the requirements are met, or "FAIL" if there are severe visual bugs or unmet constraints]
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { text: systemInstructions },
        { text: `Requirements to satisfy:\n"${uxRequirements}"` },
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image,
          },
        },
      ],
    });

    const resultText = response.text || '';

    console.log(`\n🎨 AI Visual Audit Result for [${page.url()}]:\n`);
    console.log(resultText);
    console.log(`\n---------------------------------------\n`);

    // Parse the final verdict
    const verdictRegex = /Final Verdict:\s*\**\s*(PASS|FAIL)/i;
    const match = resultText.match(verdictRegex);
    const verdict = match ? match[1].toUpperCase() : 'FAIL';

    expect(verdict).toBe('PASS');
  } catch (error: any) {
    console.error('❌ Failed to run AI Visual UX Audit:', error.message || error);
    throw error;
  }
}
