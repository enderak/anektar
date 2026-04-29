import React from 'react';
import { Button } from "../atoms/Button";
import { Download, Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const SettingsCard = ({ 
  text, setText, 
  subText, setSubText,
  textMode, setTextMode,
  textDepth, setTextDepth,
  materialColor, setMaterialColor,
  baseColor, setBaseColor,
  baseShape, setBaseShape,
  plateThickness, setPlateThickness,
  holePosition, setHolePosition,
  textScale, setTextScale,
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
      </div>

      {/* YENİ: Yazı Tipi (Mod) ve Derinlik */}
      <div className="flex flex-col gap-4 mt-2">
        {/* Yazı Modu (Emboss vs Engrave) */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('text_mode')}</label>
          <div className="bg-slate-100/80 p-1 rounded-xl flex items-center h-11 w-full relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ease-in-out ${
                textMode === 'engrave' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
              }`}
            />
            <button 
              onClick={() => setTextMode('emboss')}
              className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                textMode === 'emboss' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t('mode_emboss')}
            </button>
            <button 
              onClick={() => setTextMode('engrave')}
              className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                textMode === 'engrave' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t('mode_engrave')}
            </button>
          </div>
        </div>

        {/* Yazı Derinliği (Çıkıntı veya Oyuk derinliği) */}
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
              className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                baseShape === 'rectangle' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t('shape_rectangle')}
            </button>
            <button 
              onClick={() => setBaseShape('teardrop')}
              className={`z-10 flex-1 text-[11px] font-bold tracking-wider rounded-lg h-full transition-colors ${
                baseShape === 'teardrop' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t('shape_teardrop')}
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
            min="40" max="150" step="1"
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

      {/* Export Buttons */}
      <div className="flex flex-row gap-3 mt-4">
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
