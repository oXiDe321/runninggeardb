// lib/seed-products.ts
// Master product catalog — 30 shoes, 30 vests, 30 gels.
// Specs sourced from manufacturer data. ASINs/images populated via scripts/enrich-amazon.ts

export interface ShoeSeed {
  brand: string; model: string; slug: string; discipline: string;
  drop_mm: number; weight_g: number; price_usd: number; our_rating: number;
  carbon_plate: boolean; rock_plate?: boolean;
  stack_heel_mm?: number; stack_forefoot_mm?: number;
  image_url?: string; amazon_url?: string; published: boolean;
}

export interface VestSeed {
  brand: string; model: string; slug: string;
  capacity_l: number; weight_g: number; price_usd: number; our_rating: number;
  utmb_compliant: boolean;
  image_url?: string; amazon_url?: string; published: boolean;
}

export interface GelSeed {
  brand: string; product: string; slug: string;
  carbs_per_serving_g: number; caffeine_mg: number; sodium_mg: number;
  calories: number; price_per_serving: number;
  our_rating: number; real_food: boolean; format?: string;
  image_url?: string; amazon_url?: string; published: boolean;
}

// ── Shoes (30) ──────────────────────────────────────────────────────
export const SHOES: ShoeSeed[] = [
  // Trail
  { brand: 'HOKA', model: 'Speedgoat 6', slug: 'hoka-speedgoat-6', discipline: 'trail', drop_mm: 7, weight_g: 228, price_usd: 145, our_rating: 4.8, carbon_plate: false, stack_heel_mm: 38, stack_forefoot_mm: 31, published: true },
  { brand: 'Salomon', model: 'Sense Ride 5', slug: 'salomon-sense-ride-5', discipline: 'trail', drop_mm: 8, weight_g: 240, price_usd: 130, our_rating: 4.6, carbon_plate: false, stack_heel_mm: 30, stack_forefoot_mm: 22, published: true },
  { brand: 'Brooks', model: 'Cascadia 17', slug: 'brooks-cascadia-17', discipline: 'trail', drop_mm: 10, weight_g: 248, price_usd: 140, our_rating: 4.5, carbon_plate: false, rock_plate: true, stack_heel_mm: 30, stack_forefoot_mm: 20, published: true },
  { brand: 'Nike', model: 'Pegasus Trail 5', slug: 'nike-pegasus-trail-5', discipline: 'trail', drop_mm: 10, weight_g: 244, price_usd: 120, our_rating: 4.4, carbon_plate: false, stack_heel_mm: 32, stack_forefoot_mm: 22, published: true },
  { brand: 'Saucony', model: 'Peregrine 15', slug: 'saucony-peregrine-15', discipline: 'trail', drop_mm: 4, weight_g: 226, price_usd: 130, our_rating: 4.7, carbon_plate: false, rock_plate: true, stack_heel_mm: 28, stack_forefoot_mm: 24, published: true },
  { brand: 'Altra', model: 'Lone Peak 9+', slug: 'altra-lone-peak-9-plus', discipline: 'trail', drop_mm: 0, weight_g: 254, price_usd: 140, our_rating: 4.5, carbon_plate: false, rock_plate: true, stack_heel_mm: 25, stack_forefoot_mm: 25, published: true },
  { brand: 'La Sportiva', model: 'Bushido III', slug: 'la-sportiva-bushido-iii', discipline: 'trail', drop_mm: 6, weight_g: 250, price_usd: 145, our_rating: 4.4, carbon_plate: false, rock_plate: true, stack_heel_mm: 19, stack_forefoot_mm: 13, published: true },
  { brand: 'Topo Athletic', model: 'Ultraventure 4', slug: 'topo-ultraventure-4', discipline: 'trail', drop_mm: 5, weight_g: 262, price_usd: 150, our_rating: 4.3, carbon_plate: false, stack_heel_mm: 35, stack_forefoot_mm: 30, published: true },
  { brand: 'HOKA', model: 'Challenger 8', slug: 'hoka-challenger-8', discipline: 'trail', drop_mm: 5, weight_g: 238, price_usd: 130, our_rating: 4.2, carbon_plate: false, stack_heel_mm: 33, stack_forefoot_mm: 28, published: true },
  { brand: 'Inov-8', model: 'Trailfly G 270 V3', slug: 'inov8-trailfly-g270-v3', discipline: 'trail', drop_mm: 0, weight_g: 230, price_usd: 150, our_rating: 4.3, carbon_plate: false, stack_heel_mm: 14, stack_forefoot_mm: 14, published: true },
  { brand: 'Nike', model: 'Ultrafly', slug: 'nike-ultrafly', discipline: 'trail', drop_mm: 8, weight_g: 266, price_usd: 240, our_rating: 4.4, carbon_plate: true, stack_heel_mm: 38, stack_forefoot_mm: 30, published: true },
  { brand: 'Salomon', model: 'Speedcross 6', slug: 'salomon-speedcross-6', discipline: 'trail', drop_mm: 10, weight_g: 252, price_usd: 140, our_rating: 4.1, carbon_plate: false, stack_heel_mm: 28, stack_forefoot_mm: 18, published: true },
  // Road
  { brand: 'HOKA', model: 'Clifton 10', slug: 'hoka-clifton-10', discipline: 'road', drop_mm: 5, weight_g: 220, price_usd: 145, our_rating: 4.5, carbon_plate: false, stack_heel_mm: 37, stack_forefoot_mm: 32, published: true },
  { brand: 'On', model: 'Cloudmonster', slug: 'on-cloudmonster', discipline: 'road', drop_mm: 11, weight_g: 264, price_usd: 160, our_rating: 4.7, carbon_plate: true, stack_heel_mm: 35, stack_forefoot_mm: 24, published: true },
  { brand: 'Brooks', model: 'Ghost 17', slug: 'brooks-ghost-17', discipline: 'road', drop_mm: 12, weight_g: 264, price_usd: 140, our_rating: 4.4, carbon_plate: false, stack_heel_mm: 33, stack_forefoot_mm: 21, published: true },
  { brand: 'ASICS', model: 'Gel-Nimbus 27', slug: 'asics-gel-nimbus-27', discipline: 'road', drop_mm: 8, weight_g: 258, price_usd: 160, our_rating: 4.6, carbon_plate: false, stack_heel_mm: 37, stack_forefoot_mm: 29, published: true },
  { brand: 'Saucony', model: 'Endorphin Speed 5', slug: 'saucony-endorphin-speed-5', discipline: 'road', drop_mm: 8, weight_g: 226, price_usd: 170, our_rating: 4.8, carbon_plate: true, rock_plate: false, stack_heel_mm: 36, stack_forefoot_mm: 28, published: true },
  { brand: 'New Balance', model: 'Fresh Foam X 1080v14', slug: 'nb-fresh-foam-1080v14', discipline: 'road', drop_mm: 6, weight_g: 248, price_usd: 160, our_rating: 4.5, carbon_plate: false, stack_heel_mm: 37, stack_forefoot_mm: 31, published: true },
  { brand: 'Nike', model: 'Vomero 18', slug: 'nike-vomero-18', discipline: 'road', drop_mm: 10, weight_g: 262, price_usd: 150, our_rating: 4.3, carbon_plate: false, stack_heel_mm: 38, stack_forefoot_mm: 28, published: true },
  { brand: 'Mizuno', model: 'Wave Rider 29', slug: 'mizuno-wave-rider-29', discipline: 'road', drop_mm: 12, weight_g: 256, price_usd: 140, our_rating: 4.2, carbon_plate: false, stack_heel_mm: 33, stack_forefoot_mm: 21, published: true },
  { brand: 'Brooks', model: 'Glycerin 22', slug: 'brooks-glycerin-22', discipline: 'road', drop_mm: 10, weight_g: 266, price_usd: 160, our_rating: 4.5, carbon_plate: false, stack_heel_mm: 36, stack_forefoot_mm: 26, published: true },
  { brand: 'Nike', model: 'Alphafly 3', slug: 'nike-alphafly-3', discipline: 'road', drop_mm: 8, weight_g: 200, price_usd: 275, our_rating: 4.9, carbon_plate: true, stack_heel_mm: 40, stack_forefoot_mm: 32, published: true },
  { brand: 'Saucony', model: 'Ride 18', slug: 'saucony-ride-18', discipline: 'road', drop_mm: 8, weight_g: 250, price_usd: 140, our_rating: 4.4, carbon_plate: false, stack_heel_mm: 34, stack_forefoot_mm: 26, published: true },
  { brand: 'Adidas', model: 'Adizero Boston 13', slug: 'adidas-boston-13', discipline: 'road', drop_mm: 8, weight_g: 238, price_usd: 150, our_rating: 4.5, carbon_plate: false, rock_plate: true, stack_heel_mm: 36, stack_forefoot_mm: 28, published: true },
  { brand: 'New Balance', model: 'FuelCell Rebel v5', slug: 'nb-fuelcell-rebel-v5', discipline: 'road', drop_mm: 6, weight_g: 210, price_usd: 140, our_rating: 4.6, carbon_plate: false, stack_heel_mm: 32, stack_forefoot_mm: 26, published: true },
  { brand: 'HOKA', model: 'Mach X2', slug: 'hoka-mach-x2', discipline: 'road', drop_mm: 5, weight_g: 232, price_usd: 190, our_rating: 4.7, carbon_plate: true, stack_heel_mm: 39, stack_forefoot_mm: 34, published: true },
  { brand: 'Puma', model: 'Deviate Nitro 3', slug: 'puma-deviate-nitro-3', discipline: 'road', drop_mm: 10, weight_g: 244, price_usd: 160, our_rating: 4.5, carbon_plate: true, stack_heel_mm: 38, stack_forefoot_mm: 28, published: true },
  { brand: 'ASICS', model: 'Superblast 2', slug: 'asics-superblast-2', discipline: 'road', drop_mm: 8, weight_g: 240, price_usd: 200, our_rating: 4.8, carbon_plate: false, stack_heel_mm: 40, stack_forefoot_mm: 32, published: true },
  { brand: 'On', model: 'Cloudsurfer 2', slug: 'on-cloudsurfer-2', discipline: 'road', drop_mm: 10, weight_g: 236, price_usd: 150, our_rating: 4.3, carbon_plate: false, stack_heel_mm: 34, stack_forefoot_mm: 24, published: true },
  { brand: 'Saucony', model: 'Triumph 23', slug: 'saucony-triumph-23', discipline: 'road', drop_mm: 8, weight_g: 268, price_usd: 160, our_rating: 4.4, carbon_plate: false, stack_heel_mm: 38, stack_forefoot_mm: 30, published: true },
  // Parkrun / 5K
  { brand: 'Nike', model: 'Vaporfly 3', slug: 'nike-vaporfly-3', discipline: 'parkrun', drop_mm: 8, weight_g: 184, price_usd: 260, our_rating: 4.9, carbon_plate: true, stack_heel_mm: 40, stack_forefoot_mm: 32, published: true },
  { brand: 'Adidas', model: 'Adizero Adios 9', slug: 'adidas-adizero-adios-9', discipline: 'parkrun', drop_mm: 8, weight_g: 200, price_usd: 130, our_rating: 4.6, carbon_plate: false, stack_heel_mm: 28, stack_forefoot_mm: 20, published: true },
  { brand: 'ASICS', model: 'Novablast 5', slug: 'asics-novablast-5', discipline: 'parkrun', drop_mm: 8, weight_g: 228, price_usd: 140, our_rating: 4.7, carbon_plate: false, stack_heel_mm: 40, stack_forefoot_mm: 32, published: true },
  { brand: 'Saucony', model: 'Kinvara 15', slug: 'saucony-kinvara-15', discipline: 'parkrun', drop_mm: 4, weight_g: 190, price_usd: 120, our_rating: 4.5, carbon_plate: false, stack_heel_mm: 29, stack_forefoot_mm: 25, published: true },
  // Hyrox
  { brand: 'Puma', model: 'Velocity Nitro 3', slug: 'puma-velocity-nitro-3', discipline: 'hyrox', drop_mm: 10, weight_g: 244, price_usd: 120, our_rating: 4.4, carbon_plate: false, stack_heel_mm: 34, stack_forefoot_mm: 24, published: true },
  { brand: 'Inov-8', model: 'F-Fly 280', slug: 'inov8-f-fly-280', discipline: 'hyrox', drop_mm: 8, weight_g: 210, price_usd: 140, our_rating: 4.3, carbon_plate: false, stack_heel_mm: 26, stack_forefoot_mm: 18, published: true },
  { brand: 'Reebok', model: 'Nano X5', slug: 'reebok-nano-x5', discipline: 'hyrox', drop_mm: 4, weight_g: 278, price_usd: 130, our_rating: 4.2, carbon_plate: false, stack_heel_mm: 20, stack_forefoot_mm: 16, published: true },
  { brand: 'Nike', model: 'Metcon 9', slug: 'nike-metcon-9', discipline: 'hyrox', drop_mm: 4, weight_g: 290, price_usd: 130, our_rating: 4.3, carbon_plate: false, stack_heel_mm: 22, stack_forefoot_mm: 18, published: true },
];

// ── Vests (30) ──────────────────────────────────────────────────────
export const VESTS: VestSeed[] = [
  { brand: 'Salomon', model: 'ADV Skin 12', slug: 'salomon-adv-skin-12', capacity_l: 12, weight_g: 220, price_usd: 140, our_rating: 4.6, utmb_compliant: true, published: true },
  { brand: 'Salomon', model: 'ADV Skin 5', slug: 'salomon-adv-skin-5', capacity_l: 5, weight_g: 160, price_usd: 120, our_rating: 4.5, utmb_compliant: true, published: true },
  { brand: 'Salomon', model: 'Sense Pro 10', slug: 'salomon-sense-pro-10', capacity_l: 10, weight_g: 190, price_usd: 160, our_rating: 4.4, utmb_compliant: true, published: true },
  { brand: 'Salomon', model: 'ADV Skin 8', slug: 'salomon-adv-skin-8', capacity_l: 8, weight_g: 195, price_usd: 130, our_rating: 4.5, utmb_compliant: true, published: true },
  { brand: 'Ultimate Direction', model: 'Adventure Vesta 6', slug: 'ud-adventure-vesta-6', capacity_l: 6, weight_g: 113, price_usd: 150, our_rating: 4.7, utmb_compliant: true, published: true },
  { brand: 'Ultimate Direction', model: 'Race Vest 6.0', slug: 'ud-race-vest-6', capacity_l: 10, weight_g: 195, price_usd: 135, our_rating: 4.5, utmb_compliant: true, published: true },
  { brand: 'Ultimate Direction', model: 'Mountain Vest 7.0', slug: 'ud-mountain-vest-7', capacity_l: 12, weight_g: 245, price_usd: 160, our_rating: 4.4, utmb_compliant: true, published: true },
  { brand: 'Ultimate Direction', model: 'Ultra Vest 6.0', slug: 'ud-ultra-vest-6', capacity_l: 8, weight_g: 180, price_usd: 140, our_rating: 4.3, utmb_compliant: true, published: true },
  { brand: 'Nathan', model: 'VaporAiress 7L', slug: 'nathan-vaporairess-7l', capacity_l: 7, weight_g: 130, price_usd: 130, our_rating: 4.4, utmb_compliant: true, published: true },
  { brand: 'Nathan', model: 'Pinnacle Pro 12L', slug: 'nathan-pinnacle-pro-12l', capacity_l: 12, weight_g: 210, price_usd: 175, our_rating: 4.3, utmb_compliant: true, published: true },
  { brand: 'Nathan', model: 'TrailMix 12L', slug: 'nathan-trailmix-12l', capacity_l: 12, weight_g: 230, price_usd: 110, our_rating: 4.1, utmb_compliant: false, published: true },
  { brand: 'Osprey', model: 'Dyna 6', slug: 'osprey-dyna-6', capacity_l: 6, weight_g: 140, price_usd: 160, our_rating: 4.5, utmb_compliant: false, published: true },
  { brand: 'Osprey', model: 'Duro 6', slug: 'osprey-duro-6', capacity_l: 6, weight_g: 175, price_usd: 160, our_rating: 4.4, utmb_compliant: false, published: true },
  { brand: 'Osprey', model: 'Duro 15', slug: 'osprey-duro-15', capacity_l: 15, weight_g: 290, price_usd: 190, our_rating: 4.5, utmb_compliant: false, published: true },
  { brand: 'Black Diamond', model: 'Distance 15', slug: 'bd-distance-15', capacity_l: 15, weight_g: 280, price_usd: 200, our_rating: 4.8, utmb_compliant: true, published: true },
  { brand: 'Black Diamond', model: 'Distance 8', slug: 'bd-distance-8', capacity_l: 8, weight_g: 190, price_usd: 160, our_rating: 4.6, utmb_compliant: true, published: true },
  { brand: 'Black Diamond', model: 'Distance 4', slug: 'bd-distance-4', capacity_l: 4, weight_g: 120, price_usd: 130, our_rating: 4.3, utmb_compliant: true, published: true },
  { brand: 'Black Diamond', model: 'Pursuit 10', slug: 'bd-pursuit-10', capacity_l: 10, weight_g: 220, price_usd: 175, our_rating: 4.4, utmb_compliant: true, published: true },
  { brand: 'Raidlight', model: 'Responsiv 10L', slug: 'raidlight-responsiv-10l', capacity_l: 10, weight_g: 185, price_usd: 140, our_rating: 4.1, utmb_compliant: true, published: true },
  { brand: 'Naked', model: 'Running Band', slug: 'naked-running-band', capacity_l: 2, weight_g: 70, price_usd: 50, our_rating: 4.3, utmb_compliant: false, published: true },
  { brand: 'Compressport', model: 'Free Belt Pro', slug: 'compressport-free-belt-pro', capacity_l: 2, weight_g: 75, price_usd: 60, our_rating: 4.2, utmb_compliant: false, published: true },
  { brand: 'CamelBak', model: 'Octane 12', slug: 'camelbak-octane-12', capacity_l: 12, weight_g: 260, price_usd: 120, our_rating: 4.0, utmb_compliant: false, published: true },
  { brand: 'Arc\'teryx', model: 'Norvan 14', slug: 'arcteryx-norvan-14', capacity_l: 14, weight_g: 310, price_usd: 200, our_rating: 4.5, utmb_compliant: true, published: true },
  { brand: 'Patagonia', model: 'Slope Runner 8L', slug: 'patagonia-slope-runner-8l', capacity_l: 8, weight_g: 200, price_usd: 160, our_rating: 4.2, utmb_compliant: true, published: true },
  { brand: 'Decathlon', model: 'Evadict Vest 10L', slug: 'decathlon-evadict-vest-10l', capacity_l: 10, weight_g: 195, price_usd: 45, our_rating: 3.8, utmb_compliant: false, published: true },
  { brand: 'Inov-8', model: 'Race Ultra Pro 2-in-1', slug: 'inov8-race-ultra-pro-2in1', capacity_l: 10, weight_g: 200, price_usd: 130, our_rating: 4.1, utmb_compliant: true, published: true },
  { brand: 'Harrier', model: 'Kinder 10L', slug: 'harrier-kinder-10l', capacity_l: 10, weight_g: 210, price_usd: 110, our_rating: 4.0, utmb_compliant: true, published: true },
  { brand: 'Compressport', model: 'Ultrun S Pack 15L', slug: 'compressport-ultrun-s-15l', capacity_l: 15, weight_g: 240, price_usd: 140, our_rating: 4.0, utmb_compliant: true, published: true },
  { brand: 'Raidlight', model: 'Ultralight 3L', slug: 'raidlight-ultralight-3l', capacity_l: 3, weight_g: 90, price_usd: 80, our_rating: 3.9, utmb_compliant: true, published: true },
  { brand: 'Gregory', model: 'Pace 3', slug: 'gregory-pace-3', capacity_l: 3, weight_g: 160, price_usd: 85, our_rating: 3.9, utmb_compliant: false, published: true },
];

// ── Gels (30) ───────────────────────────────────────────────────────
export const GELS: GelSeed[] = [
  { brand: 'Maurten', product: 'Gel 100', slug: 'maurten-gel-100', carbs_per_serving_g: 25, caffeine_mg: 0, sodium_mg: 50, calories: 100, price_per_serving: 1.2, our_rating: 4.8, real_food: false, format: 'gel', published: true },
  { brand: 'Maurten', product: 'Gel 100 Caf 100', slug: 'maurten-gel-100-caf', carbs_per_serving_g: 25, caffeine_mg: 100, sodium_mg: 50, calories: 100, price_per_serving: 1.7, our_rating: 4.7, real_food: false, format: 'gel', published: true },
  { brand: 'Maurten', product: 'Drink Mix 320', slug: 'maurten-drink-mix-320', carbs_per_serving_g: 80, caffeine_mg: 0, sodium_mg: 200, calories: 320, price_per_serving: 3.0, our_rating: 4.8, real_food: false, format: 'drink mix', published: true },
  { brand: 'Precision Fuel', product: 'PF 30 Gel', slug: 'precision-fuel-pf30', carbs_per_serving_g: 30, caffeine_mg: 75, sodium_mg: 60, calories: 120, price_per_serving: 1.5, our_rating: 4.7, real_food: false, format: 'gel', published: true },
  { brand: 'Precision Fuel', product: 'PF 90 Gel', slug: 'precision-fuel-pf90', carbs_per_serving_g: 90, caffeine_mg: 0, sodium_mg: 180, calories: 360, price_per_serving: 2.5, our_rating: 4.5, real_food: false, format: 'gel', published: true },
  { brand: 'GU Energy', product: 'Original Gel', slug: 'gu-original-gel', carbs_per_serving_g: 21, caffeine_mg: 40, sodium_mg: 50, calories: 100, price_per_serving: 1.0, our_rating: 4.2, real_food: false, format: 'gel', published: true },
  { brand: 'GU Energy', product: 'Roctane Gel', slug: 'gu-roctane-gel', carbs_per_serving_g: 23, caffeine_mg: 70, sodium_mg: 60, calories: 100, price_per_serving: 1.5, our_rating: 4.4, real_food: false, format: 'gel', published: true },
  { brand: 'GU Energy', product: 'Energy Chews', slug: 'gu-energy-chews', carbs_per_serving_g: 20, caffeine_mg: 50, sodium_mg: 40, calories: 90, price_per_serving: 1.2, our_rating: 4.1, real_food: false, format: 'chew', published: true },
  { brand: 'SiS', product: 'Go Isotonic Gel', slug: 'sis-go-isotonic', carbs_per_serving_g: 22, caffeine_mg: 0, sodium_mg: 10, calories: 87, price_per_serving: 0.8, our_rating: 4.3, real_food: false, format: 'gel', published: true },
  { brand: 'SiS', product: 'Beta Fuel Gel', slug: 'sis-beta-fuel-gel', carbs_per_serving_g: 40, caffeine_mg: 0, sodium_mg: 20, calories: 158, price_per_serving: 1.3, our_rating: 4.5, real_food: false, format: 'gel', published: true },
  { brand: 'SiS', product: 'Beta Fuel Chews', slug: 'sis-beta-fuel-chews', carbs_per_serving_g: 45, caffeine_mg: 0, sodium_mg: 20, calories: 180, price_per_serving: 1.5, our_rating: 4.3, real_food: false, format: 'chew', published: true },
  { brand: 'Huma', product: 'Chia Energy Gel', slug: 'huma-chia-gel', carbs_per_serving_g: 25, caffeine_mg: 0, sodium_mg: 45, calories: 100, price_per_serving: 1.3, our_rating: 4.4, real_food: true, format: 'gel', published: true },
  { brand: 'Huma', product: 'Gel Plus', slug: 'huma-gel-plus', carbs_per_serving_g: 26, caffeine_mg: 50, sodium_mg: 50, calories: 105, price_per_serving: 1.6, our_rating: 4.3, real_food: true, format: 'gel', published: true },
  { brand: 'Spring Energy', product: 'Energy Bar', slug: 'spring-energy-bar', carbs_per_serving_g: 40, caffeine_mg: 0, sodium_mg: 20, calories: 160, price_per_serving: 2.0, our_rating: 4.5, real_food: true, format: 'bar', published: true },
  { brand: 'Spring Energy', product: 'Awesome Sauce', slug: 'spring-awesome-sauce', carbs_per_serving_g: 21, caffeine_mg: 50, sodium_mg: 30, calories: 90, price_per_serving: 2.0, our_rating: 4.6, real_food: true, format: 'gel', published: true },
  { brand: 'Torq', product: 'Energy Gel', slug: 'torq-energy-gel', carbs_per_serving_g: 30, caffeine_mg: 0, sodium_mg: 25, calories: 115, price_per_serving: 1.3, our_rating: 4.2, real_food: false, format: 'gel', published: true },
  { brand: 'Torq', product: 'Energy Drink', slug: 'torq-energy-drink', carbs_per_serving_g: 30, caffeine_mg: 0, sodium_mg: 50, calories: 120, price_per_serving: 1.0, our_rating: 4.1, real_food: false, format: 'drink mix', published: true },
  { brand: 'High5', product: 'Energy Gel', slug: 'high5-energy-gel', carbs_per_serving_g: 23, caffeine_mg: 0, sodium_mg: 5, calories: 91, price_per_serving: 0.8, our_rating: 4.0, real_food: false, format: 'gel', published: true },
  { brand: 'High5', product: 'Energy Drink', slug: 'high5-energy-drink', carbs_per_serving_g: 48, caffeine_mg: 0, sodium_mg: 50, calories: 190, price_per_serving: 0.8, our_rating: 3.9, real_food: false, format: 'drink mix', published: true },
  { brand: 'Clif', product: 'Shot Gel', slug: 'clif-shot-gel', carbs_per_serving_g: 24, caffeine_mg: 50, sodium_mg: 50, calories: 100, price_per_serving: 1.0, our_rating: 4.0, real_food: false, format: 'gel', published: true },
  { brand: 'Clif', product: 'Bloks Energy Chews', slug: 'clif-bloks-chews', carbs_per_serving_g: 24, caffeine_mg: 50, sodium_mg: 40, calories: 100, price_per_serving: 1.3, our_rating: 4.2, real_food: false, format: 'chew', published: true },
  { brand: 'Honey Stinger', product: 'Energy Gel', slug: 'honey-stinger-gel', carbs_per_serving_g: 24, caffeine_mg: 32, sodium_mg: 40, calories: 100, price_per_serving: 1.1, our_rating: 4.1, real_food: false, format: 'gel', published: true },
  { brand: 'Honey Stinger', product: 'Waffle', slug: 'honey-stinger-waffle', carbs_per_serving_g: 21, caffeine_mg: 0, sodium_mg: 55, calories: 150, price_per_serving: 1.5, our_rating: 4.3, real_food: true, format: 'waffle', published: true },
  { brand: 'Tailwind', product: 'Endurance Fuel', slug: 'tailwind-endurance-fuel', carbs_per_serving_g: 25, caffeine_mg: 35, sodium_mg: 300, calories: 100, price_per_serving: 1.0, our_rating: 4.4, real_food: false, format: 'drink mix', published: true },
  { brand: 'Tailwind', product: 'Rapid Hydration', slug: 'tailwind-rapid-hydration', carbs_per_serving_g: 25, caffeine_mg: 35, sodium_mg: 250, calories: 100, price_per_serving: 0.8, our_rating: 4.1, real_food: false, format: 'drink mix', published: true },
  { brand: 'Styrkr', product: 'Gel50', slug: 'styrkr-gel50', carbs_per_serving_g: 50, caffeine_mg: 0, sodium_mg: 80, calories: 200, price_per_serving: 1.8, our_rating: 4.4, real_food: false, format: 'gel', published: true },
  { brand: 'Veloforte', product: 'Energy Chews', slug: 'veloforte-energy-chews', carbs_per_serving_g: 20, caffeine_mg: 0, sodium_mg: 5, calories: 90, price_per_serving: 1.5, our_rating: 4.2, real_food: true, format: 'chew', published: true },
  { brand: 'Bonk Breaker', product: 'Energy Chews', slug: 'bonk-breaker-chews', carbs_per_serving_g: 20, caffeine_mg: 40, sodium_mg: 50, calories: 90, price_per_serving: 1.3, our_rating: 3.8, real_food: true, format: 'chew', published: true },
  { brand: 'Naak', product: 'Ultra Energy Waffle', slug: 'naak-ultra-waffle', carbs_per_serving_g: 30, caffeine_mg: 0, sodium_mg: 60, calories: 150, price_per_serving: 2.0, our_rating: 4.2, real_food: true, format: 'waffle', published: true },
  { brand: 'Lucho Dillitos', product: 'Bocadillo', slug: 'lucho-dillitos-bocadillo', carbs_per_serving_g: 25, caffeine_mg: 0, sodium_mg: 10, calories: 100, price_per_serving: 1.5, our_rating: 4.0, real_food: true, format: 'solid', published: true },
];
