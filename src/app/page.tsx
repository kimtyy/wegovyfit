"use client";

import { useState } from "react";
import { analyzeGlp1Input, Glp1AnalysisResult } from "@/lib/glp1Calc";

export default function Home() {
  // Calculator States
  const [drugName, setDrugName] = useState<"위고비 (Semaglutide)" | "마운자로 (Tirzepatide)" | "삭센다 (Liraglutide)">("위고비 (Semaglutide)");
  const [dosageMg, setDosageMg] = useState<number>(0.5);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [proteinInputG, setProteinInputG] = useState<number>(40);
  const [analysisResult, setAnalysisResult] = useState<Glp1AnalysisResult | null>(null);

  // Chat Drawer States
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "안녕하세요! 위고비핏 24시간 GLP-1 전용 AI 코치입니다. 위고비/마운자로 복용 중인 용량이나 메스꺼움, 단백질 섭취법 등 궁금한 점을 편하게 질문해 주세요.",
    },
  ]);
  const [userQuery, setUserQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRunCalculator = () => {
    const result = analyzeGlp1Input({
      drugName,
      dosageMg,
      currentWeightKg: weightKg,
      dailyProteinInputG: proteinInputG,
    });
    setAnalysisResult(result);
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || userQuery;
    if (!textToSend.trim()) return;

    const newMessages = [...chatMessages, { role: "user" as const, text: textToSend.trim() }];
    setChatMessages(newMessages);
    if (!queryText) setUserQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      setChatMessages([
        ...newMessages,
        { role: "assistant", text: data.text || "답변을 가져오지 못했습니다." },
      ]);
    } catch {
      setChatMessages([
        ...newMessages,
        { role: "assistant", text: "답변을 가져오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="glow-bg" />

      {/* Navigation Header */}
      <header style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>💉</span>
          <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            Wegovy<span className="gradient-text">Fit.ai</span>
          </span>
        </div>
        <button
          onClick={() => setIsChatOpen(true)}
          style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)", color: "#FFFFFF", padding: "8px 16px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
        >
          💬 AI 코치 1:1 상담
        </button>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: "900px", margin: "40px auto 60px", padding: "0 24px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--accent-emerald)", fontSize: "13px", fontWeight: "600", marginBottom: "20px" }}>
          🧬 Google DeepMind 생명과학 AI 연동 케어 엔진
        </div>
        <h1 style={{ fontSize: "40px", fontWeight: "800", lineHeight: "1.25", marginBottom: "20px", letterSpacing: "-1px" }}>
          위고비·마운자로 주사 맞으면서
          <br />
          <span className="gradient-text">근육만 빠지고 계신가요?</span>
        </h1>
        <p style={{ fontSize: "18px", color: "var(--text-sub)", lineHeight: "1.6", marginBottom: "36px" }}>
          GLP-1 감량 체중의 40%는 근육입니다. AI가 당신의 투여 용량, 근손실 위험도,
          <br />
          필수 단백질 목표량과 메스꺼움 부작용을 1:1 과학적으로 완주해 드립니다.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <a href="#calculator" className="btn-primary">
            ⚡ 내 근손실 위험도 무료 진단하기
          </a>
        </div>
      </section>

      {/* Live Calculator Widget Section */}
      <section id="calculator" style={{ maxWidth: "800px", margin: "0 auto 80px", padding: "0 24px" }}>
        <div className="glass-panel" style={{ padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "24px" }}>📊</span>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "700" }}>GLP-1 실시간 근손실 위험도 & 단백질 계산기</h2>
              <p style={{ fontSize: "13px", color: "var(--text-sub)" }}>약물과 현재 체중을 입력하시면 1초 만에 과학적 리포트를 출력합니다.</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>복용 약물 선택</label>
              <select
                value={drugName}
                onChange={(e) => setDrugName(e.target.value as "위고비 (Semaglutide)" | "마운자로 (Tirzepatide)" | "삭센다 (Liraglutide)")}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--bg-main)", border: "1px solid var(--panel-border)", color: "#FFF", fontSize: "14px", fontFamily: "inherit" }}
              >
                <option value="위고비 (Semaglutide)">위고비 (Semaglutide)</option>
                <option value="마운자로 (Tirzepatide)">마운자로 (Tirzepatide)</option>
                <option value="삭센다 (Liraglutide)">삭센다 (Liraglutide)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>투여 용량 (mg)</label>
              <input
                type="number"
                step="0.05"
                value={dosageMg}
                onChange={(e) => setDosageMg(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--bg-main)", border: "1px solid var(--panel-border)", color: "#FFF", fontSize: "14px", fontFamily: "inherit" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>현재 체중 (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--bg-main)", border: "1px solid var(--panel-border)", color: "#FFF", fontSize: "14px", fontFamily: "inherit" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "var(--text-sub)", display: "block", marginBottom: "6px" }}>현재 하루 평균 단백질 섭취량 (g)</label>
              <input
                type="number"
                value={proteinInputG}
                onChange={(e) => setProteinInputG(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--bg-main)", border: "1px solid var(--panel-border)", color: "#FFF", fontSize: "14px", fontFamily: "inherit" }}
              />
            </div>
          </div>

          <button onClick={handleRunCalculator} className="btn-primary" style={{ width: "100%" }}>
            ⚡ 1초 만에 내 근손실 위험도 분석하기
          </button>

          {/* Result Card */}
          {analysisResult && (
            <div style={{ marginTop: "28px", padding: "24px", borderRadius: "16px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "16px", fontWeight: "700" }}>📊 AI 분석 결과 리포트</span>
                <span style={{ padding: "4px 12px", borderRadius: "12px", background: analysisResult.muscleLossRiskScore >= 75 ? "#EF4444" : "#10B981", color: "#FFF", fontSize: "13px", fontWeight: "700" }}>
                  근손실 위험도: {analysisResult.riskLevel} ({analysisResult.muscleLossRiskScore}점)
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                <div style={{ background: "var(--panel-bg)", padding: "14px", borderRadius: "12px", border: "1px solid var(--panel-border)" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>하루 필수 목표 단백질량</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--accent-emerald)" }}>{analysisResult.recommendedDailyProteinG} g / 일</div>
                </div>
                <div style={{ background: "var(--panel-bg)", padding: "14px", borderRadius: "12px", border: "1px solid var(--panel-border)" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>권장 일일 수분 섭취량</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--accent-cyan)" }}>{analysisResult.recommendedWaterL} L / 일</div>
                </div>
              </div>

              <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>💡 맞춤 가이드라인:</div>
              <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.7" }}>
                {analysisResult.mitigationTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Problem & Solution Cards Section */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 100px", padding: "0 24px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "40px" }}>
          GLP-1 투여자의 80%가 경험하는 <span className="gradient-text">4대 페인포인트 해결</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>💪</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>근손실 방지</h3>
            <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.6" }}>
              체지방만 빠지고 골격근량은 보존하도록 1.6g/kg 맞춤 단백질 시케줄 가이드.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🤢</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>메스꺼움 케어</h3>
            <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.6" }}>
              투여 일차별 혈중 농도 피크 타임에 맞춘 부작용 완화 식단 팩트체크.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔄</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>요요 방지 파이프라인</h3>
            <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.6" }}>
              약물 중단 시 기초대사량 저하 및 폭식을 예방하는 단계적 테이퍼링 습관 형성.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🤖</div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>24시간 AI 코치</h3>
            <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.6" }}>
              궁금한 섭취 질문, 영양제 충돌 여부를 언제든 즉시 물어볼 수 있는 전용 챗봇.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ maxWidth: "800px", margin: "0 auto 100px", padding: "0 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px" }}>합리적인 멤버십 플랜</h2>
        <p style={{ fontSize: "14px", color: "var(--text-sub)", marginBottom: "40px" }}>월 약값의 1% 투자로 근손실 없는 완벽한 다이어트를 완주하세요.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          <div className="glass-panel" style={{ padding: "32px", border: "1px solid var(--panel-border)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>베이직 (무료)</h3>
            <div style={{ fontSize: "32px", fontWeight: "800", marginBottom: "20px" }}>0 원</div>
            <ul style={{ textAlign: "left", fontSize: "13px", color: "var(--text-sub)", lineHeight: "2", marginBottom: "24px" }}>
              <li>✓ 실시간 근손실 위험도 무료 계산기</li>
              <li>✓ 기본 하루 단백질 목표량 산출</li>
              <li>✓ 기초 GLP-1 부작용 가이드</li>
            </ul>
            <a href="#calculator" style={{ display: "block", padding: "12px", borderRadius: "10px", border: "1px solid var(--panel-border)", color: "#FFF", fontWeight: "600", fontSize: "14px" }}>
              무료 시작하기
            </a>
          </div>

          <div className="glass-panel" style={{ padding: "32px", border: "2px solid var(--accent-emerald)", boxShadow: "0 8px 32px rgba(16, 185, 129, 0.2)" }}>
            <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "12px", background: "var(--accent-emerald)", color: "#FFF", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>
              BEST CHOICE
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>프리미엄 핏</h3>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--accent-emerald)", marginBottom: "20px" }}>
              9,900 원 <span style={{ fontSize: "14px", color: "var(--text-sub)" }}>/ 월</span>
            </div>
            <ul style={{ textAlign: "left", fontSize: "13px", color: "var(--text-sub)", lineHeight: "2", marginBottom: "24px" }}>
              <li>✓ 24시간 GLP-1 전용 AI 코치 무제한</li>
              <li>✓ 주차별 근육 보존 리포트 & 식단 가이드</li>
              <li>✓ 영양제-약물 충돌 팩트체크 엔진</li>
              <li>✓ 제휴 단백질/영양제 할인 쿠폰 제공</li>
            </ul>
            <button onClick={() => setIsChatOpen(true)} className="btn-primary" style={{ width: "100%" }}>
              프리미엄 1:1 케어 시작
            </button>
          </div>
        </div>
      </section>

      {/* Footer & Disclaimer */}
      <footer style={{ borderTop: "1px solid var(--panel-border)", padding: "40px 24px", textAlign: "center", fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.7" }}>
        <p style={{ marginBottom: "10px" }}>
          <b>[의료법 & 약사법 면책 안내]</b> 위고비핏(WegovyFit.ai)은 의약품을 판매하거나 처방하지 않으며 의학적 진단을 대신할 수 없습니다.
          <br />
          본 서비스는 식품의약품안전처 및 US FDA 등록 공공 데이터 기반의 비의료 영양·습관 참고용 가이드입니다. 약물 용량 조절 및 이상 반응은 반드시 담당 의사 또는 약사와 상담하십시오.
        </p>
        <p>© 2026 WegovyFit.ai All rights reserved.</p>
      </footer>

      {/* AI Chat Drawer Modal */}
      {isChatOpen && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", width: "380px", maxHeight: "550px", background: "var(--panel-bg)", border: "1px solid var(--panel-border)", borderRadius: "20px", boxShadow: "0 16px 48px rgba(0, 0, 0, 0.6)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: "rgba(16, 185, 129, 0.1)", borderBottom: "1px solid var(--panel-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "700", fontSize: "14px" }}>💉 위고비핏 AI 코치 1:1 상담</span>
            <button onClick={() => setIsChatOpen(false)} style={{ background: "none", border: "none", color: "#FFF", fontSize: "18px", cursor: "pointer" }}>✕</button>
          </div>

          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", background: msg.role === "user" ? "var(--accent-emerald)" : "var(--bg-main)", color: "#FFF", padding: "10px 14px", borderRadius: "14px", fontSize: "13px", maxWidth: "85%", lineHeight: "1.5" }}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>AI가 답변을 생성 중입니다...</div>}
          </div>

          <div style={{ padding: "12px", borderTop: "1px solid var(--panel-border)", display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="예: 메스꺼움 완화 방법 알려줘"
              style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", background: "var(--bg-main)", border: "1px solid var(--panel-border)", color: "#FFF", fontSize: "13px", outline: "none" }}
            />
            <button onClick={() => handleSendMessage()} style={{ background: "var(--accent-emerald)", border: "none", color: "#FFF", padding: "10px 16px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
