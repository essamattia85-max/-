import React, { useState } from "react";
import { Sparkles, Loader2, Check, RefreshCw, Volume2, Landmark } from "lucide-react";
import { Scene, CompanyInfo } from "../types";

interface AIScriptGeneratorProps {
  companyInfo: CompanyInfo;
  onApplyGeneratedScript: (generated: { slogan: string; scene1: string; scene2: string; scene3: string }) => void;
}

export default function AIScriptGenerator({
  companyInfo,
  onApplyGeneratedScript,
}: AIScriptGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("عامية مصرية ودودة ومقنعة للغاية");
  const [mainTheme, setMainTheme] = useState("عمرة المولد النبوي الشريف بأسعار اقتصادية");
  const [features, setFeatures] = useState("طيران مباشر مريح، مشرف ديني مرافق، فنادق 4 نجوم قريبة من الحرم، هدايا مجانية ومزارات كاملة");
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    slogan: string;
    scene1: string;
    scene2: string;
    scene3: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agencyName: companyInfo.name,
          features,
          tone,
          mainTheme,
        }),
      });
      
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedResult(data.data);
      } else {
        throw new Error(data.error || "حدث خطأ أثناء الاتصال بالخادم وتوليد النص");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "عذراً، فشل توليد النصوص الإعلانية. يرجى مراجعة الخادم.");
    } finally {
      setLoading(false);
    }
  };

  const applyScript = () => {
    if (generatedResult) {
      onApplyGeneratedScript(generatedResult);
      // Optional visual feedback
      alert("تم تطبيق النص الإعلاني الجديد بنجاح على مشاهد الاستوديو! 🎉");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl text-right" dir="rtl">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-100 font-sans">مساعد النسخ الإعلاني الذكي (Gemini AI)</h3>
      </div>

      <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
        استخدم قوة الذكاء الاصطناعي لتوليد نصوص إعلانية بديلة باللهجة المصرية العامية، مخصصة لشركة هاي لايتس وفقاً للعروض والميزات التي تفضلها.
      </p>

      {/* Input Form Fields */}
      <div className="flex flex-col gap-4">
        {/* Main Theme */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400">الموضوع الأساسي أو اسم الرحلة:</label>
          <input
            type="text"
            value={mainTheme}
            onChange={(e) => setMainTheme(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-amber-500/40"
            placeholder="مثال: رحلة عمرة رجب الاقتصادية"
          />
        </div>

        {/* Features list */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400">الميزات والخدمات المتاحة بالرحلة:</label>
          <textarea
            rows={2}
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-amber-500/40 leading-relaxed"
            placeholder="اكتب الميزات مثل: فنادق قريبة، طيران حديث، مشرفين كبار"
          />
        </div>

        {/* Tone selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400">النبرة والأسلوب التسويقي:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none focus:border-amber-500/40"
          >
            <option value="عامية مصرية ودودة ومقنعة للغاية">عامية مصرية ودودة ومقنعة جداً 🤝</option>
            <option value="عامية مصرية عاطفية تلمس القلوب وتثير الشوق لمكة">عامية مصرية عاطفية ومشوقة لمكة ❤️</option>
            <option value="عامية مصرية سريعة ومختصرة لوسائل التواصل">عامية مصرية سريعة لوسائل التواصل 📱</option>
            <option value="عامية مصرية تركز على السعر الاقتصادي والتوفير">عامية مصرية تركز على السعر والتوفير 💰</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 py-3 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري صياغة النص بذكاء...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-slate-950" />
              توليد سيناريو إعلاني جديد بـ Gemini ✨
            </>
          )}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs mt-4 text-center">
          {error}
        </div>
      )}

      {/* Results panel */}
      {generatedResult && (
        <div className="mt-6 border-t border-slate-800 pt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              تم التوليد بنجاح!
            </span>
            <button
              onClick={applyScript}
              className="text-xs text-amber-500 hover:text-amber-400 font-bold border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 rounded-lg transition-all"
            >
              تطبيق النص على الاستوديو
            </button>
          </div>

          <div className="flex flex-col gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {/* Slogan */}
            <div className="border-b border-slate-800/60 pb-2">
              <span className="text-[10px] text-amber-400 font-bold block mb-1">الشعار الجديد:</span>
              <p className="text-xs text-slate-100 font-semibold">{generatedResult.slogan}</p>
            </div>

            {/* Scenes */}
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">المشهد الأول:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{generatedResult.scene1}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">المشهد الثاني:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{generatedResult.scene2}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">المشهد الثالث:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{generatedResult.scene3}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
