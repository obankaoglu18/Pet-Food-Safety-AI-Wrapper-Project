
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { PawFreshTheme } from '../theme';
import * as Icons from './Icons';
import { localization } from '../services/localizationService';

// --- Theme Context ---
const COLORS = PawFreshTheme.colors.light;

// --- 0. Layout & Backgrounds ---
export const AppScreen = ({ children, className = '', style = {} }: { children: ReactNode, className?: string, style?: any }) => (
  <div 
    className={`flex flex-col h-full w-full bg-[#F8FAFC] text-[${COLORS.text}] relative overflow-hidden ${className}`}
    style={{ ...style }}
  >
    {/* Subtle Decorative Background Pattern */}
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0" 
         style={{ backgroundImage: 'radial-gradient(#2EC4B6 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
    </div>
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
    <div className="absolute top-40 -left-20 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
    
    <div className="relative z-10 flex flex-col h-full">{children}</div>
  </div>
);

// --- 1. Card ---
export const Card = ({ children, className = '', onClick, variant = 'default' }: { children: ReactNode, className?: string, onClick?: () => void, variant?: 'default' | 'outline' | 'ghost' | 'danger' }) => {
  const baseStyle = `rounded-[${PawFreshTheme.radii.card}px] transition-all duration-200`;
  let variantStyle = `bg-white shadow-sm border border-[${COLORS.outline}]`;
  
  if (variant === 'outline') variantStyle = `bg-transparent border border-[${COLORS.outline}]`;
  if (variant === 'ghost') variantStyle = `bg-[${COLORS.subtle}]`;
  if (variant === 'danger') variantStyle = `bg-red-50 border border-red-100`;

  const interaction = onClick ? "active:scale-[0.98] cursor-pointer hover:shadow-md" : "";

  return (
    <div 
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${interaction} p-5 ${className}`}
    >
      {children}
    </div>
  );
};

// --- 2. Buttons ---
export const PrimaryButton = ({ children, onClick, disabled, fullWidth, className = '', icon: Icon }: any) => (
  <button
    onClick={(e) => {
      if (navigator.vibrate) navigator.vibrate(10);
      onClick && onClick(e);
    }}
    disabled={disabled}
    className={`
      flex items-center justify-center gap-2
      bg-[${COLORS.primary}] text-white
      transition-all duration-200 active:scale-[0.96] hover:shadow-lg hover:shadow-teal-500/20
      disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed disabled:shadow-none
      ${fullWidth ? 'w-full' : ''} ${className}
    `}
    style={{
      borderRadius: PawFreshTheme.radii.button,
      padding: '16px 24px',
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: '0.5px'
    }}
  >
    {Icon && <Icon size={20} className="text-white" />}
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick, disabled, fullWidth, className = '', icon: Icon }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center gap-2
      bg-white text-[${COLORS.text}] border border-[${COLORS.outline}]
      transition-all duration-200 active:scale-[0.96] hover:bg-[${COLORS.subtle}]
      disabled:opacity-50
      ${fullWidth ? 'w-full' : ''} ${className}
    `}
    style={{
      borderRadius: PawFreshTheme.radii.button,
      padding: '16px 24px',
      fontSize: 16,
      fontWeight: 700,
    }}
  >
    {Icon && <Icon size={20} className="text-slate-500" />}
    {children}
  </button>
);

export const IconButton = ({ icon: Icon, onClick, className = '' }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors ${className}`}
  >
    <Icon size={24} color={COLORS.text} />
  </button>
);

// --- 3. Typography ---
export const Txt = ({ variant = 'body', className = '', children, color }: { variant?: 'h1' | 'h2' | 'body' | 'caption' | 'muted', className?: string, children: ReactNode, color?: string }) => {
  const styles = PawFreshTheme.typography;
  let style: any = styles.body;
  let defaultColor = COLORS.text;

  if (variant === 'h1') style = styles.h1;
  if (variant === 'h2') style = styles.h2;
  if (variant === 'caption') { style = styles.caption; defaultColor = COLORS.mutedText; }
  if (variant === 'muted') { style = styles.body; defaultColor = COLORS.mutedText; }

  return (
    <div className={className} style={{ ...style, color: color || defaultColor }}>
      {children}
    </div>
  );
};

// --- 4. Forms (Inputs, Tags) ---

export const Input = ({ label, placeholder, value, onChange, type = 'text', min, className = '' }: any) => {
  const handleChange = (e: any) => {
    // Prevent negative numbers if type is number
    if (type === 'number' && parseFloat(e.target.value) < 0) return;
    onChange(e);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <Txt variant="caption" className="mb-2 uppercase tracking-wider font-bold text-slate-400">{label}</Txt>}
      <input
        type={type}
        min={min}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent placeholder:text-slate-300"
        style={{
          border: `1px solid ${COLORS.outline}`,
          borderRadius: PawFreshTheme.radii.input,
          padding: '16px 16px',
          color: COLORS.text,
          fontSize: 16,
          fontWeight: 600
        }}
      />
    </div>
  );
};

export const TagInput = ({ label, placeholder, tags, onAdd, onRemove }: any) => {
  const [input, setInput] = useState('');
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="mb-4">
      <Txt variant="caption" className="mb-2 uppercase tracking-wider font-bold text-slate-400">{label}</Txt>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag: string, i: number) => (
          <span key={i} className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 border border-teal-100 animate-fade-in">
            {tag}
            <button type="button" onClick={() => onRemove(tag)} className="hover:text-teal-900 bg-teal-200/50 rounded-full p-0.5 ml-1"><Icons.X size={12}/></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button 
          type="button"
          onClick={() => { if(input.trim()) { onAdd(input.trim()); setInput(''); }}}
          className="bg-slate-100 p-3 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <Icons.Plus size={24} />
        </button>
      </div>
    </div>
  );
};

// --- 5. Camera & Overlays ---

export const CameraCapture = ({ onCapture, onClose }: { onCapture: (img: string) => void, onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (mounted) {
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
        }
      } catch (e) {
        console.error(e);
        alert("Unable to access camera.");
        onClose();
      }
    }
    init();
    return () => {
      mounted = false;
      if (stream) stream.getTracks().forEach(t => t.stop());
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [stream]);

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      onCapture(canvas.toDataURL('image/jpeg', 0.8));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
        <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full text-white z-10 shadow-lg">
          <Icons.X size={24} />
        </button>
      </div>
      <div className="bg-black p-10 flex justify-center pb-16">
        <button onClick={capture} className="w-20 h-20 rounded-full border-[6px] border-white/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
          <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
        </button>
      </div>
    </div>
  );
};

export const LoadingOverlay = ({ type, species }: { type: 'CREATE_PET' | 'ANALYZE_FOOD' | 'PROCESSING_PAYMENT', species?: string }) => {
  const [factIndex, setFactIndex] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  // Simplified logic to retrieve facts to avoid circular deps. 
  // Ideally this comes from localization service.
  const facts = localization.getArray(
    species === 'Dog' ? 'dogFacts' : 
    species === 'Cat' ? 'catFacts' : 
    'generalFacts'
  );
  
  const messages = localization.getArray(type === 'CREATE_PET' ? 'loadCreate' : 'loadAnalyze');
  const isPayment = type === 'PROCESSING_PAYMENT';

  useEffect(() => {
    if (isPayment) return;
    const factInterval = setInterval(() => setFactIndex(prev => (prev + 1) % facts.length), 4000);
    const msgInterval = setInterval(() => setMsgIndex(prev => (prev + 1) % messages.length), 2000);
    return () => { clearInterval(factInterval); clearInterval(msgInterval); };
  }, [facts.length, messages.length, isPayment]);

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      {/* Decorative Background for Loader */}
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
          <div className="h-full bg-teal-500 animate-[progress_3s_ease-in-out_infinite]"></div>
      </div>

      <div className="relative mb-8">
         <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-30"></div>
         <div className="relative bg-white p-6 rounded-full shadow-xl border-4 border-teal-50">
           {isPayment ? <Icons.Lock size={40} className="text-teal-500" /> : <Icons.Sparkles size={40} className="text-teal-500 animate-spin-slow" />}
         </div>
      </div>

      <Txt variant="h2" className="mb-2 min-h-[2rem] transition-all text-slate-800">
        {isPayment ? localization.t('processingPayment') : messages[msgIndex]}
      </Txt>

      {!isPayment && (
        <>
          <div className="flex gap-1.5 mb-10 justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce delay-100"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce delay-200"></div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl w-full max-w-sm relative overflow-hidden shadow-sm">
             <div className="flex items-center gap-2 mb-3 text-teal-600 font-bold uppercase text-xs tracking-wider justify-center">
               <Icons.Info size={14} />
               {localization.t('didYouKnow')}
             </div>
             <Txt variant="body" className="text-slate-600 italic min-h-[4rem] flex items-center justify-center">
               "{facts[factIndex]}"
             </Txt>
             {/* Paw decorations */}
             <Icons.PawPrint className="absolute -bottom-2 -right-2 text-slate-200 opacity-50 rotate-[-15deg]" size={48} />
             <Icons.PawPrint className="absolute -top-2 -left-2 text-slate-200 opacity-50 rotate-[15deg]" size={32} />
          </div>
        </>
      )}
      <style>{`
        @keyframes progress { 0% { width: 0%; left: 0; } 50% { width: 100%; left: 0; } 100% { width: 0%; left: 100%; } }
        .animate-spin-slow { animation: spin 4s linear infinite; }
      `}</style>
    </div>
  );
};

// --- 6. Status Badges & Empty States ---

export const RiskBadge = ({ level }: { level: string }) => {
  let bg = COLORS.subtle;
  let text = COLORS.mutedText;
  let Icon = Icons.HelpCircle;

  switch (level) {
    case 'SAFE': bg = '#DCFCE7'; text = '#166534'; Icon = Icons.CheckCircle; break;
    case 'CAUTION': bg = '#FEF3C7'; text = '#92400E'; Icon = Icons.AlertTriangle; break;
    case 'DANGEROUS': bg = '#FEE2E2'; text = '#991B1B'; Icon = Icons.XCircle; break;
  }

  return (
    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-sm border border-transparent" style={{ backgroundColor: bg }}>
      <Icon size={18} color={text} />
      <span style={{ color: text, fontWeight: 800, fontSize: 13, letterSpacing: '0.5px' }}>{level}</span>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, message }: any) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center opacity-80">
    <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center mb-6 shadow-sm transform rotate-3">
      <Icon size={40} className="text-teal-400" />
    </div>
    <Txt variant="h2" className="mb-2 text-slate-800">{title}</Txt>
    <Txt variant="muted" className="max-w-xs leading-relaxed">{message}</Txt>
  </div>
);
