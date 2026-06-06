import React from 'react';
import { Button } from "../atoms/Button";
import { Download, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const SettingsCard = ({ 
  text, setText, 
  subText, setSubText,
  phoneText, setPhoneText,
  phoneDepth, setPhoneDepth,
  isILoveMode, setIsILoveMode,
  fontFamily, setFontFamily,
  iconType, setIconType,
  customSvgUrl, setCustomSvgUrl,
  iconPosition, setIconPosition,
  isItalic, setIsItalic,
  textStyle, setTextStyle,
  textDepth, setTextDepth,
  engraveDepth, setEngraveDepth,
  materialColor, setMaterialColor,
  baseColor, setBaseColor,
  baseShape, setBaseShape,
  plateThickness, setPlateThickness,
  holePosition, setHolePosition,
  textScale, setTextScale,
  iconScale, setIconScale,
  textOffset, setTextOffset,
  autoCenter, setAutoCenter,
  baseHeight, setBaseHeight,
  targetWidth, setTargetWidth,
  hasBorder, setHasBorder,
  borderWidth, setBorderWidth,
  borderDepth, setBorderDepth,
  cornerRadius = 5.0,
  setCornerRadius,
  isHoleExternal = false,
  setIsHoleExternal,
  holeRadius = 3.5,
  setHoleRadius,
  holeThickness = 2.5,
  setHoleThickness,
  holeHeight = 3.0,
  setHoleHeight,
  subTextScale = 80,
  setSubTextScale,
  textAlignment = 'center',
  setTextAlignment,
  textSpacing = 0.0,
  setTextSpacing,
  subTextSpacing = 0.0,
  setSubTextSpacing,
  borderColor = '#0F172A',
  setBorderColor,
  subTextColor,
  setSubTextColor,
  mainSubSpacing = 0.3,
  setMainSubSpacing,
  onExport 
}) => {
  const { t, i18n } = useTranslation();
  const [openSection, setOpenSection] = React.useState('text'); // 'text', 'base', 'icon', 'color'

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const colors = [
    { value: '#22C55E', label: 'Yesil',  style: { backgroundColor: '#22C55E' } },
    { value: '#0F172A', label: 'Siyah',  style: { backgroundColor: '#0F172A' } },
    { value: '#FFFFFF', label: 'Beyaz',  style: { backgroundColor: '#FFFFFF', border: '1px solid #e2e8f0' } },
    { value: '#3B82F6', label: 'Mavi',   style: { backgroundColor: '#3B82F6' } },
    { value: '#FBBF24', label: 'Sari',   style: { backgroundColor: '#FBBF24' } },
    { value: '#F87171', label: 'Mercan', style: { backgroundColor: '#F87171' } },
    { value: '#C0C0C0', label: 'Gumus',  style: { background: 'linear-gradient(135deg,#e8e8e8,#a8a9ad,#d4d4d4,#8e9299)' } },
    { value: '#FFD700', label: 'Altin',  style: { background: 'linear-gradient(135deg,#ffe066,#ffd700,#c5a028,#ffd700)' } },
    { value: '#CD7F32', label: 'Bronz',  style: { background: 'linear-gradient(135deg,#e09c52,#cd7f32,#8b5e3c,#b8730a)' } },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 flex flex-col gap-6 w-full max-w-sm shrink-0">
      
      {/* Language Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
          <Globe size={12} />
          {t('language')}
        </label>
        <div className="bg-slate-100/80 p-1 rounded-xl flex items-center h-11 w-full relative">
          {[
            { code: 'TR', name: 'TÜRKÇE' },
            { code: 'EN', name: 'ENGLISH' },
            { code: 'DE', name: 'DEUTSCH' },
            { code: 'AZ', name: 'AZƏRBAYCAN' },
            { code: 'ES', name: 'ESPAÑOL' }
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              title={lang.name}
              className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-all flex items-center justify-center ${
                i18n.language === lang.code 
                  ? 'bg-white shadow-sm text-emerald-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {lang.code}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Accordions */}
      <div className="flex flex-col gap-4">
        
        {/* 1. YAZI AYARLARI */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/20">
          <button
            type="button"
            onClick={() => toggleSection('text')}
            className="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 transition-colors font-bold text-xs text-slate-700 select-none outline-none"
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-600">✍️</span>
              {t('text_settings')}
            </span>
            {openSection === 'text' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {openSection === 'text' && (
            <div className="p-4 flex flex-col gap-4 border-t border-slate-100 bg-white">
              {/* YAZI TİPİ (FONT) SEÇİMİ */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('font_family')}</label>
                <div className="relative">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                    <option value="optimer">Optimer (Kalın)</option>
                    <option value="helvetiker">Helvetiker (Düz/Modern)</option>
                    <option value="droid">Droid Sans (Yuvarlak)</option>
                    <option value="jakarta">Plus Jakarta / Segoe UI (Modern)</option>
                    <option value="orbitron">Orbitron (Futuristik)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                {/* Türkçe Karakter Uyumluluk Uyarısı */}
                {(() => {
                  const fullText = `${text || ''} ${subText || ''}`;
                  const trChars = ['Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü', 'ç', 'ğ', 'ı', 'ö', 'ş', 'ü'];
                  const hasTr = trChars.some(char => fullText.includes(char));
                  
                  if (hasTr) {
                    if (fontFamily === 'helvetiker' || fontFamily === 'orbitron') {
                      return (
                        <div className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 p-2.5 rounded-xl font-medium leading-normal mt-1 flex gap-2 items-start">
                          <span className="shrink-0 mt-0.5">⚠️</span>
                          <span>{t('warning_font_turkish')}</span>
                        </div>
                      );
                    } else if (fontFamily === 'optimer') {
                      const optimerMissing = ['Ç', 'Ğ', 'İ', 'Ş', 'ğ', 'ı', 'ş'];
                      const hasOptimerMissing = optimerMissing.some(char => fullText.includes(char));
                      if (hasOptimerMissing) {
                        return (
                          <div className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 p-2.5 rounded-xl font-medium leading-normal mt-1 flex gap-2 items-start">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            <span>{t('warning_font_turkish')}</span>
                          </div>
                        );
                      }
                    }
                  }
                  return null;
                })()}
              </div>

              {/* Text Inputs */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500">{t('label_text')}</label>
                  <input 
                    value={text}
                    onChange={(e) => setText(e.target.value.toLocaleUpperCase('tr-TR'))}
                    className="w-full bg-white border border-slate-200/80 text-sm font-bold text-slate-800 py-2.5 px-4 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 transition-all shadow-sm"
                    placeholder={t('placeholder')}
                  />
                  {/* Özel Karakterler Kısayolu */}
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    <button
                      type="button"
                      title="E (Stilize): Sağa yatık U + tire"
                      onClick={() => setText(text + '三')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-[9px] font-extrabold rounded-lg border border-slate-700 text-white flex items-center gap-1 select-none cursor-pointer outline-none shadow-sm"
                    >
                      <span className="text-[10px] font-black leading-none tracking-tighter">⊏E</span>
                      <span className="text-[8px] opacity-70">Stilize E</span>
                    </button>
                    <button
                      type="button"
                      title="X (Stilize): ›·‹"
                      onClick={() => setText(text + '※')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-[9px] font-extrabold rounded-lg border border-slate-700 text-white flex items-center gap-1 select-none cursor-pointer outline-none shadow-sm"
                    >
                      <span className="text-[10px] font-black leading-none">›·‹</span>
                      <span className="text-[8px] opacity-70">Stilize X</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setText(text + '♥')}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 active:scale-95 transition-all text-[9px] font-extrabold rounded-lg border border-rose-200 text-rose-700 flex items-center gap-1 select-none cursor-pointer outline-none"
                    >
                      <span className="text-[11px] text-rose-500 font-black leading-none">♥</span>
                      <span className="text-[8px]">Kalp</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500">{t('sub_text')}</label>
                  <input 
                    value={subText}
                    onChange={(e) => setSubText(e.target.value.toLocaleUpperCase('tr-TR'))}
                    className="w-full bg-white border border-slate-200/80 text-sm font-bold text-slate-800 py-2.5 px-4 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 transition-all shadow-sm"
                    placeholder={t('placeholder_sub')}
                  />
                  {/* Özel Karakterler Kısayolu */}
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    <button
                      type="button"
                      title="E (Stilize): Sağa yatık U + tire"
                      onClick={() => setSubText(subText + '三')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-[9px] font-extrabold rounded-lg border border-slate-700 text-white flex items-center gap-1 select-none cursor-pointer outline-none shadow-sm"
                    >
                      <span className="text-[10px] font-black leading-none tracking-tighter">⊏E</span>
                      <span className="text-[8px] opacity-70">Stilize E</span>
                    </button>
                    <button
                      type="button"
                      title="X (Stilize): ›·‹"
                      onClick={() => setSubText(subText + '※')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-[9px] font-extrabold rounded-lg border border-slate-700 text-white flex items-center gap-1 select-none cursor-pointer outline-none shadow-sm"
                    >
                      <span className="text-[10px] font-black leading-none">›·‹</span>
                      <span className="text-[8px] opacity-70">Stilize X</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubText(subText + '♥')}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 active:scale-95 transition-all text-[9px] font-extrabold rounded-lg border border-rose-200 text-rose-700 flex items-center gap-1 select-none cursor-pointer outline-none"
                    >
                      <span className="text-[11px] text-rose-500 font-black leading-none">♥</span>
                      <span className="text-[8px]">Kalp</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500">{t('phone_text')}</label>
                  <input 
                    value={phoneText}
                    onChange={(e) => setPhoneText(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 text-sm font-bold text-slate-800 py-2.5 px-4 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 transition-all shadow-sm"
                    placeholder={t('placeholder_phone')}
                  />
                </div>

                {/* Arka Yüz Oyma Derinliği */}
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{t('phone_depth')}</span>
                    <span>{phoneDepth.toFixed(1)}mm</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="2.0" step="0.2"
                    value={phoneDepth}
                    onChange={(e) => setPhoneDepth(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>

                {/* I Love Mode Toggle */}
                <label className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl cursor-pointer hover:bg-rose-100/80 transition-colors">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={isILoveMode}
                      onChange={(e) => setIsILoveMode(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                  </div>
                  <span className="text-xs font-bold text-rose-800">{t('icon_i_love')}</span>
                </label>
              </div>

              {/* Yazı Boyutu (Scale) */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>{t('text_scale')}</span>
                  <span>{textScale}%</span>
                </div>
                <input 
                  type="range" 
                  min="20" max="150" step="1"
                  value={textScale}
                  onChange={(e) => setTextScale(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                />
              </div>

              {/* Alt Yazı Boyutu (Scale) */}
              {subText && subText.trim().length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{t('sub_text_scale')}</span>
                    <span>{subTextScale}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" max="150" step="1"
                    value={subTextScale}
                    onChange={(e) => setSubTextScale(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>
              )}

              {/* Yazı Hizalaması */}
              {subText && subText.trim().length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('text_alignment')}</label>
                  <div className="bg-slate-100/80 p-1 rounded-xl flex items-center h-11 w-full relative">
                    {[
                      { id: 'left', label: 'alignment_left' },
                      { id: 'center', label: 'alignment_center' },
                      { id: 'right', label: 'alignment_right' }
                    ].map((align) => (
                      <button
                        key={align.id}
                        onClick={() => setTextAlignment(align.id)}
                        className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                          textAlignment === align.id ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {t(align.label)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ana Yazı Harf Aralığı */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>{t('text_spacing')}</span>
                  <span>{textSpacing.toFixed(1)}mm</span>
                </div>
                <input 
                  type="range" 
                  min="-2.0" max="5.0" step="0.1"
                  value={textSpacing}
                  onChange={(e) => setTextSpacing(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                />
              </div>

              {/* Alt Yazı Harf Aralığı */}
              {subText && subText.trim().length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{t('sub_text_spacing')}</span>
                    <span>{subTextSpacing.toFixed(1)}mm</span>
                  </div>
                  <input 
                    type="range" 
                    min="-2.0" max="5.0" step="0.1"
                    value={subTextSpacing}
                    onChange={(e) => setSubTextSpacing(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>
              )}

              {/* Ana-Alt Metin Arası Mesafe */}
              {subText && subText.trim().length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{t('main_sub_spacing')}</span>
                    <span>{(mainSubSpacing * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="1.5" step="0.05"
                    value={mainSubSpacing}
                    onChange={(e) => setMainSubSpacing(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>
              )}

              {/* Yazı Derinliği (Çıkıntı yüksekliği / Gömme derinliği) */}
              <div className="flex flex-col gap-4 mt-2">
                {textStyle === 'embossed' ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>{t('text_depth')}</span>
                      <span>{textDepth.toFixed(1)}mm</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.4" max="3.0" step="0.2"
                      value={textDepth}
                      onChange={(e) => setTextDepth(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span>{t('engrave_depth')}</span>
                      <span>{engraveDepth.toFixed(1)}mm</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.4" max="3.0" step="0.2"
                      value={engraveDepth}
                      onChange={(e) => setEngraveDepth(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                    />
                  </div>
                )}

                {/* Yazı Derinliği ve Taban Yüksekliği Uyarısı */}
                {textStyle === 'engraved' && engraveDepth >= baseHeight && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 mt-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-600 shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <div className="flex flex-col gap-1 text-[11px] text-amber-800 leading-relaxed font-medium">
                      <strong className="font-bold">{t('warning_stencil_title')}</strong>
                      {t('warning_stencil_desc')}
                    </div>
                  </div>
                )}
              </div>

              {/* İtalik (Dönüştürme) */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('transform')}</label>
                <div className="bg-slate-100/80 p-1 rounded-xl flex items-center h-11 w-full relative">
                  <button 
                    onClick={() => setIsItalic(false)}
                    className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                      !isItalic ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t('normal_text') || 'NORMAL'}
                  </button>
                  <button 
                    onClick={() => setIsItalic(true)}
                    className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors italic ${
                      isItalic ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t('italic')}
                  </button>
                </div>
              </div>

              {/* Yazı Tarzı (Text Style) */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('text_style')}</label>
                <div className="bg-slate-100/80 p-1 rounded-xl flex items-center h-11 w-full relative">
                  <button 
                    onClick={() => setTextStyle('embossed')}
                    className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                      textStyle === 'embossed' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t('style_embossed')}
                  </button>
                  <button 
                    onClick={() => setTextStyle('engraved')}
                    className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                      textStyle === 'engraved' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t('style_engraved')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. TABAN & KENARLIK AYARLARI */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/20">
          <button
            type="button"
            onClick={() => toggleSection('base')}
            className="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 transition-colors font-bold text-xs text-slate-700 select-none outline-none"
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-600">🔲</span>
              {t('base_settings')}
            </span>
            {openSection === 'base' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSection === 'base' && (
            <div className="p-4 flex flex-col gap-4 border-t border-slate-100 bg-white">
              {/* Taban Şekli */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('base_shape')}</label>
                <div className="bg-slate-100/80 p-1 rounded-xl flex items-center h-11 w-full relative">
                  <button 
                    onClick={() => setBaseShape('rectangle')}
                    className={`z-10 flex-1 text-[10px] sm:text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                      baseShape === 'rectangle' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t('shape_rectangle')}
                  </button>
                  <button 
                    onClick={() => setBaseShape('teardrop')}
                    className={`z-10 flex-1 text-[10px] sm:text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                      baseShape === 'teardrop' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t('shape_teardrop')}
                  </button>
                  <button 
                    onClick={() => setBaseShape('heart')}
                    className={`z-10 flex-1 text-[10px] sm:text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                      baseShape === 'heart' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    ❤️
                  </button>
                  <button 
                    onClick={() => setBaseShape('contour')}
                    className={`z-10 flex-1 text-[10px] sm:text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                      baseShape === 'contour' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t('shape_contour')}
                  </button>
                </div>
              </div>

              {/* Taban Yüksekliği (Base Height) */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>{t('base_height')}</span>
                  <span>{baseHeight.toFixed(1)}mm</span>
                </div>
                <input 
                  type="range" 
                  min="2" max="10" step="0.5"
                  value={baseHeight}
                  onChange={(e) => setBaseHeight(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                />
              </div>

              {/* Kenar Ovalliği (Corner Roundness) - Sadece Dikdörtgen için */}
              {baseShape === 'rectangle' && (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{t('corner_radius')}</span>
                    <span>{cornerRadius.toFixed(1)}mm</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="50" step="0.5"
                    value={cornerRadius}
                    onChange={(e) => setCornerRadius(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>
              )}

              {/* Üretim Uzunluğu Seçici (Dropdown) */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('fixed_length')}</label>
                <select
                  value={targetWidth || 0}
                  onChange={(e) => setTargetWidth(parseInt(e.target.value) || 0)}
                  className="bg-white border border-slate-200/80 text-sm font-bold text-slate-700 py-3 px-4 rounded-xl outline-none focus:border-emerald-500 transition-all shadow-sm shadow-slate-100/50 cursor-pointer"
                >
                  <option value={0}>{t('auto')}</option>
                  <option value={40}>4 {t('width_cm')}</option>
                  <option value={50}>5 {t('width_cm')}</option>
                  <option value={60}>6 {t('width_cm')}</option>
                  <option value={70}>7 {t('width_cm')}</option>
                  <option value={80}>8 {t('width_cm')}</option>
                  <option value={100}>10 {t('width_cm')}</option>
                  <option value={150}>15 {t('width_cm')}</option>
                </select>
              </div>

              {/* --- KENARLIK AYARLARI --- */}
              <div className="flex flex-col gap-4 pt-3 border-t border-slate-100">
                {/* Kenarlık Ekle Toggle */}
                <label className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100/30 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={hasBorder}
                      onChange={(e) => setHasBorder(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{t('border_enable')}</span>
                </label>

                {hasBorder && (
                  <>
                    {/* Kenarlık Kalınlığı (Width) */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>{t('border_width')}</span>
                        <span>{borderWidth.toFixed(1)}mm</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.8" max="3.0" step="0.1"
                        value={borderWidth}
                        onChange={(e) => setBorderWidth(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                      />
                    </div>

                    {/* Kenarlık Yüksekliği (Depth) */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span>{t('border_depth')}</span>
                        <span>{borderDepth.toFixed(1)}mm</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.4" max="4.0" step="0.1"
                        value={borderDepth}
                        onChange={(e) => setBorderDepth(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. SİMGE & DELİK AYARLARI */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/20">
          <button
            type="button"
            onClick={() => toggleSection('icon')}
            className="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 transition-colors font-bold text-xs text-slate-700 select-none outline-none"
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-600">🍀</span>
              {t('icon_settings')}
            </span>
            {openSection === 'icon' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSection === 'icon' && (
            <div className="p-4 flex flex-col gap-4 border-t border-slate-100 bg-white">
              {/* SİMGE SEÇİMİ */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('icon')}</label>
                <div className="relative">
                  <select
                    value={iconType}
                    onChange={(e) => {
                      setIconType(e.target.value);
                      if (e.target.value !== 'custom') {
                        setCustomSvgUrl(null);
                      }
                    }}
                    className="w-full h-11 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                  >
                     <option value="none">{t('icon_none')}</option>
                    <option value="clover">{t('icon_clover')} 🍀</option>
                    <option value="star_crescent">{t('icon_star_crescent')} 🌙</option>
                    <option value="heart">{t('icon_heart')} ❤️</option>
                    <option value="skull">{t('icon_skull')} 💀</option>
                    <option value="rook">{t('icon_rook')} ♖</option>
                    <option value="racket_table">{t('icon_racket_table')} 🏓</option>
                    <option value="racket_tennis">{t('icon_racket_tennis')} 🎾</option>
                    <option value="stilize_e">E (Stilize)</option>
                    <option value="stilize_x">X (Stilize ›·‹)</option>
                    <option value="custom">{t('icon_custom')} 📁</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* CUSTOM SVG UPLOAD */}
              {iconType === 'custom' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">SVG Yükle</label>
                    <input 
                      type="file" 
                      accept=".svg"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setCustomSvgUrl(event.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer"
                    />
                  </div>
                  <a
                    href="/custom_icon_template.svg"
                    download="sakrad_custom_icon_template.svg"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 transition-all select-none cursor-pointer outline-none text-center"
                  >
                    {t('svg_template')}
                  </a>
                </div>
              )}

              {/* ICON POSITION */}
              {iconType !== 'none' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('icon_position')}</label>
                  <div className="bg-slate-100/80 p-1 rounded-xl flex items-center h-11 w-full relative">
                    <button 
                      onClick={() => setIconPosition('left')}
                      className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                        iconPosition === 'left' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {t('icon_pos_left')}
                    </button>
                    <button 
                      onClick={() => setIconPosition('top')}
                      className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                        iconPosition === 'top' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {t('icon_pos_top')}
                    </button>
                    <button 
                      onClick={() => setIconPosition('right')}
                      className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                        iconPosition === 'right' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {t('icon_pos_right')}
                    </button>
                  </div>
                </div>
              )}

              {/* ICON SCALE */}
              {iconType !== 'none' && (
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>Simge Boyutu</span>
                    <span>{iconScale}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" max="200" step="5"
                    value={iconScale}
                    onChange={(e) => setIconScale(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>
              )}

              {/* Delik Konumu */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('hole_position')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'top_left', label: 'hole_top_left' },
                    { id: 'center_left', label: 'hole_center_left' },
                    { id: 'bottom_left', label: 'hole_bottom_left' },
                    { id: 'top_right', label: 'hole_top_right' },
                    { id: 'center_right', label: 'hole_center_right' },
                    { id: 'bottom_right', label: 'hole_bottom_right' },
                    { id: 'none', label: 'hole_none', fullWidth: true }
                  ].map(pos => (
                    <button
                      key={pos.id}
                      onClick={() => setHolePosition(pos.id)}
                      className={`py-2 px-3 text-[11px] font-bold rounded-xl transition-all border ${
                        pos.fullWidth ? 'col-span-2 py-2.5' : ''
                      } ${
                        holePosition === pos.id 
                           ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm font-extrabold' 
                           : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {t(pos.label)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deliği Dışarı Taşı Toggle — Sadece Delik Var ise ve Şekil Uygun ise */}
              {holePosition !== 'none' && (baseShape === 'rectangle' || baseShape === 'contour') && (
                <label className="flex items-center gap-3 p-3 bg-emerald-50/30 border border-emerald-100/30 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors mt-2">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={isHoleExternal}
                      onChange={(e) => setIsHoleExternal(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{t('hole_external')}</span>
                </label>
              )}

              {/* Delik Yarıçapı Slider — Sadece Delik Var ise */}
              {holePosition !== 'none' && (
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{t('hole_radius')}</span>
                    <span>{(holeRadius * 2).toFixed(1)}mm (Ø)</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.5" max="6.0" step="0.5"
                    value={holeRadius}
                    onChange={(e) => setHoleRadius(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>
              )}

              {/* Halka Kalınlığı Slider — Sadece Harici Delik Var ise */}
              {holePosition !== 'none' && isHoleExternal && (baseShape === 'rectangle' || baseShape === 'contour') && (
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{t('hole_thickness')}</span>
                    <span>{holeThickness.toFixed(1)}mm</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.5" max="5.0" step="0.5"
                    value={holeThickness}
                    onChange={(e) => setHoleThickness(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>
              )}

              {/* Halka Yüksekliği Slider — Sadece Harici Delik Var ise */}
              {holePosition !== 'none' && isHoleExternal && (baseShape === 'rectangle' || baseShape === 'contour') && (
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>{t('hole_height')}</span>
                    <span>{holeHeight.toFixed(1)}mm</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" max="10.0" step="0.5"
                    value={holeHeight}
                    onChange={(e) => setHoleHeight(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. RENK AYARLARI */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/20">
          <button
            type="button"
            onClick={() => toggleSection('color')}
            className="w-full flex justify-between items-center px-4 py-3 bg-slate-50/50 hover:bg-slate-50 transition-colors font-bold text-xs text-slate-700 select-none outline-none"
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-600">🎨</span>
              {t('color_settings')}
            </span>
            {openSection === 'color' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openSection === 'color' && (
            <div className="p-4 flex flex-col gap-4 border-t border-slate-100 bg-white">
              {/* Yazı Rengi - Ana */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500">{t('label_text_color')}</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      title={color.label}
                      onClick={() => setMaterialColor(color.value)}
                      className={`w-8 h-8 rounded-full relative transition-transform hover:scale-110 shadow-md ${
                        materialColor === color.value ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : ''
                      }`}
                      style={color.style}
                      aria-label={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Alt Yazı Rengi - sadece alt yazı varsa */}
              {subText && subText.trim().length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500">
                    {t('label_text_color') || 'Yazı Rengi'} <span className="text-emerald-600 font-extrabold">(Alt)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        title={color.label}
                        onClick={() => setSubTextColor(color.value)}
                        className={`w-8 h-8 rounded-full relative transition-transform hover:scale-110 shadow-md ${
                          (subTextColor || materialColor) === color.value ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : ''
                        }`}
                        style={color.style}
                        aria-label={color.label}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Taban Rengi */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500">{t('label_base_color')}</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      title={color.label}
                      onClick={() => setBaseColor(color.value)}
                      className={`w-8 h-8 rounded-full relative transition-transform hover:scale-110 shadow-md ${
                        baseColor === color.value ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : ''
                      }`}
                      style={color.style}
                      aria-label={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Kenarlık Rengi */}
              {hasBorder && (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500">{t('label_border_color')}</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        title={color.label}
                        onClick={() => setBorderColor(color.value)}
                        className={`w-8 h-8 rounded-full relative transition-transform hover:scale-110 shadow-md ${
                          borderColor === color.value ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : ''
                        }`}
                        style={color.style}
                        aria-label={color.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Bilgilendirme Notu */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2 mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
          <strong className="font-bold">Not:</strong> Delik konumu veya simge yönü değiştiğinde modelin dengesi için <span className="font-bold">Yazı Boyutu</span> değişikliği yapılması gerekebilir.
        </p>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-row gap-3 mt-2">
        <button 
          onClick={() => onExport(false)}
          className="flex-1 bg-[#059669] hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-500/20 py-3.5 px-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-[11px] text-center"
        >
          <Download size={18} />
          {t('export_single')}
        </button>
        <button 
          onClick={() => onExport(true)}
          className="flex-1 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white shadow-lg shadow-slate-900/20 py-3.5 px-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-[11px] text-center border border-slate-700"
        >
          <div className="flex items-center -space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-800 z-10"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-slate-800 z-0"></span>
          </div>
          {t('export_multi')}
        </button>
      </div>

    </div>
  );
};
