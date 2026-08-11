import { TarsDebugResponse, TarsSettings } from '../types';

// Predefined TARS Hinglish Roasting Dialogue Database for Common Student Python Errors
export const TARS_ROAST_DICTIONARY: Record<string, { roast: string; hint: string }> = {
  SyntaxError: {
    roast: "Bhai, tune colon (:) ya bracket lagana bhul gaya hai. Python tera aisi harkatein dekh kar soch raha hoga ki isko admission kisne diya. Ja line theek kar chupchap.",
    hint: "Code mein Syntax check kar! Bracket '(' ')' close karo, ya function/if/for/while line ke end mein colon (:) lagana mat bhoolo.",
  },
  NameError: {
    roast: "Bhai, tu jis variable ko bula raha hai, uska wajood hi nahi hai. Jaise ghost ko dhundh raha ho. Pehle variable declare kar, phir hero banna.",
    hint: "Variable pehle define (assign) karo, e.g. x = 10, uske baad hi print ya use karo! Variable name ki spelling bhi re-check kar le.",
  },
  IndentationError: {
    roast: "Bhai, indentation ki aisi-taisi kar rakhi hai tune. Python space/tab ke chakkar mein chakkar kha ke gir gaya hai. Thoda formatting theek kar le.",
    hint: "Python code blocks space-sensitive hote hain. Function, if, else, ya loop ke andar ki lines ko 4 spaces (Tab) aage shift karo.",
  },
  ZeroDivisionError: {
    roast: "Bhai, mathematical paap kar diya tune! Kisi number ko 0 se divide kar raha hai. Universe collapse karane ka iraada hai kya? Code sudhar apna.",
    hint: "0 se division invalid hai! Divide karne se pehle denominator check kar lo: e.g. if b != 0: result = a / b else print('Cannot divide by zero').",
  },
  TypeError: {
    roast: "Bhai, string aur integer ko aapas mein jodh raha hai jaise paani aur aag mila raha ho. Types match kar, warna TARS mode off karke khud thappad maar dunga.",
    hint: "Data types convert karo! String ke saath number join karne ke liye str(number) convert karo, ya f-string use karo: print(f'Result: {num}').",
  },
  IndexError: {
    roast: "Bhai, list ka size chhota hai aur tu out of bounds ja raha hai. Hawa mein se elements thodi nikal lega Python!",
    hint: "Python lists 0-indexed hoti hain. Pehla item index 0 par hota hai. len(my_list) check kar aur index valid range mein rakho.",
  },
  ValueError: {
    roast: "Bhai, value hi galat de di tune! String ko integer mein convert karne ki koshish kar raha hai bina number ke.",
    hint: "Value conversion check karo! e.g. int('hello') crash hoga kyunki 'hello' mein numbers nahi hain. Valid digit string pass karo.",
  },
  KeyError: {
    roast: "Bhai, dictionary mein ye key exist hi nahi karti! Khawaab mein se key thodi nikalega Python?",
    hint: "Dictionary mein key check karo 'if key in my_dict:' ya safe access ke liye 'my_dict.get(key, default_value)' use karo.",
  },
  AttributeError: {
    roast: "Bhai, galat function/method bula raha hai is object par! Car par fly() call karega to accident hi hoga na!",
    hint: "Attribute ya method name ki spelling check karo. Double check karo ki us data object par wo function available hai ya nahi.",
  },
  ModuleNotFoundError: {
    roast: "Bhai, aisa library import kar raha hai jo installed hi nahi hai! Hava mein se package thodi import hoga?",
    hint: "Standard built-in libraries (math, random, sys) use karo, ya check karo library name spelling sahi hai.",
  },
  ImportError: {
    roast: "Bhai, module mein se aisa function maang raha hai jo usme hai hi nahi. Sahi import statement likho!",
    hint: "Import path aur function name check karo. e.g. from math import sqrt.",
  },
  RecursionError: {
    roast: "Bhai, infinite loop ya recursion chala diya tune! Function khud ko call karte-karte behosh ho gaya hai.",
    hint: "Recursive function mein base condition (stopping criteria) add karo taaki recursion end ho sake!",
  },
};

export function generateLocalHinglishRoast(
  code: string,
  errorTraceback: string,
  settings: TarsSettings,
  repeatCount: number
): TarsDebugResponse {
  const lines = errorTraceback.trim().split('\n');
  const lastLine = lines.pop() || '';
  const errorType = lastLine.split(':')[0].trim();
  const errorDetails = lastLine.split(':').slice(1).join(':').trim();

  let roast = "";
  let technicalHint = "";

  if (repeatCount > 0) {
    roast = `Bhai, dobara wahi ${errorType}? Teri memory wipe ho gayi hai kya? Maine abhi bataya tha fir bhi wahi galti! TARS tera patience test kar raha hai.`;
    technicalHint = `Dhayan se dekho: ${lastLine}. Purani galti fix karo pehle!`;
  } else if (TARS_ROAST_DICTIONARY[errorType]) {
    const matched = TARS_ROAST_DICTIONARY[errorType];
    roast = matched.roast;
    technicalHint = matched.hint + (errorDetails ? ` (Details: ${errorDetails})` : "");
  } else {
    roast = `Bhai, tere code mein aisa anokha error hai ki Python bhi pareshaan ho gaya: ${lastLine}. Pehle error padho fir line thik karo!`;
    technicalHint = `Traceback line check karo:\n${lastLine}`;
  }

  return {
    roast,
    technicalHint,
    humorScore: `Humor: ${settings.humor}% | Sarcasm: ${settings.sarcasm}% (Offline TARS Engine)`,
    tarsStatusQuote: "Hinglish Subroutines Active. Full Offline Mode Enabled.",
  };
}
