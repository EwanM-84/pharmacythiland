import type { Category, Product } from "@/types";

const now = new Date().toISOString();

const imgKeywords = [
  "pills,tablets,medicine",
  "pharmacy,bottles,medicine",
  "capsules,supplements,health",
  "vitamins,healthcare,medicine",
  "cream,ointment,skincare",
  "syrup,liquid,medicine",
  "inhaler,respiratory,medicine",
  "injection,vaccine,medical",
  "eyedrops,optic,medicine",
  "baby,pediatric,medicine",
  "allergy,antihistamine,medicine",
  "sleep,wellness,health",
];

function img(seed: string) {
  const hash = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const keywords = imgKeywords[hash % imgKeywords.length];
  return `https://loremflickr.com/400/400/${keywords}?lock=${hash}`;
}

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Pain Relief", slug: "pain-relief", description: "Analgesics and pain management", image_url: null, parent_id: null, sort_order: 1, created_at: now },
  { id: "cat-2", name: "Vitamins & Supplements", slug: "vitamins", description: "Vitamins, minerals and supplements", image_url: null, parent_id: null, sort_order: 2, created_at: now },
  { id: "cat-3", name: "Cold & Flu", slug: "cold-flu", description: "Cold, flu and respiratory relief", image_url: null, parent_id: null, sort_order: 3, created_at: now },
  { id: "cat-4", name: "Skincare", slug: "skincare", description: "Skin treatments and moisturisers", image_url: null, parent_id: null, sort_order: 4, created_at: now },
  { id: "cat-5", name: "Digestive Health", slug: "digestion", description: "Antacids, probiotics and gut health", image_url: null, parent_id: null, sort_order: 5, created_at: now },
  { id: "cat-6", name: "Heart & Blood Pressure", slug: "heart", description: "Cardiovascular medications", image_url: null, parent_id: null, sort_order: 6, created_at: now },
  { id: "cat-7", name: "Diabetes Care", slug: "diabetes", description: "Diabetes management and testing", image_url: null, parent_id: null, sort_order: 7, created_at: now },
  { id: "cat-8", name: "Antibiotics", slug: "antibiotics", description: "Prescription antibiotics", image_url: null, parent_id: null, sort_order: 8, created_at: now },
  { id: "cat-9", name: "Baby & Child", slug: "baby", description: "Safe medications for children", image_url: null, parent_id: null, sort_order: 9, created_at: now },
  { id: "cat-10", name: "Eye & Ear Care", slug: "eye-ear", description: "Eye drops, ear treatments", image_url: null, parent_id: null, sort_order: 10, created_at: now },
  { id: "cat-11", name: "Allergy", slug: "allergy", description: "Antihistamines and allergy relief", image_url: null, parent_id: null, sort_order: 11, created_at: now },
  { id: "cat-12", name: "Sleep & Wellness", slug: "sleep", description: "Sleep aids and wellness products", image_url: null, parent_id: null, sort_order: 12, created_at: now },
];

const catMap = Object.fromEntries(mockCategories.map((c) => [c.id, c]));

function p(
  id: string,
  name: string,
  slug: string,
  catId: string,
  price: number,
  comparePrice: number | null,
  stock: number,
  rating: number,
  reviews: number,
  rx: boolean,
  seed: string,
  short: string,
  tags: string[] = []
): Product {
  return {
    id,
    name,
    slug,
    description: short,
    short_description: short,
    sku: `SKU-${id.toUpperCase()}`,
    barcode: null,
    price,
    cost_price: null,
    compare_price: comparePrice,
    stock_qty: stock,
    low_stock_threshold: 5,
    category_id: catId,
    category: catMap[catId],
    images: [img(seed), img(`${seed}-2`)],
    tags,
    requires_prescription: rx,
    is_active: true,
    created_at: now,
    updated_at: now,
    avg_rating: rating,
    review_count: reviews,
  };
}

export const mockProducts: Product[] = [
  // ── Pain Relief ──────────────────────────────────────────────
  p("pr-1","Paracetamol 500mg Tablets × 24","paracetamol-500mg","cat-1",45,null,240,4.8,1842,false,"pharma-paracetamol","Fast-acting paracetamol for headaches, fever and mild pain. Suitable for adults and children over 12.",["pain","headache","fever"]),
  p("pr-2","Ibuprofen 400mg Tablets × 24","ibuprofen-400mg","cat-1",65,85,180,4.7,1203,false,"pharma-ibuprofen","Anti-inflammatory relief for pain, fever and swelling. Effective within 30 minutes.",["pain","inflammation","fever"]),
  p("pr-3","Aspirin 75mg Enteric Coated × 56","aspirin-75mg","cat-1",85,110,95,4.6,864,false,"pharma-aspirin","Low-dose aspirin for heart health maintenance. Enteric coated to protect the stomach.",["heart","pain","blood-thinning"]),
  p("pr-4","Naproxen 250mg Tablets × 12","naproxen-250mg","cat-1",120,155,60,4.5,432,false,"pharma-naproxen","Long-lasting 12-hour pain relief for arthritis, back pain and period pain.",["pain","arthritis","backpain"]),
  p("pr-5","Co-Codamol 8/500mg Tablets × 32","co-codamol-8-500mg","cat-1",180,220,40,4.6,328,true,"pharma-cocodamol","Combination paracetamol and codeine for moderate to severe pain.",["pain","prescription","codeine"]),
  p("pr-6","Tramadol 50mg Capsules × 30","tramadol-50mg","cat-1",280,350,20,4.4,218,true,"pharma-tramadol","Opioid analgesic for moderate to moderately severe pain. Prescription required.",["pain","opioid","prescription"]),
  p("pr-7","Voltaren Emulgel 100g","voltaren-gel-100g","cat-1",220,280,85,4.9,2104,false,"pharma-voltarengel","Topical diclofenac gel for local joint and muscle pain. Fast penetrating formula.",["pain","topical","joint"]),
  p("pr-8","Deep Heat Maximum Strength Spray 150ml","deep-heat-spray","cat-1",195,245,120,4.6,987,false,"pharma-deepheat","Warming pain relief spray for muscle and joint stiffness. Instant targeted relief.",["pain","muscle","topical"]),

  // ── Vitamins & Supplements ───────────────────────────────────
  p("vi-1","Vitamin C 1000mg with Zinc × 60","vitamin-c-1000mg-zinc","cat-2",185,240,320,4.9,3421,false,"pharma-vitc","High-strength vitamin C plus zinc for immune support and antioxidant protection.",["vitamin","immune","zinc"]),
  p("vi-2","Vitamin D3 4000IU Softgels × 90","vitamin-d3-4000iu","cat-2",290,360,280,4.8,2876,false,"pharma-vitd","Premium vitamin D3 for bone health, immune function and mood support.",["vitamin","bone","immune"]),
  p("vi-3","Vitamin B Complex × 60","vitamin-b-complex","cat-2",150,190,195,4.7,1654,false,"pharma-vitb","Complete B vitamin complex including B1, B2, B3, B5, B6, B7, B9 and B12.",["vitamin","energy","nervous-system"]),
  p("vi-4","Omega-3 Fish Oil 1000mg × 90","omega-3-1000mg","cat-2",395,480,165,4.8,2198,false,"pharma-omega3","Triple-strength omega-3 from sustainable sources for heart, brain and joint health.",["omega","heart","brain"]),
  p("vi-5","Magnesium 375mg × 60","magnesium-375mg","cat-2",240,300,142,4.7,1087,false,"pharma-magnesium","High-absorption magnesium for muscle relaxation, sleep and nervous system support.",["mineral","sleep","muscle"]),
  p("vi-6","Zinc 25mg × 60","zinc-25mg","cat-2",120,150,210,4.6,934,false,"pharma-zinc","Elemental zinc for immune defence, skin health and wound healing.",["mineral","immune","skin"]),
  p("vi-7","Iron 210mg Ferrous Sulphate × 84","iron-210mg","cat-2",175,215,178,4.5,743,false,"pharma-iron","High-strength iron supplement for the treatment and prevention of iron deficiency anaemia.",["mineral","anaemia","energy"]),
  p("vi-8","Complete Multivitamin & Mineral × 60","complete-multivitamin","cat-2",340,420,235,4.8,1876,false,"pharma-multi","Comprehensive daily multivitamin with 24 essential nutrients for overall health.",["vitamin","multi","daily"]),

  // ── Cold & Flu ───────────────────────────────────────────────
  p("cf-1","Day Nurse Cold & Flu Tablets × 24","day-nurse-tablets","cat-3",145,180,140,4.7,1243,false,"pharma-daynurse","Non-drowsy cold and flu relief with paracetamol, decongestant and cough suppressant.",["cold","flu","day"]),
  p("cf-2","Night Nurse Cold & Flu Liquid 160ml","night-nurse-liquid","cat-3",195,240,95,4.8,987,false,"pharma-nightnurse","Night-time cold and flu relief for uninterrupted restful sleep.",["cold","flu","night","sleep"]),
  p("cf-3","Sudafed Blocked Nose Spray 15ml","sudafed-nasal-spray","cat-3",185,230,88,4.6,834,false,"pharma-sudafed","Fast nasal decongestant spray for instant blocked nose relief. Works in seconds.",["cold","nasal","decongestant"]),
  p("cf-4","Covonia Chesty Cough Syrup 150ml","covonia-cough-syrup","cat-3",165,200,107,4.5,621,false,"pharma-covonia","Expectorant syrup to loosen and clear chesty coughs. Liquorice flavour.",["cough","chest","expectorant"]),
  p("cf-5","Strepsils Honey & Lemon Lozenges × 36","strepsils-honey-lemon","cat-3",95,120,195,4.8,2341,false,"pharma-strepsils","Antibacterial throat lozenges that kill bacteria causing sore throats. 2-in-1 action.",["sore-throat","antibacterial","lozenge"]),
  p("cf-6","Lemsip Max Cold & Flu Sachets × 10","lemsip-max","cat-3",125,160,162,4.7,1897,false,"pharma-lemsip","Maximum strength lemon hot drink for fast relief of cold and flu symptoms.",["cold","flu","hot-drink"]),

  // ── Skincare ─────────────────────────────────────────────────
  p("sk-1","Hydrocortisone Cream 1% × 30g","hydrocortisone-cream-1pct","cat-4",145,180,75,4.6,634,false,"pharma-hydrocortisone","Mild corticosteroid cream for eczema, dermatitis and insect bite relief.",["skin","eczema","anti-inflammatory"]),
  p("sk-2","Cetraben Emollient Cream 150g","cetraben-cream-150g","cat-4",285,350,92,4.8,1087,false,"pharma-cetraben","Rich moisturising cream for dry, sensitive and eczema-prone skin.",["skin","moisturiser","eczema"]),
  p("sk-3","Canesten Antifungal Cream 30g","canesten-antifungal-30g","cat-4",195,245,68,4.7,876,false,"pharma-canesten","Clotrimazole antifungal cream for athlete's foot, ringworm and skin fungal infections.",["skin","antifungal","infection"]),
  p("sk-4","Acnecide 5% Benzoyl Peroxide Gel 30g","acnecide-5pct-gel","cat-4",340,420,54,4.5,543,false,"pharma-acnecide","Prescription-strength acne gel. Kills acne bacteria and reduces spots in 4 weeks.",["skin","acne","benzoyl-peroxide"]),
  p("sk-5","E45 Moisturising Lotion 500ml","e45-lotion-500ml","cat-4",320,395,113,4.8,2034,false,"pharma-e45","Clinically proven moisturiser for very dry, itchy and sensitive skin conditions.",["skin","moisturiser","dry-skin"]),
  p("sk-6","Dermol 500 Antiseptic Lotion 500ml","dermol-500-lotion","cat-4",380,460,67,4.7,765,false,"pharma-dermol","Antimicrobial emollient lotion for infected or at-risk eczema and dry skin conditions.",["skin","antiseptic","eczema"]),

  // ── Digestive Health ─────────────────────────────────────────
  p("dg-1","Omeprazole 20mg Capsules × 28","omeprazole-20mg","cat-5",185,230,148,4.8,2143,false,"pharma-omeprazole","Proton pump inhibitor for acid reflux, heartburn and stomach ulcers.",["digestion","acid","heartburn"]),
  p("dg-2","Buscopan IBS Relief Tablets × 20","buscopan-ibs","cat-5",175,215,95,4.6,987,false,"pharma-buscopan","Antispasmodic tablets for IBS cramps, spasms and stomach pain. Fast relief.",["digestion","ibs","cramps"]),
  p("dg-3","Imodium Original Capsules × 12","imodium-capsules","cat-5",145,180,127,4.7,1432,false,"pharma-imodium","Loperamide capsules for fast, effective diarrhoea relief. Works in 1 hour.",["digestion","diarrhoea","loperamide"]),
  p("dg-4","Movicol Lemon & Lime Sachets × 20","movicol-sachets","cat-5",320,390,82,4.6,765,false,"pharma-movicol","Osmotic laxative for constipation relief. Gentle, effective and safe for long-term use.",["digestion","constipation","laxative"]),
  p("dg-5","Acidex Advance Suspension 250ml","acidex-suspension","cat-5",145,175,109,4.5,654,false,"pharma-acidex","Alginate antacid for heartburn and acid indigestion. Fast-acting liquid formula.",["digestion","antacid","heartburn"]),
  p("dg-6","Yakult Probiotic Drink × 5 Pack","yakult-5-pack","cat-5",95,null,340,4.8,3214,false,"pharma-yakult","Daily probiotic drinks with 6.5 billion live Lactobacillus casei Shirota bacteria.",["digestion","probiotic","gut-health"]),

  // ── Heart & Blood Pressure ───────────────────────────────────
  p("ht-1","Amlodipine 5mg Tablets × 28","amlodipine-5mg","cat-6",195,240,32,4.7,432,true,"pharma-amlodipine","Calcium channel blocker for high blood pressure and angina. Once-daily dosing.",["heart","blood-pressure","prescription"]),
  p("ht-2","Atenolol 50mg Tablets × 28","atenolol-50mg","cat-6",165,205,28,4.6,387,true,"pharma-atenolol","Beta-blocker for hypertension and angina. Reduces heart rate and blood pressure.",["heart","blood-pressure","prescription"]),
  p("ht-3","Simvastatin 20mg Tablets × 28","simvastatin-20mg","cat-6",215,265,25,4.7,521,true,"pharma-simvastatin","HMG-CoA reductase inhibitor for high cholesterol and cardiovascular risk reduction.",["heart","cholesterol","prescription"]),
  p("ht-4","Lisinopril 10mg Tablets × 28","lisinopril-10mg","cat-6",195,240,30,4.6,398,true,"pharma-lisinopril","ACE inhibitor for hypertension and heart failure. Protects kidneys in diabetics.",["heart","blood-pressure","prescription"]),

  // ── Diabetes Care ────────────────────────────────────────────
  p("db-1","Metformin 500mg Tablets × 56","metformin-500mg","cat-7",245,300,45,4.7,643,true,"pharma-metformin","First-line type 2 diabetes medication. Reduces blood glucose and improves insulin sensitivity.",["diabetes","blood-sugar","prescription"]),
  p("db-2","Accu-Chek Guide Blood Glucose Test Strips × 50","accu-chek-guide-strips","cat-7",450,540,38,4.8,1087,false,"pharma-accuchek","Compatible with Accu-Chek Guide meter. Accurate results in 4 seconds with No-Code technology.",["diabetes","glucose","testing"]),
  p("db-3","OneTouch Ultra Test Strips × 50","onetouch-ultra-strips","cat-7",480,580,29,4.7,876,false,"pharma-onetouch","Designed for OneTouch Ultra meter family. Small sample size, fast and reliable results.",["diabetes","glucose","testing"]),

  // ── Antibiotics ──────────────────────────────────────────────
  p("ab-1","Amoxicillin 500mg Capsules × 21","amoxicillin-500mg","cat-8",195,240,20,4.7,543,true,"pharma-amoxicillin","Broad-spectrum penicillin antibiotic for bacterial infections. Course of 7 days.",["antibiotic","bacterial","prescription"]),
  p("ab-2","Azithromycin 250mg Tablets × 6","azithromycin-250mg","cat-8",285,345,15,4.8,421,true,"pharma-azithromycin","Macrolide antibiotic for respiratory and skin infections. 5-day or 3-day course.",["antibiotic","respiratory","prescription"]),
  p("ab-3","Flucloxacillin 500mg Capsules × 28","flucloxacillin-500mg","cat-8",240,295,18,4.6,387,true,"pharma-flucloxacillin","Penicillinase-resistant penicillin for staphylococcal skin and soft tissue infections.",["antibiotic","skin","prescription"]),

  // ── Baby & Child ─────────────────────────────────────────────
  p("bc-1","Calpol 6+ Suspension 200ml Strawberry","calpol-6plus-200ml","cat-9",185,225,187,4.9,3421,false,"pharma-calpol","Paracetamol suspension for children 6+ for pain and fever. Loved by parents.",["baby","children","paracetamol"]),
  p("bc-2","Nurofen Children 100mg/5ml Suspension 150ml","nurofen-children-150ml","cat-9",195,240,142,4.8,2198,false,"pharma-nurofen-children","Ibuprofen suspension for children 3 months to 12 years. Strawberry flavour.",["baby","children","ibuprofen"]),
  p("bc-3","Infacol Wind Drops 50ml","infacol-wind-drops","cat-9",145,180,215,4.7,1876,false,"pharma-infacol","Simethicone drops for infant colic and wind. Suitable from birth.",["baby","infant","colic"]),
  p("bc-4","Bepanthen Nappy Care Ointment 30g","bepanthen-nappy-30g","cat-9",185,225,163,4.9,2654,false,"pharma-bepanthen","Dexpanthenol ointment to protect and heal nappy rash. Fragrance-free.",["baby","nappy-rash","skin"]),
  p("bc-5","Dentinox Infant Colic Drops 100ml","dentinox-colic-drops","cat-9",125,155,198,4.6,1243,false,"pharma-dentinox","Simethicone drops to relieve infant colic and trapped wind after feeding.",["baby","colic","infant"]),

  // ── Eye & Ear Care ───────────────────────────────────────────
  p("ee-1","Optrex Actimist 2in1 Eye Spray 10ml","optrex-actimist-spray","cat-10",165,205,87,4.7,876,false,"pharma-optrex","Innovative eye spray for dry and tired eyes. Can be used over contact lenses.",["eyes","dry-eyes","spray"]),
  p("ee-2","Viscotears Liquid Gel Eye Drops 10g","viscotears-gel","cat-10",195,240,74,4.8,1087,false,"pharma-viscotears","Carbomer gel drops for persistent dry eye syndrome. Long-lasting lubrication.",["eyes","dry-eyes","gel"]),
  p("ee-3","Otex Ear Drops 8ml","otex-ear-drops","cat-10",185,230,92,4.6,743,false,"pharma-otex","Hydrogen peroxide ear drops for safe and effective earwax removal.",["ears","earwax","drops"]),
  p("ee-4","Chloramphenicol Eye Drops 0.5% 10ml","chloramphenicol-eye-drops","cat-10",165,205,35,4.7,621,true,"pharma-chloramphenicol","Broad-spectrum antibiotic eye drops for bacterial conjunctivitis. Prescription required.",["eyes","infection","antibiotic","prescription"]),

  // ── Allergy ──────────────────────────────────────────────────
  p("al-1","Cetirizine Hydrochloride 10mg × 30","cetirizine-10mg","cat-11",95,120,287,4.8,2876,false,"pharma-cetirizine","Non-drowsy 24-hour antihistamine for hay fever, allergies and urticaria.",["allergy","antihistamine","hay-fever"]),
  p("al-2","Loratadine 10mg × 30","loratadine-10mg","cat-11",85,105,312,4.7,2543,false,"pharma-loratadine","Non-sedating antihistamine for hay fever, skin allergies and allergic rhinitis.",["allergy","antihistamine","hay-fever"]),
  p("al-3","Beconase Hayfever Nasal Spray 200 Doses","beconase-nasal-spray","cat-11",245,300,143,4.6,1234,false,"pharma-beconase","Beclomethasone nasal spray for hayfever and perennial allergic rhinitis.",["allergy","nasal","hayfever"]),
  p("al-4","Piriton Allergy Tablets × 30","piriton-tablets","cat-11",115,145,198,4.6,1654,false,"pharma-piriton","Chlorphenamine antihistamine for skin allergies, hayfever and allergic reactions.",["allergy","antihistamine","skin"]),

  // ── Sleep & Wellness ─────────────────────────────────────────
  p("sw-1","Nytol Original Diphenhydramine 25mg × 20","nytol-original","cat-12",195,245,87,4.5,876,false,"pharma-nytol","Antihistamine sleep aid for temporary insomnia. Promotes restful sleep.",["sleep","insomnia","antihistamine"]),
  p("sw-2","Melatonin 3mg Sleep Support × 60","melatonin-3mg","cat-12",285,350,124,4.7,1432,false,"pharma-melatonin","Natural melatonin supplement to regulate sleep-wake cycle and combat jet lag.",["sleep","melatonin","jet-lag"]),
  p("sw-3","Bach Original Rescue Remedy 20ml","rescue-remedy-20ml","cat-12",295,365,95,4.6,1087,false,"pharma-rescue","Original flower essence blend for stress, anxiety and emotional upset. 100% natural.",["wellness","stress","anxiety"]),
];

export function getProductsByCategory(slug: string): Product[] {
  return mockProducts.filter((p) => p.category?.slug === slug);
}

export function searchProducts(q: string): Product[] {
  const lower = q.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.includes(lower)) ||
      p.category?.name.toLowerCase().includes(lower)
  );
}

export function getFeaturedProducts(limit = 8): Product[] {
  return mockProducts.filter((p) => p.avg_rating! >= 4.7).slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return [...mockProducts]
    .sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0))
    .slice(0, limit);
}

export function getTrending(limit = 8): Product[] {
  return [...mockProducts]
    .sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0))
    .slice(8, 8 + limit);
}

export function getCustomerFavorites(limit = 8): Product[] {
  return mockProducts.filter((p) => (p.avg_rating ?? 0) >= 4.8).slice(0, limit);
}

export function getStaffPicks(limit = 8): Product[] {
  const ids = ["pr-7", "vi-1", "cf-5", "dg-6", "sk-5", "bc-4", "al-1", "sw-2"];
  return ids.map((id) => mockProducts.find((p) => p.id === id)!).filter(Boolean).slice(0, limit);
}

export function getSeasonalEssentials(limit = 8): Product[] {
  return mockProducts.filter((p) => ["cat-3", "cat-11", "cat-2", "cat-9"].includes(p.category_id)).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return mockProducts
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, limit);
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug);
}
