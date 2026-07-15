import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Phone, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Scene, VideoSettings, CompanyInfo } from "../types";

// Images generated via AI Studio tools
import kaabaBg from "../assets/images/kaaba_background_1783757166651.jpg";
import agencyLogo from "../assets/images/highlights_travel_logo_1783757181582.jpg";
import pilgrimImg from "../assets/images/egyptian_pilgrim_1783757195471.jpg";

interface VideoPlayerProps {
  scenes: Scene[];
  settings: VideoSettings;
  companyInfo: CompanyInfo;
  setSettings: React.Dispatch<React.SetStateAction<VideoSettings>>;
  onSceneChange: (sceneId: number) => void;
}

export default function VideoPlayer({
  scenes,
  settings,
  companyInfo,
  setSettings,
  onSceneChange,
}: VideoPlayerProps) {
  const [progress, setProgress] = useState(0); // 0 to 100 for current scene
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoice, setActiveVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  // Initialize Speech Synthesis and Audio Synth on click/mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Prefer Egyptian Arabic or general Arabic
        const voice = voices.find((v) => v.lang.includes("EG") || v.lang.startsWith("ar")) || null;
        setActiveVoice(voice);
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      stopAllAudio();
    };
  }, []);

  // Web Audio API Spiritual Synthesizer for gentle ambient pad background music
  const startAmbientSynth = () => {
    try {
      if (settings.isMuted) return;
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create main lowpass filter for deep spiritual serenity
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      // Warm primary frequency (F3, representing spiritual grounding ~174.61Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(174.61, ctx.currentTime);

      // Fifth interval (C4 ~261.63Hz) for divine harmony
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(261.63, ctx.currentTime);

      // Sub-bass frequency (F2 ~87.31Hz) for warm room resonance
      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(87.31, ctx.currentTime);

      const gainNode = ctx.createGain();
      // Set volume based on music settings
      const vol = (settings.backgroundMusicVolume / 100) * 0.08;
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1.5);

      // Route everything safely
      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      ambientOscRef.current = osc1; // Hold reference to stop
      ambientGainRef.current = gainNode;
    } catch (e) {
      console.warn("Audio synthesis not supported or blocked by browser security policy.", e);
    }
  };

  const stopAmbientSynth = () => {
    if (ambientGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      try {
        ambientGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        setTimeout(() => {
          if (ambientOscRef.current) {
            ambientOscRef.current.stop();
            ambientOscRef.current = null;
          }
        }, 600);
      } catch (e) {
        // Safe check
      }
    }
  };

  const stopAllAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    stopAmbientSynth();
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
  };

  // Speak script and start progress counting
  const currentScene = scenes.find((s) => s.id === settings.activeScene) || scenes[0];

  const handlePlayPause = () => {
    if (settings.isPlaying) {
      // Pause
      stopAllAudio();
      setSettings((prev) => ({ ...prev, isPlaying: false }));
    } else {
      // Play
      setSettings((prev) => ({ ...prev, isPlaying: true }));
      playCurrentScene();
    }
  };

  const playCurrentScene = () => {
    stopAllAudio();
    setProgress(0);

    const activeSceneData = scenes.find((s) => s.id === settings.activeScene) || scenes[0];

    // 1. Play Background Music Synth
    startAmbientSynth();

    // 2. TTS Voiceover
    if (synthRef.current && !settings.isMuted) {
      // Create fresh speech utterance
      const textToSpeak = activeSceneData.text;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;
      
      utterance.voice = activeVoice;
      utterance.lang = "ar-EG";
      utterance.rate = settings.voiceSpeed;
      utterance.pitch = settings.voicePitch;
      utterance.volume = settings.voiceVolume / 100;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        handleSceneCompletion();
      };

      utterance.onerror = (e) => {
        console.warn("Speech Synthesis error:", e);
        setIsSpeaking(false);
        // Fallback progress trigger anyway
        simulateSpeechProgress(activeSceneData.duration);
      };

      synthRef.current.speak(utterance);
    } else {
      // Simulate speech if muted or unsupported
      simulateSpeechProgress(activeSceneData.duration);
    }

    // 3. Track Scene Progress
    const durationMs = activeSceneData.duration * 1000;
    const intervalTime = 100; // update progress every 100ms
    let elapsed = 0;

    progressTimerRef.current = window.setInterval(() => {
      elapsed += intervalTime;
      const percentage = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(percentage);

      if (percentage >= 100) {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
        if (!synthRef.current || settings.isMuted) {
          handleSceneCompletion();
        }
      }
    }, intervalTime);
  };

  const simulateSpeechProgress = (duration: number) => {
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
    }, duration * 1000);
  };

  const handleSceneCompletion = () => {
    if (settings.autoPlayNext) {
      const currentIndex = scenes.findIndex((s) => s.id === settings.activeScene);
      if (currentIndex < scenes.length - 1) {
        const nextSceneId = scenes[currentIndex + 1].id;
        onSceneChange(nextSceneId);
      } else {
        // Loop back to scene 1 or stop
        setSettings((prev) => ({ ...prev, isPlaying: false }));
        setProgress(100);
      }
    } else {
      setSettings((prev) => ({ ...prev, isPlaying: false }));
      setProgress(100);
    }
  };

  const restartVideo = () => {
    setProgress(0);
    onSceneChange(scenes[0].id);
    setSettings((prev) => ({ ...prev, isPlaying: true }));
  };

  // Re-trigger playback on scene or voice parameter change when isPlaying
  useEffect(() => {
    if (settings.isPlaying) {
      playCurrentScene();
    } else {
      stopAllAudio();
      setProgress(0);
    }
  }, [settings.activeScene]);

  // Adjust volume / speed changes live
  useEffect(() => {
    if (settings.isPlaying && synthRef.current) {
      // To apply new settings smoothly, we quick re-trigger or wait
    }
  }, [settings.voiceSpeed, settings.voicePitch, settings.isMuted]);

  // Canvas-based spiritual glowing particle effect
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current || !settings.showParticles) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.width = canvasRef.current.offsetWidth;
        height = canvasRef.current.height = canvasRef.current.offsetHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 40;

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: height + Math.random() * 20,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.5 + 0.2),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.3,
      fadeSpeed: Math.random() * 0.002 + 0.001,
    });

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
      // distribute initially
      particles[i].y = Math.random() * height;
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity -= p.fadeSpeed;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Spiritual gold particles
        ctx.fillStyle = `rgba(234, 179, 8, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#eab308";
        ctx.fill();

        if (p.opacity <= 0 || p.y < -10) {
          particles[i] = createParticle();
        }
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [settings.showParticles, settings.aspectRatio]);

  // Dynamic filter css
  const getFilterStyle = () => {
    switch (settings.overlayFilter) {
      case "golden":
        return "sepia(40%) saturate(140%) hue-rotate(5deg) brightness(95%) contrast(105%)";
      case "emerald":
        return "hue-rotate(80deg) saturate(110%) brightness(90%) contrast(110%)";
      case "twilight":
        return "hue-rotate(-20deg) saturate(130%) brightness(85%) contrast(115%)";
      default:
        return "none";
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-slate-950 p-4 md:p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Decorative Golden Arch Silhouette Border */}
      <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/10 rounded-3xl m-1" />
      
      {/* Dynamic Player Screen Title */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          <span className="font-sans text-sm font-semibold text-slate-200">
            معاينة الفيديو الإعلاني التفاعلي • {settings.aspectRatio === "16:9" ? "أفقي 16:9 (يوتيوب/فيسبوك)" : "عمودي 9:16 (ستوري/ريلز)"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            جاهز للبث
          </span>
        </div>
      </div>

      {/* Video Viewport Wrapper with Dynamic Aspect Ratio */}
      <div
        className={`relative overflow-hidden rounded-2xl border-4 border-amber-500/25 bg-slate-900 transition-all duration-500 shadow-inner flex items-center justify-center ${
          settings.aspectRatio === "16:9" 
            ? "w-full aspect-video max-w-4xl" 
            : "w-full max-w-[340px] aspect-[9/16] h-[550px]"
        }`}
        id="highlights-video-container"
      >
        {/* 1. Base Kaaba Beautiful Immersive Background */}
        <img
          src={kaabaBg}
          alt="Al Kaaba background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-all duration-700"
          style={{ filter: getFilterStyle() }}
        />

        {/* Ambient Dark Overlay for visual balance and subtitle contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-slate-950/50 pointer-events-none" />

        {/* 2. Particles layer */}
        {settings.showParticles && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />
        )}

        {/* 3. Company Branding & Logo (Top Right as requested) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2.5 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-lg animate-fade-in text-right" dir="rtl">
          <img
            src={agencyLogo}
            alt="Highlights Logo"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-lg border border-amber-500/20 object-cover"
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-amber-400 leading-tight">هاي لايتس ترافيل</span>
            <span className="text-[9px] text-slate-300 font-medium tracking-tight">
              {settings.slogan || "ريادة في خدمة ضيوف الرحمن"}
            </span>
          </div>
        </div>

        {/* 4. Dynamic Content Layer based on active Scene */}
        <AnimatePresence mode="wait">
          {settings.activeScene !== 3 ? (
            <motion.div
              key={`scene-${settings.activeScene}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col justify-center items-center p-6 z-10"
            >
              {/* Pilgrim Character Portrait Frame (Scene 1 & 2) */}
              <div className="relative mt-2 mb-4">
                {/* Glowing Sacred Halo Halo */}
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 opacity-60 blur animate-pulse" />
                
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-amber-400 overflow-hidden shadow-2xl bg-slate-800">
                  <img
                    src={pilgrimImg}
                    alt="Egyptian Pilgrim in Ihram"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      isSpeaking ? "scale-105 brightness-110" : "scale-100 filter brightness-95"
                    }`}
                  />
                  
                  {/* Speaking indicator overlay */}
                  {isSpeaking && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-amber-500 text-[10px] font-bold text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                      يتحدث الآن
                    </div>
                  )}
                </div>
              </div>

              {/* Character Details */}
              <div className="bg-slate-950/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-700/50 mb-2">
                <span className="text-xs text-amber-200 font-sans font-medium" dir="rtl">
                  الحاج عصام عطيّة (شاهد من مصر) 🇪🇬
                </span>
              </div>
            </motion.div>
          ) : (
            // Scene 3: Majestic Grand Finale with Contact Details and spiritual badges
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col justify-center items-center p-6 z-20 text-center text-white bg-slate-950/80 backdrop-blur-md"
              dir="rtl"
            >
              {/* Sacred Dome Logo Accent */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center mb-4 border border-amber-400 shadow-lg shadow-amber-500/20">
                <Sparkles className="w-8 h-8 text-slate-950" />
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-amber-400 tracking-wide font-sans mb-1">
                سجل الآن في رحلة العمرة المميزة
              </h3>
              <p className="text-sm text-emerald-400 font-sans font-medium mb-4 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                هاي لايتس للسياحة - ثقة وأمان وصحبة صالحة
              </p>

              {/* Dynamic Feature Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-sm">
                <span className="text-[10px] md:text-xs bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                  🛫 طيران متميز ومريح
                </span>
                <span className="text-[10px] md:text-xs bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                  🕌 إشراف ديني متمكن
                </span>
                <span className="text-[10px] md:text-xs bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                  🤝 صحبة طيبة صالحة
                </span>
              </div>

              {/* Call-to-action Contact Card with phone numbers */}
              <div className="w-full max-w-xs bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <span className="text-xs text-amber-400 font-semibold mb-2 block tracking-wider">
                  📞 للحجز والاستعلام المباشر:
                </span>
                <div className="flex flex-col gap-2">
                  {companyInfo.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.replace(/-/g, "")}`}
                      className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 py-2 rounded-lg text-slate-100 hover:text-amber-300 transition-all font-mono font-bold text-sm md:text-base tracking-widest shadow-md"
                    >
                      <Phone className="w-4 h-4 text-emerald-400 animate-bounce" />
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Subtitles & Script Box Overlay (Bottom Position) */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-10 z-30" dir="rtl">
          <div className="max-w-xl mx-auto text-center">
            {/* Dynamic Interactive Karaoke Subtitle Progression */}
            <p className="text-base md:text-lg text-slate-100 leading-relaxed font-sans font-semibold drop-shadow-md">
              {currentScene.text}
            </p>
            
            {/* Subtitle Progress Bar */}
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-3 max-w-xs mx-auto border border-slate-700/30">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Scene Tracker dots */}
            <div className="flex items-center justify-center gap-2 mt-3.5">
              {scenes.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => onSceneChange(s.id)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    settings.activeScene === s.id
                      ? "w-7 bg-amber-500"
                      : "w-2.5 bg-slate-700 hover:bg-slate-500"
                  }`}
                  title={`المشهد ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Media Playback Controls Console (Below Screen) */}
      <div className="w-full max-w-2xl mt-5 flex flex-col gap-4">
        {/* Playback Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 px-5 py-3.5 rounded-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className={`p-3.5 rounded-full shadow-lg transition-all ${
                settings.isPlaying
                  ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
              title={settings.isPlaying ? "إيقاف مؤقت" : "تشغيل العرض الإعلاني"}
            >
              {settings.isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            
            <button
              onClick={restartVideo}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700 rounded-full transition-all"
              title="إعادة تشغيل من البداية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Volume and Voice indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettings((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
              className="text-slate-400 hover:text-amber-400 transition-colors p-1"
              title={settings.isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
            >
              {settings.isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="text-xs text-slate-400 flex flex-col">
              <span className="font-sans font-medium">التعليق الصوتي:</span>
              <span className="font-mono text-amber-400/90 text-right">
                {settings.isMuted ? "مكتوم 🚫" : isSpeaking ? "مستمر... 🔊" : "جاهز ▶️"}
              </span>
            </div>
          </div>
        </div>

        {/* Browser Speech Compatibility Warning */}
        {typeof window !== "undefined" && !window.speechSynthesis && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>متصفحك لا يدعم توليد الصوت محلياً. سيتم تشغيل المؤثرات والترجمة الإرشادية تلقائياً.</span>
          </div>
        )}
      </div>
    </div>
  );
}
