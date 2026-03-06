/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, RefreshCw, Type, Image as ImageIcon, Check } from 'lucide-react';
import { singlishToUnicode, unicodeToLegacy } from './utils/converter';

export default function App() {
  const [input, setInput] = useState('');
  const [unicodeOutput, setUnicodeOutput] = useState('');
  const [legacyOutput, setLegacyOutput] = useState('');
  const [copiedUnicode, setCopiedUnicode] = useState(false);
  const [copiedLegacy, setCopiedLegacy] = useState(false);

  useEffect(() => {
    const unicode = singlishToUnicode(input);
    setUnicodeOutput(unicode);
    setLegacyOutput(unicodeToLegacy(unicode));
  }, [input]);

  const handleCopy = (text: string, type: 'unicode' | 'legacy') => {
    navigator.clipboard.writeText(text);
    if (type === 'unicode') {
      setCopiedUnicode(true);
      setTimeout(() => setCopiedUnicode(false), 2000);
    } else {
      setCopiedLegacy(true);
      setTimeout(() => setCopiedLegacy(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              සි
            </div>
            <h1 className="font-bold text-lg tracking-tight text-slate-900">
              Singlish Converter
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            For Web, PS & CapCut
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Singlish to Sinhala</h2>
          <p className="text-slate-600">Type in Singlish (e.g., "mama") and get Sinhala text instantly.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Type size={16} className="text-indigo-600" />
                  Type here (Singlish)
                </label>
                <button 
                  onClick={() => setInput('')}
                  className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} /> Clear
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here... (e.g. mama gedara yanawa)"
                className="w-full h-40 p-4 text-lg focus:outline-none resize-none"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Unicode Output (Web) */}
          <motion.div 
            layout
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
          >
            <div className="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
              <label className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                <Type size={16} className="text-indigo-600" />
                Unicode (For Web/FB/WhatsApp)
              </label>
              <button
                onClick={() => handleCopy(unicodeOutput, 'unicode')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  copiedUnicode 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {copiedUnicode ? <Check size={14} /> : <Copy size={14} />}
                {copiedUnicode ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 flex-1 min-h-[160px] bg-slate-50/30">
              {unicodeOutput ? (
                <p className="text-xl leading-relaxed text-slate-900 whitespace-pre-wrap font-sinhala">
                  {unicodeOutput}
                </p>
              ) : (
                <p className="text-slate-400 italic text-sm">Sinhala text will appear here...</p>
              )}
            </div>
          </motion.div>

          {/* Legacy Output (PS/CapCut) */}
          <motion.div 
            layout
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
          >
            <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
              <label className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
                <ImageIcon size={16} className="text-emerald-600" />
                Legacy (For Photoshop/CapCut)
              </label>
              <button
                onClick={() => handleCopy(legacyOutput, 'legacy')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  copiedLegacy 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {copiedLegacy ? <Check size={14} /> : <Copy size={14} />}
                {copiedLegacy ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 flex-1 min-h-[160px] bg-slate-50/30">
              {legacyOutput ? (
                <p className="text-xl leading-relaxed text-slate-900 whitespace-pre-wrap font-sinhala">
                  {legacyOutput}
                </p>
              ) : (
                <p className="text-slate-400 italic text-sm">Legacy text will appear here...</p>
              )}
            </div>
            <div className="bg-yellow-50 px-4 py-2 text-[10px] text-yellow-800 border-t border-yellow-100">
              Use <strong>FM Abhaya</strong> or <strong>DL-Paras</strong> font in your software.
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <div className="font-bold text-slate-900 mb-1">Step 1</div>
            <div className="text-sm text-slate-600">Type Singlish above</div>
            <div className="text-xs text-slate-400 mt-1">"mama" -&gt; "මම"</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <div className="font-bold text-slate-900 mb-1">Step 2</div>
            <div className="text-sm text-slate-600">Copy the output</div>
            <div className="text-xs text-slate-400 mt-1">Unicode or Legacy</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <div className="font-bold text-slate-900 mb-1">Step 3</div>
            <div className="text-sm text-slate-600">Paste & Change Font</div>
            <div className="text-xs text-slate-400 mt-1">Use FM Abhaya for Legacy</div>
          </div>
        </div>

        {/* Cheat Sheet */}
        <div className="mt-12 border-t border-slate-200 pt-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Typing Cheat Sheet</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-indigo-600 mb-3">Vowels</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex justify-between"><span>a</span> <span className="font-sinhala">අ</span></li>
                <li className="flex justify-between"><span>aa</span> <span className="font-sinhala">ආ</span></li>
                <li className="flex justify-between"><span>ae</span> <span className="font-sinhala">ඇ</span></li>
                <li className="flex justify-between"><span>i</span> <span className="font-sinhala">ඉ</span></li>
                <li className="flex justify-between"><span>ii, ee</span> <span className="font-sinhala">ඊ</span></li>
                <li className="flex justify-between"><span>u</span> <span className="font-sinhala">උ</span></li>
                <li className="flex justify-between"><span>uu</span> <span className="font-sinhala">ඌ</span></li>
                <li className="flex justify-between"><span>e</span> <span className="font-sinhala">එ</span></li>
                <li className="flex justify-between"><span>ea, ey</span> <span className="font-sinhala">ඒ</span></li>
                <li className="flex justify-between"><span>o</span> <span className="font-sinhala">ඔ</span></li>
                <li className="flex justify-between"><span>oo, oe</span> <span className="font-sinhala">ඕ</span></li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-indigo-600 mb-3">Consonants</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex justify-between"><span>k, c, q</span> <span className="font-sinhala">ක</span></li>
                <li className="flex justify-between"><span>g</span> <span className="font-sinhala">ග</span></li>
                <li className="flex justify-between"><span>t, T</span> <span className="font-sinhala">ට</span></li>
                <li className="flex justify-between"><span>d</span> <span className="font-sinhala">ද</span></li>
                <li className="flex justify-between"><span>D</span> <span className="font-sinhala">ඩ</span></li>
                <li className="flex justify-between"><span>n</span> <span className="font-sinhala">න</span></li>
                <li className="flex justify-between"><span>N</span> <span className="font-sinhala">ණ</span></li>
                <li className="flex justify-between"><span>p, P</span> <span className="font-sinhala">ප</span></li>
                <li className="flex justify-between"><span>b, B</span> <span className="font-sinhala">බ</span></li>
                <li className="flex justify-between"><span>m, M</span> <span className="font-sinhala">ම</span></li>
                <li className="flex justify-between"><span>y, Y</span> <span className="font-sinhala">ය</span></li>
                <li className="flex justify-between"><span>r, R</span> <span className="font-sinhala">ර</span></li>
                <li className="flex justify-between"><span>l, L</span> <span className="font-sinhala">ල</span></li>
                <li className="flex justify-between"><span>v, w</span> <span className="font-sinhala">ව</span></li>
                <li className="flex justify-between"><span>s, S</span> <span className="font-sinhala">ස</span></li>
                <li className="flex justify-between"><span>h, H</span> <span className="font-sinhala">හ</span></li>
                <li className="flex justify-between"><span>f, F</span> <span className="font-sinhala">ෆ</span></li>
                <li className="flex justify-between"><span>j, J</span> <span className="font-sinhala">ජ</span></li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-indigo-600 mb-3">Special</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex justify-between"><span>nng</span> <span className="font-sinhala">ඥ</span></li>
                <li className="flex justify-between"><span>nnd</span> <span className="font-sinhala">ඳ</span></li>
                <li className="flex justify-between"><span>nngg</span> <span className="font-sinhala">ඟ</span></li>
                <li className="flex justify-between"><span>th, Th</span> <span className="font-sinhala">ත</span></li>
                <li className="flex justify-between"><span>TH</span> <span className="font-sinhala">ඨ</span></li>
                <li className="flex justify-between"><span>dh, Dh</span> <span className="font-sinhala">ධ</span></li>
                <li className="flex justify-between"><span>DH</span> <span className="font-sinhala">ඪ</span></li>
                <li className="flex justify-between"><span>sh, Sh</span> <span className="font-sinhala">ශ</span></li>
                <li className="flex justify-between"><span>SH</span> <span className="font-sinhala">ෂ</span></li>
                <li className="flex justify-between"><span>ch</span> <span className="font-sinhala">ච</span></li>
                <li className="flex justify-between"><span>x</span> <span className="font-sinhala">ං</span></li>
                <li className="flex justify-between"><span>ksh</span> <span className="font-sinhala">ක්ෂ</span></li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-indigo-600 mb-3">Combinations</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex justify-between"><span>ka</span> <span className="font-sinhala">ක</span></li>
                <li className="flex justify-between"><span>kaa</span> <span className="font-sinhala">කා</span></li>
                <li className="flex justify-between"><span>kae</span> <span className="font-sinhala">කැ</span></li>
                <li className="flex justify-between"><span>ki</span> <span className="font-sinhala">කි</span></li>
                <li className="flex justify-between"><span>kii, kee</span> <span className="font-sinhala">කී</span></li>
                <li className="flex justify-between"><span>ku</span> <span className="font-sinhala">කු</span></li>
                <li className="flex justify-between"><span>kuu, koo</span> <span className="font-sinhala">කූ</span></li>
                <li className="flex justify-between"><span>ke</span> <span className="font-sinhala">කෙ</span></li>
                <li className="flex justify-between"><span>kea</span> <span className="font-sinhala">කේ</span></li>
                <li className="flex justify-between"><span>ko</span> <span className="font-sinhala">කො</span></li>
                <li className="flex justify-between"><span>koe</span> <span className="font-sinhala">කෝ</span></li>
                <li className="flex justify-between"><span>kra</span> <span className="font-sinhala">ක්‍ර</span></li>
                <li className="flex justify-between"><span>kya</span> <span className="font-sinhala">ක්‍ය</span></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
