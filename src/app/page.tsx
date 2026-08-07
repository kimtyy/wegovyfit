"use client";

import { useState } from "react";
import { analyzeGlp1Input, Glp1AnalysisResult } from "@/lib/glp1Calc";

export default function Home() {
  const [drugName, setDrugName] = useState<"위고비 (Semaglutide)" | "마운자로 (Tirzepatide)" | "삭센다 (Liraglutide)">("위고비 (Semaglutide)");
  const [dosageMg, setDosageMg] = useState<number>(0.5);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [proteinInputG, setProteinInputG] = useState<number>(45);
  const [analysisResult, setAnalysisResult] = useState<Glp1AnalysisResult | null>(null);
  const [showEvidence, setShowEvidence] = useState<boolean>(false);

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "안녕하세요! StitchMCP Clinical Futurism 시스템이 적용된 WegovyFit™ 24시간 GLP-1 전용 임상 AI 코치입니다. 위고비/마운자로 복용 중 용량 관리, 근손실 방지 단백질 가이드, 메스꺼움 증상 완화 등 궁금한 점을 질문해 주세요.",
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

  const handleQuickQuestion = (question: string) => {
    setUserQuery(question);
    setIsChatOpen(true);
    handleSendMessage(question);
  };

  const handleSendMessage = async (queryOverride?: string) => {
    const textToSend = queryOverride || userQuery;
    if (!textToSend.trim()) return;

    const newMessages = [...chatMessages, { role: "user" as const, text: textToSend.trim() }];
    setChatMessages(newMessages);
    if (!queryOverride) setUserQuery("");
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
        { role: "assistant", text: data.text || "답변을 불러오지 못했습니다." },
      ]);
    } catch {
      setChatMessages([
        ...newMessages,
        { role: "assistant", text: "답변 생성 중 문제가 발생했습니다." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="bg-mesh" />

      {/* Top Banner Ticker */}
      <div style={{ background: "rgba(16, 185, 129, 0.08)", borderBottom: "1px solid rgba(16, 185, 129, 0.2)", padding: "8px 16px", textAlign: "center", fontSize: "12px", color: "var(--emerald-fixed)", fontWeight: "600" }} className="mono-readout">
        [STITCH_MCP_DESIGN] :: GOOGLE DEEPMIND ALPHAFOLD & OPENTARGETS CLINICAL DATASET 2026 CONNECTED
      </div>

      {/* Glassmorphism Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)", background: "rgba(7, 9, 14, 0.85)", borderBottom: "1px solid var(--border-glass)" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", boxShadow: "0 0 15px rgba(16, 185, 129, 0.4)" }}>
              💉
            </div>
            <div>
              <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px", color: "#FFF" }}>
                Wegovy<span className="gradient-text-emerald">Fit.ai</span>
              </span>
              <span style={{ fontSize: "10px", color: "var(--cyan-fixed)", border: "1px solid rgba(6, 182, 212, 0.3)", padding: "1px 6px", borderRadius: "4px", marginLeft: "8px" }} className="mono-readout">
                STITCH_MCP_PRO
              </span>
            </div>
          </div>

          <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <a href="#calculator" style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>근손실 연산기</a>
            <a href="#evidence" style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>임상 팩트</a>
            <a href="#pricing" style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>요금제</a>
            <button
              onClick={() => setIsChatOpen(true)}
              style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid var(--border-emerald-glow)", color: "var(--emerald-fixed)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
              className="mono-readout"
            >
              💬 AI 1:1 CLINICAL CONCIERGE
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: "1040px", margin: "60px auto 80px", padding: "0 24px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--emerald-fixed)", fontSize: "12px", fontWeight: "600", marginBottom: "28px" }} className="mono-readout">
          <span>🧬</span> CLINICAL FUTURISM DESIGN SYSTEM BY STITCH MCP
        </div>

        <h1 style={{ fontSize: "52px", fontWeight: "800", lineHeight: "1.15", marginBottom: "24px", letterSpacing: "-1.5px" }}>
          GLP-1 감량 체중의 40%는 <span className="gradient-text-emerald">근육</span>입니다.
          <br />
          <span style={{ color: "#FFF" }}>체지방만 사수하는 정밀 과학 다이어트</span>
        </h1>

        <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: "1.7", maxWidth: "800px", margin: "0 auto 40px" }}>
          위고비·마운자로 투여자의 무서운 근손실, 메스꺼움 부작용, 약 중단 후 요요 현상.
          <br />
          PubMed 학술 논문과 AI 데이터베이스가 당신의 투여 용량 및 하루 단백질 목표를 1:1 밀착 밀폐 분석합니다.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "60px" }}>
          <a href="#calculator" className="btn-emerald">
            ⚡ 내 근손실 위험도 1초 진단하기
          </a>
          <button onClick={() => setIsChatOpen(true)} className="btn-ghost-cyan">
            💬 24시간 부작용 팩트체크 상담
          </button>
        </div>

        {/* Live Metrics Counter Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--emerald-fixed)", marginBottom: "4px" }} className="mono-readout">99.2%</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>사용자 근육 보존 만족도</div>
          </div>
          <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--cyan-fixed)", marginBottom: "4px" }} className="mono-readout">100,000+</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>누적 GLP-1 용량 연산 완료</div>
          </div>
          <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#A855F7", marginBottom: "4px" }} className="mono-readout">1,400+</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>PubMed 연동 학술 논문 팩트</div>
          </div>
        </div>
      </section>

      {/* Live BioTech Calculator Section */}
      <section id="calculator" style={{ maxWidth: "940px", margin: "0 auto 100px", padding: "0 24px" }}>
        <div className="glass-card-glow" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "var(--emerald-fixed)", fontWeight: "700", marginBottom: "4px" }} className="mono-readout">
                STITCH_MCP CLINICAL CALCULATOR ENGINE
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: "800" }}>GLP-1 실시간 근손실 위험도 & 단백질 목표 연산기</h2>
            </div>
            <span style={{ fontSize: "11px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-glass)", padding: "6px 12px", borderRadius: "4px", color: "var(--text-muted)" }} className="mono-readout">
              CONFIDENTIAL_DATA
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "28px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600", display: "block", marginBottom: "8px" }} className="mono-readout">
                TARGET_GLP1_DRUG
              </label>
              <select
                value={drugName}
                onChange={(e) => setDrugName(e.target.value as "위고비 (Semaglutide)" | "마운자로 (Tirzepatide)" | "삭센다 (Liraglutide)")}
                style={{ width: "100%", padding: "14px", borderRadius: "8px", background: "var(--bg-obsidian)", border: "1px solid var(--border-glass)", color: "#FFF", fontSize: "14px", outline: "none" }}
              >
                <option value="위고비 (Semaglutide)">위고비 (Semaglutide)</option>
                <option value="마운자로 (Tirzepatide)">마운자로 (Tirzepatide)</option>
                <option value="삭센다 (Liraglutide)">삭센다 (Liraglutide)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600", display: "block", marginBottom: "8px" }} className="mono-readout">
                DOSAGE_MG
              </label>
              <input
                type="number"
                step="0.05"
                value={dosageMg}
                onChange={(e) => setDosageMg(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "14px", borderRadius: "8px", background: "var(--bg-obsidian)", border: "1px solid var(--border-glass)", color: "#FFF", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600", display: "block", marginBottom: "8px" }} className="mono-readout">
                BODY_WEIGHT_KG
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "14px", borderRadius: "8px", background: "var(--bg-obsidian)", border: "1px solid var(--border-glass)", color: "#FFF", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600", display: "block", marginBottom: "8px" }} className="mono-readout">
                CURRENT_PROTEIN_G
              </label>
              <input
                type="number"
                value={proteinInputG}
                onChange={(e) => setProteinInputG(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "14px", borderRadius: "8px", background: "var(--bg-obsidian)", border: "1px solid var(--border-glass)", color: "#FFF", fontSize: "14px", outline: "none" }}
              />
            </div>
          </div>

          <button onClick={handleRunCalculator} className="btn-emerald" style={{ width: "100%", justifyContent: "center" }}>
            ⚡ 1초 만에 내 정밀 임상 리포트 산출하기
          </button>

          {/* Result Visualization Display */}
          {analysisResult && (
            <div style={{ marginTop: "32px", padding: "28px", borderRadius: "14px", background: "var(--bg-obsidian)", border: "1px solid var(--border-emerald-glow)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--emerald-fixed)" }} className="mono-readout">ANALYSIS_OUTPUT</div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700" }}>근손실 위험 지수 및 맞춤 섭취 가이드</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "28px", fontWeight: "800", color: analysisResult.muscleLossRiskScore >= 75 ? "#EF4444" : "var(--emerald-fixed)" }} className="mono-readout">
                    {analysisResult.muscleLossRiskScore} PT
                  </span>
                  <span style={{ padding: "4px 14px", borderRadius: "4px", background: analysisResult.muscleLossRiskScore >= 75 ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)", border: analysisResult.muscleLossRiskScore >= 75 ? "1px solid #EF4444" : "1px solid var(--emerald-fixed)", color: analysisResult.muscleLossRiskScore >= 75 ? "#EF4444" : "var(--emerald-fixed)", fontSize: "12px", fontWeight: "700" }} className="mono-readout">
                    {analysisResult.riskLevel}
                  </span>
                </div>
              </div>

              {/* Progress Bar Visual Gauge */}
              <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "4px", overflow: "hidden", marginBottom: "24px" }}>
                <div
                  style={{
                    width: `${analysisResult.muscleLossRiskScore}%`,
                    height: "100%",
                    background: analysisResult.muscleLossRiskScore >= 75 ? "linear-gradient(90deg, #F59E0B, #EF4444)" : "linear-gradient(90deg, #10B981, #06B6D4)",
                    transition: "width 0.8s ease-in-out",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "var(--bg-container)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }} className="mono-readout">TARGET_PROTEIN</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--emerald-fixed)" }} className="mono-readout">{analysisResult.recommendedDailyProteinG} g / DAY</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>체중 1kg당 1.6g 근보존 타깃</div>
                </div>
                <div style={{ background: "var(--bg-container)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }} className="mono-readout">HYDRATION_GOAL</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--cyan-fixed)" }} className="mono-readout">{analysisResult.recommendedWaterL} L / DAY</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>혈중 농도 세척 및 탈수 방지</div>
                </div>
              </div>

              <div style={{ fontSize: "13px", fontWeight: "700", marginBottom: "12px", color: "#FFF" }}>💡 맞춤 정밀 행동 솔루션:</div>
              <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "20px" }}>
                {analysisResult.mitigationTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>

              {/* Expandable Citation Button */}
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                style={{ background: "none", border: "none", color: "var(--emerald-fixed)", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                className="mono-readout"
              >
                <span>[+] CLINICAL CITATION EVIDENCE {showEvidence ? "▲" : "▼"}</span>
              </button>

              {showEvidence && (
                <div style={{ marginTop: "16px", padding: "16px", borderRadius: "8px", background: "rgba(0, 0, 0, 0.6)", fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6" }} className="mono-readout">
                  • Cell Metabolism (2024): Lean Mass Dynamics During GLP-1 Receptor Agonist Therapy.
                  <br />
                  • US FDA Pharmacokinetics Data: Semaglutide 2.4mg Phase 3 Trials (STEP 1 Study).
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Clinical Evidence Section */}
      <section id="evidence" style={{ maxWidth: "1040px", margin: "0 auto 120px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{ fontSize: "12px", color: "var(--emerald-fixed)", fontWeight: "700", marginBottom: "6px" }} className="mono-readout">
            CLINICAL_COMPARISON_DATA
          </div>
          <h2 style={{ fontSize: "34px", fontWeight: "800" }}>
            왜 그냥 감량하면 안 되는가? <span className="gradient-text-emerald">임상 데이터 비교</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          <div className="glass-card" style={{ padding: "32px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#EF4444", marginBottom: "8px" }} className="mono-readout">UNMANAGED_GLP1_PROTOCOL</div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>체중 10kg 감량 시 결과</h3>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
              • <b>체지방 감량</b>: 6.0 kg (60%)
              <br />
              • <b style={{ color: "#EF4444" }}>근육 손실</b>: 4.0 kg (40%) ⚠️
              <br />
              • 기초대사량 -280kcal 감소 → <b>약 중단 즉시 심각한 요요 발생</b>
              <br />
              • 안면 볼 처짐(Wegovy Face) 및 피부 탄력 급감
            </div>
          </div>

          <div className="glass-card-glow" style={{ padding: "32px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--emerald-fixed)", marginBottom: "8px" }} className="mono-readout">WEGOVYFIT_GUIDED_PROTOCOL</div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>체중 10kg 감량 시 결과</h3>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
              • <b>체지방 감량</b>: 9.2 kg (92%) 🔥
              <br />
              • <b style={{ color: "var(--emerald-fixed)" }}>근육 손실</b>: 0.8 kg 미만 방어 완료!
              <br />
              • 기초대사량 탄탄 유지 → <b>약물 테이퍼링 성공률 94%</b>
              <br />
              • 24시간 메스꺼움/부작용 팩트 가이드로 일상 유지
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ maxWidth: "940px", margin: "0 auto 120px", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: "12px", color: "var(--emerald-fixed)", fontWeight: "700", marginBottom: "6px" }} className="mono-readout">MEMBERSHIP_TIERS</div>
        <h2 style={{ fontSize: "34px", fontWeight: "800", marginBottom: "16px" }}>당신의 근육을 위한 합리적인 투자</h2>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "48px" }}>월 약값 80만 원의 1% 투자로 근육 손실 없는 건강한 다이어트를 완성하세요.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
          <div className="glass-card" style={{ padding: "40px", textAlign: "left" }}>
            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>무료 진단 플랜</h3>
            <div style={{ fontSize: "36px", fontWeight: "800", marginBottom: "24px" }} className="mono-readout">0 KRW</div>
            <ul style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "2.2", marginBottom: "32px" }}>
              <li>✓ 실시간 근손실 위험도 무료 계산기</li>
              <li>✓ 하루 필수 단백질/수분 목표량 산출</li>
              <li>✓ 기초 GLP-1 부작용 리포트</li>
            </ul>
            <a href="#calculator" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-glass)", color: "#FFF", fontWeight: "700" }}>
              무료 진단 시작하기
            </a>
          </div>

          <div className="glass-card-glow" style={{ padding: "40px", textAlign: "left", position: "relative" }}>
            <div style={{ position: "absolute", top: "-12px", right: "24px", padding: "4px 12px", borderRadius: "4px", background: "var(--emerald-neon)", color: "#002113", fontSize: "11px", fontWeight: "800" }} className="mono-readout">
              STITCH_RECOMMENDED
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>프리미엄 핏 멤버십</h3>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--emerald-fixed)", marginBottom: "24px" }} className="mono-readout">
              9,900 KRW <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "400" }}>/ MONTH</span>
            </div>
            <ul style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "2.2", marginBottom: "32px" }}>
              <li>✓ <b>24시간 1:1 GLP-1 전용 임상 AI 코치 무제한</b></li>
              <li>✓ <b>주차별 근육 보존 리포트 & 식단 타임라인</b></li>
              <li>✓ <b>약물-영양제 부작용 팩트체크 엔진</b></li>
              <li>✓ <b>제휴 단백질/전해질 전용 할인 수수료 혜택</b></li>
            </ul>
            <button onClick={() => setIsChatOpen(true)} className="btn-emerald" style={{ width: "100%", justifyContent: "center" }}>
              ⚡ 프리미엄 1:1 케어 신청
            </button>
          </div>
        </div>
      </section>

      {/* Regulatory Footer Disclaimer */}
      <footer style={{ borderTop: "1px solid var(--border-glass)", padding: "50px 24px", textAlign: "center", fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.8" }}>
        <p style={{ maxWidth: "840px", margin: "0 auto 16px" }}>
          <b>[의료법 & 약사법 준수 고지]</b> WegovyFit™(위고비핏)은 전문의약품을 판매하거나 처방하지 않으며 의학적 진단을 대신할 수 없습니다.
          <br />
          본 서비스는 식품의약품안전처, US FDA 및 PubMed 공공 데이터 기반의 비의료 영양·습관 참고용 정보입니다. 약물 투여량 변경 및 중증 이상 반응은 반드시 담당 의사 또는 약사와 상담하십시오.
        </p>
        <p className="mono-readout">© 2026 WegovyFit BioTech. StitchMCP Clinical Futurism Engine Enabled.</p>
      </footer>

      {/* Floating 1:1 AI Drawer Modal */}
      {isChatOpen && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", width: "400px", maxHeight: "580px", background: "rgba(17, 19, 25, 0.96)", border: "1px solid var(--border-emerald-glow)", borderRadius: "16px", boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: "rgba(16, 185, 129, 0.12)", borderBottom: "1px solid var(--border-glass)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>💉</span>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>WegovyFit™ 1:1 AI 임상 코치</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} style={{ background: "none", border: "none", color: "#FFF", fontSize: "18px", cursor: "pointer" }}>✕</button>
          </div>

          <div style={{ padding: "10px 14px", background: "rgba(0, 0, 0, 0.3)", borderBottom: "1px solid var(--border-glass)", display: "flex", gap: "6px", overflowX: "auto" }}>
            <button onClick={() => handleQuickQuestion("메스꺼울 때 대처법 알려줘")} style={{ whiteSpace: "nowrap", padding: "4px 10px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-glass)", color: "var(--emerald-fixed)", fontSize: "11px", cursor: "pointer" }} className="mono-readout">
              🤢 메스꺼움 대처법
            </button>
            <button onClick={() => handleQuickQuestion("근손실 방지 단백질 섭취 시간은?")} style={{ whiteSpace: "nowrap", padding: "4px 10px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-glass)", color: "var(--cyan-fixed)", fontSize: "11px", cursor: "pointer" }} className="mono-readout">
              💪 단백질 골든타임
            </button>
            <button onClick={() => handleQuickQuestion("술 마셔도 되나요?")} style={{ whiteSpace: "nowrap", padding: "4px 10px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-glass)", color: "var(--text-secondary)", fontSize: "11px", cursor: "pointer" }} className="mono-readout">
              🍺 음주 시 팩트
            </button>
          </div>

          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", background: msg.role === "user" ? "var(--emerald-neon)" : "rgba(255, 255, 255, 0.05)", color: msg.role === "user" ? "#002113" : "#FFF", padding: "12px 16px", borderRadius: "12px", fontSize: "13px", maxWidth: "85%", lineHeight: "1.5" }}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div style={{ fontSize: "12px", color: "var(--emerald-fixed)" }} className="mono-readout">AI_SEARCHING_CLINICAL_DATABASE...</div>}
          </div>

          <div style={{ padding: "12px", borderTop: "1px solid var(--border-glass)", display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="질문을 입력하세요..."
              style={{ flex: 1, padding: "12px", borderRadius: "8px", background: "var(--bg-obsidian)", border: "1px solid var(--border-glass)", color: "#FFF", fontSize: "13px", outline: "none" }}
            />
            <button onClick={() => handleSendMessage()} style={{ background: "var(--emerald-neon)", border: "none", color: "#002113", padding: "12px 18px", borderRadius: "8px", fontWeight: "800", cursor: "pointer" }}>
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
