/**
 * WegovyFit AI Safety Filter & Non-Diagnostic Guardrails
 */

const PRESCRIPTION_DIRECTIVE_REGEX =
  /(?:약을|투여량을|용량을|주사\s*용량을)\s*(?:끊|바꾸|줄이|늘리|중단하|임의로\s*조절)(?:세요|하십시오)?/i;

export const SAFE_DISCLAIMER =
  "\n\n※ 본 서비스는 비의료 영양·습관 참고용 가이드이며, 약물 용량 조절 및 부작용 조치는 반드시 담당 의사 또는 약사와 상의하세요.";

export function checkAndSanitizeSafety(text: string): string {
  if (!text || typeof text !== "string") return "";

  if (PRESCRIPTION_DIRECTIVE_REGEX.test(text)) {
    return (
      "위고비핏은 의약품 용량을 변경하거나 처방하지 않습니다. 주사 용량 변경이나 구체적인 부작용 처치는 담당 의사 또는 약사와 상담을 통해 결정해 주세요." +
      SAFE_DISCLAIMER
    );
  }

  if (!text.includes("의사") && !text.includes("약사") && !text.includes("참고")) {
    return text + SAFE_DISCLAIMER;
  }

  return text;
}
