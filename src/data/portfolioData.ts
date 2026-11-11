import videoVfxRealisticCover from '../assets/images/video_vfx_realistic_cover_1794401539858.jpg';
import videoMinecraftCover from '../assets/images/video_minecraft_shader_1794394728984.jpg';
import shaderShowcaseImg from '../assets/images/shader_showcase_cleaned_1794401918558.jpg';

export type ProjectCategoryId =
  | 'web-design'
  | 'video-editing'
  | 'blender-editing'
  | 'minecraft-modding'
  | 'thumbnail-design';

export interface CategoryMeta {
  id: ProjectCategoryId;
  label: string;
  subtitle: string;
}

export interface ProjectItem {
  id: string;
  frameCode: string;
  category: ProjectCategoryId;
  categoryLabel: string;
  title: string;
  formatLabel: string;
  summary: string;
  deliverables: string[];
  imageSrc?: string;
  mediaNote: string;
  // Minecraft-specific structured showcase fields
  mcKind?: 'jar-mod' | 'texture-pack' | 'shaders';
  features?: string[];
  requirementsTitle?: string;
  requirementsNote?: string;
  requirements?: { label: string; value: string }[];
}

export const PROJECT_CATEGORIES: CategoryMeta[] = [
  {
    id: 'web-design',
    label: 'WEB DESIGN',
    subtitle: 'Display-only showcase of the three website design concepts.',
  },
  {
    id: 'video-editing',
    label: 'VIDEO EDITING',
    subtitle: 'Display-only cinematic cover frames for pacing, VFX, and shader cuts.',
  },
  {
    id: 'blender-editing',
    label: 'BLENDER EDITING',
    subtitle: 'Static 3D render poster showcasing dramatic materials, lighting, and grading.',
  },
  {
    id: 'minecraft-modding',
    label: 'MINECRAFT MODDING',
    subtitle: 'Display-only showcase covering Renders (Mod), Icy90k Special Texture Pack, and Shaders.',
  },
  {
    id: 'thumbnail-design',
    label: 'THUMBNAIL DESIGN',
    subtitle: 'Featured original Minecraft thumbnail composition by Aditya (LUCFIFER).',
  },
];

// Display-only portfolio entries. All cards are strictly non-playable and non-downloadable.
export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  // 1. WEBSITE DESIGN PROJECTS (Exactly 3 existing demo projects with uploaded screenshots)
  {
    id: 'web-demo-01',
    frameCode: 'WD · 01',
    category: 'web-design',
    categoryLabel: 'WEB DESIGN',
    title: 'Atmospheric Brand & WebGL Experience',
    formatLabel: 'Display Preview · Sample 01',
    summary:
      'Demo website concept exploring scroll-choreographed 3D architecture, moody typography, and refined charcoal-and-crimson glass surfaces.',
    deliverables: ['UI Architecture', 'Three.js Camera', 'Responsive Build'],
    imageSrc: '/assets/aistudio/Screenshot_2026-11-11_160336_e94e41d5.png',
    mediaNote: 'Display-only website design sample 01',
  },
  {
    id: 'web-demo-02',
    frameCode: 'WD · 02',
    category: 'web-design',
    categoryLabel: 'WEB DESIGN',
    title: 'Minimalist Studio & Editorial System',
    formatLabel: 'Display Preview · Sample 02',
    summary:
      'Demo website concept structured around high-contrast dark surfaces, grid discipline, and smooth view transitions.',
    deliverables: ['Design Tokens', 'Component Kit', 'Motion Spec'],
    imageSrc: '/assets/aistudio/Screenshot_2026-11-11_160211_cddd6262.png',
    mediaNote: 'Display-only website design sample 02',
  },
  {
    id: 'web-demo-03',
    frameCode: 'WD · 03',
    category: 'web-design',
    categoryLabel: 'WEB DESIGN',
    title: 'Creator Release & Media Hub',
    formatLabel: 'Display Preview · Sample 03',
    summary:
      'Demo website concept built to showcase mod releases, video reels, and community updates inside a unified dark interface.',
    deliverables: ['Information Architecture', 'Media Cards', 'Frontend Engineering'],
    imageSrc: '/assets/aistudio/Screenshot_2026-11-11_160527_94c2a678.png',
    mediaNote: 'Display-only website design sample 03',
  },

  // 2. VIDEO EDITING PROJECTS (Display-only high-contrast cinematic cover images)
  {
    id: 'video-demo-01',
    frameCode: 'VE · 01',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    title: 'Cinematic Trailer & Rhythm Montage',
    formatLabel: 'Display Cover · 16:9 Cinema Edit',
    summary:
      'Beat-synced montage pacing, dramatic silhouette framing, atmospheric SFX layering, and filmic obsidian-crimson contrast grading.',
    deliverables: ['Story Pacing', 'Color Grading', 'Sound Design'],
    imageSrc: '/assets/aistudio/maxresdefault_4d1c70c2.jpg',
    mediaNote: 'Display-only cinematic cover frame',
  },
  {
    id: 'video-demo-02',
    frameCode: 'VE · 02',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    title: 'VFX Compositing & Motion Sequence',
    formatLabel: 'Display Cover · Visual Effects',
    summary:
      'Camera-tracked transitions, speed ramping, refractive shard compositing, and high-contrast light streak integration.',
    deliverables: ['Compositing', 'Speed Ramps', 'Motion Type'],
    imageSrc: videoVfxRealisticCover,
    mediaNote: 'Display-only VFX cover frame',
  },
  {
    id: 'video-demo-03',
    frameCode: 'VE · 03',
    category: 'video-editing',
    categoryLabel: 'VIDEO EDITING',
    title: 'Minecraft Shader Cinematic Cut',
    formatLabel: 'Display Cover · In-Game Film',
    summary:
      'Custom Replay Mod camera paths paired with volumetric twilight lighting, water reflections, and atmospheric world grading.',
    deliverables: ['Replay Camera', 'Shader Capture', 'Final Master'],
    imageSrc: videoMinecraftCover,
    mediaNote: 'Display-only cinematic cover frame',
  },

  // 3. BLENDER EDITING PROJECT (Exactly ONE static poster)
  {
    id: 'blender-poster-01',
    frameCode: 'BL · 01',
    category: 'blender-editing',
    categoryLabel: 'BLENDER EDITING',
    title: 'Obsidian Monolith — Cycles Chamber Study',
    formatLabel: 'Static 3D Render Poster',
    summary:
      'Single static Blender render study balancing brushed titanium and obsidian surface roughness, volumetric mist, concrete reflections, and crimson rim lighting.',
    deliverables: ['3D Lighting & Shading', 'Procedural Materials', 'Cinematic Grading'],
    imageSrc: '/assets/aistudio/Screenshot_2026-11-11_181440_abc7a8ec.png',
    mediaNote: 'Static display-only poster — non-interactive',
  },

  // 4. MINECRAFT MODDING SECTION (Exactly THREE display-only samples)
  {
    id: 'mc-renders-mod',
    frameCode: 'MC · 01',
    category: 'minecraft-modding',
    categoryLabel: 'MINECRAFT MODDING',
    title: 'Renders',
    formatLabel: 'Java Mod · Display Only',
    summary:
      'Renders is designed to give your Minecraft gameplay a cinematic montage-style look, with smooth visuals and a polished presentation. It aims to make gameplay look cleaner and more suitable for high-quality 4K montage content.',
    deliverables: ['Montage Visual Polish', 'Smooth Presentation', '4K Capture Ready'],
    mcKind: 'jar-mod',
    mediaNote: 'Default Java JAR archive icon · Display only',
    features: [
      'Cinematic montage-oriented visual smoothing',
      'Cleaner frame presentation tuned for 4K edits',
      'Refined motion feel built for showcase captures',
    ],
    requirementsTitle: 'Estimated System Requirements',
    requirementsNote: 'Estimates only — pending final verified compatibility testing.',
    requirements: [
      { label: 'CPU', value: '6-core modern desktop CPU (est.)' },
      { label: 'GPU', value: 'RTX 2060 / RX 6600 or equivalent (est.)' },
      { label: 'Memory', value: '8–16 GB RAM allocated appropriately (est.)' },
      { label: 'Runtime', value: 'Java Edition (version TBD)' },
    ],
  },
  {
    id: 'mc-best-smp-pack',
    frameCode: 'MC · 02',
    category: 'minecraft-modding',
    categoryLabel: 'MINECRAFT MODDING',
    title: 'Icy90k Special Texture Pack',
    formatLabel: 'Texture Pack · Display Only',
    summary:
      "Icy90k Special Texture Pack is designed for Minecraft content creators who want a clean, polished and visually appealing gameplay experience. Whether you're recording SMP videos, creating cinematic clips or capturing gameplay for YouTube, this pack delivers a distinctive visual style with carefully designed textures. Perfect for creators who want their Minecraft content to stand out.",
    deliverables: ['Clean SMP Palette', 'Crisp Surface Detail', 'Pairs with Renders'],
    mcKind: 'texture-pack',
    imageSrc: '/assets/aistudio/Aesthetic__ab1004fb.jpg',
    mediaNote: 'Display-only texture pack artwork',
    features: [
      'Balanced, readable SMP textures without visual noise',
      'Sharper block and item clarity in PvP and survival',
      'Engineered to pair cleanly alongside Renders',
    ],
  },
  {
    id: 'mc-shaders',
    frameCode: 'MC · 03',
    category: 'minecraft-modding',
    categoryLabel: 'MINECRAFT MODDING',
    title: 'Cinematic Shader Preset',
    formatLabel: 'Shaders · Display Only',
    summary:
      'Crafted around dramatic volumetric atmosphere, physically grounded shadows, crisp water and wet-stone reflections, and rich skylight contrast for an elevated, cinematic in-game visual experience.',
    deliverables: ['Volumetric Fog', 'Soft Dynamic Shadows', 'Specular Reflections'],
    mcKind: 'shaders',
    imageSrc: shaderShowcaseImg,
    mediaNote: 'Display-only shader artwork',
    features: [
      'Cinematic lighting & directional sun/moon rays',
      'Soft cascade shadows & ambient depth',
      'Atmospheric fog & natural surface reflections',
    ],
    requirementsTitle: 'Estimated Minimum PC Requirements',
    requirementsNote:
      'Estimates only, not guaranteed compatibility specifications. Actual performance depends on shader settings, Minecraft version, resolution, and other system components.',
    requirements: [
      { label: 'Min GPU (NVIDIA)', value: 'GeForce RTX 4070 Ti (12GB VRAM)' },
      { label: 'Min GPU (AMD)', value: 'Radeon RX 7900 XT (20GB VRAM)' },
      { label: 'CPU', value: 'Ryzen 7 5800X / Core i7-12700K+ (est.)' },
      { label: 'Memory', value: '16–32 GB DDR4/DDR5 RAM (est.)' },
      { label: 'Storage', value: 'NVMe SSD recommended for smooth chunk streaming (est.)' },
    ],
  },

  // 5. THUMBNAIL DESIGN (Strictly ONE sample using existing uploaded artwork)
  {
    id: 'thumb-real-01',
    frameCode: 'TD · 01',
    category: 'thumbnail-design',
    categoryLabel: 'THUMBNAIL DESIGN',
    title: 'Minecraft Thumbnail Artwork Showcase',
    formatLabel: 'Original Uploaded Artwork',
    summary:
      'Featured Minecraft thumbnail compositions by Aditya (LUCFIFER) combining dramatic character contrast, custom shader/mod focal icons, and torchlit gothic castle atmosphere.',
    deliverables: ['3D Scene Staging', 'Rim Lighting', 'Color & Contrast'],
    imageSrc: '/assets/aistudio/minecraft_hq_no_logo_d51b6385.png',
    mediaNote: 'Display-only original thumbnail artwork',
  },
];

export type SkillCategoryId =
  | 'web-design'
  | 'video-editing'
  | 'minecraft-modding'
  | 'thumbnail-design'
  | 'blender-editing';

export interface SkillGroup {
  id: SkillCategoryId;
  title: string;
  subtitle: string;
  coreFocus: string;
  capabilities: {
    name: string;
    detail: string;
  }[];
  tools: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'web-design',
    title: 'Web Design',
    subtitle: 'Interfaces, 3D atmospheres & responsive engineering',
    coreFocus:
      'Crafting dark, editorial, interactive web experiences that balance cinematic spatial depth with sharp usability and static deployment speed.',
    capabilities: [
      {
        name: 'Visual Systems & Dark UI',
        detail: 'High-contrast typography, obsidian & charcoal surfaces, and disciplined layout rhythm.',
      },
      {
        name: 'Scroll & 3D Choreography',
        detail: 'Three.js architectural environments, GSAP ScrollTrigger timelines, and pointer parallax.',
      },
      {
        name: 'Modern Static Builds',
        detail: 'Accessible React and TypeScript applications optimized for Cloudflare Pages.',
      },
    ],
    tools: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind CSS', 'Figma'],
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    subtitle: 'Pacing, smooth transitions, grading & sound design',
    coreFocus:
      'Turning raw captures and footage into cohesive, emotionally resonant cuts driven by rhythm, seamless transitions, and cinematic grading.',
    capabilities: [
      {
        name: 'Rhythmic Narrative Cuts',
        detail: 'Music-driven editing, smooth transitions, and deliberate visual momentum.',
      },
      {
        name: 'VFX & Motion Compositing',
        detail: 'Speed ramping, depth-based blurs, tracking, and kinetic title treatments.',
      },
      {
        name: 'Grading & Audio Beds',
        detail: 'Cinematic tonal contrast, atmospheric SFX layering, and balanced stems.',
      },
    ],
    tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Replay Mod'],
  },
  {
    id: 'minecraft-modding',
    title: 'Minecraft Modding',
    subtitle: 'Custom Java mods, SMP packs & shader visuals',
    coreFocus:
      'Building visual-first mods, clean SMP texture packs, and atmospheric presets tuned for crisp gameplay and montage captures.',
    capabilities: [
      {
        name: 'Visual & Montage Mods',
        detail: 'Clean gameplay smoothing and polished visual presentation for 4K content.',
      },
      {
        name: 'SMP Texture Packs',
        detail: 'Readable, cohesive surface styling designed to complement cinematic renders.',
      },
      {
        name: 'Shader & Atmosphere Tuning',
        detail: 'Balanced volumetric fog, shadows, and surface reflections.',
      },
    ],
    tools: ['Java', 'Fabric / Forge', 'Blockbench', 'Resource Packs', 'Gradle'],
  },
  {
    id: 'thumbnail-design',
    title: 'Thumbnail Design',
    subtitle: '3D staging, dramatic lighting & focal clarity',
    coreFocus:
      'Composing unmistakable focal points, expressive character poses, and cinematic color separation built to command attention immediately.',
    capabilities: [
      {
        name: '3D Scene & Pose Staging',
        detail: 'Dynamic character rigs, expressive silhouettes, and layered depth planes.',
      },
      {
        name: 'Lighting & Rim Separation',
        detail: 'High-contrast rim lights, atmospheric fog, and intentional color focus.',
      },
      {
        name: 'Visual Storytelling',
        detail: 'Clear narrative tension readable in under a second across all devices.',
      },
    ],
    tools: ['Photoshop', 'Blender', 'Mine-imator', 'Lightroom', 'Shader Captures'],
  },
  {
    id: 'blender-editing',
    title: 'Blender Editing',
    subtitle: '3D scenes, Cycles lighting, shaders & post-grading',
    coreFocus:
      'Building moody 3D scenes with physically grounded PBR materials, volumetric lighting shafts, and cinematic camera framing.',
    capabilities: [
      {
        name: 'PBR Shading & Materials',
        detail: 'Layered roughness, brushed metals, concrete weathering, and subtle reflections.',
      },
      {
        name: 'Cinematic Lighting & Fog',
        detail: 'Volumetric light shafts, rim separation, and controlled shadow contrast.',
      },
      {
        name: 'Compositing & Look Dev',
        detail: 'Depth of field, subtle glare passes, and moody editorial color grading.',
      },
    ],
    tools: ['Blender', 'Cycles', 'Shader Nodes', 'Compositor', 'After Effects'],
  },
];

export interface TestimonialSample {
  id: string;
  name: string;
  initial: string;
  projectType: string;
  rating: number;
  quote: string;
  exampleLabel: string;
}

// Five illustrative demo testimonial cards (not verified customer reviews or confirmed transactions).
export const TESTIMONIAL_SAMPLES: TestimonialSample[] = [
  {
    id: 't-1',
    name: 'Aarav',
    initial: 'A',
    projectType: 'Video Editing · Long-Form (Example)',
    rating: 4.5,
    quote:
      'Bhai, 14-minute ki long-form timeline dekh ke laga hi nahi ki cut kahin rush hua hai. Pacing aur transitions ekdum smooth the, storytelling end tak hold karti hai. Overall output dekh ke proper value-for-money vibe aati hai.',
    exampleLabel: 'Illustrative Example · Video Editing',
  },
  {
    id: 't-2',
    name: 'aesthion.official',
    initial: 'A',
    projectType: 'Website Design · Portfolio (Example)',
    rating: 5.0,
    quote:
      'Got a personal portfolio concept put together and the whole layout feels genuinely premium. Scroll animations flow smoothly without feeling heavy, and switching from desktop to mobile keeps every section crisp and responsive.',
    exampleLabel: 'Illustrative Example · Website Design',
  },
  {
    id: 't-3',
    name: 'Rishabh',
    initial: 'R',
    projectType: 'Reel Editing · ₹900 Concept (Example)',
    rating: 4.0,
    quote:
      'For a hypothetical ₹900 reel-editing project, the motion graphics aur kinetic typography genuinely surprised me. Beat-synced transitions ke saath subtle VFX clean rakhe hain—overdone nahi lagta, bas sharp aur rewatchable banta hai.',
    exampleLabel: 'Illustrative Example · Reel Editing',
  },
  {
    id: 't-4',
    name: 'tmartlyfts',
    initial: 'T',
    projectType: 'Thumbnail Design · YouTube (Example)',
    rating: 3.9,
    quote:
      'Composition solid hai aur colour contrast background se subject ko cleanly separate karta hai. Typography chhote phone screen pe bhi easily readable rehti hai—bas ek-do minor tweak chahiye the spacing mein, baaki presentation kaafi pro dikhti hai.',
    exampleLabel: 'Illustrative Example · Thumbnail Design',
  },
  {
    id: 't-5',
    name: '𝖙𝖒𝖆𝖗𝖙',
    initial: 'T',
    projectType: 'Minecraft Modding · Visuals (Example)',
    rating: 4.5,
    quote:
      'Minecraft project ka overall visual presentation kaafi clean hai—textures aur atmosphere dono bina kisi visual noise ke pop karte hain. Gameplay record karte time quality noticeable rehti hai aur pura experience kaafi smooth feel hota hai.',
    exampleLabel: 'Illustrative Example · Minecraft Modding',
  },
];
