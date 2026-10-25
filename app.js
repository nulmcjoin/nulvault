const categories = ["Addons","Texture / Resource","Skin Pack","Maps","MCTemplate"];
const fallback = [
 {id:"demo-addon",title:"Fantasy Creatures Add-on",category:"Addons",description:"Contoh kartu katalog untuk addon makhluk fantasi. Ganti item contoh dengan feed komunitas yang mengizinkan distribusi atau tautan resmi kreator.",version:"Periksa sumber",date:"2026-10-25",creator:"Demo item",url:"https://www.minecraft.net/en-us/marketplace",icon:"🐉",source:"Demo"},
 {id:"demo-texture",title:"Clean PvP Resource Pack",category:"Texture / Resource",description:"Contoh listing resource pack untuk tampilan PvP yang lebih sederhana. Detail versi dan lisensi harus diperiksa pada halaman sumber.",version:"Periksa sumber",date:"2026-10-24",creator:"Demo item",url:"https://www.minecraft.net/en-us/marketplace",icon:"▧",source:"Demo"},
 {id:"demo-skin",title:"Pixel Heroes Skin Pack",category:"Skin Pack",description:"Contoh listing skin pack. Tautan Marketplace hanya sebagai contoh navigasi; bukan unduhan file gratis.",version:"Bedrock",date:"2026-10-22",creator:"Demo item",url:"https://www.minecraft.net/en-us/marketplace",icon:"♙",source:"Demo"},
 {id:"demo-map",title:"Mountain Survival World",category:"Maps",description:"Contoh listing peta survival. Gunakan tautan unduhan asli dari kreator dan pastikan izin distribusinya.",version:"Periksa sumber",date:"2026-10-20",creator:"Demo item",url:"https://www.minecraft.net/en-us/marketplace",icon:"▦",source:"Demo"},
 {id:"demo-template",title:"Adventure Template",category:"MCTemplate",description:"Contoh listing template dunia. Item contoh ini hanya untuk memperlihatkan desain kartu.",version:"Bedrock",date:"2026-10-18",creator:"Demo item",url:"https://www.minecraft.net/en-us/marketplace",icon:"◈",source:"Demo"}
];
let items = [];
let activeCategory = "All";
const $ = s => document.querySelector(s);
const safe = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function iconFor(cat){return ({"Addons":"⬡","Texture / Resource":"▧","Skin Pack":"♙","Maps":"▦","MCTemplate":"◈"})[cat]||"✦"}
function render(){
 const q=$("#search").value.trim().toLowerCase(), sort=$("#sort").value;
 let list=items.filter(x=>(activeCategory==="All"||x.category===activeCategory)&&[x.title,x.description,x.creator,x.category,x.version].join(" ").toLowerCase().includes(q));
 list.sort((a,b)=>sort==="az"?a.title.localeCompare(b.title):String(b.date||"").localeCompare(String(a.date||"")));
 $("#cards").innerHTML=list.map(x=>`<article class="card"><div class="thumb"><span class="tag">${safe(x.category)}</span><span class="thumb-icon">${safe(x.icon||iconFor(x.category))}</span></div><div class="card-body"><h3>${safe(x.title)}</h3><p>${safe(x.description)}</p><div class="meta"><span>MC ${safe(x.version||"Bedrock")}</span><span>${safe(x.date||"Tanggal tidak tersedia")}</span></div><div class="card-bottom"><span class="creator">${safe(x.creator||x.source||"Community creator")}</span><a class="download" href="${safe(x.url)}" target="_blank" rel="noopener noreferrer">LIHAT SUMBER ↗</a></div></div></article>`).join("");
 $("#empty").hidden=list.length>0; $("#results-count").textContent=`${list.length} konten ditemukan`; $("#total-count").textContent=items.length;
}
async function init(){
 $("#year").textContent=new Date().getFullYear();
 try {const r=await fetch("data/catalog.json?ts="+Date.now());if(!r.ok)throw Error("catalog missing");const d=await r.json();items=Array.isArray(d.items)?d.items:[];if(!items.length)items=fallback;$("#updated-label").textContent="Update data: "+(d.updated_at||"belum tersedia");}
 catch(e){items=fallback;$("#updated-label").textContent="Mode contoh • data feed belum tersedia";}
 render();
}
$("#search").addEventListener("input",render);$("#sort").addEventListener("change",render);
$("#filters").addEventListener("click",e=>{const b=e.target.closest("button[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render()});
init();