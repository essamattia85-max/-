import React, { useState } from "react";
import { 
  Sparkles, ShieldCheck, Heart, Moon, Compass, MapPin, Phone, 
  HelpCircle, Share2, Clipboard, Globe, Award, UserCheck
} from "lucide-react";
import { Scene, VideoSettings, CompanyInfo } from "./types";
import VideoPlayer from "./components/VideoPlayer";
import StudioControls from "./components/StudioControls";
import AIScriptGenerator from "./components/AIScriptGenerator";

// Import generated images for decorative branding cards
import kaabaBg from "./assets/images/kaaba_background_1783757166651.jpg";
import agencyLogo from "./assets/images/highlights_travel_logo_1783757181582.jpg";
import pilgrimImg from "./assets/images/egyptian_pilgrim_1783757195471.jpg";

export default function App() {
  // 1. Core State for the 3 scenes (Default as requested by the user)
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 1,
      title: "تجربة الحاج عصام (البداية)",
      text: "تجربتي في العمره مع شركة هاي لايتس ترافيل أنها كانت ممتازة",
      narratorName: "عصام عطية",
      duration: 6,
      subtitle: "الحاج عصام يشارك تجربته مع هاي لايتس ترافيل",
    },
    {
      id: 2,
      title: "جودة الرحلة والطيران",
      text: "الرحلة كانت ممتازة والطيران جميل",
      narratorName: "عصام عطية",
      duration: 5,
      subtitle: "تسهيلات السفر وجودة الطيران المريح",
    },
    {
      id: 3,
      title: "الإشراف والتوصية والاتصال",
      text: "إشراف ديني بصحبة طيبه. انصح الجميع بالحجز مع هاي لايتس للسياحه",
      narratorName: "عصام عطية",
      duration: 7,
      subtitle: "إشراف ديني مميز وأرقام التواصل للحجز",
    },
  ]);

  // 2. Core State for Company/Agency Details
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "هاي لايتس ترافيل",
    englishName: "High Lights Travel",
    slogan: "ريادة في خدمة ضيوف الرحمن",
    phones: ["01095555089", "01116994660"], // From user request
  });

  // 3. Core State for Video Settings & Player State
  const [settings, setSettings] = useState<VideoSettings>({
    slogan: "ريادة في خدمة ضيوف الرحمن",
    aspectRatio: "16:9",
    overlayFilter: "golden",
    activeScene: 1,
    isPlaying: false,
    isMuted: false,
    backgroundMusicVolume: 35,
    voiceVolume: 90,
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    showParticles: true,
    autoPlayNext: true,
  });

  // Campaign presets to switch scripts instantly
  const applyPreset = (presetType: "default" | "ramadan" | "vip") => {
    if (presetType === "default") {
      setScenes([
        {
          id: 1,
          title: "تجربة الحاج عصام (البداية)",
          text: "تجربتي في العمره مع شركة هاي لايتس ترافيل أنها كانت ممتازة",
          narratorName: "عصام عطية",
          duration: 6,
          subtitle: "الحاج عصام يشارك تجربته",
        },
        {
          id: 2,
          title: "جودة الرحلة والطيران",
          text: "الرحلة كانت ممتازة والطيران جميل",
          narratorName: "عصام عطية",
          duration: 5,
          subtitle: "تسهيلات السفر وجودة الطيران",
        },
        {
          id: 3,
          title: "الإشراف والتوصية والاتصال",
          text: "إشراف ديني بصحبة طيبه. انصح الجميع بالحجز مع هاي لايتس للسياحه",
          narratorName: "عصام عطية",
          duration: 7,
          subtitle: "الإشراف الديني ووسائل الحجز",
        },
      ]);
      setSettings((prev) => ({ ...prev, activeScene: 1, slogan: "ريادة في خدمة ضيوف الرحمن" }));
    } else if (presetType === "ramadan") {
      setScenes([
        {
          id: 1,
          title: "شوق لرمضان ومكة",
          text: "مفيش أجمل من عمرة رمضان مع ناس بتخاف ربنا وتريحك، تجربتي معاهم كانت فوق الخيال",
          narratorName: "عصام عطية",
          duration: 7,
          subtitle: "شوق وفرحة عمرة رمضان المبارك",
        },
        {
          id: 2,
          title: "فنادق قريبة وسفر مريح",
          text: "الفندق كان على بعد خطوات من الحرم الشريف والأكل ممتاز والسفر مريح جداً",
          narratorName: "عصام عطية",
          duration: 6,
          subtitle: "راحة تامة في الفنادق والسفر",
        },
        {
          id: 3,
          title: "التوصية بالحجز الفوري",
          text: "إشراف على أعلى مستوى وصحبة صالحة. متفكرش كتير، كلم هاي لايتس ترافيل واحجز فوراً",
          narratorName: "عصام عطية",
          duration: 8,
          subtitle: "الحجز الفوري والتواصل المباشر",
        },
      ]);
      setSettings((prev) => ({ ...prev, activeScene: 1, slogan: "عمرة رمضان المبارك بأسعار خاصة" }));
    } else if (presetType === "vip") {
      setScenes([
        {
          id: 1,
          title: "العمرة المميزة والمثالية",
          text: "لو بتدور على التميز والراحة التامة ليك ولعيلتك، أنصحك وبشدة ببرنامج عمرة هاي لايتس الفاخرة",
          narratorName: "عصام عطية",
          duration: 8,
          subtitle: "عمرة العائلات المتميزة والفاخرة",
        },
        {
          id: 2,
          title: "طيران مباشر وفنادق 5 نجوم",
          text: "طيران مباشر سريع وفنادق خمس نجوم مطلة على الكعبة المشرفة مباشرة مع رعاية طبية ممتازة",
          narratorName: "عصام عطية",
          duration: 7,
          subtitle: "خدمات الخمس نجوم الاستثنائية",
        },
        {
          id: 3,
          title: "تسهيل المناسك والدعم الدائم",
          text: "مرشدين دينيين على مدار الساعة لتسهيل المناسك. احجز مكانك الآن مع أفضل شركة سياحة بمصر",
          narratorName: "عصام عطية",
          duration: 8,
          subtitle: "توجيه دائم طوال الرحلة",
        },
      ]);
      setSettings((prev) => ({ ...prev, activeScene: 1, slogan: "رحلات عمرة فاخرة تناسب تطلعاتكم" }));
    }
  };

  // Callback to handle generated AI script application
  const handleApplyAIScript = (generated: { slogan: string; scene1: string; scene2: string; scene3: string }) => {
    setScenes([
      { ...scenes[0], text: generated.scene1 },
      { ...scenes[1], text: generated.scene2 },
      { ...scenes[2], text: generated.scene3 },
    ]);
    setSettings((prev) => ({ ...prev, slogan: generated.slogan, activeScene: 1 }));
  };

  const handleCopyNumbers = () => {
    navigator.clipboard.writeText(companyInfo.phones.join(" - "));
    alert("تم نسخ أرقام هواتف شركة هاي لايتس بنجاح! 📞");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Header with Islamic Geometric Accents and Brand Identity */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4" dir="rtl">
        {/* Brand details and logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-xl border-2 border-amber-500/30 overflow-hidden shadow-md bg-slate-950">
            <img
              src={agencyLogo}
              alt="High Lights Travel Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Islamic crescent shadow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                هاي لايتس ترافيل • استوديو إعلانات العمرة
              </h1>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold">
                نسخة احترافية
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              مصمم عروض العمرة التفاعلي والمبتكر بخلفيات الكعبة والمؤثرات الصوتية والذكاء الاصطناعي لشركات السياحة
            </p>
          </div>
        </div>

        {/* Action presets row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 ml-1">حملات سريعة جاهزة:</span>
          <button
            onClick={() => applyPreset("default")}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/30 text-slate-300 py-1.5 px-3 rounded-lg transition-all"
          >
            🇪🇬 رحلة الحاج عصام (الأساسية)
          </button>
          <button
            onClick={() => applyPreset("ramadan")}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 text-slate-300 py-1.5 px-3 rounded-lg transition-all"
          >
            🌙 عرض عمرة رمضان
          </button>
          <button
            onClick={() => applyPreset("vip")}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500/30 text-slate-300 py-1.5 px-3 rounded-lg transition-all"
          >
            ⭐ الباقة المتميزة الفاخرة
          </button>
        </div>
      </header>

      {/* 2. Main Content Grid of the studio workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        
        {/* Intro Alert Box about the Campaign & Settings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6" dir="rtl text-right">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-6 h-6 text-amber-500 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 mb-1 font-sans">
                تفاصيل وخصائص حملة العمرة لشركة هاي لايتس ترافيل
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                تم تجهيز هذا الاستوديو الترويجي بناءً على ميزات وتجربة <strong>الحاج عصام عطيّة</strong> بالعامية المصرية. الإعلان ينقسم إلى ثلاثة مشاهد متسلسلة بمؤثرات بصرية وصوتية، مع إبراز أرقام التواصل للحجز الفوري 
                <span className="text-amber-400 font-mono font-bold mx-1">01095555089</span> و 
                <span className="text-amber-400 font-mono font-bold mx-1">01116994660</span> في المشهد الختامي.
              </p>
            </div>
          </div>
          
          {/* Quick Copy Info Card */}
          <div className="flex items-center gap-3 shrink-0 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">أرقام الحجز السريع:</span>
              <span className="text-xs font-mono font-bold text-slate-300">{companyInfo.phones.join(" - ")}</span>
            </div>
            <button
              onClick={handleCopyNumbers}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-xl border border-slate-800 transition-colors"
              title="نسخ أرقام الهواتف"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Studio Workspace Layout Grid (Widescreen Video + Control Sidebars) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Middle: Interactive Video Player (Column Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Immersive Video Player Container */}
            <VideoPlayer
              scenes={scenes}
              settings={settings}
              companyInfo={companyInfo}
              setSettings={setSettings}
              onSceneChange={(sceneId) => setSettings((prev) => ({ ...prev, activeScene: sceneId }))}
            />

            {/* Campaign Guide & Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl text-right">
              
              {/* Trust Badge / Features Checklist */}
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col gap-3">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  أمان وضمان الخدمة مع هاي لايتس للسياحة
                </span>
                <ul className="text-xs text-slate-400 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> تأكيد الحجوزات وإصدار تأشيرات العمرة بشكل فوري ومعتمد.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> فنادق متميزة وقريبة من ساحة الحرم لراحة كبار السن والعائلات.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> إشراف ديني متميز لشرح المناسك ومرافقتكم في كل خطوة بالرحلة.
                  </li>
                </ul>
              </div>

              {/* Guide how to use speech/sound in this app */}
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col gap-3">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  إرشادات الاستخدام والتعليق الصوتي
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  • اضغط على زر <strong>التشغيل الأخضر</strong> لتفعيل عرض الفيديو بـ المشاهد الثلاثة.
                  <br />
                  • التطبيق يقوم بتوليد <strong>صوت الراوي</strong> بالعامية المصرية آلياً مع تزامن النص الإرشادي.
                  <br />
                  • سيقوم التطبيق بإنتاج <strong>موسيقى روحانية تصويرية</strong> دافئة في الخلفية لتجربة إيمانية متكاملة.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Studio Adjustments, Campaign Editors, and Gemini AI Copywriter */}
          <div className="flex flex-col gap-8">
            
            {/* Visual & Text Studio Controls */}
            <StudioControls
              scenes={scenes}
              settings={settings}
              companyInfo={companyInfo}
              setScenes={setScenes}
              setSettings={setSettings}
              setCompanyInfo={setCompanyInfo}
            />

            {/* AI Copywriter with Gemini API Integration */}
            <AIScriptGenerator
              companyInfo={companyInfo}
              onApplyGeneratedScript={handleApplyAIScript}
            />

          </div>

        </div>

      </main>

      {/* 3. Global Decorative Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center mt-12" dir="rtl">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-3">
          <img
            src={agencyLogo}
            alt="High Lights Travel"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-cover opacity-85 border border-amber-500/10 mb-1"
          />
          <span className="text-xs text-slate-400 font-sans">
            هاي لايتس ترافيل للسياحة والخدمات المتميزة • جميع الحقوق محفوظة لعام ٢٠٢٦م - ١٤٤٧هـ
          </span>
          <span className="text-[10px] text-slate-600 font-mono">
            High Lights Travel Umrah Studio v2.1 • Powered by Gemini AI Studio Build
          </span>
        </div>
      </footer>
    </div>
  );
}
