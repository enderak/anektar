import React from 'react';
import { Button } from "../atoms/Button";
import { Download, Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const SettingsCard = ({ 
  text, setText, 
  subText, setSubText,
  phoneText, setPhoneText,
  isILoveMode, setIsILoveMode,
  fontFamily, setFontFamily,
  iconType, setIconType,
  customSvgUrl, setCustomSvgUrl,
  iconPosition, setIconPosition,
  isItalic, setIsItalic,
  textDepth, setTextDepth,
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
  onExport 
}) => {
  const { t, i18n } = useTranslation();

  const colors = [
    { value: '#22C55E', label: 'Sakarya Green' }, 
    { value: '#0F172A', label: 'Sakarya Black' }, 
    { value: '#3B82F6', label: 'Blue' },   
    { value: '#FBBF24', label: 'Yellow' }, 
    { value: '#F87171', label: 'Coral' },  
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

      <div className="flex flex-col gap-5 border-b border-slate-100 pb-5">
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
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
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
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-slate-500">{t('sub_text')}</label>
          <input 
            value={subText}
            onChange={(e) => setSubText(e.target.value.toLocaleUpperCase('tr-TR'))}
            className="w-full bg-white border border-slate-200/80 text-sm font-bold text-slate-800 py-2.5 px-4 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 transition-all shadow-sm"
            placeholder={t('placeholder_sub')}
          />
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

      {/* Yazı Derinliği (Çıkıntı yüksekliği) */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
            <span>{t('text_depth')}</span>
            <span>{textDepth.toFixed(1)}mm</span>
          </div>
          <input 
            type="range" 
            min="0.5" max="5.0" step="0.5"
            value={textDepth}
            onChange={(e) => setTextDepth(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
          />
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

        {/* SİMGE (ICON) SEÇİMİ VE KONUMU */}
        <div className="flex flex-col gap-5 pt-3 border-t border-slate-100">
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
                <option value="custom">{t('icon_custom')} 📁</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* CUSTOM SVG UPLOAD */}
          {iconType === 'custom' && (
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
        </div>
      </div>

      {/* Renk Seçimi: Yazı ve Taban */}
      <div className="flex flex-col gap-4">
        {/* Yazı Rengi */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-slate-500">{t('label_text_color')}</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setMaterialColor(color.value)}
                className={`w-8 h-8 rounded-full relative transition-transform hover:scale-110 shadow-sm ${
                  materialColor === color.value ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : ''
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={color.label}
              />
            ))}
          </div>
        </div>
        
        {/* Taban Rengi */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-slate-500">{t('label_base_color')}</label>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setBaseColor(color.value)}
                className={`w-8 h-8 rounded-full relative transition-transform hover:scale-110 shadow-sm ${
                  baseColor === color.value ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : ''
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={color.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-4 mt-2">

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
              { id: 'bottom_right', label: 'hole_bottom_right' }
            ].map(pos => (
              <button
                key={pos.id}
                onClick={() => setHolePosition(pos.id)}
                className={`py-2 px-3 text-[11px] font-bold rounded-xl transition-all border ${
                  holePosition === pos.id 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t(pos.label)}
              </button>
            ))}
          </div>
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

        {/* --- YENİ: KONUM AYARLARI --- */}
        <div className="w-full h-px bg-slate-100/80 my-1"></div>
        
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
  </div>
  );
};
