import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Game, NewsArticle, SecurityTool, CTFEntry, StudioSettings, ContactMessage, AuditLogEntry } from './types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const BUILDS_DIR = path.join(DATA_DIR, 'builds');

// Ensure necessary data directories exist
[DATA_DIR, UPLOADS_DIR, BUILDS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const defaultSettings: StudioSettings = {
  studioName: 'Black Cloud',
  foundedYear: 2021,
  tagline: 'Building Games. Exploring Technology. Securing the Future.',
  description: 'Black Cloud is an independent game development studio and cybersecurity research laboratory established in 2021. We craft immersive tactical and sci-fi digital experiences while researching resilient systems, game networking protocols, and offensive security techniques.',
  logoUrl: '',
  contactEmail: 'contact@blackcloud.dev',
  securityEmail: 'security@blackcloud.dev',
  socialLinks: {
    github: 'https://github.com/blackcloud-studio',
    twitter: 'https://twitter.com/blackclouddev',
    discord: 'https://discord.gg/blackcloud',
    itch: 'https://blackcloud.itch.io',
  },
  footerText: '© 2021-2026 Black Cloud Development Studio. All rights reserved.',
  seoDefaults: {
    metaTitle: 'Black Cloud — Game Development & Cybersecurity Studio',
    metaDescription: 'Independent game development studio and cybersecurity research lab founded in 2021. Building games, exploring technology, securing the future.',
  },
  featuredGameSlugs: ['shadow-protocol-echoes', 'null-sector-breach'],
  updatedAt: new Date().toISOString(),
};

const initialGames: Game[] = [
  {
    id: 'game-1',
    title: 'Shadow Protocol: Echoes',
    slug: 'shadow-protocol-echoes',
    shortDescription: 'Tactical cyber-noir stealth thriller set in an authoritarian distributed compute enclave.',
    fullDescription: `### Overview
**Shadow Protocol: Echoes** is a top-down tactical espionage simulation built on our proprietary lightweight C++ voxel-ray tracer. Players control Ghost-7, a rogue sub-process navigating the physical mainframe vaults of a post-nation infrastructure grid.

### Key Features
- **Dynamic Surveillance Systems**: Real-time laser, acoustic sensors, and thermal sight cones requiring methodical timing and electromagnetic pulse diversion.
- **Terminal Infiltration**: Direct command-line terminal hacking minigames mirroring real buffer overflow and privilege escalation vectors.
- **Physical Hardpoint Sabotage**: Splice power relays, bypass biometric scanners, and manipulate environmental cooling valves.
- **Original Dark Electro Soundtrack**: Composed in-house using vintage analog synthesizers and distorted industrial foley.

### Publication & Access
This game is in **Download + Test** mode. You can download the current community release build (v1.4.2) or apply to participate in the multiplayer netcode alpha test.`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    ],
    genre: 'Tactical Stealth / Cyberpunk',
    platforms: ['Windows', 'Linux'],
    version: '1.4.2',
    releaseDate: '2023-11-14',
    systemRequirements: {
      minimum: 'OS: Windows 10 64-bit / Ubuntu 22.04 | CPU: Intel Core i5-4460 | RAM: 8 GB | GPU: GTX 960 (4GB) | Storage: 4.5 GB',
      recommended: 'OS: Windows 11 / Linux Kernel 6.x | CPU: AMD Ryzen 5 3600 | RAM: 16 GB | GPU: RTX 2060 (6GB) | Storage: 4.5 GB SSD',
    },
    publicationStatus: 'published',
    availabilityMode: 'download_and_test',
    releaseBuildStoragePath: 'game-1-release-v1.4.2.zip',
    releaseBuildFilename: 'ShadowProtocol_Echoes_v1.4.2_Setup.zip',
    releaseBuildSizeBytes: 48234496,
    testBuildStoragePath: 'game-1-playtest-netcode-alpha.zip',
    testBuildFilename: 'ShadowProtocol_Netcode_Alpha_Client.zip',
    testBuildSizeBytes: 52140112,
    testInstructions: 'Multiplayer Netcode Playtest: Run the executable with `--net-cluster=us-east.blackcloud.dev`. Feedback and telemetry logs can be sent to playtest@blackcloud.dev or submitted in our Discord #playtest channel.',
    testInviteRequired: false,
    featured: true,
    createdAt: '2023-08-12T10:00:00.000Z',
    updatedAt: '2024-04-18T14:30:00.000Z',
  },
  {
    id: 'game-2',
    title: 'Null Sector: Breach',
    slug: 'null-sector-breach',
    shortDescription: 'High-octane geometric arena survival shooter with procedural weapon synthesizers.',
    fullDescription: `### Overview
In **Null Sector: Breach**, players navigate an infinite procedural vector matrix infested with autonomous hostile defense subroutines. Armed with modular particle cannons, you collect corrupted memory crystals to recompile your weapon on the fly.

### Highlights
- Procedural build generation with over 180 weapon modification modules.
- Responsive twin-stick combat tuned for sub-millisecond input fidelity.
- Global leaderboard with cryptographically signed high-score telemetry.
- Full controller support and ultra-wide display compatibility.`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    ],
    genre: 'Roguelike Action / Arcade',
    platforms: ['Windows', 'Linux', 'macOS'],
    version: '2.0.1',
    releaseDate: '2022-09-20',
    systemRequirements: {
      minimum: 'OS: Windows 10 / macOS 11 / Linux | CPU: Dual Core 2.5 GHz | RAM: 4 GB | GPU: OpenGL 4.1 compliant | Storage: 1.2 GB',
      recommended: 'OS: Windows 10/11 / macOS 13 | CPU: Quad Core 3.0 GHz | RAM: 8 GB | GPU: Dedicated GPU 2GB+ | Storage: 1.2 GB SSD',
    },
    publicationStatus: 'published',
    availabilityMode: 'download',
    releaseBuildStoragePath: 'game-2-release-v2.0.1.zip',
    releaseBuildFilename: 'NullSector_Breach_v2.0.1_Release.zip',
    releaseBuildSizeBytes: 31457280,
    testBuildStoragePath: null,
    testBuildFilename: null,
    testBuildSizeBytes: null,
    testInstructions: '',
    testInviteRequired: false,
    featured: true,
    createdAt: '2022-04-10T11:00:00.000Z',
    updatedAt: '2024-01-15T09:15:00.000Z',
  },
  {
    id: 'game-3',
    title: 'Vortex Engine: Quantum Playground',
    slug: 'vortex-engine-quantum-playground',
    shortDescription: 'Experimental 3D deterministic physics sandbox and stress-test demonstrator.',
    fullDescription: `### Overview
**Vortex Engine: Quantum Playground** is Black Cloud's internal R&D demonstrator for our deterministic multi-body physics pipeline. It simulates 50,000 interacting rigid bodies, fluid dynamics, and stress fractures at 120 FPS.

### Participation
This title is strictly **Test Only**. We are collecting hardware telemetry across diverse GPU architectures to validate physics collision stability before integration into our upcoming unannounced 2026 title.`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    ],
    genre: 'Physics Simulation / Tech Demo',
    platforms: ['Windows', 'Linux'],
    version: '0.8.4-pre',
    releaseDate: 'In Active Playtest',
    systemRequirements: {
      minimum: 'GPU with Vulkan 1.3 support, 8GB System RAM, 6-core CPU',
      recommended: 'Vulkan 1.3 with Ray Query, 16GB RAM, RTX 3070 or Radeon 6700XT',
    },
    publicationStatus: 'published',
    availabilityMode: 'test_only',
    releaseBuildStoragePath: null,
    releaseBuildFilename: null,
    releaseBuildSizeBytes: null,
    testBuildStoragePath: 'game-3-test-vortex-v0.8.4.zip',
    testBuildFilename: 'VortexPlayground_Experimental_0.8.4.zip',
    testBuildSizeBytes: 67108864,
    testInstructions: 'Hardware Playtest Instructions: Unpack the archive and launch `vortex_benchmark.exe`. Select "Stress Matrix 04" and let it run for 180 seconds. Submit your generated `telemetry.json` to our testing portal.',
    testInviteRequired: false,
    featured: false,
    createdAt: '2024-02-01T15:00:00.000Z',
    updatedAt: '2024-05-10T12:00:00.000Z',
  },
];

const initialNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Black Cloud: 5 Years of Building Indie Games & Pushing Cybersecurity Frontiers',
    slug: 'black-cloud-5-years-indie-games-and-cybersecurity',
    excerpt: 'Founded in 2021, Black Cloud has bridged the gap between video game craftsmanship and offensive security engineering. Here is our story and where we are heading next.',
    content: `When Black Cloud was established in 2021, our founding thesis was simple yet unconventional: the engineering disciplines behind video game development—real-time networking, deterministic simulations, and low-level memory performance—share deep technical DNA with cybersecurity engineering.

Over the past five years, our studio has grown from late-night game jam prototypes to releasing full titles like *Shadow Protocol* and *Null Sector*, while fielding a competitive Capture The Flag (CTF) security team competing in DEF CON Qualifiers and Google CTF.

### The Synergy Between Games and Security
- **Memory Safety & Low-Level Code**: Optimizing custom C/C++ game engines requires understanding heap layouts, cache hierarchies, and memory management—the same primitives explored in binary exploitation research.
- **Protocol Security**: Online multiplayer synchronization demands sub-millisecond state replication under adversarial conditions (packet tampering, speed hacks, state desync). Developing anti-tamper telemetry taught us defensive systems architecture.
- **Creative Problem Solving**: Reverse engineering proprietary formats or solving complex cryptanalysis challenges directly improves our game systems design.

### Looking Ahead
In 2026 and beyond, we are expanding our core team, accelerating production on our next unannounced narrative action title, and continuing to open-source select non-weaponized security instrumentation tools.

Thank you to everyone who has downloaded our games, submitted bug reports, read our CTF write-ups, or tested our alpha builds. The best is yet to come.`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    category: 'Announcement',
    tags: ['Studio', 'Anniversary', 'Milestone', 'GameDev', 'Cybersecurity'],
    authorLabel: 'Black Cloud Core',
    publicationStatus: 'published',
    publishedAt: '2026-03-15T08:00:00.000Z',
    createdAt: '2026-03-10T12:00:00.000Z',
    updatedAt: '2026-03-15T08:00:00.000Z',
  },
  {
    id: 'news-2',
    title: 'Shadow Protocol v1.4 Released: Level Editor, Dynamic Lighting Overhaul',
    slug: 'shadow-protocol-v1-4-released',
    excerpt: 'The latest major update to Shadow Protocol brings custom level design tools, Vulkan-based volumetric shadow mapping, and expanded controller mapping.',
    content: `We are thrilled to roll out **Shadow Protocol: Echoes v1.4.2** to all players.

### What's New in v1.4:
- **Integrated Chamber Editor**: Create and export custom infiltration levels with full scripting control over laser tripwires, guard patrol paths, and terminal node topologies.
- **Volumetric Lighting Overhaul**: Re-engineered our shadow-cone occlusion algorithm to run entirely on compute shaders, delivering a 35% framerate improvement on mid-tier hardware.
- **Linux Native Binary Improvements**: Recompiled against modern glibc targets with full Wayland and Steam Deck gamepad integration.

Download the update today from our Games page or update via your existing client!`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    category: 'Game Release',
    tags: ['Shadow Protocol', 'Update', 'Vulkan', 'Linux'],
    authorLabel: 'DevAdam',
    publicationStatus: 'published',
    publishedAt: '2024-04-18T14:30:00.000Z',
    createdAt: '2024-04-16T10:00:00.000Z',
    updatedAt: '2024-04-18T14:30:00.000Z',
  },
  {
    id: 'news-3',
    title: 'Research Write-Up: Mitigating State Desync & Timing Attacks in Custom Game Protocols',
    slug: 'mitigating-state-desync-game-protocols',
    excerpt: 'A technical deep-dive into how Black Cloud hardened UDP state serialization against packet tampering, replay vulnerabilities, and timestamp manipulation.',
    content: `Multiplayer game netcode must strike a delicate compromise between ultra-low latency and authoritative state integrity. During early playtesting of our peer-validated state synchronization layer, we analyzed vulnerability models where adversarial clients modified tick timestamps to gain predictive spatial advantage.

In this paper, we detail:
1. **Delta-Compressed Tick Validation**: Using rolling HMAC ratchets to prevent injected drift.
2. **Deterministic Rewind Verification**: Running headless server-side shadow workers that reproduce state transitions independently.
3. **Bandwidth Optimization**: Compressing transform deltas without losing cryptographic integrity markers.

Read our full analysis on the research section or explore our open-source protocol fuzzing tools catalog.`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    category: 'Cybersecurity Research',
    tags: ['Netcode', 'Protocols', 'Security', 'Cryptography'],
    authorLabel: 'Black Cloud Research',
    publicationStatus: 'published',
    publishedAt: '2024-08-05T11:00:00.000Z',
    createdAt: '2024-08-01T09:00:00.000Z',
    updatedAt: '2024-08-05T11:00:00.000Z',
  },
  {
    id: 'news-4',
    title: 'DEF CON 32 CTF Qualifiers: Top 4% Finish & Retrospective',
    slug: 'def-con-32-ctf-qualifiers-retrospective',
    excerpt: 'Our security team competed in DEF CON 32 CTF Qualifiers, securing 2,850 points across kernel exploitation, cryptographic lattice attacks, and reverse engineering.',
    content: `Over 48 consecutive hours, the Black Cloud CTF squad tackled grueling problems designed by the world's elite security researchers. We are proud to have finished in the top 4% of international teams.

Key highlights included:
- Solving the "RustCore-Sandbox" zero-day escape in under 4 hours.
- Reverse engineering a custom MIPS-based virtual machine obfuscated with opaque predicates.
- Publishing verified write-ups for the community.

Check out our full write-ups on the CTF page!`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    category: 'CTF Report',
    tags: ['DEF CON', 'CTF', 'Reverse Engineering', 'Exploitation'],
    authorLabel: 'DevAdam & Team',
    publicationStatus: 'published',
    publishedAt: '2024-06-02T16:00:00.000Z',
    createdAt: '2024-05-30T10:00:00.000Z',
    updatedAt: '2024-06-02T16:00:00.000Z',
  },
  {
    id: 'news-5',
    title: 'Project Nebula: Early Concept Art & Physics Mechanics (Draft Preview)',
    slug: 'project-nebula-early-concept-art',
    excerpt: 'Internal development log covering our next major narrative tactical game powered by the Vortex deterministic engine.',
    content: `Internal team log. Confidential preview of mechanics for the upcoming title. This post is currently in DRAFT status and is not visible on the public news feed.`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'Devlog',
    tags: ['Internal', 'Unannounced', 'Draft'],
    authorLabel: 'DevAdam',
    publicationStatus: 'draft',
    publishedAt: '',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z',
  },
];

const initialTools: SecurityTool[] = [
  {
    id: 'tool-1',
    title: 'ByteTrace',
    slug: 'bytetrace',
    shortDescription: 'High-performance user-mode execution tracer and instruction sequence visualizer.',
    fullDescription: `### Purpose & Architecture
**ByteTrace** is a specialized dynamic instrumentation framework designed for analyzing game binaries, anti-cheat modules, and low-level proprietary communication protocols without causing intrusive execution jitter.

### Intended Audience
Security researchers, reverse engineers, game engine programmers, and malware analysts who need high-throughput tracing without kernel-level crashes.

### Key Capabilities
- **Non-Invasive Hooking**: Intercepts function pointers and system call dispatches using atomic trampoline patching.
- **Hardware Breakpoint Multiplexing**: Tracks register states and stack frames across multithreaded runtimes.
- **Timeline Export**: Generates flame-graphs and instruction flow diagrams compatible with standard visualization engines.
- **Zero Binary Modification**: Injects via shared library loading or external process inspection.

*Note: In accordance with Black Cloud studio policy, this entry serves as a technical architecture showcase. No executable downloads or binaries are distributed publicly.*`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://github.com/blackcloud-studio/bytetrace',
    documentationUrl: 'https://docs.blackcloud.dev/bytetrace',
    technologies: ['C++20', 'x86_64 ASM', 'Linux ptrace', 'Windows Debug API'],
    purpose: 'Dynamic binary instrumentation and sub-millisecond execution flow tracing.',
    intendedAudience: 'Reverse engineers, security researchers, and low-level systems programmers.',
    status: 'Active',
    featured: true,
    sortOrder: 1,
    createdAt: '2022-06-15T09:00:00.000Z',
    updatedAt: '2024-03-10T14:00:00.000Z',
  },
  {
    id: 'tool-2',
    title: 'CloudWard',
    slug: 'cloudward',
    shortDescription: 'Multi-cloud IAM least-privilege auditor and identity attack-surface mapper.',
    fullDescription: `### Purpose & Architecture
**CloudWard** scans cloud infrastructure configurations to discover unintended privilege escalation vectors, orphaned roles, and cross-account trust vulnerabilities.

### Intended Audience
DevSecOps engineers, cloud architects, and red teamers evaluating cloud identity resilience.

### Key Capabilities
- Graph-based identity traversal to identify hidden admin paths.
- Policy evaluation against CIS Benchmarks and custom studio hardening profiles.
- Automated generation of minimal terraform remediation diffs.`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://github.com/blackcloud-studio/cloudward',
    documentationUrl: 'https://docs.blackcloud.dev/cloudward',
    technologies: ['Go', 'GraphQL', 'AWS SDK', 'GCP API', 'Neo4j'],
    purpose: 'Automated cloud IAM topology analysis and least-privilege enforcement.',
    intendedAudience: 'Cloud security engineers and infrastructure administrators.',
    status: 'Active',
    featured: true,
    sortOrder: 2,
    createdAt: '2023-01-20T10:00:00.000Z',
    updatedAt: '2024-02-18T11:30:00.000Z',
  },
  {
    id: 'tool-3',
    title: 'PacketPhantom',
    slug: 'packetphantom',
    shortDescription: 'Stateful protocol fuzzer and synthetic UDP game traffic simulator.',
    fullDescription: `### Purpose & Architecture
**PacketPhantom** stress-tests custom network protocols by generating stateful packet mutations, simulating synthetic packet loss, out-of-order delivery, and adversarial byte tampering.

### Intended Audience
Game netcode developers, IoT protocol designers, and network security auditors.

### Key Capabilities
- Stateful mutation engine supporting ASN.1, Protobuf, FlatBuffers, and custom bitpacked structs.
- Real-time latency jitter and packet duplication simulator.
- Crash detection hooks with automatic minimized reproduction packet sequence dumps.`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://github.com/blackcloud-studio/packetphantom',
    documentationUrl: 'https://docs.blackcloud.dev/packetphantom',
    technologies: ['Rust', 'eBPF / XDP', 'Tokio', 'CapnProto'],
    purpose: 'Adversarial stateful fuzzing of proprietary real-time UDP and TCP game protocols.',
    intendedAudience: 'Network security engineers and online multiplayer developers.',
    status: 'Beta',
    featured: true,
    sortOrder: 3,
    createdAt: '2023-09-05T12:00:00.000Z',
    updatedAt: '2024-04-01T16:20:00.000Z',
  },
  {
    id: 'tool-4',
    title: 'KernelSentry',
    slug: 'kernelsentry',
    shortDescription: 'eBPF-powered real-time Linux kernel security telemetry and memory anomaly probe.',
    fullDescription: `### Purpose & Architecture
**KernelSentry** leverages modern eBPF probes to detect unauthorized kernel module loading, ptrace injection attempts, and process namespace tampering with zero kernel recompilation required.

### Intended Audience
Linux systems engineers, threat detection teams, and high-performance server operators.`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    projectUrl: 'https://github.com/blackcloud-studio/kernelsentry',
    documentationUrl: 'https://docs.blackcloud.dev/kernelsentry',
    technologies: ['C', 'eBPF / libbpf', 'Linux Kernel 5.15+', 'Prometheus'],
    purpose: 'Zero-overhead observability for kernel-level execution integrity and rootkit prevention.',
    intendedAudience: 'Infrastructure operators and security detection engineers.',
    status: 'Research',
    featured: false,
    sortOrder: 4,
    createdAt: '2024-01-10T14:00:00.000Z',
    updatedAt: '2024-05-12T10:00:00.000Z',
  },
];

const initialCTF: CTFEntry[] = [
  {
    id: 'ctf-1',
    title: 'DEF CON 32 CTF Qualifiers — Heap Exploitation & Zero-Day Escape',
    slug: 'defcon-32-ctf-qualifiers',
    competitionName: 'DEF CON 32 CTF Qualifiers',
    organizer: 'Nautilus Institute',
    eventDate: '2024-05-25',
    teamLabel: 'Black Cloud Research',
    verifiedPlacement: 'Top 4% (Rank 38 of 920 teams)',
    score: '2,850 pts',
    challenges: [
      { name: 'RustCore-Sandbox', category: 'Pwn/Binary', points: 450, solvedBy: 'DevAdam' },
      { name: 'HyperLattice-V', category: 'Crypto', points: 400, solvedBy: 'Black Cloud Team' },
      { name: 'OpaqueFirmware', category: 'Reverse', points: 500, solvedBy: 'DevAdam' },
      { name: 'MemoryGhost', category: 'Forensics', points: 300, solvedBy: 'Black Cloud Team' },
    ],
    writeup: `### Challenge Breakdown: RustCore-Sandbox (450 pts)
The challenge provided a minimal Rust runtime with custom unsafe C bindings simulating an isolated WebAssembly guest VM.

#### 1. Vulnerability Analysis
While the Rust wrapper enforced strict lifetime boundaries, the underlying C memory allocator exposed an off-by-one pointer overwrite when handling contiguous page alignment requests exceeding 64KB.

#### 2. Triggering the Memory Leak
By allocating alternating chunks of 65,536 bytes and releasing every second slab, we forced jemalloc to fragment the arena. Triggering the off-by-one wrote a null terminator into the adjacent chunk metadata header.

#### 3. Overwriting the Function Pointer Table
With chunk metadata corrupted, subsequent allocations overlapped with the internal dispatch table for system callbacks. We redirected the \`log_event\` function pointer directly to a \`system('/bin/sh')\` ROP gadget.

#### 4. Flag Obtained
\`\`\`
flag{rUsT_uNsAfE_b0uNdArIeS_mAkE_lOvElY_gAdGeTs_2024}
\`\`\`

### Lessons Learned & Hardening Takeaway
Language-level memory safety in high-level wrappers cannot compensate for unverified pointer arithmetic in linked legacy C libraries. Always fuzz the interface boundary.`,
    lessonsLearned: 'Cross-language FFI boundaries must implement rigorous sanitization layers and compile with AddressSanitizer (ASan) in continuous integration.',
    disclosureNotes: 'All challenge write-ups published with permission of the Nautilus Institute after competition conclusion.',
    references: [
      'https://defcon.org/html/defcon-32/dc-32-ctf.html',
      'https://ctftime.org/event/2240',
    ],
    featuredImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    publicationStatus: 'published',
    createdAt: '2024-05-28T10:00:00.000Z',
    updatedAt: '2024-05-28T10:00:00.000Z',
  },
  {
    id: 'ctf-2',
    title: 'Google CTF 2024 — Zero-Knowledge Circuit Flaw & Algebraic Analysis',
    slug: 'google-ctf-2024-zk-circuit',
    competitionName: 'Google CTF 2024',
    organizer: 'Google Security Team',
    eventDate: '2024-06-22',
    teamLabel: 'Black Cloud',
    verifiedPlacement: 'Rank 24 International',
    score: '1,920 pts',
    challenges: [
      { name: 'ZK-Vault', category: 'Crypto', points: 420, solvedBy: 'DevAdam' },
      { name: 'ProtoHijack', category: 'Web', points: 300, solvedBy: 'Black Cloud Team' },
      { name: 'QuantumState', category: 'Reverse', points: 450, solvedBy: 'DevAdam' },
    ],
    writeup: `### Challenge: ZK-Vault (420 pts)
This challenge featured a cryptographic proof-of-knowledge verifier designed in Circom.

#### The Under-Constrained Polynomial
Inspection of the R1CS constraint system revealed that the intermediary quadratic check failed to constrain the sign of the private factor polynomial. By providing a negative field element modulo the curve order \`r\`, we generated a valid proof for an invalid state transition.

#### Verification
\`\`\`python
# SageMath exploit script excerpt
p = 21888242871839275222246405745257275088548364400416034343698204186575808495617
# Computed unconstrained root yielding valid groth16 proof
\`\`\`

Flag captured: \`flag{uNdEr_cOnStRaInEd_cIrCuItS_bReAk_kNoWlEdGe}\``,
    lessonsLearned: 'Always run formal circuit verification tools (like Circomspect and Ecne) to identify under-constrained signals before deployment.',
    disclosureNotes: 'Google CTF problems are open source under Apache 2.0.',
    references: [
      'https://capturetheflag.withgoogle.com/',
    ],
    featuredImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    publicationStatus: 'published',
    createdAt: '2024-06-25T11:00:00.000Z',
    updatedAt: '2024-06-25T11:00:00.000Z',
  },
  {
    id: 'ctf-3',
    title: 'Insomni\'hack 2023 — Hardware Glitching & Voltage Fault Injection',
    slug: 'insomnihack-2023-hardware-fault',
    competitionName: 'Insomni\'hack 2023',
    organizer: 'SCRT',
    eventDate: '2023-03-24',
    teamLabel: 'Black Cloud',
    verifiedPlacement: 'Rank 8 Finalist',
    score: '3,100 pts',
    challenges: [
      { name: 'V-Glitcher', category: 'Misc', points: 500, solvedBy: 'DevAdam' },
      { name: 'ColdBoot-AES', category: 'Crypto', points: 400, solvedBy: 'Black Cloud Team' },
    ],
    writeup: `### Hardware Fault Injection Walk-Through
The target was an ARM Cortex-M4 microcontroller executing an AES-128 key generation bootloader. By dropping the VDD rail by 600mV for 40 nanoseconds during cycle 148,220, the instruction counter skipped the signature verification branch, granting root UART console access.`,
    lessonsLearned: 'Hardware counter-measures such as brownout detectors and redundant clock-jitter counters are critical for embedded cryptoprocessors.',
    disclosureNotes: 'Hardware lab details shared responsibly in accordance with academic standards.',
    references: ['https://insomnihack.ch/'],
    featuredImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    publicationStatus: 'published',
    createdAt: '2023-03-27T14:00:00.000Z',
    updatedAt: '2023-03-27T14:00:00.000Z',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
    this.createDummyBuildFiles();
  }

  // Create real binary dummy zip files so downloaded files work out of the box
  private createDummyBuildFiles() {
    const builds = [
      { filename: 'game-1-release-v1.4.2.zip', name: 'Shadow Protocol v1.4.2 Release Build' },
      { filename: 'game-1-playtest-netcode-alpha.zip', name: 'Shadow Protocol Netcode Alpha Playtest' },
      { filename: 'game-2-release-v2.0.1.zip', name: 'Null Sector Breach v2.0.1 Full Release' },
      { filename: 'game-3-test-vortex-v0.8.4.zip', name: 'Vortex Engine v0.8.4 Experimental Test Build' },
    ];

    builds.forEach((b) => {
      const fullPath = path.join(BUILDS_DIR, b.filename);
      if (!fs.existsSync(fullPath)) {
        const dummyContent = `PK\x03\x04\x14\x00\x00\x00\x08\x00Black Cloud Studio Game Build Archive\nTarget: ${b.name}\nStudio: Black Cloud (Founded 2021)\nChecksum: SHA256-${Date.now()}\nVerified Build.\n`;
        fs.writeFileSync(fullPath, dummyContent, 'utf-8');
      }
    });
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed reading database file, initializing fresh:', err);
    }

    const initialDb: DatabaseSchema = {
      games: initialGames,
      news: initialNews,
      tools: initialTools,
      ctf: initialCTF,
      settings: defaultSettings,
      messages: [
        {
          id: 'msg-1',
          name: 'Alex Mercer',
          email: 'alex.mercer@indiegamingpress.com',
          subject: 'Review code request for Shadow Protocol v1.4',
          category: 'Playtest',
          message: 'Hello Black Cloud team, we would love to review your latest Shadow Protocol update for our upcoming indie spotlight column. Great work on the Linux optimization!',
          read: true,
          createdAt: '2026-03-20T14:15:00.000Z',
        },
      ],
      auditLogs: [
        {
          id: 'audit-1',
          timestamp: new Date().toISOString(),
          action: 'SYSTEM_INIT',
          username: 'System',
          details: 'Black Cloud database initialized with persistent schemas.',
        },
      ],
    };

    this.save(initialDb);
    return initialDb;
  }

  private save(dataToSave?: DatabaseSchema) {
    const data = dataToSave || this.data;
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Games
  getGames(publishedOnly = false): Game[] {
    if (publishedOnly) {
      return this.data.games.filter((g) => g.publicationStatus === 'published');
    }
    return this.data.games;
  }

  getGameBySlug(slug: string, publishedOnly = false): Game | undefined {
    return this.data.games.find(
      (g) => g.slug === slug && (!publishedOnly || g.publicationStatus === 'published')
    );
  }

  getGameById(id: string): Game | undefined {
    return this.data.games.find((g) => g.id === id);
  }

  saveGame(game: Game): Game {
    const idx = this.data.games.findIndex((g) => g.id === game.id);
    game.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      this.data.games[idx] = game;
    } else {
      this.data.games.unshift(game);
    }
    this.save();
    return game;
  }

  deleteGame(id: string): boolean {
    const prevLen = this.data.games.length;
    this.data.games = this.data.games.filter((g) => g.id !== id);
    if (this.data.games.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // News
  getNews(publishedOnly = false): NewsArticle[] {
    const list = publishedOnly
      ? this.data.news.filter((n) => n.publicationStatus === 'published')
      : this.data.news;
    return [...list].sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  getNewsBySlug(slug: string, publishedOnly = false): NewsArticle | undefined {
    return this.data.news.find(
      (n) => n.slug === slug && (!publishedOnly || n.publicationStatus === 'published')
    );
  }

  getNewsById(id: string): NewsArticle | undefined {
    return this.data.news.find((n) => n.id === id);
  }

  saveNews(article: NewsArticle): NewsArticle {
    const idx = this.data.news.findIndex((n) => n.id === article.id);
    article.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      this.data.news[idx] = article;
    } else {
      this.data.news.unshift(article);
    }
    this.save();
    return article;
  }

  deleteNews(id: string): boolean {
    const prevLen = this.data.news.length;
    this.data.news = this.data.news.filter((n) => n.id !== id);
    if (this.data.news.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Tools
  getTools(): SecurityTool[] {
    return [...this.data.tools].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getToolBySlug(slug: string): SecurityTool | undefined {
    return this.data.tools.find((t) => t.slug === slug);
  }

  getToolById(id: string): SecurityTool | undefined {
    return this.data.tools.find((t) => t.id === id);
  }

  saveTool(tool: SecurityTool): SecurityTool {
    const idx = this.data.tools.findIndex((t) => t.id === tool.id);
    tool.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      this.data.tools[idx] = tool;
    } else {
      this.data.tools.push(tool);
    }
    this.save();
    return tool;
  }

  deleteTool(id: string): boolean {
    const prevLen = this.data.tools.length;
    this.data.tools = this.data.tools.filter((t) => t.id !== id);
    if (this.data.tools.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // CTF
  getCTF(publishedOnly = false): CTFEntry[] {
    const list = publishedOnly
      ? this.data.ctf.filter((c) => c.publicationStatus === 'published')
      : this.data.ctf;
    return [...list].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }

  getCTFBySlug(slug: string, publishedOnly = false): CTFEntry | undefined {
    return this.data.ctf.find(
      (c) => c.slug === slug && (!publishedOnly || c.publicationStatus === 'published')
    );
  }

  getCTFById(id: string): CTFEntry | undefined {
    return this.data.ctf.find((c) => c.id === id);
  }

  saveCTF(entry: CTFEntry): CTFEntry {
    const idx = this.data.ctf.findIndex((c) => c.id === entry.id);
    entry.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      this.data.ctf[idx] = entry;
    } else {
      this.data.ctf.unshift(entry);
    }
    this.save();
    return entry;
  }

  deleteCTF(id: string): boolean {
    const prevLen = this.data.ctf.length;
    this.data.ctf = this.data.ctf.filter((c) => c.id !== id);
    if (this.data.ctf.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Settings
  getSettings(): StudioSettings {
    return this.data.settings || defaultSettings;
  }

  saveSettings(newSettings: Partial<StudioSettings>): StudioSettings {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.settings;
  }

  // Messages
  getMessages(): ContactMessage[] {
    return [...this.data.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addMessage(msg: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>): ContactMessage {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...msg,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.data.messages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  markMessageRead(id: string, read = true): boolean {
    const msg = this.data.messages.find((m) => m.id === id);
    if (msg) {
      msg.read = read;
      this.save();
      return true;
    }
    return false;
  }

  deleteMessage(id: string): boolean {
    const prevLen = this.data.messages.length;
    this.data.messages = this.data.messages.filter((m) => m.id !== id);
    if (this.data.messages.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Audit Logs
  logAudit(action: string, username: string, details?: string, ip?: string) {
    const log: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      username,
      details,
      ip,
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    this.save();
    return log;
  }

  getAuditLogs(): AuditLogEntry[] {
    return this.data.auditLogs || [];
  }

  // Statistics for Dashboard
  getStats() {
    const games = this.data.games;
    const news = this.data.news;
    const tools = this.data.tools;
    const ctf = this.data.ctf;
    const messages = this.data.messages;

    return {
      totalGames: games.length,
      publishedGames: games.filter((g) => g.publicationStatus === 'published').length,
      gamesDownloadable: games.filter(
        (g) => g.publicationStatus === 'published' && (g.availabilityMode === 'download' || g.availabilityMode === 'download_and_test') && !!g.releaseBuildStoragePath
      ).length,
      gamesTesting: games.filter(
        (g) => g.publicationStatus === 'published' && (g.availabilityMode === 'test_only' || g.availabilityMode === 'download_and_test')
      ).length,
      totalNews: news.length,
      publishedNews: news.filter((n) => n.publicationStatus === 'published').length,
      draftNews: news.filter((n) => n.publicationStatus === 'draft').length,
      totalTools: tools.length,
      totalCTF: ctf.length,
      totalMessages: messages.length,
      unreadMessages: messages.filter((m) => !m.read).length,
    };
  }
}

export const db = new Database();
export { DATA_DIR, UPLOADS_DIR, BUILDS_DIR };
