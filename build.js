#!/usr/bin/env node
// SITE_URL=https://example.com/physioultant [GSC_TOKEN=xxx] node build.js  -> dist/
const fs=require("fs"),zlib=require("zlib"),crypto=require("crypto"),path=require("path");
const SITE=(process.env.SITE_URL||"").replace(/\/$/,"");
if(!/^https:\/\//.test(SITE)){console.error("Set SITE_URL to the public https URL (no trailing slash).");process.exit(1)}
let es=null;try{es=require("esbuild")}catch(e){console.warn("esbuild not installed: skipping minification")}
const BUDGET_GZ=28*1024,src=fs.readFileSync("src/index.html","utf8"),C=JSON.parse(fs.readFileSync("src/content.json","utf8")),LG=["en","fa","fr"];
const FLAT=process.env.FLAT=="1",url=l=>SITE+(l=="en"?"/":FLAT?`/${l}.html`:`/${l}/`),esc=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),today=new Date().toISOString().slice(0,10);
const hasOg=fs.existsSync("assets/og.png"),out="dist";fs.rmSync(out,{recursive:true,force:true});
const alts=LG.map(x=>`<link rel="alternate" hreflang="${x}" href="${url(x)}">`).join("")+`<link rel="alternate" hreflang="x-default" href="${url("en")}">`;
for(const l of LG){const c=C[l];let h=src.replace('<html lang="en">',`<html lang="${l}" dir="${l=="fa"?"rtl":"ltr"}" data-b="${l=="en"||FLAT?"":"../"}"${FLAT?' data-x=".html"':""}>`);
 const ld={"@context":"https://schema.org","@graph":[{"@type":"WebApplication",name:"Physioultant",alternateName:c.alt,url:url(l),description:c.desc,inLanguage:l,applicationCategory:"HealthApplication",operatingSystem:"Any (web browser)",isAccessibleForFree:true,offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},author:{"@type":"Person",name:"Iman Kiani",url:"https://imankiani.com/"}},{"@type":"FAQPage",inLanguage:l,mainEntity:c.faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}]};
 const og=(p,v)=>`<meta property="${p}" content="${esc(v)}">`,tw=(n,v)=>`<meta name="twitter:${n}" content="${esc(v)}">`;
 const head=`<title>${esc(c.title)}</title><meta name="description" content="${esc(c.desc)}"><link rel="canonical" href="${url(l)}">${alts}<meta name="robots" content="index,follow,max-image-preview:large">`
 +og("og:type","website")+og("og:site_name","Physioultant")+og("og:title",c.title)+og("og:description",c.desc)+og("og:url",url(l))+og("og:locale",c.locale)+LG.filter(x=>x!=l).map(x=>og("og:locale:alternate",C[x].locale)).join("")
 +(hasOg?og("og:image",SITE+"/og.png")+og("og:image:alt","Physioultant – "+c.alt):"")+tw("card",hasOg?"summary_large_image":"summary")+tw("title",c.title)+tw("description",c.desc)+(hasOg?tw("image",SITE+"/og.png"):"")
 +(process.env.GSC_TOKEN?`<meta name="google-site-verification" content="${esc(process.env.GSC_TOKEN)}">`:"")+`<link rel="preload" href="anat-m-f.webp" as="image" type="image/webp"><meta name="theme-color" content="#0b6f6b"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🩺%3C/text%3E%3C/svg%3E">`
 +`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g,"\\u003c")}</script>`;
 const seo=`<article class="seo"><h2>${esc(c.h2)}</h2><p>${esc(c.intro)}</p><h3>${esc(c.hs)}</h3><ol>${c.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><h3>${esc(c.ha)}</h3><p>${esc(c.areas)}</p><h3>${esc(c.hf)}</h3>${c.faq.map(([q,a])=>`<h4>${esc(q)}</h4><p>${esc(a)}</p>`).join("")}<p class="warn">${esc(c.disc)}</p></article>`;
 h=h.replace(/<title>[^<]*<\/title>/,head).replace("<!--SEO-->",seo);
 if(es)h=h.replace(/<style>([\s\S]*?)<\/style>/,(m,s)=>"<style>"+es.transformSync(s,{loader:"css",minify:true}).code+"</style>").replace(/<script>([\s\S]*?)<\/script>/,(m,s)=>"<script>"+es.transformSync(s,{minify:true}).code+"</script>");
 h=h.replace(/>\s+</g,"><");
 const js=h.match(/<script>([\s\S]*?)<\/script>/)[1],hash=crypto.createHash("sha256").update(js).digest("base64");
 h=h.replace('<meta charset="utf-8">',`<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'sha256-${hash}'; style-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; form-action 'none'">`);
 const f=FLAT?path.join(out,l=="en"?"index.html":l+".html"):path.join(out,l=="en"?"":l,"index.html");fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,h);
 const gz=zlib.gzipSync(h).length;console.log(f,(h.length/1024).toFixed(1)+" KB raw,",(gz/1024).toFixed(1)+" KB gzip");
 if(gz>BUDGET_GZ){console.error("PERF BUDGET EXCEEDED");process.exit(1)}}
fs.writeFileSync(out+"/sitemap.xml",`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`+LG.map(l=>`<url><loc>${url(l)}</loc><lastmod>${today}</lastmod>${alts.replace(/<link /g,"<xhtml:link ").replace(/>/g," />")}</url>`).join("")+`</urlset>`);
fs.writeFileSync(out+"/robots.txt",`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(out+"/_headers","/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n/*.png\n  Cache-Control: public, max-age=31536000, immutable\n");
fs.writeFileSync(out+"/.nojekyll","");if(!/github\.io$/.test(new URL(SITE).hostname))fs.writeFileSync(out+"/CNAME",new URL(SITE).hostname+"\n");if(hasOg)fs.copyFileSync("assets/og.png",out+"/og.png");for(const f of fs.readdirSync("assets"))if(/^anat-.*\.webp$/.test(f))fs.copyFileSync("assets/"+f,out+"/"+f);
console.log("OK ->",out);
