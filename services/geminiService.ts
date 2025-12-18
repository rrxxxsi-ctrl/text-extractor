import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * معالجة وضغط الصورة لضمان أقصى سرعة استخراج
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const MAX_WIDTH = 1600; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          const ratio = MAX_WIDTH / width;
          width *= ratio;
          height *= ratio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          // ضغط الصورة بصيغة JPEG لسرعة الرفع بنسبة 80%
          resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
        }
      };
    };
    reader.onerror = (e) => reject(e);
  });
};

/**
 * استخراج النص العربي فقط باستخدام موديل Gemini 3 Flash السريع
 */
export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `
            استخرج النص العربي من هذه الصورة.
            التعليمات الصارمة:
            1. استخرج الكلمات العربية فقط.
            2. احذف تماماً أي حروف إنجليزية، أرقام غير عربية، أو رموز تقنية.
            3. نسق النص في أسطر وفقرات مرتبة كما تظهر في الصورة.
            4. قم بتصحيح الأخطاء المطبعية البائتة لضمان جودة النص.
            5. لا تضع أي مقدمات (مثل: "إليك النص...")، أريد النص المستخرج فقط.
            `
          }
        ]
      },
      config: {
        temperature: 0, // لضمان الدقة وتجنب التخريف
        thinkingConfig: { thinkingBudget: 0 } // تفعيل وضع السرعة القصوى (بدون تفكير مطول)
      }
    });

    return response.text?.trim() || "لم يتم العثور على نصوص عربية واضحة.";
  } catch (error) {
    console.error("Extraction Error:", error);
    throw new Error("فشلت عملية الاستخراج. حاول مرة أخرى.");
  }
};