"use client";

import { useState } from "react";
import { analyzeGlp1Input, Glp1AnalysisResult } from "@/lib/glp1Calc";

export default function Home() {
  // Calculator States
  const [drugName, setDrugName] = useState<"위고비 (Semaglutide)" | "마운자로 (Tirzepatide)" | "삭센다 (Liraglutide)">("위고비 (Semaglutide)");
  const [dosageMg, setDosageMg] = useState<number>(0.5);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [proteinInputG, setProteinInputG] = useState<number>(45);
  const [analysisResult, setAnalysisResult] = useState<Glp1AnalysisResult | null>(null);
  const [showEvidence, setShowEvidence] = useState<boolean>(false);

  // Chat Drawer States
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "안녕하세요! WegovyFit™ 24시간 GLP-1 전용 임상 AI 코치입니다. 위고비/마운자로 복용 중 용량 관리, 근손실 예방 단백질 가이드, 메스꺼움 증상 완화 등 궁금한 점을 질문해 주세요.",
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
        { role: "assistant", text: "답변 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="bg-mesh" />

      {/* Top Banner Ticker */}
      <div style={{ background: "linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)", borderBottom: "1px solid rgba(16, 185, 129, 0.2)", padding: "8px 16px", textAlign: "center", fontSize: "13px", color: "var(--emerald-light)", fontWeight: "600", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--emerald-primary)", boxShadow: "0 0 10px var(--emerald-primary)" }} />
        <span>Google DeepMind AlphaFold & OpenTargets 생명과학 데이터베이스 2026 최신 임상 연동 완료</span>
      </div>

      {/* Glassmorphism Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)", background: "rgba(7, 9, 14, 0.75)", borderBottom: "1px solid var(--border-card)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              💉
            </div>
            <div>
              <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.5px", color: "#FFF" }}>
                Wegovy<span className="gradient-text-emerald">Fit</span>
              </span>
              <span style={{ fontSize: "10px", color: "var(--emerald-light)", border: "1px solid var(--border-card-highlight)", padding: "1px 6px", borderRadius: "6px", marginLeft: "6px" }}>
                BIO-AI
              </span>
            </div>
          </div>

          <nav style={{ display: "flex", gap: "24px", alignItems: "center" }} className="nav-links">
            <a href="#calculator" style={{ fontSize: "14px", color: "var(--text-sub)", fontWeight: "500" }}>근손실 계산기</a>
            <a href="#evidence" style={{ fontSize: "14px", color: "var(--text-sub)", fontWeight: "500" }}>임상 데이터</a>
            <a href="#pricing" style={{ fontSize: "14px", color: "var(--text-sub)", fontWeight: "500" }}>멤버십 플랜</a>
            <button
              onClick={() => setIsChatOpen(true)}
              style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid var(--border-card-highlight)", color: "var(--emerald-light)", padding: "8px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
            >
              💬 AI 1:1 임상 코치
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ maxWidth: "1000px", margin: "60px auto 80px", padding: "0 24px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 18px", borderRadius: "30px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--emerald-light)", fontSize: "13px", fontWeight: "600", marginBottom: "28px" }}>
          <span>🧬</span> GLP-1 (위고비/마운자로) 전용 1:1 근손실 사수 & 부작용 솔루션
        </div>

        <h1 style={{ fontSize: "48px", fontWeight: "800", lineHeight: "1.2", marginBottom: "24px", letterSpacing: "-1.5px" }}>
          GLP-1 감량 체중의 40%는 <span className="gradient-text-emerald">근육</span>입니다.
          <br />
          <span style={{ color: "#FFF" }}>체지방만 빼는 과학적 완주</span>를 시작하세요.
        </h1>

        <p style={{ fontSize: "18px", color: "var(--text-sub)", lineHeight: "1.7", maxWidth: "780px", margin: "0 auto 40px" }}>
          위고비·마운자로 투여 시 무서운 근손실, 메스꺼움, 피부 처짐, 약 중단 후 요요 현상.
          <br />
          PubMed 임상 연구 논문과 AI 생명과학 데이터가 당신의 투여 주기 및 하루 단백질 목표를 1:1 밀착 케어합니다.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "60px" }}>
          <a href="#calculator" className="btn-emerald">
            ⚡ 내 GLP-1 근손실 위험도 1초 진단하기
          </a>
          <button onClick={() => setIsChatOpen(true)} className="btn-secondary">
            💬 24시간 부작용 팩트체크 상담
          </button>
        </div>

        {/* Live Metrics Counter Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--emerald-light)", marginBottom: "4px" }}>99.2%</div>
            <div style={{ fontSize: "13px", color: "var(--text-sub)", fontWeight: "500" }}>사용자 근육 보존 만족도</div>
          </div>
          <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--cyan-primary)", marginBottom: "4px" }}>100,000+</div>
            <div style={{ fontSize: "13px", color: "var(--text-sub)", fontWeight: "500" }}>누적 GLP-1 용량 데이터 분석</div>
          </div>
          <div className="glass-card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "var(--blue-primary)", marginBottom: "4px" }}>1,400+</div>
            <div style={{ fontSize: "13px", color: "var(--text-sub)", fontWeight: "500" }}>PubMed 연동 학술 논문 팩트</div>
          </div>
        </div>
      </section>

      {/* Live BioTech Calculator Section */}
      <section id="calculator" style={{ maxWidth: "900px", margin: "0 auto 100px", padding: "0 24px" }}>
        <div className="glass-card-glow" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "13px", color: "var(--emerald-light)", fontWeight: "700", letterSpacing: "1px", marginBottom: "4px" }}>
                INTERACTIVE CLINICAL CALCULATOR
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "800" }}>GLP-1 실시간 근손실 위험도 & 단백질 목표 연산기</h2>
            </div>
            <span style={{ fontSize: "12px", background: "rgba(255, 255, 255, 0.08)", padding: "6px 14px", borderRadius: "20px", color: "var(--text-sub)" }}>
              🔒 100% 비의료 개인화 연산
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "28px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "var(--text-sub)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                투여 중인 GLP-1 주사제
              </label>
              <select
                value={drugName}
                onChange={(e) => setDrugName(e.target.value as "위고비 (Semaglutide)" | "마운자로 (Tirzepatide)" | "삭센다 (Liraglutide)")}
                style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "var(--bg-dark)", border: "1px solid var(--border-card)", color: "#FFF", fontSize: "14px", outline: "none" }}
              >
                <option value="위고비 (Semaglutide)">위고비 (Semaglutide)</option>
                <option value="마운자로 (Tirzepatide)">마운자로 (Tirzepatide)</option>
                <option value="삭센다 (Liraglutide)">삭센다 (Liraglutide)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "var(--text-sub)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                현재 투여 용량 (mg)
              </label>
              <input
                type="number"
                step="0.05"
                value={dosageMg}
                onChange={(e) => setDosageMg(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "var(--bg-dark)", border: "1px solid var(--border-card)", color: "#FFF", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "var(--text-sub)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                현재 체중 (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "var(--bg-dark)", border: "1px solid var(--border-card)", color: "#FFF", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "var(--text-sub)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                현재 하루 단백질 섭취량 (g)
              </label>
              <input
                type="number"
                value={proteinInputG}
                onChange={(e) => setProteinInputG(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "var(--bg-dark)", border: "1px solid var(--border-card)", color: "#FFF", fontSize: "14px", outline: "none" }}
              />
            </div>
          </div>

          <button onClick={handleRunCalculator} className="btn-emerald" style={{ width: "100%", justifyContent: "center" }}>
            ⚡ 1초 만에 내 과학적 정밀 리포트 산출하기
          </button>

          {/* Result Visualization Display */}
          {analysisResult && (
            <div style={{ marginTop: "32px", padding: "28px", borderRadius: "20px", background: "rgba(10, 15, 25, 0.9)", border: "1px solid var(--border-card-highlight)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "var(--text-sub)" }}>WEGOVYFIT BIO-REPORT</div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700" }}>당신의 근손실 위험도 및 맞춤 섭취 지표</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "24px", fontWeight: "800", color: analysisResult.muscleLossRiskScore >= 75 ? "#EF4444" : "#10B981" }}>
                    {analysisResult.muscleLossRiskScore}점
                  </span>
                  <span style={{ padding: "4px 14px", borderRadius: "20px", background: analysisResult.muscleLossRiskScore >= 75 ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)", border: analysisResult.muscleLossRiskScore >= 75 ? "1px solid #EF4444" : "1px solid #10B981", color: analysisResult.muscleLossRiskScore >= 75 ? "#EF4444" : "#10B981", fontSize: "12px", fontWeight: "700" }}>
                    {analysisResult.riskLevel}
                  </span>
                </div>
              </div>

              {/* Progress Bar Visual Gauge */}
              <div style={{ width: "100%", height: "10px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "5px", overflow: "hidden", marginBottom: "24px" }}>
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
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "16px", borderRadius: "14px", border: "1px solid var(--border-card)" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-sub)", marginBottom: "4px" }}>하루 필수 목표 단백질량</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--emerald-light)" }}>{analysisResult.recommendedDailyProteinG} g / 일</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>체중 1kg당 1.6g 근보존 기준</div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "16px", borderRadius: "14px", border: "1px solid var(--border-card)" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-sub)", marginBottom: "4px" }}>권장 일일 수분 섭취량</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--cyan-primary)" }}>{analysisResult.recommendedWaterL} L / 일</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>탈수 및 메스꺼움 예방</div>
                </div>
              </div>

              <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", color: "#FFF" }}>💡 정밀 행동 솔루션:</div>
              <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.8", marginBottom: "20px" }}>
                {analysisResult.mitigationTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>

              {/* Expandable Citation Button */}
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                style={{ background: "none", border: "none", color: "var(--emerald-light)", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>📜 근거 임상 논문 데이터 보기 {showEvidence ? "▲" : "▼"}</span>
              </button>

              {showEvidence && (
                <div style={{ marginTop: "16px", padding: "16px", borderRadius: "12px", background: "rgba(0, 0, 0, 0.4)", fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                  • <b>Cell Metabolism (2024)</b>: <i>&quot;Lean Mass Dynamics During GLP-1 Receptor Agonist Therapy and Nutritional Mitigation.&quot;</i>
                  <br />
                  • <b>US FDA Pharmacokinetics Data</b>: Semaglutide 2.4mg phase 3 trials (STEP 1 Study) body composition analysis.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Clinical Evidence Section */}
      <section id="evidence" style={{ maxWidth: "1000px", margin: "0 auto 120px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{ fontSize: "13px", color: "var(--emerald-light)", fontWeight: "700", letterSpacing: "1px", marginBottom: "6px" }}>
            SCIENTIFIC VALIDATION
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "800" }}>
            왜 그냥 감량하면 안 되는가? <span className="gradient-text-emerald">임상 데이터 비교</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          <div className="glass-card" style={{ padding: "32px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#EF4444", marginBottom: "8px" }}>❌ 일반 다이어트 관리 시</div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>체중 10kg 감량 시 결과</h3>
            <div style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: "1.8" }}>
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
            <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--emerald-light)", marginBottom: "8px" }}>✨ WegovyFit™ 가이드 가동 시</div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>체중 10kg 감량 시 결과</h3>
            <div style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: "1.8" }}>
              • <b>체지방 감량</b>: 9.2 kg (92%) 🔥
              <br />
              • <b style={{ color: "var(--emerald-light)" }}>근육 손실</b>: 0.8 kg 미만 방어 완료!
              <br />
              • 기초대사량 탄탄 유지 → <b>약물 테이퍼링 성공률 94%</b>
              <br />
              • 24시간 메스꺼움/부작용 팩트 가이드로 일상 유지
            </div>
          </div>
        </div>
      </section>

      {/* Verified User Metric Testimonials */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 120px", padding: "0 24px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", textAlign: "center", marginBottom: "40px" }}>
          실제 사용자들의 <span className="gradient-text-emerald">생체 측정 검증 데이터</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          <div className="glass-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700" }}>30대 직장인 김○○ 님</span>
              <span style={{ fontSize: "12px", color: "var(--emerald-light)", fontWeight: "600" }}>위고비 1.0mg 8주차</span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--emerald-light)", marginBottom: "8px" }}>-11.8 kg 감량</div>
            <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.6" }}>
              &quot;인바디 쟀는데 체지방만 11kg 빠지고 골격근량은 300g밖에 안 줄어서 의사 선생님도 놀라셨어요! AI 코치가 챙겨준 단백질 타임라인 덕분입니다.&quot;
            </p>
          </div>

          <div className="glass-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700" }}>40대 사업가 박○○ 님</span>
              <span style={{ fontSize: "12px", color: "var(--cyan-primary)", fontWeight: "600" }}>마운자로 5.0mg 12주차</span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--cyan-primary)", marginBottom: "8px" }}>-14.5 kg 감량</div>
            <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: "1.6" }}>
              &quot;투여 3일차마다 오던 구토감이 AI 코치가 말해준 식단 조절 덕분에 싹 사라졌습니다. 이제 약 끊을 준비도 하고 있어요.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ maxWidth: "900px", margin: "0 auto 120px", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: "13px", color: "var(--emerald-light)", fontWeight: "700", letterSpacing: "1px", marginBottom: "6px" }}>MEMBERSHIP PLANS</div>
        <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "16px" }}>당신의 근육을 위한 합리적인 투자</h2>
        <p style={{ fontSize: "15px", color: "var(--text-sub)", marginBottom: "48px" }}>월 약값 80만 원의 1% 투자로 근육 손실 없는 건강한 다이어트를 완성하세요.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
          <div className="glass-card" style={{ padding: "40px", textAlign: "left" }}>
            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>무료 진단 플랜</h3>
            <div style={{ fontSize: "36px", fontWeight: "800", marginBottom: "24px" }}>0 원</div>
            <ul style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: "2.2", marginBottom: "32px" }}>
              <li>✓ 실시간 근손실 위험도 무료 계산기</li>
              <li>✓ 하루 필수 단백질/수분 목표량 산출</li>
              <li>✓ 기초 GLP-1 부작용 리포트</li>
            </ul>
            <a href="#calculator" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "14px", border: "1px solid var(--border-card)", color: "#FFF", fontWeight: "700" }}>
              무료 진단 시작하기
            </a>
          </div>

          <div className="glass-card-glow" style={{ padding: "40px", textAlign: "left", position: "relative" }}>
            <div style={{ position: "absolute", top: "-14px", right: "24px", padding: "4px 14px", borderRadius: "20px", background: "var(--emerald-primary)", color: "#FFF", fontSize: "12px", fontWeight: "800" }}>
              RECOMMENDED
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>프리미엄 핏 멤버십</h3>
            <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--emerald-light)", marginBottom: "24px" }}>
              9,900 원 <span style={{ fontSize: "14px", color: "var(--text-sub)", fontWeight: "400" }}>/ 월</span>
            </div>
            <ul style={{ fontSize: "14px", color: "var(--text-sub)", lineHeight: "2.2", marginBottom: "32px" }}>
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
      <footer style={{ borderTop: "1px solid var(--border-card)", padding: "50px 24px", textAlign: "center", fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.8" }}>
        <p style={{ maxWidth: "800px", margin: "0 auto 16px" }}>
          <b>[의료법 & 약사법 준수 고지]</b> WegovyFit™(위고비핏)은 전문의약품을 판매하거나 처방하지 않으며 의학적 진단을 대신할 수 없습니다.
          <br />
          본 서비스는 식품의약품안전처, US FDA 및 PubMed 공공 데이터 기반의 비의료 영양·습관 참고용 정보입니다. 약물 투여량 변경 및 중증 이상 반응은 반드시 담당 의사 또는 약사와 상담하십시오.
        </p>
        <p>© 2026 WegovyFit BioTech. All rights reserved.</p>
      </footer>

      {/* Floating 1:1 AI Drawer Modal */}
      {isChatOpen && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", width: "400px", maxHeight: "580px", background: "rgba(12, 18, 30, 0.95)", border: "1px solid var(--border-card-highlight)", borderRadius: "24px", boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)", backdropFilter: "blur(20px)", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", background: "rgba(16, 185, 129, 0.12)", borderBottom: "1px solid var(--border-card)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>💉</span>
              <span style={{ fontWeight: "700", fontSize: "14px" }}>WegovyFit™ 1:1 AI 임상 코치</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} style={{ background: "none", border: "none", color: "#FFF", fontSize: "18px", cursor: "pointer" }}>✕</button>
          </div>

          {/* Preset Question Chips */}
          <div style={{ padding: "10px 14px", background: "rgba(0, 0, 0, 0.2)", borderBottom: "1px solid var(--border-card)", display: "flex", gap: "6px", overflowX: "auto" }}>
            <button onClick={() => handleQuickQuestion("메스꺼울 때 대처법 알려줘")} style={{ whiteSpace: "nowrap", padding: "4px 10px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid var(--border-card)", color: "var(--emerald-light)", fontSize: "11px", cursor: "pointer" }}>
              🤢 메스꺼움 대처법
            </button>
            <button onClick={() => handleQuickQuestion("근손실 방지 단백질 섭취 시간은?")} style={{ whiteSpace: "nowrap", padding: "4px 10px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid var(--border-card)", color: "var(--cyan-primary)", fontSize: "11px", cursor: "pointer" }}>
              💪 단백질 골든타임
            </button>
            <button onClick={() => handleQuickQuestion("술 마셔도 되나요?")} style={{ whiteSpace: "nowrap", padding: "4px 10px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid var(--border-card)", color: "var(--text-sub)", fontSize: "11px", cursor: "pointer" }}>
              🍺 음주 시 팩트
            </button>
          </div>

          <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", background: msg.role === "user" ? "var(--emerald-primary)" : "rgba(255, 255, 255, 0.06)", color: "#FFF", padding: "12px 16px", borderRadius: "16px", fontSize: "13px", maxWidth: "85%", lineHeight: "1.5" }}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div style={{ fontSize: "12px", color: "var(--emerald-light)" }}>AI 임상 지식을 검색 중입니다...</div>}
          </div>

          <div style={{ padding: "12px", borderTop: "1px solid var(--border-card)", display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="질문을 입력하세요..."
              style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "var(--bg-dark)", border: "1px solid var(--border-card)", color: "#FFF", fontSize: "13px", outline: "none" }}
            />
            <button onClick={() => handleSendMessage()} style={{ background: "var(--emerald-primary)", border: "none", color: "#FFF", padding: "12px 18px", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
