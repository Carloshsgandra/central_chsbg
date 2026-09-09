export function emptyAcademy() {
  return { version: 1, notes: {}, tasks: {}, practice: {}, reviews: {}, ledger: {}, goals: {}, monthlyLimit: 0, limitUpdatedAt: '', imports: {}, legacyCompleted: [] };
}
export function normalizeAcademy(input = {}) {
  const result = { ...emptyAcademy(), ...input };
  for (const key of ['notes','tasks','practice','reviews','ledger','goals','imports']) {
    if (!result[key] || typeof result[key] !== 'object' || Array.isArray(result[key])) result[key] = {};
  }
  result.legacyCompleted = Array.isArray(result.legacyCompleted) ? result.legacyCompleted : [];
  return result;
}
const timestamp = (value) => Date.parse(value || '') || 0;
export function mergeRecords(left = {}, right = {}) {
  const result = { ...left };
  for (const [id, item] of Object.entries(right)) {
    if (!result[id] || timestamp(item.updatedAt) > timestamp(result[id].updatedAt) ||
      (timestamp(item.updatedAt) === timestamp(result[id].updatedAt) && JSON.stringify(item) > JSON.stringify(result[id]))) result[id] = item;
  }
  return result;
}
export function mergeAcademy(a = {}, b = {}) {
  a = normalizeAcademy(a); b = normalizeAcademy(b);
  const result = { ...a };
  for (const key of ['notes','tasks','practice','reviews','ledger','goals','imports']) result[key] = mergeRecords(a[key], b[key]);
  for (const id of Object.keys(result.practice)) {
    result.practice[id] = { ...result.practice[id], completed: Boolean(a.practice[id]?.completed || b.practice[id]?.completed) };
  }
  result.legacyCompleted = [...new Set([...a.legacyCompleted,...b.legacyCompleted])];
  if (timestamp(b.limitUpdatedAt) > timestamp(a.limitUpdatedAt)) { result.monthlyLimit = b.monthlyLimit; result.limitUpdatedAt = b.limitUpdatedAt; }
  return result;
}
export function localDay(date = new Date()) {
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
}
export function moneyToCents(input) {
  let text = String(input).trim();
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(text) && !/^\d+(?:\.\d{1,2})?$/.test(text)) throw new Error('Use um valor como 125,50.');
  if (text.includes(',')) text = text.replaceAll('.','').replace(',','.');
  else if (/^\d{1,3}(?:\.\d{3})+$/.test(text)) text = text.replaceAll('.','');
  const cents = Math.round(Number(text)*100);
  if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 100000000000) throw new Error('Informe um valor positivo válido.');
  return cents;
}
export function totals(ledger, month) {
  return Object.values(ledger).filter(x=>!x.deleted && (!month || x.date.startsWith(month))).reduce((a,x)=>{
    a[x.type === 'income' ? 'income' : 'expense'] += x.cents;
    a.balance = a.income - a.expense; return a;
  }, {income:0,expense:0,balance:0});
}
export function scheduleReview(previous = {}, rating, now = new Date()) {
  if (!['again','hard','good'].includes(rating)) throw new Error('Avaliação inválida.');
  const interval = rating === 'again' ? 0 : rating === 'hard' ? 1 : Math.min(90, Math.max(3,(previous.interval || 1)*2));
  return { interval, due: new Date(now.getTime() + (interval ? interval*86400000 : 600000)).toISOString(), updatedAt: now.toISOString(), count:(previous.count||0)+1 };
}
export function importNexo(academy, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source) || (!Array.isArray(source.completed) && !Array.isArray(source.expenses) && typeof source.note !== 'string')) throw new Error('Este arquivo não é um backup do Nexo.');
  const next = normalizeAcademy(structuredClone(academy));
  const now = new Date().toISOString();
  for (const row of source.expenses || []) {
    if (!row.title || !['income','expense'].includes(row.type) || !Number.isFinite(row.value) || row.value <= 0) continue;
    const id = 'nexo-' + String(row.id);
    next.ledger[id] ??= {id,title:String(row.title).slice(0,120),cents:Math.round(row.value*100),type:row.type,category:'Importado',date:localDay(),updatedAt:now,imported:true};
  }
  if (source.note?.trim()) next.notes['nexo-notebook'] ??= {id:'nexo-notebook',title:'Meu caderno do Nexo',body:source.note,tag:'Importado',updatedAt:now};
  next.legacyCompleted = [...new Set([...next.legacyCompleted,...(source.completed || []).filter(x=>typeof x==='string')])];
  next.imports.nexo = {updatedAt:now};
  return next;
}
