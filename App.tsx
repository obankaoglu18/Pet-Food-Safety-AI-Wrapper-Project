
import React, { useState, useEffect, useRef } from 'react';
import { Pet, FoodCheck, ViewState, Species, RiskLevel } from './types';
import { storageService } from './services/storageService';
import { geminiService } from './services/geminiService';
import { paymentService } from './services/paymentService';
import { localization } from './services/localizationService';
import * as Icons from './components/Icons';
import { 
  AppScreen, Card, PrimaryButton, SecondaryButton, 
  IconButton, Txt, Input, TagInput, RiskBadge, 
  EmptyState, LoadingOverlay, CameraCapture 
} from './components/PawFreshUI';
import { PawFreshTheme } from './theme';

// --- Utils ---
const compressImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 800;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) { height *= maxDim / width; width = maxDim; }
      } else {
        if (height > maxDim) { width *= maxDim / height; height = maxDim; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
  });
};

// --- VIEWS ---

// 1. Onboarding
const OnboardingView = ({ onComplete }: { onComplete: () => void }) => (
  <AppScreen className="justify-center items-center px-8 text-center bg-white">
    <div className="mb-10 w-44 h-44 bg-transparent rounded-[40px] flex items-center justify-center shadow-2xl shadow-teal-500/10 animate-fade-in relative overflow-hidden border border-slate-50">
       <img src="logo.png" alt="PawFresh Logo" className="w-full h-full object-cover" />
    </div>
    <Txt variant="h1" className="mb-2 text-slate-900 tracking-tight font-extrabold text-3xl">{localization.t('appName')}</Txt>
    <Txt variant="h2" className="mb-4 text-teal-600 font-bold">{localization.t('onboardingTitle')}</Txt>
    <Txt className="mb-12 text-center text-slate-500 leading-relaxed max-w-xs mx-auto">
      {localization.t('onboardingDesc')}
    </Txt>
    <PrimaryButton fullWidth onClick={onComplete} icon={Icons.ChevronRight} className="shadow-xl shadow-teal-500/30">
      {localization.t('getStarted')}
    </PrimaryButton>
  </AppScreen>
);

// 2. Paywall
const PaywallView = ({ onClose, onPurchaseComplete, context }: { onClose: () => void, onPurchaseComplete: () => void, context?: 'LIMIT' | 'CREDIT' }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  const handlePurchase = async () => {
    setLoading(true);
    const res = await paymentService.processPurchase(selectedPlan);
    setLoading(false);
    
    if (res.success) {
      storageService.setPro(true);
      onPurchaseComplete();
    } else {
      let msg = localization.t('paymentFailed');
      if (res.error === 'CANCELLED') msg = localization.t('paymentCancelled');
      if (res.error === 'NETWORK') msg = localization.t('networkError');
      alert(msg);
    }
  };

  const handleRestore = async () => {
      setLoading(true);
      const success = await paymentService.restorePurchases();
      setLoading(false);
      if (success) {
          storageService.setPro(true);
          alert(localization.t('restoreSuccess'));
          onPurchaseComplete();
      } else {
          alert(localization.t('restoreFailed'));
      }
  };

  const priceYearly = localization.formatCurrency(39.99);
  const priceMonthly = localization.formatCurrency(4.99);

  return (
    <AppScreen className="bg-white">
      {loading && <LoadingOverlay type="PROCESSING_PAYMENT" />}
      
      {/* Close Button */}
      <div className="p-6 pt-12 flex justify-end">
        <IconButton icon={Icons.X} onClick={onClose} className="bg-slate-100 text-slate-600 hover:bg-slate-200" />
      </div>

      <div className="flex-1 px-8 flex flex-col items-center text-center overflow-y-auto">
        {/* Dynamic Header based on Trigger Context */}
        {context === 'LIMIT' ? (
          <div className="mb-6 flex flex-col items-center animate-fade-in">
             <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
               <Icons.Lock size={32} className="text-red-400" />
             </div>
             <Txt variant="h1" className="text-slate-900 mb-2">{localization.t('limitReachedTitle')}</Txt>
             <Txt className="text-slate-500 max-w-xs">{localization.t('limitReachedDesc')}</Txt>
          </div>
        ) : (
          <>
            <div className="w-28 h-28 bg-white rounded-[24px] flex items-center justify-center shadow-xl shadow-slate-200 mb-6 animate-pulse overflow-hidden border border-slate-50">
               <img src="logo.png" alt="Pro" className="w-full h-full object-cover" />
            </div>
            <Txt variant="h1" className="mb-2 text-slate-900 tracking-tight">{localization.t('premiumTitle')}</Txt>
            <Txt className="text-slate-500 mb-10 leading-relaxed max-w-xs mx-auto">{localization.t('premiumDesc')}</Txt>
          </>
        )}
        
        {/* Plans */}
        <div className="w-full space-y-4 mb-8">
          {/* Yearly Plan */}
          <div 
            onClick={() => setSelectedPlan('yearly')}
            className={`
              relative w-full rounded-2xl p-4 border-2 transition-all cursor-pointer flex items-center justify-between
              ${selectedPlan === 'yearly' ? 'border-amber-400 bg-amber-50 shadow-md scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-200'}
            `}
          >
            {selectedPlan === 'yearly' && (
              <div className="absolute -top-3 left-6 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                {localization.t('bestValue')}
              </div>
            )}
            <div className="flex items-center gap-4 text-left">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'yearly' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                 {selectedPlan === 'yearly' && <Icons.Check size={14} className="text-white" />}
              </div>
              <div>
                <Txt className={`font-bold ${selectedPlan === 'yearly' ? 'text-slate-900' : 'text-slate-600'}`}>{localization.t('planYearly')}</Txt>
                <Txt variant="caption" className="text-slate-400">{priceYearly} {localization.t('perYear')}</Txt>
              </div>
            </div>
            <Txt variant="h2" className="text-amber-600 text-lg">{priceYearly}</Txt>
          </div>

          {/* Monthly Plan */}
          <div 
            onClick={() => setSelectedPlan('monthly')}
            className={`
              w-full rounded-2xl p-4 border-2 transition-all cursor-pointer flex items-center justify-between
              ${selectedPlan === 'monthly' ? 'border-amber-400 bg-amber-50 shadow-md scale-[1.02]' : 'border-slate-100 bg-white hover:border-slate-200'}
            `}
          >
            <div className="flex items-center gap-4 text-left">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                 {selectedPlan === 'monthly' && <Icons.Check size={14} className="text-white" />}
              </div>
              <div>
                <Txt className={`font-bold ${selectedPlan === 'monthly' ? 'text-slate-900' : 'text-slate-600'}`}>{localization.t('planMonthly')}</Txt>
                <Txt variant="caption" className="text-slate-400">{priceMonthly} {localization.t('perMonth')}</Txt>
              </div>
            </div>
            <Txt variant="h2" className="text-slate-600 text-lg">{priceMonthly}</Txt>
          </div>
        </div>

        {/* Action */}
        <PrimaryButton fullWidth onClick={handlePurchase} className="mb-4 shadow-xl shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-500 border-none py-5">
          {localization.t('continue')}
        </PrimaryButton>
        
        <div className="flex items-center gap-1 text-slate-400 justify-center text-xs mt-2">
           <Icons.Lock size={10} />
           <span>{localization.t('securePayment')}</span>
        </div>
        
        <button className="mt-6 mb-8 text-xs text-slate-400 hover:text-slate-600 transition-colors underline" onClick={handleRestore}>
          {localization.t('restore')}
        </button>
      </div>
    </AppScreen>
  );
};

// 3. Home
const HomeView = ({ pets, onAddPet, onSelectPet, onHistory, onGoPro, isPro, freeCredits }: any) => {
  return (
    <AppScreen>
      {/* Header */}
      <div className="px-6 pt-10 pb-6 bg-white border-b border-slate-100 shadow-sm z-10 rounded-b-[32px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-slate-100 bg-white">
                <img src="logo.png" alt="Logo" className="w-full h-full object-cover" />
             </div>
             <div>
                <Txt variant="caption" className="uppercase tracking-widest font-extrabold text-teal-600 text-[10px]">{localization.t('welcomeBack')}</Txt>
                <Txt variant="h2" className="text-slate-900 leading-none">PawFresh</Txt>
             </div>
          </div>
          <div className="flex gap-2">
            {!isPro && <IconButton icon={Icons.Crown} onClick={onGoPro} className="bg-gradient-to-br from-amber-100 to-orange-100 text-orange-600 shadow-sm" />}
            <IconButton icon={Icons.History} onClick={onHistory} className="bg-slate-50 text-slate-600" />
          </div>
        </div>
        
        {/* Credits Pill */}
        {!isPro && (
          <div onClick={onGoPro} className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between cursor-pointer shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-transform">
            <div className="flex items-center gap-3">
               <div className="bg-amber-400 p-1.5 rounded-full"><Icons.Star size={14} className="text-black" /></div>
               <div className="text-xs font-bold">
                 {freeCredits > 0 ? localization.t('freeRemaining', {count: freeCredits}) : localization.t('outOfCredits')}
               </div>
            </div>
            <Icons.ChevronRight size={16} className="text-slate-500" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {pets.length === 0 ? (
          <EmptyState 
            icon={Icons.Dog} 
            title={localization.t('noPets')} 
            message={localization.t('noPetsDesc')} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pets.map((pet: Pet) => (
              <Card key={pet.id} onClick={() => onSelectPet(pet.id)} className="flex items-center gap-4 hover:shadow-lg transition-all border-none bg-white/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-white shadow-md overflow-hidden flex-shrink-0 relative">
                  {pet.portraitUrl ? (
                    <img src={pet.portraitUrl} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-600 font-black text-xl">{pet.name[0]}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Txt variant="h2" className="mb-0.5 truncate">{pet.name}</Txt>
                  <Txt variant="caption" className="text-slate-500 font-medium truncate">{pet.breed || pet.species} • {pet.age} {localization.t('years')}</Txt>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-active:bg-teal-500 group-active:text-white transition-colors flex-shrink-0">
                   <Icons.ChevronRight size={20} className="text-slate-300" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-gradient-to-t from-white via-white to-transparent">
        <PrimaryButton fullWidth onClick={onAddPet} icon={Icons.Plus} className="shadow-xl shadow-teal-500/30">
          {localization.t('addPet')}
        </PrimaryButton>
      </div>
    </AppScreen>
  );
};

// 4. Add/Edit Pet
const PetFormView = ({ onSave, onCancel, initialPet }: any) => {
  const [formData, setFormData] = useState({ 
    name: initialPet?.name || '', 
    age: initialPet?.age?.toString() || '', 
    weight: initialPet ? localization.fromKg(initialPet.weight) : '',
    species: initialPet?.species || Species.DOG, // Hidden from UI, AI detects
    allergies: initialPet?.allergies || [],
    conditions: initialPet?.conditions || []
  });
  const [image, setImage] = useState<string | null>(initialPet?.originalImage || null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!formData.name || !image || !formData.age || !formData.weight) return;
    setLoading(true);
    try {
      await onSave({
        ...formData,
        age: Math.abs(parseFloat(formData.age)),
        weight: localization.toKg(Math.abs(parseFloat(formData.weight))),
        image
      });
    } finally { setLoading(false); }
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => setImage(await compressImage(reader.result as string));
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppScreen>
      {loading && <LoadingOverlay type="CREATE_PET" />}
      {showCamera && <CameraCapture onCapture={(img) => { setImage(img); setShowCamera(false); }} onClose={() => setShowCamera(false)} />}
      
      <div className="px-6 pt-10 pb-4 flex items-center gap-4">
        {onCancel && <IconButton icon={Icons.ArrowLeft} onClick={onCancel} className="bg-white shadow-sm" />}
        <Txt variant="h2" className={!onCancel ? "ml-1" : ""}>{initialPet ? localization.t('editProfile') : localization.t('create')}</Txt>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pt-0">
        <div className="flex justify-center mb-8 mt-4">
           {image ? (
             <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-xl">
               <img src={image} className="w-full h-full object-cover rounded-full" />
               <button onClick={() => setImage(null)} className="absolute bottom-1 right-1 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                 <Icons.Trash2 size={16} />
               </button>
             </div>
           ) : (
             <div className="flex gap-4">
                <div onClick={() => setShowCamera(true)} className="w-32 h-32 bg-teal-50 border-2 border-teal-100 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-teal-100 transition-colors">
                   <Icons.Camera size={32} className="text-teal-500 mb-2" />
                   <Txt variant="caption" className="text-teal-600 font-bold">{localization.t('camera')}</Txt>
                </div>
                <div onClick={() => fileInput.current?.click()} className="w-32 h-32 bg-slate-50 border-2 border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                   <Icons.Upload size={32} className="text-slate-400 mb-2" />
                   <Txt variant="caption" className="text-slate-500 font-bold">{localization.t('gallery')}</Txt>
                </div>
             </div>
           )}
           <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={handleImage} />
        </div>

        <Card className="mb-6 space-y-6 shadow-sm border-none">
          <Input label={localization.t('name')} value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} />
          
          <div className="flex gap-4">
             <div className="flex-1"><Input label={localization.t('age')} type="number" min="0" value={formData.age} onChange={(e: any) => setFormData({...formData, age: e.target.value})} /></div>
             <div className="flex-1"><Input label={`${localization.t('weight')} (${localization.getWeightUnit()})`} type="number" min="0" value={formData.weight} onChange={(e: any) => setFormData({...formData, weight: e.target.value})} /></div>
          </div>

          <div className="h-px bg-slate-100 my-2"></div>

          <TagInput 
            label={localization.t('allergies')} 
            placeholder={localization.t('addAllergy')}
            tags={formData.allergies} 
            onAdd={(t: string) => setFormData({...formData, allergies: [...formData.allergies, t]})}
            onRemove={(t: string) => setFormData({...formData, allergies: formData.allergies.filter((x: string) => x !== t)})}
          />
          <TagInput 
            label={localization.t('conditions')} 
            placeholder={localization.t('addCondition')}
            tags={formData.conditions} 
            onAdd={(t: string) => setFormData({...formData, conditions: [...formData.conditions, t]})}
            onRemove={(t: string) => setFormData({...formData, conditions: formData.conditions.filter((x: string) => x !== t)})}
          />
        </Card>
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <PrimaryButton fullWidth onClick={handleSave} disabled={!image || !formData.name}>{localization.t('save')}</PrimaryButton>
      </div>
    </AppScreen>
  );
};

// 5. New Check (Photo First)
const NewCheckView = ({ pet, onAnalyze, onBack, isAnalyzing }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => setImage(await compressImage(reader.result as string));
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppScreen>
      {isAnalyzing && <LoadingOverlay type="ANALYZE_FOOD" species={pet.species} />}
      {showCamera && <CameraCapture onCapture={(img) => { setImage(img); setShowCamera(false); }} onClose={() => setShowCamera(false)} />}
      
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex items-center gap-4 border-b border-slate-100 bg-white">
        <IconButton icon={Icons.ArrowLeft} onClick={onBack} className="bg-slate-50" />
        <div>
          <Txt variant="caption" className="uppercase font-bold text-teal-600">{localization.t('checkFood')}</Txt>
          <Txt variant="h2">{pet.name}</Txt>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
         
         {!image ? (
           <div className="w-full space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                   <Icons.Search size={40} className="text-teal-600" />
                </div>
                <Txt variant="h2" className="mb-2 text-slate-900">{localization.t('whatIsEating', {name: pet.name})}</Txt>
                <Txt className="text-slate-500">{localization.t('takePhotoDesc')}</Txt>
              </div>

              <button onClick={() => setShowCamera(true)} className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-2xl p-6 flex flex-col items-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-teal-500/20 group">
                 <div className="bg-white/20 p-4 rounded-full group-hover:bg-white/30 transition-colors"><Icons.Camera size={32} /></div>
                 <span className="text-lg font-bold">{localization.t('takePhoto')}</span>
              </button>

              <button onClick={() => fileInput.current?.click()} className="w-full bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-700 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all active:scale-[0.98]">
                 <div className="bg-slate-100 p-4 rounded-full"><Icons.Upload size={32} className="text-slate-500" /></div>
                 <span className="text-lg font-bold">{localization.t('gallery')}</span>
              </button>
              
              <input type="file" ref={fileInput} className="hidden" accept="image/*" onChange={handleImage} />
           </div>
         ) : (
           <div className="w-full flex flex-col h-full">
              <div className="flex-1 flex flex-col justify-center items-center">
                 <div className="relative w-full aspect-square max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-8">
                    <img src={image} className="w-full h-full object-cover" />
                 </div>
                 <Txt variant="h2" className="text-center mb-6">{localization.t('readyToAnalyze')}</Txt>
              </div>
              <div className="space-y-4 mb-4">
                 <PrimaryButton 
                    fullWidth 
                    onClick={() => onAnalyze({ data: image, text: '' })} 
                    icon={Icons.Search}
                    className="shadow-xl shadow-teal-500/30"
                  >
                    {localization.t('analyze')}
                 </PrimaryButton>
                 <SecondaryButton fullWidth onClick={() => setImage(null)} className="border-red-100 text-red-500 hover:bg-red-50">
                    {localization.t('retake')}
                 </SecondaryButton>
              </div>
           </div>
         )}
      </div>
    </AppScreen>
  );
};

// 6. Result View
const ResultView = ({ check, pet, onHome, onNewCheck }: any) => {
  return (
    <AppScreen>
      <div className="px-6 pt-10 pb-4 flex justify-between items-center bg-white border-b border-slate-100 z-10">
        <IconButton icon={Icons.Home} onClick={onHome} className="bg-slate-50" />
        <Txt variant="h2">{localization.t('analyze')}</Txt>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Top Summary Card */}
        <div className="flex flex-col items-center text-center py-4 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-50/50 to-transparent pointer-events-none -z-10 rounded-3xl"></div>
          {check.imageUrl && (
            <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg overflow-hidden mb-6 rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src={check.imageUrl} className="w-full h-full object-cover" />
            </div>
          )}
          <RiskBadge level={check.result.riskLevel} />
          <Txt variant="h1" className="mt-4 mb-1 text-slate-900">{check.foodName}</Txt>
          <Txt variant="body" className="text-slate-500 font-medium">{localization.t('canEat', {name: pet.name})}</Txt>
        </div>

        {/* Can Eat / Summary */}
        <Card className="space-y-4 border-none shadow-md">
          <div className="flex items-start gap-4">
            <div className={`mt-1 p-3 rounded-2xl ${check.result.canEat ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {check.result.canEat ? <Icons.Check size={28}/> : <Icons.X size={28}/>}
            </div>
            <div>
              <Txt variant="h2" className="mb-1">{check.result.canEat ? localization.t('yesSafe') : localization.t('noAvoid')}</Txt>
              <Txt variant="body" className="text-slate-600 leading-relaxed">{check.result.shortSummary}</Txt>
            </div>
          </div>
        </Card>

        {/* Emergency Warning */}
        {check.result.emergencyWarning && (
          <Card variant="danger" className="flex items-start gap-3 shadow-sm">
             <div className="bg-red-200 p-2 rounded-full"><Icons.AlertTriangle className="text-red-700" size={20} /></div>
             <div>
               <Txt variant="h2" className="text-red-900 text-sm uppercase mb-1 tracking-wide">{localization.t('warning')}</Txt>
               <Txt className="text-red-800 font-medium">{check.result.emergencyWarning}</Txt>
             </div>
          </Card>
        )}

        {/* Detailed Explanation */}
        <div>
          <Txt variant="h2" className="mb-3 px-1">{localization.t('why')}</Txt>
          <Card className="border-none bg-white/60">
            <Txt variant="body" className="text-slate-700 leading-relaxed whitespace-pre-line">
              {check.result.detailedExplanation}
            </Txt>
          </Card>
        </div>

        <Txt variant="caption" className="text-center text-slate-400 px-8 py-4 bg-slate-50 rounded-2xl">
          {localization.t('disclaimer')}
        </Txt>
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <PrimaryButton fullWidth onClick={onNewCheck} className="shadow-lg shadow-teal-500/20">
          {localization.t('checkAnother')}
        </PrimaryButton>
      </div>
    </AppScreen>
  );
};

// 7. History View
const HistoryView = ({ checks, pets, onBack, onSelectCheck }: any) => {
  return (
    <AppScreen>
      <div className="px-6 pt-10 pb-4 flex items-center gap-4 bg-white border-b border-slate-100">
        <IconButton icon={Icons.ArrowLeft} onClick={onBack} className="bg-slate-50" />
        <Txt variant="h2">{localization.t('history')}</Txt>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {checks.length === 0 ? (
          <EmptyState icon={Icons.History} title={localization.t('noHistory')} message="" />
        ) : (
          <div className="space-y-3">
            {checks.map((check: FoodCheck) => {
               const pet = pets.find((p: Pet) => p.id === check.petId);
               return (
                <Card key={check.id} onClick={() => onSelectCheck(check)} className="flex items-center justify-between hover:bg-slate-50 border-none shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-12 rounded-full ${check.result.riskLevel === RiskLevel.SAFE ? 'bg-green-400' : check.result.riskLevel === RiskLevel.DANGEROUS ? 'bg-red-400' : 'bg-amber-400'}`} />
                    {check.imageUrl ? <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden"><img src={check.imageUrl} className="w-full h-full object-cover"/></div> : <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center"><Icons.Search size={20} className="text-slate-400"/></div>}
                    <div>
                      <Txt variant="h2" className="text-base mb-0.5">{check.foodName}</Txt>
                      <Txt variant="caption" className="text-slate-400 font-medium">{pet?.name} • {new Date(check.timestamp).toLocaleDateString()}</Txt>
                    </div>
                  </div>
                  <Icons.ChevronRight className="text-slate-300" size={20} />
                </Card>
               );
            })}
          </div>
        )}
      </div>
    </AppScreen>
  );
};

// --- MAIN APP CONTROLLER ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ name: 'HOME' });
  const [pets, setPets] = useState<Pet[]>([]);
  const [checks, setChecks] = useState<FoodCheck[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [freeCredits, setFreeCredits] = useState(0);

  useEffect(() => {
    const init = async () => {
      const [lPets, lChecks] = await Promise.all([storageService.getPets(), storageService.getChecks()]);
      setPets(lPets);
      setChecks(lChecks);
      setIsPro(storageService.isPro());
      setFreeCredits(storageService.getFreeCredits());
      
      if (!storageService.hasOnboarded()) setView({ name: 'ONBOARDING' });
      else if (lPets.length === 0) setView({ name: 'ADD_PET' });
      else setView({ name: 'HOME' });
      
      setIsDataLoaded(true);
    };
    init();
  }, []);

  // --- Handlers ---
  
  const handleAddPetClick = () => {
      if (!isPro && pets.length >= 1) {
          setView({ name: 'PAYWALL', fromView: {name: 'HOME'}, context: 'LIMIT' });
      } else {
          setView({ name: 'ADD_PET' });
      }
  };

  const handleCreatePet = async (data: any) => {
    const newPet = await geminiService.createPetProfile(data.name, data.age, data.weight, data.image);
    newPet.allergies = data.allergies;
    newPet.conditions = data.conditions;
    newPet.notes = data.notes; 
    
    setPets(await storageService.savePet(newPet));
    setView({ name: 'HOME' });
  };

  const handleUpdatePet = async (data: any) => {
    if (view.name !== 'EDIT_PET') return;
    const current = pets.find(p => p.id === view.petId);
    if (!current) return;
    const updated = { ...current, ...data };
    setPets(await storageService.updatePet(updated));
    setView({ name: 'HOME' }); 
  };

  const handleAnalyze = async (input: { data: string, text: string }) => {
    if (view.name !== 'NEW_CHECK') return;
    
    if (!isPro && freeCredits <= 0) {
       setView({ name: 'PAYWALL', fromView: view, context: 'CREDIT' });
       return;
    }

    const pet = pets.find(p => p.id === view.petId);
    if (!pet) return;

    setIsAnalyzing(true);
    try {
      let type: 'IMAGE' | 'BARCODE' = input.data ? 'IMAGE' : 'BARCODE';
      
      const result = await geminiService.analyzeFood(pet, { 
        type, 
        data: input.data || input.text, 
        additionalContext: input.text 
      });

      const newCheck: FoodCheck = {
        id: crypto.randomUUID(),
        petId: pet.id,
        foodName: result.detectedFoodName || localization.t('unknownFood'),
        timestamp: Date.now(),
        result,
        imageUrl: input.data || undefined
      };

      setChecks(await storageService.saveCheck(newCheck));
      
      if (!isPro) {
        storageService.useCredit();
        setFreeCredits(storageService.getFreeCredits());
      }
      setView({ name: 'CHECK_RESULT', checkId: newCheck.id });

    } catch (e) {
      alert(localization.t('analysisFailed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const completeOnboarding = () => {
    storageService.completeOnboarding();
    setFreeCredits(storageService.getFreeCredits());
    setView({ name: 'ADD_PET' });
  };

  if (!isDataLoaded) return <div className="h-full flex items-center justify-center bg-slate-50"><Icons.Loader2 className="animate-spin text-[#2EC4B6]" size={48} /></div>;

  // Paywall needs extra props now
  if (view.name === 'PAYWALL') return <PaywallView context={(view as any).context} onClose={() => setView(view.fromView || {name:'HOME'})} onPurchaseComplete={() => { setIsPro(true); setView(view.fromView || {name:'HOME'}); }} />;
  
  if (view.name === 'ONBOARDING') return <OnboardingView onComplete={completeOnboarding} />;
  if (view.name === 'ADD_PET') return <PetFormView onSave={handleCreatePet} onCancel={pets.length > 0 ? () => setView({ name: 'HOME' }) : undefined} />;
  if (view.name === 'EDIT_PET') return <PetFormView initialPet={pets.find(p => p.id === view.petId)} onSave={handleUpdatePet} onCancel={() => setView({ name: 'HOME' })} />;
  
  if (view.name === 'NEW_CHECK') {
    const p = pets.find(p => p.id === view.petId);
    return <NewCheckView pet={p} onAnalyze={handleAnalyze} onBack={() => setView({ name: 'HOME' })} isAnalyzing={isAnalyzing} />;
  }

  if (view.name === 'CHECK_RESULT') {
    const c = checks.find(c => c.id === view.checkId)!;
    const p = pets.find(pet => pet.id === c.petId);
    return <ResultView check={c} pet={p} onHome={() => setView({ name: 'HOME' })} onNewCheck={() => setView({ name: 'NEW_CHECK', petId: c.petId })} />;
  }

  if (view.name === 'HISTORY') {
    return <HistoryView checks={checks} pets={pets} onBack={() => setView({ name: 'HOME' })} onSelectCheck={(c: FoodCheck) => setView({ name: 'CHECK_RESULT', checkId: c.id })} />;
  }

  return <HomeView 
    pets={pets} 
    isPro={isPro} 
    freeCredits={freeCredits} 
    onAddPet={handleAddPetClick} 
    onSelectPet={(id: string) => setView({ name: 'NEW_CHECK', petId: id })} 
    onHistory={() => setView({ name: 'HISTORY' })}
    onGoPro={() => setView({ name: 'PAYWALL', fromView: {name:'HOME'}, context: 'CREDIT' })}
  />;
};

export default App;
