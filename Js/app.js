(function(){
/* on refresh: empty the cart and start at the top of the page (moving between pages keeps the cart) */
var navType=((performance.getEntriesByType&&performance.getEntriesByType("navigation")[0])||{}).type;
try{history.scrollRestoration="manual"}catch(e){}
if(navType==="reload"){
  try{localStorage.removeItem("tmdas_cart")}catch(e){}
  if(location.hash)history.replaceState(null,"",location.pathname+location.search);
  scrollTo(0,0);addEventListener("load",function(){scrollTo(0,0)});
}
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const gbp=n=>"£"+n.toFixed(2),pf=n=>n?gbp(n):"Price on request";
const page=document.body.dataset.page;
const links=[["index.html","Home"],["menu.html","Menu"],["services.html","Services"],["about.html","About Us"],["contact.html","Contact Us"]];

/* ---------- layout ---------- */
const nav=links.map(l=>`<a href="${l[0]}" class="${l[0].startsWith(page)?'on':''}">${l[1]}</a>`).join("");
document.body.insertAdjacentHTML("afterbegin",`<header class="top"><div class="wrap"><a href="index.html" class="brand" aria-label="TMDAS Catering Services home"><img src="img/logo.png" alt="TMDAS Catering Services"></a><nav class="main" id="nav">${nav}</nav><div style="display:flex;gap:12px;align-items:center"><button class="cartbtn" id="openCart" aria-label="Open cart">Order <span id="cnt">0</span></button><button class="burger" id="burger" aria-label="Menu">&#9776;</button></div></div></header>`);
document.body.insertAdjacentHTML("beforeend",`
<footer><div class="wrap"><div class="grid"><div><a href="index.html" class="brand flogo" aria-label="TMDAS Catering Services home"><img src="img/logo.png" alt="TMDAS Catering Services"></a><p style="margin-top:8px">Good food, great taste, always fresh. Authentic Nigerian catering in the UK.</p></div>
<div><h4>Explore</h4>${nav.replace(/ class="[^"]*"/g,"")}</div>
<div><h4>Order</h4><a href="https://wa.me/${SETTINGS.whatsapp}">WhatsApp: ${SETTINGS.phoneDisplay}</a><a href="tel:${SETTINGS.phoneDisplay}">Call: ${SETTINGS.phoneDisplay}</a><a href="mailto:info@tmdascateringserviceltd.com">info@tmdascateringserviceltd.com</a></div>
<div><h4>Follow us</h4><a href="#">Facebook</a><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">YouTube</a><p style="font-size:13px;margin-top:6px">@tmdas catering services</p></div></div>
<p class="copy">&copy; ${new Date().getFullYear()} TMDAS Catering Services Ltd. All rights reserved.</p></div></footer>
<a class="fab" href="https://wa.me/${SETTINGS.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a>
<div class="ov" id="ov"></div>
<aside class="drawer" id="drawer" aria-label="Your order"><header><b id="dtitle" style="font-size:20px">Your order</b><span style="display:flex;align-items:center;gap:14px"><button id="clr" class="hclr">Clear all</button><button id="closeCart" aria-label="Close">&times;</button></span></header><div class="dbody" id="dbody"></div><div class="dfoot" id="dfoot"></div></aside><div class="toast" id="toast"></div>`);
$("#burger").onclick=()=>$("#nav").classList.toggle("open");

/* ---------- cart ---------- */
let cart=JSON.parse(localStorage.getItem("tmdas_cart")||"[]"),mode=localStorage.getItem("tmdas_mode")||"Delivery";
const save=()=>{localStorage.setItem("tmdas_cart",JSON.stringify(cart));render()};
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1800)};
const open=v=>{$("#drawer").classList.toggle("on",v);$("#ov").classList.toggle("on",v);if(v)fit()};
$("#openCart").onclick=()=>open(true);$("#closeCart").onclick=$("#ov").onclick=()=>open(false);
window.addToCart=(name,label,price,alc)=>{const key=name+"|"+label,f=cart.find(i=>i.key===key);f?f.q++:cart.push({key,name,label,price,alc,q:1,note:""});save();toast("Added: "+name)};
const sub=()=>cart.reduce((s,i)=>s+i.price*i.q,0);
let step="cart",fd={cn:"",cp:"",ca:"",cz:"",cd:"",cx:"",c18:false},ref="",paid=false;
const esc=s=>String(s).replace(/"/g,"&quot;");
const newRef=()=>"TMD-"+Math.random().toString(36).slice(2,6).toUpperCase()+Date.now().toString(36).slice(-2).toUpperCase();
const P=SETTINGS.payment;
function render(){
  $("#cnt").textContent=cart.reduce((s,i)=>s+i.q,0);
  const b=$("#dbody"),f=$("#dfoot");
  if(!cart.length){step="cart";ref="";paid=false;$("#clr").style.display="none";$("#dtitle").textContent="Your order";b.innerHTML=`<div class="empty"><h3>Your order is empty</h3><p style="margin:10px 0 18px">Pick something tasty from the menu.</p><a class="btn" href="menu.html">Browse the menu</a></div>`;f.innerHTML="";return}
  const del=mode==="Delivery",fee=del?SETTINGS.deliveryFee:0,alc=cart.some(i=>i.alc),tbc=cart.some(i=>!i.price),tot=sub()+fee,n=cart.reduce((s,i)=>s+i.q,0);
  $("#dtitle").textContent={cart:"Your order",form:"Checkout",pay:"Payment"}[step];$("#clr").style.display=step==="cart"?"":"none";
  const totals=`<div class="tot sm"><span>Subtotal ${gbp(sub())}</span><span>${mode} ${fee?gbp(fee):"free"}</span></div><div class="tot g"><span>Total</span><span>${gbp(tot)}${tbc?" +":""}</span></div>${tbc?`<p class="small">Bulk items marked TBC are priced on WhatsApp once we confirm your order.</p>`:""}`;
  if(step==="cart"){
    b.innerHTML=cart.map((i,x)=>`<div class="ci"><div class="r1"><div class="nm">${i.name}${i.label?` <small>(${i.label})</small>`:""}</div>
    <div class="step"><button data-a="-" data-x="${x}" aria-label="Less">&minus;</button><b>${i.q}</b><button data-a="+" data-x="${x}" aria-label="More">+</button></div>
    <b class="pr2">${i.price?gbp(i.price*i.q):"TBC"}</b>
    ${i.note||i.showNote?"":`<button class="ib note" data-a="note" data-x="${x}" aria-label="Add note" title="Add note"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg></button>`}
    <button class="ib del" data-a="x" data-x="${x}" aria-label="Remove ${esc(i.name)}" title="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button></div>
    ${i.note||i.showNote?`<input type="text" data-n="${x}" placeholder="Special instructions (e.g. less pepper)" value="${esc(i.note)}">`:""}</div>`).join("");
    f.innerHTML=`<div class="seg"><label><input type="radio" name="mode" value="Delivery" ${del?"checked":""}>Delivery</label><label><input type="radio" name="mode" value="Collection" ${!del?"checked":""}>Collection</label></div>${totals}<button class="btn" id="next" style="width:100%;margin-top:10px">Continue to checkout</button>`;
  }else if(step==="form"){
    b.innerHTML=`<button class="back" id="back">&larr; Back to order</button><p class="small" style="margin:0 0 10px"><b>${n} items</b> &middot; ${mode}</p>
    ${tbc?`<p class="note">Your order includes bulk items priced on WhatsApp, so no payment is needed now. We will confirm the price and send you payment details.</p>`:""}
    <div class="f c"><input id="cn" placeholder="Your name" autocomplete="name" value="${esc(fd.cn)}"><input id="cp" placeholder="Phone number" autocomplete="tel" value="${esc(fd.cp)}">
    ${del?`<input class="full" id="ca" placeholder="Delivery address" autocomplete="street-address" value="${esc(fd.ca)}"><input id="cz" placeholder="Postcode" autocomplete="postal-code" value="${esc(fd.cz)}">`:""}
    <input id="cd" type="datetime-local" aria-label="Preferred date and time" value="${esc(fd.cd)}" class="${del?"":"full"}"><textarea class="full" id="cx" rows="2" placeholder="Anything else we should know?">${fd.cx}</textarea>
    ${alc?`<label class="full" style="font-weight:600"><input type="checkbox" id="c18" ${fd.c18?"checked":""}> I confirm I am 18 or over (alcohol in my order)</label>`:""}</div>`;
    f.innerHTML=`${totals}<button class="btn" id="go" style="width:100%;margin-top:10px">${tbc?"Send order on WhatsApp":"Continue to payment"}</button>`;
  }else{
    if(!ref)ref=newRef();
    const row=(l,v)=>`<div><span>${l}</span><b>${v}</b><button class="cp" data-copy="${esc(v)}">Copy</button></div>`;
    b.innerHTML=`<button class="back" id="back2">&larr; Back to details</button><p class="note"><b>Payment validates your order.</b> Your order is confirmed only after we receive and check your payment.</p>
    <div class="amt"><small>Amount to pay</small><b>${gbp(tot)}</b></div>
    <div class="bank">${row("Account name",P.accountName)}${row("Bank",P.bank)}${row("Sort code",P.sortCode)}${row("Account no.",P.accountNumber)}${row("Reference",ref)}</div>
    <ol class="how"><li>Transfer exactly <b>${gbp(tot)}</b> and use the reference above.</li><li>Tick the box below, then tap the green button.</li><li>In WhatsApp, <b>attach your payment receipt</b> (screenshot or PDF) and send.</li></ol>
    <label class="chk"><input type="checkbox" id="cpaid" ${paid?"checked":""}> I have made this payment</label>`;
    f.innerHTML=`<div class="tot g"><span>Total to pay</span><span>${gbp(tot)}</span></div><button class="btn wa" id="send" style="width:100%;margin-top:10px">Send receipt on WhatsApp</button>`;
  }
}
function fit(){const d=$("#drawer"),b=$("#dbody");d.classList.remove("t1","t2");if(b.scrollHeight>b.clientHeight+1){d.classList.add("t1");if(b.scrollHeight>b.clientHeight+1)d.classList.add("t2")}}
const _r=render;render=function(){_r();fit()};addEventListener("resize",fit);
const copy=v=>{(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(()=>toast("Copied"),()=>{const x=document.createElement("textarea");x.value=v;document.body.append(x);x.select();try{document.execCommand("copy");toast("Copied")}catch(_){}x.remove()})};
function validate(){const del=mode==="Delivery";["cn","cp","ca","cz","cd","cx"].forEach(k=>{const el=$("#"+k);if(el)fd[k]=el.value});
  if(!fd.cn.trim()||!fd.cp.trim())return"Please add your name and phone";
  if(del&&(!fd.ca.trim()||!fd.cz.trim()))return"Please add address and postcode";
  if(cart.some(i=>i.alc)&&!fd.c18)return"Please confirm you are 18 or over";return""}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-a]"),d=t?t.dataset:{},id=e.target.id,cp=e.target.closest("[data-copy]");
  if(d.a){const i=cart[d.x];if(d.a==="+")i.q++;if(d.a==="-"&&--i.q<1)cart.splice(d.x,1);if(d.a==="x")cart.splice(d.x,1);if(d.a==="note")i.showNote=true;save()}
  if(cp)copy(cp.dataset.copy);
  if(id==="clr"){cart=[];ref="";paid=false;save()}
  if(id==="next"){step="form";render();$("#dbody").scrollTop=0}
  if(id==="back"){step="cart";render()}
  if(id==="back2"){step="form";render()}
  if(id==="go"){const err=validate();if(err)return toast(err);if(cart.some(i=>!i.price))send(false);else{step="pay";render();$("#dbody").scrollTop=0}}
  if(id==="send"){if(!paid)return toast("Please confirm you have made the payment");send(true)}
});
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.n!==undefined){cart[t.dataset.n].note=t.value;localStorage.setItem("tmdas_cart",JSON.stringify(cart))}if(t.type!=="checkbox"&&t.id in fd)fd[t.id]=t.value});
document.addEventListener("change",e=>{const t=e.target;if(t.name==="mode"){mode=t.value;localStorage.setItem("tmdas_mode",mode);render()}if(t.id==="c18")fd.c18=t.checked;if(t.id==="cpaid")paid=t.checked});
function send(isPaid){
  const del=mode==="Delivery",fee=del?SETTINGS.deliveryFee:0,tot=sub()+fee,tbc=cart.some(i=>!i.price);
  let m=isPaid?`*NEW ORDER - PAYMENT MADE*\nRef: ${ref}\n\n`:`*NEW BULK ORDER - PLEASE QUOTE*\n\n`;
  cart.forEach(i=>{m+=`${i.q} x ${i.name}${i.label?` (${i.label})`:""} - ${i.price?gbp(i.price*i.q):"price to confirm"}\n`+(i.note?`   Note: ${i.note}\n`:"")});
  m+=`\nSubtotal: ${gbp(sub())}\n${mode} fee: ${fee?gbp(fee):"Free"}\n*Total: ${gbp(tot)}${tbc?" + bulk items to be quoted":""}*\n\n*${mode}*\nName: ${fd.cn.trim()}\nPhone: ${fd.cp.trim()}\n`;
  if(del)m+=`Address: ${fd.ca.trim()}, ${fd.cz.trim()}\n`;
  if(fd.cd)m+=`Preferred time: ${fd.cd.replace("T"," ")}\n`;
  if(fd.cx.trim())m+=`Notes: ${fd.cx.trim()}\n`;
  m+=isPaid?`\n*Payment:* bank transfer of ${gbp(tot)}, reference ${ref}. My payment receipt is attached in this chat.`:`\nPlease confirm the price and send payment details.`;
  window.open(`https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(m)}`,"_blank");
  toast(isPaid?"Now attach your receipt in WhatsApp":"Opening WhatsApp");
}
render();

/* ---------- menu page ---------- */
const mp=$("#menuRoot");
if(mp){
  $("#tabs").innerHTML=MENU.map(c=>`<a href="#${c.id}">${c.cat}</a>`).join("");
  mp.innerHTML=MENU.map(c=>`<section class="mcat" id="${c.id}"><h2>${c.cat}</h2>${c.note?`<p class="lead" style="margin-top:-10px">${c.note}</p>`:""}<div class="items">${c.items.map((it,k)=>`<div class="item"><div><h3>${it.n}${it.alc?'<span class="tag">18+</span>':""}</h3><p>${it.d}</p></div>
  <div class="add">${it.opts?`<select id="o${c.id}${k}">${it.opts.map(o=>`<option value="${o[1]}|${o[0]}">${o[0]}${o[1]?" - "+gbp(o[1]):""}</option>`).join("")}</select>`:`<span class="pr">${pf(it.p)}</span>`}
  <button class="btn" data-c="${c.id}" data-k="${k}">Add</button></div></div>`).join("")}</div></section>`).join("");
  mp.addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(!b)return;
    const it=MENU.find(c=>c.id===b.dataset.c).items[b.dataset.k];
    if(it.opts){const [p,l]=$("#o"+b.dataset.c+b.dataset.k).value.split("|");addToCart(it.n,l,+p,it.alc)}else addToCart(it.n,"",it.p,it.alc)});
}

/* ---------- hero slider ---------- */
const sl=$$(".slide"),dots=$(".dots");
if(sl.length){let n=0;sl.forEach((_,i)=>{const d=document.createElement("i");d.onclick=()=>go(i);dots.append(d)});
  const go=i=>{n=i;sl.forEach((s,k)=>s.classList.toggle("on",k===n));$$("i",dots).forEach((d,k)=>d.classList.toggle("on",k===n))};
  go(0);setInterval(()=>go((n+1)%sl.length),3500)}

/* ---------- auto carousels, testimonials, reveal ---------- */
$$(".car").forEach(c=>{setInterval(()=>{if(c.matches(":hover"))return;const w=c.firstElementChild.offsetWidth+20;c.scrollLeft+w>=c.scrollWidth-c.clientWidth-4?c.scrollTo({left:0,behavior:"smooth"}):c.scrollBy({left:w,behavior:"smooth"})},2600)});
$$(".strip div,.marq div").forEach(d=>d.innerHTML+=d.innerHTML);
const q=$("#quote");if(q){const T=[["Jollof that tastes like home. Our guests kept asking for seconds.","Birthday party, London"],["The egusi and pounded yam were spot on, and delivery was on time.","Weekly customer"],["Catered our naming ceremony for 80 people. Everything was fresh and hot.","Naming ceremony host"],["Peppered turkey and small chops disappeared in minutes!","Office event"]];let t=0;
  const show=()=>{q.style.opacity=0;setTimeout(()=>{q.innerHTML=`&ldquo;${T[t][0]}&rdquo;<br><small style="color:var(--or);font-weight:700">${T[t][1]}</small>`;q.style.opacity=1;t=(t+1)%T.length},400)};show();setInterval(show,4000)}
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("on")),{threshold:.15});$$(".rev").forEach(r=>io.observe(r));

/* ---------- contact form ---------- */
const cf=$("#cform");if(cf)cf.onsubmit=e=>{e.preventDefault();const f=new FormData(cf);
  const m=`*Enquiry - ${SETTINGS.business}*\nName: ${f.get("name")}\nPhone: ${f.get("phone")}\nEnquiry: ${f.get("type")}\n\n${f.get("msg")}`;
  window.open(`https://wa.me/${SETTINGS.whatsapp}?text=${encodeURIComponent(m)}`,"_blank")};
})();
