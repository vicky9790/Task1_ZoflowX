import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(API_KEY);


export async function analyzeCompanyWithGemini(company) {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Set VITE_GEMINI_API_KEY in your .env file.");
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { responseMimeType: "application/json" }
  });

  const score = Math.min(100, company.signals.reduce((sum, s) => sum + (s.weight || 10), 0));
  const businessPotential = score >= 70 ? "High" : score >= 50 ? "Medium" : "Low";

  const prompt = `
Analyze the following company profile and signals to evaluate their likelihood of needing B2B services:

Company Name: ${company.name}
Industry: ${company.industry}
Description: ${company.description}
Employees: ${company.employees}
Stage: ${company.size}
Location: ${company.location}

Signals Detected:
${company.signals.map(s => `- [${s.date}] via ${s.source}: ${s.detail} (Type: ${s.type})`).join('\n')}

Based on this information, provide a structured JSON analysis. Make sure to:
1. Determine an opportunityScore (0-100) reflecting their likelihood to convert.
2. Provide a scoreBreakdown array where each object has a "signal" (string) and "impact" (number). The sum of all impact values MUST EXACTLY EQUAL totalScore.
3. Never display a score greater than 100. If totalScore exceeds 100, automatically cap it at 100 and adjust the breakdown.
4. Determine businessPotential ("High", "Medium", or "Low").
5. Write a detailed AI justification explaining why they got this score.
6. Specify a recommendedService that fits their technology stack or expansion signals.
7. Suggest a recommendedAction for a sales representative (as a string with newlines if multiple).
8. Write a complete prospecting email draft targeting their team.

Your response MUST be a valid JSON object matching this structure exactly:
{
  "opportunityScore": 75,
  "scoreBreakdown": [
    { "signal": "Funding Round", "impact": 30 },
    { "signal": "Talent Scaling", "impact": 20 }
  ],
  "totalScore": 75,
  "businessPotential": "High",
  "reason": "...",
  "recommendedService": "...",
  "recommendedAction": "...",
  "outreachEmail": "..."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini API Error (Falling back to simulated AI data):", error);
    
    
    let totalScore = 0;
    const scoreBreakdown = company.signals.map(s => {
      let impact = s.weight || 10;
      totalScore += impact;
      const label = s.type === "funding" ? "Funding Round" : 
                    s.type === "hiring" ? "Talent Scaling" :
                    s.type === "expansion" ? "Market Expansion" :
                    s.type === "product_launch" ? "Product Launch" : "Business Signal";
      return { signal: label, impact };
    });
    
    if (totalScore > 100) {
      const diff = totalScore - 100;
      scoreBreakdown[0].impact -= diff;
      totalScore = 100;
    }

    return {
      opportunityScore: totalScore,
      scoreBreakdown: scoreBreakdown,
      totalScore: totalScore,
      businessPotential: company.businessPotential,
      // Reason (AI justification)
      reason: `${company.name} exhibits strong growth indicators, including ${scoreBreakdown.map(item => `${item.signal.toLowerCase()} (+${item.impact})`).join(', ')}, suggesting a high likelihood to invest in external services.`,
      // Recommended service based on signals
      recommendedService: "Strategic Advisory & Process Optimization",
      // Recommended action for sales rep
      recommendedAction: "1. Initiate a discovery call to understand strategic priorities.\n2. Share a tailored advisory proposal highlighting scaling support.",
      // Outreach email draft
      outreachEmail: `Subject: Partnering with ${company.name} for Scalable Growth

Hi ${company.name} Team,

I noticed your recent ${scoreBreakdown[0].signal.toLowerCase()} and the momentum it brings. At [Your Company], we specialize in helping fast‑growing firms like yours streamline operations and accelerate market expansion.

Would you be open to a brief call next week to explore how we can support your growth objectives?

Best regards,
[Your Name]
[Your Title]
[Your Company]`
    };
  }
}
