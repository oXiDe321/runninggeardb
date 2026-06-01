// lib/best-pages.ts
// Config for programmatic "best for" landing pages at /best/[category].
// Each entry drives generateStaticParams, generateMetadata, the Supabase
// filter, the intro copy, FAQ schema, and buying guide.

export interface BestPageFilter {
  discipline?: string;
  carbon_plate?: boolean;
  drop_lte?: number;
  drop_gte?: number;
  stack_heel_gte?: number;
  weight_lte?: number;
}

export interface BestPageFaq {
  q: string;
  a: string;
}

export interface BestPageConfig {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;          // 50-60 word answer for AI Overview / featured snippet
  buyingGuide: string;    // 100-150 word bottom section
  filter: BestPageFilter;
  faqs: BestPageFaq[];
}

export const BEST_PAGES: BestPageConfig[] = [
  {
    slug: 'trail-running-shoes',
    metaTitle: 'Best Trail Running Shoes 2026 — Ranked by Spec Data',
    metaDescription: 'The best trail running shoes ranked by drop, stack height, weight, and grip. Real spec data across every model — filter to match your terrain and distance.',
    h1: 'Best Trail Running Shoes',
    intro: 'The best trail running shoes in 2026 combine aggressive grip, protective rock plates, and a drop of 4–8mm for technical terrain. For most trail runners, the Salomon Speedcross and HOKA Speedgoat class offer the best balance of traction, cushioning, and weight. Check full specs and compare models below.',
    buyingGuide: 'Trail running shoes differ from road shoes in three key dimensions: lug depth (3–6mm for grip on loose terrain), rock plate protection (essential for rocky or technical ground), and stack height. For ultra distances (50km+), prioritise cushioning — stack heel >33mm helps reduce fatigue. For shorter, faster races, lighter shoes (<250g) with responsive midsoles are faster. Drop preference is personal: most trail runners run 4–8mm, but if you transitioned from minimalist shoes, look for 0–4mm options.',
    filter: { discipline: 'trail' },
    faqs: [
      { q: 'What heel drop is best for trail running?', a: 'Most trail runners prefer 4–8mm drop, which balances heel cushioning with a more natural footstrike. Technical runners who have transitioned from minimalist running may prefer 0–4mm. Higher drop (10mm+) suits runners who heel-strike and want maximum cushioning on long ultras.' },
      { q: 'Do I need a rock plate for trail running?', a: 'A rock plate is strongly recommended for rocky, technical terrain. It protects the forefoot from sharp rocks without significantly adding weight. For smooth, groomed trails you can skip it, but for anything alpine or rocky, a rock plate prevents bruising and fatigue.' },
      { q: 'How much do trail running shoes typically weigh?', a: 'Trail running shoes typically weigh 240–310g. Race-oriented shoes come in at 200–250g; well-cushioned ultra shoes range from 270–320g. For reference, our database shows the lightest models at around 200g and the most cushioned at 320g+.' },
      { q: 'What lug depth do I need for muddy terrain?', a: 'For muddy conditions, look for lugs of 5–6mm depth with wide spacing to shed mud. Shallower lugs (3–4mm) are better for hard-packed trails and mixed surfaces. Salomon\'s 4mm and HOKA\'s 5mm lugs are popular compromises for varied terrain.' },
    ],
  },
  {
    slug: 'road-running-shoes',
    metaTitle: 'Best Road Running Shoes 2026 — Compared by Weight, Drop & Price',
    metaDescription: 'Best road running shoes for every runner — from daily trainers to marathon racers. Full spec data: drop, stack height, weight, price. Filter and compare.',
    h1: 'Best Road Running Shoes',
    intro: 'The best road running shoes for 2026 span daily trainers (high cushion, 8–12mm drop) to carbon-plated racers (low weight, <230g, carbon plate). For most runners, a 8–10mm drop daily trainer in the 260–290g range offers the best combination of comfort, durability, and affordability. Carbon plate race shoes are worth it for sub-4 hour marathons.',
    buyingGuide: 'Road running shoes are primarily differentiated by cushioning level, drop, and whether they include a carbon plate. Daily trainers prioritise durability and comfort — look for stack heights of 28–36mm and weights of 260–300g. For marathon racing, carbon-plated shoes with high stack heights (36–40mm forefoot) and low weight (<230g) deliver measurable performance gains. Drop is the most personal variable: new runners often do well starting at 8–10mm and reducing over time.',
    filter: { discipline: 'road' },
    faqs: [
      { q: 'What is a good heel-to-toe drop for road running?', a: 'Most road runners do well with 8–10mm drop, which supports a heel-strike pattern common in recreational runners. Experienced runners transitioning to a midfoot strike often prefer 4–6mm. Zero-drop shoes require a long adaptation period and are best reserved for experienced minimalist runners.' },
      { q: 'Are carbon plate road shoes worth it?', a: 'Carbon plate shoes are worth it if you race marathons or half marathons and are aiming for a time goal. Studies show 4–6% energy return improvement. They\'re not designed for daily training — the carbon plate degrades quickly and they\'re too responsive for easy runs.' },
      { q: 'What stack height is considered max cushion for road running?', a: 'Max cushion road shoes typically have stack heights of 36–45mm at the heel. HOKA\'s Clifton and Bondi series and the New Balance More v4 are the most popular max-cushion options. These are ideal for long easy runs, recovery runs, and runners with joint issues.' },
    ],
  },
  {
    slug: 'hyrox-shoes',
    metaTitle: 'Best Hyrox Shoes 2026 — Spec Comparison for Sled, Ski & Running',
    metaDescription: 'Best shoes for Hyrox competitions. Compare drop, weight, and stability for running, sled push, ski erg, and burpees. Full spec data from our database.',
    h1: 'Best Hyrox Shoes',
    intro: 'The best Hyrox shoes in 2026 need to handle both running and functional fitness stations (sled push, ski erg, burpees). That means a firm, stable midsole with 4–8mm drop, a wide toe box for stability under load, and enough cushioning for the 8km run component. Dedicated cross-training shoes often outperform pure running shoes for Hyrox.',
    buyingGuide: 'Hyrox-specific footwear requirements differ from pure road or trail running: the sled push requires forefoot grip and lateral stability; the ski erg needs a stable platform; burpees need a firm, responsive forefoot. A 4–6mm drop balanced shoe with a wide base tends to outperform traditional running shoes. Weight matters less than in pure road racing — prioritise stability and grip. Shoes with carbon plates are generally not recommended for Hyrox, as the rocker geometry makes functional movement awkward.',
    filter: { discipline: 'hyrox' },
    faqs: [
      { q: 'Can I use regular running shoes for Hyrox?', a: 'You can, but cross-training shoes typically perform better. Regular running shoes have curved rocker geometry that\'s awkward for sled pushes and lateral movements. A flatter, more stable platform with 4–6mm drop handles both the run segments and functional stations better.' },
      { q: 'What drop is best for Hyrox shoes?', a: 'A 4–6mm drop is ideal for Hyrox — low enough for a natural, powerful push through the functional stations, but not so low that it stresses the Achilles during the run segments. Avoid 0mm drop unless you\'re already adapted to minimalist shoes.' },
    ],
  },
  {
    slug: 'zero-drop-running-shoes',
    metaTitle: 'Best Zero Drop Running Shoes 2026 — 0mm Drop Shoes Compared',
    metaDescription: 'Best zero drop (0mm) running shoes ranked by weight, cushioning, and terrain. Full spec data. Find the right zero-drop shoe for trail, road, or ultra.',
    h1: 'Best Zero Drop Running Shoes',
    intro: 'Zero drop running shoes (0mm heel-to-toe differential) position your foot level with the ground, promoting a natural forefoot or midfoot strike. The best zero-drop shoes in 2026 include options from Altra and Topo Athletic across trail and road disciplines. Important: transitioning to zero-drop requires a 6–12 week adaptation period to avoid Achilles injury.',
    buyingGuide: 'Zero-drop running encourages a more natural footstrike but requires careful adaptation — don\'t switch immediately from 10mm+ shoes. The key specs to compare in zero-drop shoes are cushioning (stack height), toe box width, and weight. Altra is the dominant brand in this space with proprietary "FootShape" wide toe boxes; Topo Athletic offers slightly narrower options. Stack heights vary widely — from minimal (20mm) to max-cushion (32mm+) — so you can get all the cushioning you want with zero differential.',
    filter: { drop_lte: 0 },
    faqs: [
      { q: 'How do I transition to zero drop running shoes?', a: 'Transition over 6–12 weeks by starting with short runs (20–30% of normal volume) in zero-drop shoes and gradually increasing. Your calves and Achilles tendons need time to adapt. Running gait drills (cadence, forward lean) help the transition. Do not switch cold turkey from high-drop shoes.' },
      { q: 'Are zero drop shoes better for running?', a: 'Zero drop shoes are neither better nor worse — they suit runners who prefer a natural forefoot or midfoot strike pattern. Many ultrarunners prefer them for long distances. However, runners accustomed to higher drops should not switch without a careful transition period.' },
      { q: 'Do zero drop shoes help plantar fasciitis?', a: 'Evidence is mixed. Some runners find zero-drop shoes help by strengthening foot muscles over time; others find the increased calf load aggravates Achilles issues. Consult a physio before switching if you\'re managing plantar fasciitis.' },
    ],
  },
  {
    slug: 'low-drop-running-shoes',
    metaTitle: 'Best Low Drop Running Shoes 2026 — 0–4mm Drop Compared',
    metaDescription: 'Best low drop running shoes (0–4mm) ranked by weight and cushioning. Compare trail and road options. Full spec data including stack height and weight.',
    h1: 'Best Low Drop Running Shoes (0–4mm)',
    intro: 'Low drop running shoes (0–4mm) promote a midfoot or forefoot strike and are popular with experienced runners and those moving away from high-heel-drop shoes. The 1–4mm range offers a balance between natural footstrike mechanics and enough heel cushioning for adaptation. Most trail running shoes and minimalist-influenced road shoes fall in this range.',
    buyingGuide: 'Low drop shoes (0–4mm) are a middle ground between minimalist (0mm) and standard (8–12mm) running shoes. They work well for runners who have already adapted to 4–6mm drop and want to reduce further. The key is to check stack height alongside drop — a low-drop shoe with 32mm+ of cushioning (like many Altra models) is far more forgiving than a minimal-stack low-drop shoe. Look at weight as a secondary concern: most dedicated low-drop models are already built for performance.',
    filter: { drop_lte: 4 },
    faqs: [
      { q: 'What is the difference between zero drop and low drop?', a: 'Zero drop shoes have exactly 0mm differential between heel and forefoot. Low drop is generally considered 1–4mm. In practice, the feel and mechanics are very similar — both encourage a more natural footstrike. The 1–4mm range provides slightly more Achilles relief for runners still adapting.' },
      { q: 'Are low drop shoes good for beginners?', a: 'Low drop shoes are generally not recommended for beginners who have been running in standard 8–12mm drop shoes. The transition requires calves and Achilles tendons to work harder. If you\'re new to running, start with 6–8mm drop and transition down over several months.' },
    ],
  },
  {
    slug: 'max-cushion-running-shoes',
    metaTitle: 'Best Max Cushion Running Shoes 2026 — High Stack Height Compared',
    metaDescription: 'Best max cushion running shoes with 35mm+ stack height. Compare HOKA, Brooks, New Balance and more by stack height, drop, weight, and price.',
    h1: 'Best Max Cushion Running Shoes',
    intro: 'Max cushion running shoes feature stack heights of 35mm or more at the heel, providing the most shock absorption available. They are ideal for long slow distance, recovery runs, and runners with joint issues or high mileage weeks. HOKA pioneered the category and remains the benchmark, but every major brand now has a competitive offering.',
    buyingGuide: 'Max cushion shoes are defined by stack height (35mm+ heel), not drop. The drop in max-cushion shoes ranges from 4mm (HOKA Clifton) to 10mm+ (Brooks Ghost). The high stack doesn\'t mean the shoe is soft — most max-cushion modern shoes use responsive foam that returns energy while absorbing impact. Weight is the trade-off: max-cushion shoes are typically 290–340g, heavier than performance trainers. Use them for easy days, long runs, and recovery — not for speed sessions where you want ground feel.',
    filter: { stack_heel_gte: 35 },
    faqs: [
      { q: 'What is considered max cushion in running shoes?', a: 'Max cushion shoes typically have a heel stack height of 35mm or more. HOKA defines the category with the Bondi (40mm+), followed by the Clifton (37mm). New Balance More, Brooks Glycerin, and ASICS Nimbus all compete in the 35–40mm stack range.' },
      { q: 'Are max cushion shoes good for marathon running?', a: 'Max cushion shoes are excellent for marathon running if you\'re not chasing a time goal. They reduce fatigue over long distances. For competitive times (sub-3:30), a lighter, more responsive shoe — potentially carbon-plated — will be faster, even though it\'s less cushioned.' },
      { q: 'Do high stack shoes cause more injuries?', a: 'There\'s no strong evidence that high stack shoes cause more injuries. The main concern is stability — very high stacks can feel wobbly and may be problematic for runners with ankle instability. Look for max-cushion shoes with a wide base and stability features if this is a concern.' },
    ],
  },
  {
    slug: 'carbon-plate-running-shoes',
    metaTitle: 'Best Carbon Plate Running Shoes 2026 — Race Shoes Compared',
    metaDescription: 'Best carbon plate running shoes ranked by weight, stack height, and price. Compare Nike Vaporfly, Adidas Adizero, HOKA, and more with full spec data.',
    h1: 'Best Carbon Plate Running Shoes',
    intro: 'Carbon plate running shoes combine a stiff carbon fibre plate with highly responsive foam to return energy and propel you forward. Studies show 4–6% running economy improvement. The best carbon plate shoes in 2026 weigh under 220g, have stack heights of 36–40mm (forefoot), and are designed for race day — not daily training.',
    buyingGuide: 'Carbon plate shoes are race-day tools, not daily trainers. Using them for all your runs will degrade the carbon plate and foam faster, and their highly responsive, rockered geometry can strain the Achilles on easy days. Reserve them for races and key workouts. Key specs: look for weight under 220g for optimal performance; stack height of 36–42mm (forefoot) for energy return; and an 8mm or lower drop for efficient carbon plate leverage. Price ranges from $180–$280 for top-tier models.',
    filter: { carbon_plate: true },
    faqs: [
      { q: 'How much does a carbon plate improve running performance?', a: 'Research shows 4–6% improvement in running economy with carbon plate shoes, which translates to roughly 3–5 minutes off a marathon time. The effect is larger for longer races (marathon vs 5K) because the energy savings compound over more strides.' },
      { q: 'How long do carbon plate running shoes last?', a: 'Carbon plate shoes typically last 300–500km (200–300 miles), significantly less than standard trainers (600–800km). The foam degrades faster than the plate, losing responsiveness. Use them for races and tempo workouts only to maximise lifespan.' },
      { q: 'Can beginners wear carbon plate shoes?', a: 'Yes, but the highly responsive, rockered geometry can feel unstable if you\'re not used to it. Beginners who heel-strike heavily may trip on the aggressive rocker. It\'s worth running in them a few times before race day to adapt to the feel.' },
    ],
  },
  {
    slug: 'lightweight-trail-shoes',
    metaTitle: 'Best Lightweight Trail Running Shoes 2026 — Under 255g',
    metaDescription: 'Lightest trail running shoes (under 255g / 9oz) ranked by weight, drop, and grip. Compare spec data for fast trail racing and FKT attempts.',
    h1: 'Best Lightweight Trail Running Shoes (Under 255g)',
    intro: 'The lightest trail running shoes weigh under 255g (9oz) and are designed for fast trail racing, FKTs, and competitive runners who prioritise speed over cushioning. They typically sacrifice some protection and cushioning for weight savings. Most feature 4–8mm drop, 4–5mm lugs, and minimal but present rock protection.',
    buyingGuide: 'Lightweight trail shoes trade cushioning for speed. The lightest race-day trail shoes come in at 190–230g — these are not everyday trainers. The key trade-offs: less cushioning (stack heights of 20–30mm vs 33–38mm in cushioned shoes), thinner upper materials, and sometimes no rock plate. Use them for race day and fast workouts. For anything over 50km or on particularly rocky terrain, the weight savings may not outweigh the increased fatigue and bruising risk from reduced protection.',
    filter: { discipline: 'trail', weight_lte: 255 },
    faqs: [
      { q: 'What is considered a lightweight trail running shoe?', a: 'Trail running shoes under 255g (9oz in a men\'s US9) are generally considered lightweight. Race-oriented shoes come in at 200–240g; everyday trail shoes are typically 260–310g. The weight rating is for one shoe — manufacturers usually quote per-shoe weight in the lightest size.' },
      { q: 'Are lighter trail shoes faster?', a: 'Yes, to a degree. Research suggests every 100g reduction in footwear weight improves running economy by about 1%. However, less cushioning increases fatigue over long distances, which can negate the weight advantage. For races over 50km, moderate weight with more cushioning often wins.' },
    ],
  },
  {
    slug: 'parkrun-shoes',
    metaTitle: 'Best Parkrun Shoes 2026 — 5K Road Shoes Compared',
    metaDescription: 'Best shoes for parkrun: lightweight, responsive 5K road shoes compared by weight, drop, and price. Find the right shoe for your weekly 5K.',
    h1: 'Best Parkrun Shoes',
    intro: 'The best parkrun shoes balance responsiveness for 5K pace with enough cushioning for weekly use. Most park runners do well with a lightweight daily trainer or tempo shoe — 240–270g, 6–10mm drop, and a responsive (not too soft) midsole. Carbon plate race shoes are overkill unless you\'re chasing a PB.',
    buyingGuide: 'Parkrun is a 5K run on grass, tarmac, or mixed terrain depending on the course. The ideal shoe depends on your goals: casual runners and those focused on completing it are well-served by any comfortable daily trainer. Runners chasing PBs benefit from a lightweight responsive trainer (240–260g) or a tempo shoe. Only bother with carbon plate shoes if you\'re genuinely racing for a PB — for most park runners, the extra cost and stiffness isn\'t worth it.',
    filter: { discipline: 'parkrun' },
    faqs: [
      { q: 'Can I wear trail shoes for parkrun?', a: 'Yes, especially for grass-heavy or muddy courses. Trail shoes provide better grip on wet grass than road shoes. However, for tarmac or firm paths, road shoes are faster and more comfortable. Check your local parkrun\'s typical surface before deciding.' },
      { q: 'What is a good weight for a parkrun shoe?', a: 'For casual parkrun, any shoe up to 300g is fine. For faster parkrunners chasing PBs, a shoe under 260g with a responsive midsole (not too soft) will feel noticeably faster. The lightest performance options come in at 200–230g.' },
    ],
  },
  {
    slug: 'road-to-trail-shoes',
    metaTitle: 'Best Road-to-Trail Running Shoes 2026 — Versatile Hybrid Shoes',
    metaDescription: 'Best road-to-trail running shoes: hybrid shoes that work on both tarmac and light trails. Full spec comparison by weight, drop, and grip.',
    h1: 'Best Road-to-Trail Running Shoes',
    intro: 'Road-to-trail running shoes handle both tarmac and light trail without needing to change shoes. They feature moderate lugs (3–4mm) for light grip on trails while remaining comfortable on roads. The best models in 2026 weigh 250–280g and work for commuter runners, mixed-terrain events, and runners who\'d rather own one shoe than two.',
    buyingGuide: 'Road-to-trail shoes compromise between trail grip and road comfort. The lugs are shallower than dedicated trail shoes (3–4mm vs 5–6mm) and the midsole is firmer than pure road shoes for trail stability. If your running is 80%+ tarmac, go with a road shoe. If it\'s 80%+ trail, go with a trail shoe. Road-to-trail makes most sense for mixed training routes, commuting through parks, or adventure races where surfaces vary.',
    filter: { discipline: 'road-to-trail' },
    faqs: [
      { q: 'What is the difference between trail and road-to-trail shoes?', a: 'Road-to-trail shoes have shallower lugs (3–4mm vs 5–6mm on trail shoes), softer midsoles, and lighter construction. They handle light gravel, grass, and packed dirt well but struggle on loose, muddy, or rocky technical terrain where dedicated trail shoes are needed.' },
    ],
  },
];

export function getBestPage(slug: string): BestPageConfig | undefined {
  return BEST_PAGES.find((p) => p.slug === slug);
}
