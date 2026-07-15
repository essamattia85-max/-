import React from "react";
import { 
  Settings, Layers, Sliders, Smartphone, Monitor, Sparkles, 
  HelpCircle, Volume2, User, Phone, Check, RefreshCw, FileText
} from "lucide-react";
import { Scene, VideoSettings, CompanyInfo } from "../types";

interface StudioControlsProps {
  scenes: Scene[];
  settings: VideoSettings;
  companyInfo: CompanyInfo;
  setScenes: React.Dispatch<React.SetStateAction<Scene[]>>;
  setSettings: React.Dispatch<React.SetStateAction<VideoSettings>>;
  setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyInfo>>;
}

export default function StudioControls({
  scenes,
  settings,
  companyInfo,
  setScenes,
  setSettings,
  setCompanyInfo,
}: StudioControlsProps) {
  
  const handleSceneTextChange = (id: number, val: string) => {
    setScenes((prev) =>
      prev.map((scene) => (scene.id === id ? { ...scene, text: val } : scene))
    );
  };

  const handlePhoneChange = (index: number, val: string) => {
    const updatedPhones = [...companyInfo.phones];
    updatedPhones[index] = val;
    setCompanyInfo((prev) => ({ ...prev, phones: updatedPhones }));
  };

  const addPhone = () => {
    if (companyInfo.phones.length < 3) {
      setCompanyInfo((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
    }
  };

  const removePhone = (index: number) => {
    if (companyInfo.phones.length > 1) {
      const updatedPhones = companyInfo.phones.filter((_, idx) => idx !== index);
      setCompanyInfo((prev) => ({ ...prev, phones: updatedPhones }));
    }
  };

  const handleFilterChange = (filter: VideoSettings["overlayFilter"]) => {
    setSettings((prev) => ({ ...prev, overlayFilter: filter }));
  };

  const handleRatioChange = (ratio: VideoSettings["aspectRatio"]) => {
    setSettings((prev) => ({ ...prev, aspectRatio: ratio }));
  };

  return (
    <div className="flex flex-col gap-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl text-right" dir="rtl">
      
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Settings className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-100 font-sans">أدوات تعديل العرض والاستوديو</h3>
      </div>

      {/* Section 1: Formatting & Visual Styling */}
      <div className="flex flex-col gap-4">
        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
          <Layers className="w-4 h-4" />
          تنسيق الفيديو والفلاتر الإلهية
        </span>

        {/* Aspect Ratio Switcher */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleRatioChange("16:9")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm transition-all ${
              settings.aspectRatio === "16:9"
                ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Monitor className="w-4 h-4" />
            أفقي (16:9)
          </button>
          <button
            onClick={() => handleRatioChange("9:16")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm transition-all ${
              settings.aspectRatio === "9:16"
                ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            عمودي (9:16)
          </button>
        </div>

        {/* Color Filters */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400">فلاتر الإضاءة والتأثير الروحي:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "none", name: "طبيعي", color: "bg-slate-800" },
              { id: "golden", name: "ذهبي", color: "bg-amber-600/50 border-amber-500" },
              { id: "emerald", name: "زمردي", color: "bg-emerald-600/50 border-emerald-500" },
              { id: "twilight", name: "شفق", color: "bg-indigo-600/50 border-indigo-500" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilterChange(f.id as any)}
                className={`py-2 px-1 text-xs rounded-lg border text-center transition-all ${
                  settings.overlayFilter === f.id
                    ? "bg-slate-950 border-amber-500 text-amber-400 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Particles Toggle */}
        <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300">مؤثر ذرات الغبار الذهبي الطائرة</span>
          </div>
          <input
            type="checkbox"
            checked={settings.showParticles}
            onChange={(e) => setSettings((prev) => ({ ...prev, showParticles: e.target.checked }))}
            className="w-4 h-4 accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Section 2: Real-time Script Editor */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          محتوى وسيناريو المشاهد (بالعامية المصرية)
        </span>

        {scenes.map((scene, idx) => (
          <div key={scene.id} className="flex flex-col gap-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800/85">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-500 font-bold font-mono">
                المشهد {idx + 1}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                المدة المقترحة: {scene.duration} ثواني
              </span>
            </div>
            <textarea
              rows={3}
              value={scene.text}
              onChange={(e) => handleSceneTextChange(scene.id, e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-2.5 text-xs font-sans leading-relaxed focus:outline-none focus:border-amber-500/40"
              placeholder={`نص المشهد ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Section 3: Contact & Company Branding */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
          <Phone className="w-4 h-4" />
          بيانات شركة السياحة وأرقام التواصل
        </span>

        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400">اسم الشركة وتفاصيلها:</label>
          <input
            type="text"
            value={companyInfo.name}
            onChange={(e) => setCompanyInfo((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-amber-500/40"
            placeholder="اسم الشركة"
          />
        </div>

        {/* Slogan */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400">الشعار النصي (Slogan):</label>
          <input
            type="text"
            value={settings.slogan}
            onChange={(e) => setSettings((prev) => ({ ...prev, slogan: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-amber-500/40"
            placeholder="الشعار التسويقي للشركة"
          />
        </div>

        {/* Phone numbers inputs list */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-400">أرقام هواتف الحجز:</label>
            {companyInfo.phones.length < 3 && (
              <button
                type="button"
                onClick={addPhone}
                className="text-[10px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1"
              >
                + إضافة رقم آخر
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {companyInfo.phones.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg py-2 px-3 text-xs font-mono text-center tracking-widest focus:outline-none focus:border-amber-500/40"
                  placeholder="مثال: 01095555089"
                />
                {companyInfo.phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 text-xs"
                    title="حذف الرقم"
                  >
                    حذف
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Voiceover Audio Settings */}
      <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
          <Volume2 className="w-4 h-4" />
          إعدادات الصوت والتعليق الصوتي المتقدمة
        </span>

        {/* Auto Play checkbox */}
        <div className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          <span className="text-xs text-slate-300">تشغيل متواصل تلقائي للمشاهد</span>
          <input
            type="checkbox"
            checked={settings.autoPlayNext}
            onChange={(e) => setSettings((prev) => ({ ...prev, autoPlayNext: e.target.checked }))}
            className="w-4 h-4 accent-amber-500 cursor-pointer"
          />
        </div>

        {/* Speed slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">سرعة نطق الراوي:</span>
            <span className="font-mono text-amber-500">{settings.voiceSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.1"
            value={settings.voiceSpeed}
            onChange={(e) => setSettings((prev) => ({ ...prev, voiceSpeed: parseFloat(e.target.value) }))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Music Volume slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">صوت الخلفية الموسيقية (الأجواء الروحانية):</span>
            <span className="font-mono text-amber-500">{settings.backgroundMusicVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={settings.backgroundMusicVolume}
            onChange={(e) => setSettings((prev) => ({ ...prev, backgroundMusicVolume: parseInt(e.target.value) }))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
