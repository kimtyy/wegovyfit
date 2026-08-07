import { NextResponse } from "next/server";
import { getSystemPrompt } from "@/lib/prompts";
import { checkAndSanitizeSafety } from "@/lib/safetyFilter";
import { getGlp1Summary } from "@/lib/glp1Calc";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userText = body.text || "";

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    const dynamicContext = getGlp1Summary(userText);
    const systemPrompt = getSystemPrompt(dynamicContext);

    if (!apiKey || apiKey === "your_anthropic_api_key_here") {
      // Fallback deterministic response when API Key is not set in dev
      const safeText = checkAndSanitizeSafety(
        `위고비핏 AI 분석 결과입니다.\n\n${dynamicContext}\n\n질문하신 "${userText}" 내용에 대해, 투여 초기에는 단백질을 매일 식사 때마다 나눠 섭취하시는 것이 근손실 예방에 가장 중요합니다.`
      );
      return NextResponse.json({ text: safeText, evidence: "GLP-1 Pharmacokinetics Data" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userText }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API failed: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || "답변을 불러오지 못했습니다.";
    const safeText = checkAndSanitizeSafety(rawText);

    return NextResponse.json({ text: safeText, evidence: "Cell Metabolism & FDA Clinical Data" });
  } catch {
    return NextResponse.json(
      {
        text: "위고비핏 AI 서비스 응답 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        evidence: "서버 오류",
      },
      { status: 500 }
    );
  }
}
