const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.nav-links');
if(menuButton&&navigation){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('is-open');}});}
const enquiry=document.querySelector('#enquiry');
if(enquiry){
const ENDPUNKT='https://script.google.com/macros/s/AKfycbzV8PGLWAUWddGMecLVLR4z9aCn3jGm4Xmw9IwkWrJvM9GmwU_nyNCJj5mW2GP2l-uN2A/exec';
const DIREKT='Sie erreichen uns auch direkt unter stanley.kunz@kunzakquise.com oder +49 6344 926 9681.';
const feedback=document.querySelector('#form-feedback');
const button=enquiry.querySelector('button[type="submit"]');
const zeitfeld=enquiry.elements.namedItem('t');
const stempeln=()=>{if(zeitfeld)zeitfeld.value=String(Date.now());};
stempeln();
const requested=new URLSearchParams(location.search).get('leistung');
const field=enquiry.elements.namedItem('leistung');
const vorbelegen=()=>{if(requested&&field&&[...field.options].some(o=>o.value===requested))field.value=requested;};
vorbelegen();
const melden=(text,zustand)=>{feedback.textContent=text;if(zustand)feedback.setAttribute('data-state',zustand);else feedback.removeAttribute('data-state');};
enquiry.addEventListener('submit',async e=>{
e.preventDefault();
if(!enquiry.reportValidity())return;
const beschriftung=button.innerHTML;
button.disabled=true;
button.textContent='Wird gesendet …';
melden('','');
try{
const antwort=await fetch(ENDPUNKT,{method:'POST',body:new URLSearchParams(new FormData(enquiry))});
const ergebnis=await antwort.json().catch(()=>({ok:false,error:'antwort'}));
if(!ergebnis.ok)throw new Error(ergebnis.error||'unbekannt');
enquiry.reset();
vorbelegen();
stempeln();
melden('Vielen Dank, Ihre Anfrage ist bei uns eingegangen. Wir melden uns zeitnah bei Ihnen.','ok');
}catch(fehler){
const texte={zu_schnell:'Bitte senden Sie das Formular noch einmal ab.',unvollstaendig:'Bitte füllen Sie alle Pflichtfelder aus.',email:'Bitte prüfen Sie Ihre E-Mail-Adresse.',zu_viele:'Es gehen gerade sehr viele Anfragen ein. Bitte versuchen Sie es später noch einmal.'};
const code=String((fehler&&fehler.message)||'');
melden((texte[code]||'Ihre Anfrage konnte nicht gesendet werden.')+' '+DIREKT,'fehler');
}finally{
button.innerHTML=beschriftung;
button.disabled=false;
}
});
}
