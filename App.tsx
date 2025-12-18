import React, { useState, useRef } from 'react';
import { extractTextFromImage, fileToBase64 } from './services/geminiService';
import { 
  Loader2, Copy, Sparkles, UploadCloud, Phone, Mail, 
  MessageCircle, FileText, CheckCircle2, RefreshCw, XCircle
} from 'lucide-react';

const PROFILE_IMAGE = "https://www2.0zz0.com/2025/12/17/06/790723590.jpg";
const CONTACT = {
  name: "عبد الإله فلاتة",
  phone: "0591388202",
  whatsapp: "966591388202",
  email: "iioe@outlook.sa"
};

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult("");
    }
  };

  const processImage = async () => {
    if (!file) return;
    setLoading(true);
    setResult("");
    try {
      const base64 = await fileToBase64(file);
      const text = await extractTextFromImage(base64);
      setResult(text);
    } catch (err) {
      setResult("حدث خطأ أثناء المعالجة، تأكد من اتصالك بالإنترنت.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setResult("");
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-4 py-8">
      
      {/* هيدر احترافي */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-bold opacity-70">المستخرج الذكي V3.1</span>
        </div>

        <div className="flex items-center gap-4 text-left">
          <div className="text-right">
            <h2 className="text-xl font-black bg-gradient-to-l from-white to-gray-400 bg-clip-text text-transparent">
              {CONTACT.name}
            </h2>
            <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold">المطور والمالك</span>
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/10 ring-4 ring-purple-500/10">
            <img src={PROFILE_IMAGE} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="w-full max-w-xl flex flex-col items-center gap-8 flex-grow">
        
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black">نصك العربي <span className="text-purple-500">خالص ونقي</span></h1>
          <p className="text-gray-400 font-medium">استخراج فوري وتنسيق ذكي باستخدام أحدث تقنيات Gemini</p>
        </div>

        {/* كرت العمليات */}
        <div className="w-full bg-[#0c0c0e]/80 border border-white/5 rounded-[40px] p-6 backdrop-blur-2xl shadow-2xl relative">
          
          <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />
          
          <div 
            onClick={() => !loading && fileRef.current?.click()}
            className={`w-full h-64 rounded-[30px] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden group
              ${preview ? 'border-purple-500/40 bg-purple-500/5' : 'border-white/10 hover:border-purple-500/30 hover:bg-white/5'}
            `}
          >
            {preview ? (
              <div className="relative w-full h-full p-4 flex items-center justify-center">
                <img src={preview} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <RefreshCw className="w-10 h-10 text-white animate-spin-slow" />
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                   <UploadCloud className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-300">اختر صورة أو اسحبها هنا</h3>
                <p className="text-xs text-gray-500 mt-2">سيتم استخراج النص العربي فقط وتنظيفه</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button 
              onClick={processImage}
              disabled={!file || loading}
              className={`flex-[3] py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95
                ${!file || loading ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]'}
              `}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
              {loading ? 'جاري المعالجة...' : 'استخراج النص'}
            </button>
            
            <button 
              onClick={clear}
              className="flex-1 py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              <XCircle className="w-6 h-6 mx-auto" />
            </button>
          </div>
        </div>

        {/* منطقة النتيجة */}
        {result && (
          <div className="w-full animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-[#0c0c0e] border border-white/5 rounded-[35px] p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" /> تم التنظيف والاستخراج
                </div>
                <button 
                  onClick={copyResult}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-xs font-bold
                    ${copied ? 'bg-green-500/20 text-green-500' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'}
                  `}
                >
                  <Copy className="w-3 h-3" /> {copied ? 'تم النسخ' : 'نسخ النص'}
                </button>
              </div>
              <textarea 
                value={result}
                readOnly
                className="w-full h-72 bg-black/40 rounded-2xl p-6 text-right leading-relaxed text-gray-200 focus:outline-none border border-white/5 resize-none"
              />
            </div>
          </div>
        )}

        {/* فقاعات التواصل العائمة */}
        <div className="w-full max-w-sm mt-12 grid grid-cols-3 gap-6 pb-20">
          <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" className="animate-float-slow">
            <div className="group flex flex-col items-center gap-2">
               <div className="w-16 h-16 rounded-3xl bg-[#0c0c0e] border border-white/5 flex items-center justify-center text-gray-400 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-500 group-hover:-translate-y-2 transition-all duration-500 shadow-xl glow-shadow">
                  <MessageCircle className="w-7 h-7" />
               </div>
               <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-green-500 transition-colors">WhatsApp</span>
            </div>
          </a>

          <a href={`tel:${CONTACT.phone}`} className="animate-float-mid">
            <div className="group flex flex-col items-center gap-2">
               <div className="w-16 h-16 rounded-3xl bg-[#0c0c0e] border border-white/5 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:-translate-y-2 transition-all duration-500 shadow-xl glow-shadow">
                  <Phone className="w-7 h-7" />
               </div>
               <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-blue-500 transition-colors">Contact</span>
            </div>
          </a>

          <a href={`mailto:${CONTACT.email}`} className="animate-float-fast">
            <div className="group flex flex-col items-center gap-2">
               <div className="w-16 h-16 rounded-3xl bg-[#0c0c0e] border border-white/5 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 group-hover:-translate-y-2 transition-all duration-500 shadow-xl glow-shadow">
                  <Mail className="w-7 h-7" />
               </div>
               <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-purple-500 transition-colors">Email</span>
            </div>
          </a>
        </div>
      </main>

      <footer className="w-full text-center py-8 border-t border-white/5 opacity-20">
        <p className="text-[10px] font-black tracking-[0.3em]">ABDALLAH FALLATAH • SMART OCR ENGINE • 2024</p>
      </footer>

    </div>
  );
};

export default App;