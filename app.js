import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

// Shared logic for every page layout. Pages only need to provide the element ids
// used below; all visual styling (including 3D scene colors) comes from CSS.

// Send a GA4 event; no-op if gtag is blocked or not loaded
function track(name, params = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', name, params);
    }
}

// Embedded data from Beluga_in_captivity_china_2025_tank.csv
const aquariums = [
    {
        "facility_id": "4",
        "facility_status": "营业中",
        "name": "北京海洋馆",
        "city": "北京",
        "province": "北京",
        "beluga_present": "1",
        "beluga_count": "1",
        "beluga_count_year": "2024",
        "tank_size ( L * W * H)": "20m * 5m * 5m",
        "shows_with_beluga": "白鲸表演",
        "close_contact_programs": "",
        "welfare_flags": "",
        "detail_url": "",
        "info_source_primary": "CCA_2024_report",
        "info_source_update": "",
        "last_checked_date": ""
    },
    {
        "facility_id": "23",
        "facility_status": "营业中",
        "name": "广州海洋馆",
        "city": "广州",
        "province": "广东",
        "beluga_present": "1",
        "beluga_count": "2",
        "beluga_count_year": "2024",
        "tank_size ( L * W * H)": "20m * 6m * 5m",
        "shows_with_beluga": "白鲸表演",
        "close_contact_programs": "",
        "welfare_flags": "",
        "detail_url": "",
        "info_source_primary": "CCA_2024_report",
        "info_source_update": "",
        "last_checked_date": ""
    },
    {
        "facility_id": "34",
        "facility_status": "营业中",
        "name": "多彩贵州城极地海洋世界",
        "city": "贵州",
        "province": "贵州",
        "beluga_present": "1",
        "beluga_count": "1",
        "beluga_count_year": "2024",
        "tank_size ( L * W * H)": "10m * 5m * 6m",
        "shows_with_beluga": "白鲸表演",
        "close_contact_programs": "",
        "welfare_flags": "",
        "detail_url": "",
        "info_source_primary": "CCA_2024_report",
        "info_source_update": "",
        "last_checked_date": ""
    },
    {
        "facility_id": "36",
        "facility_status": "营业中",
        "name": "三亚亚特兰蒂斯海豚湾",
        "city": "三亚",
        "province": "海南",
        "beluga_present": "1",
        "beluga_count": "2",
        "beluga_count_year": "2024",
        "tank_size ( L * W * H)": "14m *  8m * 6m",
        "shows_with_beluga": "白鲸表演",
        "close_contact_programs": "",
        "welfare_flags": "",
        "detail_url": "",
        "info_source_primary": "CCA_2024_report",
        "info_source_update": "",
        "last_checked_date": ""
    },
    {
        "facility_id": "59",
        "facility_status": "营业中",
        "name": "长沙海底世界",
        "city": "长沙",
        "province": "湖南",
        "beluga_present": "1",
        "beluga_count": "3",
        "beluga_count_year": "2024",
        "tank_size ( L * W * H)": "15m *  10m * 10m ",
        "shows_with_beluga": "白鲸表演",
        "close_contact_programs": "",
        "welfare_flags": "",
        "detail_url": "",
        "info_source_primary": "CCA_2024_report",
        "info_source_update": "",
        "last_checked_date": ""
    },
    {
        "facility_id": "77",
        "facility_status": "营业中",
        "name": "大连老虎滩海洋公园",
        "city": "大连",
        "province": "辽宁",
        "beluga_present": "1",
        "beluga_count": "3",
        "beluga_count_year": "2024",
        "tank_size ( L * W * H)": "16m * 5m * 4m",
        "shows_with_beluga": "白鲸表演",
        "close_contact_programs": "",
        "welfare_flags": "",
        "detail_url": "",
        "info_source_primary": "CCA_2024_report",
        "info_source_update": "",
        "last_checked_date": ""
    },
    {
        "facility_id": "98",
        "facility_status": "营业中",
        "name": "成都极地海洋公园",
        "city": "成都",
        "province": "四川",
        "beluga_present": "1",
        "beluga_count": "6",
        "beluga_count_year": "2024",
        "tank_size ( L * W * H)": "20m * 15m * 10m",
        "shows_with_beluga": "白鲸表演",
        "close_contact_programs": "",
        "welfare_flags": "",
        "detail_url": "",
        "info_source_primary": "CCA_2024_report",
        "info_source_update": "",
        "last_checked_date": ""
    },
    {
        "facility_id": "104",
        "facility_status": "营业中",
        "name": "石林冰雪海洋世界",
        "city": "石林",
        "province": "云南",
        "beluga_present": "1",
        "beluga_count": "4",
        "beluga_count_year": "2024",
        "tank_size ( L * W * H)": "20m * 5m * 6m",
        "shows_with_beluga": "白鲸表演",
        "close_contact_programs": "",
        "welfare_flags": "",
        "detail_url": "",
        "info_source_primary": "CCA_2024_report",
        "info_source_update": "",
        "last_checked_date": ""
    }
];

const $ = (id) => document.getElementById(id);

const select = $('aquarium-select');
const tankContainer = $('tank-container');
const loadStatus = $('load-status'); // optional
const btnTank = $('btn-tank');
const btnHuman = $('btn-human');

// ---------- Audio (fetched only when the user turns it on) ----------
const belugaAudio = $('beluga-audio');
const belugaAudioToggle = $('beluga-audio-toggle');
const belugaAudioLabel = $('beluga-audio-label');
let belugaAudioOn = false;
let audioToggleTrigger = 'manual'; // 'auto' when toggled by the first-page-click handler

function updateBelugaAudioUI() {
    belugaAudioToggle.setAttribute('aria-pressed', String(belugaAudioOn));
    if (belugaAudioLabel) {
        belugaAudioLabel.textContent = belugaAudioOn ? '白鲸叫声 · 开' : '白鲸叫声 · 关';
    }
}

async function toggleBelugaAudio() {
    const trigger = audioToggleTrigger;
    audioToggleTrigger = 'manual';
    try {
        if (belugaAudioOn) {
            belugaAudio.pause();
            belugaAudioOn = false;
        } else {
            await belugaAudio.play();
            belugaAudioOn = true;
        }
        updateBelugaAudioUI();
        track('audio_toggle', { state: belugaAudioOn ? 'on' : 'off', trigger });
    } catch (err) {
        console.log('Beluga audio toggle error', err);
    }
}

if (belugaAudio && belugaAudioToggle) {
    belugaAudio.volume = 0.25;
    belugaAudioToggle.addEventListener('click', toggleBelugaAudio);
    updateBelugaAudioUI();

    // First click anywhere on the page turns the sound on
    window.addEventListener('click', (e) => {
        if (belugaAudioOn || belugaAudioToggle.contains(e.target)) return;
        audioToggleTrigger = 'auto';
        toggleBelugaAudio();
    }, { once: true });
}

// ---------- Aquarium select + info ----------
select.innerHTML = '';
aquariums.forEach((aquarium, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${aquarium.name} · ${aquarium.city}`;
    select.appendChild(option);
});

const scene3d = initThreeJS();

function updateInfo(aquarium) {
    $('info-name').textContent = aquarium.name;
    $('info-size').textContent = (aquarium['tank_size ( L * W * H)'] || 'Unknown').replace(/\s+/g, ' ').replace(/\s*\*\s*/g, ' × ').trim();
    $('info-count').textContent = `${aquarium.beluga_count} 头`;
    $('info-location').textContent = `${aquarium.city}, ${aquarium.province}`;
    scene3d.updateTankSize(aquarium);
    scene3d.updateBelugas(parseInt(aquarium.beluga_count) || 1);

    // The same tank at human scale (4m beluga -> 1.7m person)
    const asHuman = $('info-human');
    if (asHuman) {
        const [l, w, h] = scene3d.tankDims().map(v => v * 1.7 / 4);
        asHuman.textContent = `${l.toFixed(1)}m × ${w.toFixed(1)}m，约 ${Math.round(l * w)}㎡，层高 ${h.toFixed(1)}m`;
    }
}

select.addEventListener('change', (e) => {
    const a = aquariums[e.target.value];
    updateInfo(a);
    track('select_aquarium', { aquarium_name: a.name, city: a.city });
});

updateInfo(aquariums[0]);

// ---------- View mode ----------
function setMode(human) {
    btnTank.setAttribute('aria-pressed', String(!human));
    btnHuman.setAttribute('aria-pressed', String(human));
    scene3d.setHumanScaleMode(human);
    document.body.dataset.mode = human ? 'human' : 'tank';
}
btnTank.addEventListener('click', () => { setMode(false); track('view_mode', { mode: 'tank' }); });
btnHuman.addEventListener('click', () => { setMode(true); track('view_mode', { mode: 'human' }); });
setMode(false);

// ---------- Three.js ----------
function initThreeJS() {
    // Scene colors are read from CSS custom properties on the container
    const css = getComputedStyle(tankContainer);
    const cssVar = (name, fallback) => (css.getPropertyValue(name) || '').trim() || fallback;
    const theme = {
        accent: new THREE.Color(cssVar('--scene-accent', '#00a3ff')),
        label: cssVar('--scene-label', 'rgba(255,255,255,0.9)'),
        labelLine: new THREE.Color(cssVar('--scene-label-line', '#ffffff')),
        labelFont: cssVar('--scene-font', '500 30px -apple-system, "PingFang SC", sans-serif'),
        glassOpacity: parseFloat(cssVar('--scene-glass-opacity', '0.08')),
        lineOpacity: parseFloat(cssVar('--scene-line-opacity', '0.35')),
        gridColor: new THREE.Color(cssVar('--scene-grid', '#333333')),
        gridOpacity: parseFloat(cssVar('--scene-grid-opacity', '0.08')),
        ambient: parseFloat(cssVar('--scene-ambient', '0.5')),
        belugaEmissive: new THREE.Color(cssVar('--scene-beluga-emissive', '#004488')),
        humanEmissive: new THREE.Color(cssVar('--scene-human-emissive', '#88ccff')),
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
    camera.position.set(6, 6, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    // Cap pixel ratio: 3x phones would otherwise render 9x the pixels
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    tankContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 60;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;

    scene.add(new THREE.AmbientLight(0x404040, theme.ambient));
    const spotLight = new THREE.SpotLight(theme.accent, 20);
    spotLight.position.set(0, 15, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.decay = 1;
    spotLight.distance = 50;
    scene.add(spotLight);
    // Soft fill so the models read on light backgrounds too
    const fill = new THREE.HemisphereLight(0xffffff, 0x223344, theme.ambient * 0.6);
    scene.add(fill);

    // === Tank base geometry (20m x 5m x 5m), scaled per facility ===
    const BASE_TANK_LENGTH = 20;
    const BASE_TANK_WIDTH = 5;
    const BASE_TANK_HEIGHT = 5;
    let tankLength = BASE_TANK_LENGTH;
    let tankWidth = BASE_TANK_WIDTH;
    let tankHeight = BASE_TANK_HEIGHT;
    let dimensionGroup = null;
    let labelScale = 1; // grows with camera distance so labels stay readable on small screens

    const tankGroup = new THREE.Group();
    scene.add(tankGroup);
    const tankGeometry = new THREE.BoxGeometry(BASE_TANK_LENGTH, BASE_TANK_HEIGHT, BASE_TANK_WIDTH);
    tankGroup.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(tankGeometry),
        new THREE.LineBasicMaterial({ color: theme.accent, transparent: true, opacity: theme.lineOpacity })
    ));
    // Plain transparent glass: the old transmission material cost an extra full render pass per frame
    tankGroup.add(new THREE.Mesh(tankGeometry, new THREE.MeshBasicMaterial({
        color: theme.accent,
        transparent: true,
        opacity: theme.glassOpacity,
        depthWrite: false,
        side: THREE.DoubleSide,
    })));

    const gridHelper = new THREE.GridHelper(50, 50, theme.gridColor, theme.gridColor);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = theme.gridOpacity;
    gridHelper.position.y = -BASE_TANK_HEIGHT / 2;
    scene.add(gridHelper);

    // Architectural dimension line: extension lines, dimension line, ticks and a text label
    function createDimension(p1, p2, text, offsetVector) {
        const group = new THREE.Group();
        const p1Ext = p1.clone().add(offsetVector);
        const p2Ext = p2.clone().add(offsetVector);
        const material = new THREE.LineBasicMaterial({ color: theme.labelLine, transparent: true, opacity: 0.7, depthTest: false });
        const line = (a, b) => group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), material));

        const offDir = offsetVector.clone().normalize();
        const overshoot = offDir.clone().multiplyScalar(0.2);
        line(p1, p1Ext.clone().add(overshoot));
        line(p2, p2Ext.clone().add(overshoot));
        line(p1Ext, p2Ext);

        const dimDir = new THREE.Vector3().subVectors(p2, p1).normalize();
        const tickVec = new THREE.Vector3().addVectors(dimDir, offDir).normalize().multiplyScalar(0.2);
        line(p1Ext.clone().sub(tickVec), p1Ext.clone().add(tickVec));
        line(p2Ext.clone().sub(tickVec), p2Ext.clone().add(tickVec));

        // Label drawn at 2x for crisp text
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.font = theme.labelFont;
        ctx.fillStyle = theme.label;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 64);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
        sprite.position.addVectors(p1Ext, p2Ext).multiplyScalar(0.5).add(offDir.clone().multiplyScalar(0.5));
        sprite.scale.set(4 * labelScale, labelScale, 1);
        group.add(sprite);
        return group;
    }

    function formatMeters(v) {
        const rounded = Math.round(v * 10) / 10;
        return Number.isInteger(rounded) ? `${rounded}m` : `${rounded.toFixed(1)}m`;
    }

    function disposeGroup(group) {
        group.traverse((node) => {
            if (node.geometry) node.geometry.dispose();
            if (node.material) {
                if (node.material.map) node.material.map.dispose();
                node.material.dispose();
            }
        });
    }

    function rebuildDimensions() {
        if (dimensionGroup) {
            disposeGroup(dimensionGroup);
            scene.remove(dimensionGroup);
        }
        dimensionGroup = new THREE.Group();
        scene.add(dimensionGroup);

        const halfL = tankLength / 2;
        const halfW = tankWidth / 2;
        const halfH = tankHeight / 2;
        // In human mode labels show the "human-equivalent" room size
        const f = isHumanScale ? HUMAN_EQUIV_FACTOR : 1;

        dimensionGroup.add(createDimension(
            new THREE.Vector3(-halfL, -halfH, halfW), new THREE.Vector3(halfL, -halfH, halfW),
            formatMeters(tankLength * f), new THREE.Vector3(0, 0, 1.5)));
        dimensionGroup.add(createDimension(
            new THREE.Vector3(halfL, -halfH, halfW), new THREE.Vector3(halfL, halfH, halfW),
            formatMeters(tankHeight * f), new THREE.Vector3(1.5, 0, 0)));
        dimensionGroup.add(createDimension(
            new THREE.Vector3(halfL, -halfH, halfW), new THREE.Vector3(halfL, -halfH, -halfW),
            formatMeters(tankWidth * f), new THREE.Vector3(1.5, 0, 0)));
    }

    // Parse strings like "20m * 5m * 5m"
    function parseTankSize(str) {
        const fallback = { length: BASE_TANK_LENGTH, width: BASE_TANK_WIDTH, height: BASE_TANK_HEIGHT };
        if (!str) return fallback;
        const nums = str.split('*').map(s => parseFloat((s.match(/[\d.]+/) || [])[0]));
        if (nums.length !== 3 || nums.some(isNaN)) return fallback;
        return { length: nums[0], width: nums[1], height: nums[2] };
    }

    // Place the camera so the whole tank (plus labels) fits the current container
    const viewDir = camera.position.clone().normalize();
    const portraitDir = new THREE.Vector3(14, 9, 14).normalize();
    let userRotated = false;
    controls.addEventListener('start', () => { userRotated = true; });
    function fitCamera() {
        const w = tankContainer.clientWidth || 1;
        const h = tankContainer.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);

        // Box around the tank including the dimension lines (they sit +1.5..2.5m outside)
        const hx = tankLength / 2, hy = tankHeight / 2, hz = tankWidth / 2;
        const corners = [];
        for (const x of [-hx, hx + 2.5]) for (const y of [-hy, hy]) for (const z of [-hz, hz + 2.5]) {
            corners.push(new THREE.Vector3(x, y, z));
        }
        // Until the user rotates, portrait screens look along the tank's diagonal so it fills more of the frame
        const dir = userRotated
            ? camera.position.clone().sub(controls.target).normalize()
            : (camera.aspect < 1 ? portraitDir : viewDir).clone();

        // Binary-search the closest distance at which every corner lands inside the frame
        const fits = (d) => {
            camera.position.copy(controls.target).addScaledVector(dir, d);
            camera.lookAt(controls.target);
            camera.updateMatrixWorld();
            return corners.every(c => {
                const p = c.clone().project(camera);
                return Math.abs(p.x) < 0.92 && Math.abs(p.y) < 0.85 && p.z < 1;
            });
        };
        let lo = 5, hi = 200;
        for (let i = 0; i < 24; i++) {
            const mid = (lo + hi) / 2;
            if (fits(mid)) hi = mid; else lo = mid;
        }
        fits(hi);
        labelScale = Math.max(1, hi / 20);
        dimensionGroup?.traverse((n) => { if (n.isSprite) n.scale.set(4 * labelScale, labelScale, 1); });
        controls.maxDistance = Math.max(60, hi * 1.6);
    }

    function updateTankSize(aquarium) {
        ({ length: tankLength, width: tankWidth, height: tankHeight } = parseTankSize(aquarium['tank_size ( L * W * H)']));
        tankGroup.scale.set(tankLength / BASE_TANK_LENGTH, tankHeight / BASE_TANK_HEIGHT, tankWidth / BASE_TANK_WIDTH);
        gridHelper.position.y = -tankHeight / 2;
        rebuildDimensions();
        repositionHumanForTank();
        if (activeBelugas.length) layoutSwim();
        fitCamera();
    }

    // ---------- Models (progressive: beluga first, human after) ----------
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const mixers = [];
    const updatables = [];
    const clock = new THREE.Clock();

    function setStatus(text, progress) {
        if (!loadStatus) return;
        loadStatus.hidden = !text;
        loadStatus.textContent = text || '';
        if (progress != null) loadStatus.style.setProperty('--progress', progress);
    }

    // Fade newly loaded materials from transparent to opaque
    const fading = [];
    function fadeIn(root) {
        root.traverse((node) => {
            if (!node.isMesh) return;
            const m = node.material;
            m.transparent = true;
            m.opacity = 0;
            fading.push(m);
        });
    }

    // === Human ===
    const HUMAN_HEIGHT = 1.7;
    const BELUGA_LENGTH = 4.0;
    const HUMAN_AS_BELUGA_SCALE = BELUGA_LENGTH / HUMAN_HEIGHT;
    const HUMAN_EQUIV_FACTOR = HUMAN_HEIGHT / BELUGA_LENGTH; // ≈ 0.425
    let isHumanScale = false;
    let human = null;
    let humanLoading = false;

    function loadHuman() {
        if (humanLoading) return;
        humanLoading = true;
        loader.load('human.glb', (gltf) => {
            const h = gltf.scene;
            h.traverse((node) => {
                if (node.isMesh) {
                    node.material.emissive = theme.humanEmissive;
                    node.material.emissiveIntensity = 0.5;
                    node.material.color = new THREE.Color(0xffffff);
                }
            });
            scene.add(h);
            human = h;
            fadeIn(h);

            const mixer = new THREE.AnimationMixer(h);
            const clip = gltf.animations.find(a => a.name === '2953314151920_TempMotion') || gltf.animations[0];
            if (clip) mixer.clipAction(clip).play();
            mixers.push(mixer);

            h.userData.speed = 1.0;
            h.userData.direction = 1;
            h.userData.update = (delta) => {
                const range = h.userData.patrolRange;
                h.position.x += h.userData.speed * delta * h.userData.direction;
                if (h.position.x > range) {
                    h.userData.direction = -1;
                    h.rotation.y = -Math.PI / 2;
                } else if (h.position.x < -range) {
                    h.userData.direction = 1;
                    h.rotation.y = Math.PI / 2;
                }
            };
            updatables.push(h);
            repositionHumanForTank();
            if (isHumanScale) setStatus('');
        });
    }

    function repositionHumanForTank() {
        if (!human) return;
        const floorY = -tankHeight / 2;
        if (isHumanScale) {
            // Human becomes "beluga sized" and trapped inside
            human.scale.setScalar(HUMAN_AS_BELUGA_SCALE);
            const range = tankLength / 2 - 1.0;
            human.position.set(-range, floorY, 0);
            human.userData.patrolRange = range;
        } else {
            // Human as a size reference walking outside the tank
            human.scale.setScalar(1);
            const range = tankLength / 2;
            human.position.set(-range, floorY, tankWidth / 2 + 1.0);
            human.userData.patrolRange = range;
        }
        human.rotation.y = Math.PI / 2;
        human.userData.direction = 1;
    }

    function setHumanScaleMode(flag) {
        isHumanScale = flag;
        if (flag && !human) {
            setStatus('人物模型加载中…');
            loadHuman();
        }
        repositionHumanForTank();
        rebuildDimensions();
        updateBelugas(desiredBelugaCount);
    }

    // === Belugas ===
    let belugaTemplate = null;
    let belugaAnimation = null;
    let desiredBelugaCount = 1;
    const activeBelugas = [];

    // Space one beluga really occupies over its whole swim animation (group-local, centered).
    // Measured from the skinned (posed) mesh: the raw mesh sits ~2m away from where it is drawn.
    const body = { halfLen: 2, halfSide: 0.6, halfHeight: 0.7 };
    // Shared swim path, recomputed whenever the tank or the beluga count changes
    const swim = { a: 1, b: 1, omega: 0.2, phase: 0, yMin: 0, yMax: 0, laneYs: [0], laneAmp: 0 };
    const SWIM_SPEED = 1.2;  // m/s along the path
    const WALL_GAP = 0.15;   // keep a little water between body and glass
    const WATER_GAP = 0.3;   // water surface sits below the tank rim

    // Sweep the animation. Vertical limits use the full bounds (never break the surface);
    // horizontal limits use the typical swimming pose, because a brief head turn swings the
    // body much wider/longer and would leave no room to turn around in 5m-wide tanks
    function measureSwimBox(model, clip) {
        const mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(clip).play();
        const box = new THREE.Box3();
        const frame = new THREE.Box3();
        const widths = [];
        const lengths = [];
        const centersX = [];
        const centersZ = [];
        const steps = 80;
        for (let i = 0; i < steps; i++) {
            mixer.setTime(clip.duration * i / steps);
            model.updateMatrixWorld(true);
            frame.setFromObject(model, true);
            box.union(frame);
            widths.push(frame.max.x - frame.min.x);
            centersX.push((frame.max.x + frame.min.x) / 2);
            lengths.push(frame.max.z - frame.min.z);
            centersZ.push((frame.max.z + frame.min.z) / 2);
        }
        mixer.stopAllAction();
        mixer.uncacheRoot(model);
        const median = (arr) => arr.sort((p, q) => p - q)[Math.floor(arr.length / 2)];
        return {
            box,
            typicalWidth: median(widths),
            typicalLength: median(lengths),
            typicalCenter: new THREE.Vector3(median(centersX), 0, median(centersZ)),
        };
    }

    // Which walls does the oriented body (nose, tail and flanks) cross somewhere on this ellipse?
    function ellipseOverflow(a, b, halfL, halfW) {
        const over = { x: false, z: false };
        for (let i = 0; i < 48; i++) {
            const t = (i / 48) * Math.PI * 2;
            const px = Math.cos(t) * a, pz = Math.sin(t) * b;
            let fx = -Math.sin(t) * a, fz = Math.cos(t) * b;
            const len = Math.hypot(fx, fz) || 1;
            fx /= len; fz /= len;
            for (const s of [-1, 1]) for (const k of [-1, 1]) {
                const x = px + fx * body.halfLen * s + fz * body.halfSide * k;
                const z = pz + fz * body.halfLen * s - fx * body.halfSide * k;
                if (Math.abs(x) > halfL) over.x = true;
                if (Math.abs(z) > halfW) over.z = true;
            }
        }
        return over;
    }

    function layoutSwim() {
        const halfL = tankLength / 2 - WALL_GAP;
        const halfW = tankWidth / 2 - WALL_GAP;
        let a = Math.max(0.05, halfL - body.halfSide);
        let b = Math.max(0.05, halfW - body.halfSide);
        // Pull in whichever side of the loop crosses a wall
        for (let i = 0; i < 400; i++) {
            const over = ellipseOverflow(a, b, halfL, halfW);
            if (!over.x && !over.z) break;
            if (over.z && b > 0.05) b = Math.max(0.05, b - 0.05);
            else if (a > 0.05) a = Math.max(0.05, a - 0.05);
            else break;
        }
        swim.a = a;
        swim.b = b;
        // Ramanujan's ellipse perimeter; constant speed in m/s regardless of tank size
        const perimeter = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
        swim.omega = SWIM_SPEED * 2 * Math.PI / perimeter;

        // Vertical room for the body center: above the floor, below the water surface
        let yMin = -tankHeight / 2 + WALL_GAP + body.halfHeight;
        let yMax = tankHeight / 2 - WATER_GAP - body.halfHeight;
        if (yMax < yMin) yMin = yMax = (yMin + yMax) / 2;

        // Belugas follow each other evenly spaced on the loop; if they can't all fit
        // nose-to-tail, extra ones swim the opposite way at another depth
        const n = activeBelugas.length;
        const perLoop = Math.max(1, Math.floor(perimeter / (body.halfLen * 2 * 1.3)));
        // Each depth layer is a band at least one body tall, so layers never overlap
        const range = yMax - yMin;
        const maxLanes = Math.max(1, Math.floor(range / (body.halfHeight * 2)));
        const lanes = Math.min(maxLanes, Math.max(1, Math.ceil(n / perLoop)));
        const band = range / lanes;
        swim.laneYs = Array.from({ length: lanes }, (_, i) => yMin + band * (i + 0.5));
        swim.laneAmp = lanes === 1 ? range / 2 : Math.max(0, band / 2 - body.halfHeight);

        activeBelugas.forEach((group, i) => {
            const lane = i % lanes;
            const inLane = Math.ceil((n - lane) / lanes);
            const slot = Math.floor(i / lanes);
            group.userData.lane = lane;
            group.userData.dir = lane % 2 ? -1 : 1;
            group.userData.offset = (slot / inLane) * Math.PI * 2 + lane * Math.PI / lanes;
        });
    }

    // Advance the shared path once per frame
    updatables.push({ userData: { update: (delta) => { swim.phase += swim.omega * delta; } } });

    setStatus('白鲸游进水缸… 0%', 0);
    loader.load('beluga.glb', (gltf) => {
        belugaTemplate = gltf.scene;
        belugaAnimation = gltf.animations[0];

        // Scale the posed body to ~4m long
        belugaTemplate.updateMatrixWorld(true);
        const rest = new THREE.Box3().setFromObject(belugaTemplate, true).getSize(new THREE.Vector3());
        belugaTemplate.scale.setScalar(BELUGA_LENGTH / Math.max(rest.x, rest.y, rest.z));

        // Center on the space it sweeps while swimming, and remember its extents
        const swimBox = measureSwimBox(belugaTemplate, belugaAnimation);
        const center = swimBox.typicalCenter;
        center.y = (swimBox.box.min.y + swimBox.box.max.y) / 2;
        belugaTemplate.position.sub(center);
        body.halfSide = swimBox.typicalWidth / 2;
        body.halfLen = swimBox.typicalLength / 2;
        body.halfHeight = (swimBox.box.max.y - swimBox.box.min.y) / 2;

        belugaTemplate.traverse((node) => {
            if (node.isMesh) {
                node.material.emissive = theme.belugaEmissive;
                node.material.emissiveIntensity = 0.3;
            }
        });
        // Clones share this material, so fading the template fades them all
        fadeIn(belugaTemplate);

        setStatus('');
        updateBelugas(desiredBelugaCount);
        // Human is a secondary element: fetch it once the main model is in
        loadHuman();
    }, (e) => {
        if (e.total) {
            const p = e.loaded / e.total;
            setStatus(`白鲸游进水缸… ${Math.round(p * 100)}%`, p);
        }
    }, () => {
        setStatus('白鲸模型加载失败，请刷新重试');
    });

    function updateBelugas(count) {
        desiredBelugaCount = count;
        if (!belugaTemplate) return;
        const effectiveCount = isHumanScale ? 0 : count;

        while (activeBelugas.length > effectiveCount) {
            const group = activeBelugas.pop();
            updatables.splice(updatables.indexOf(group), 1);
            const mixer = group.userData.mixer;
            mixer.stopAllAction();
            mixer.uncacheRoot(mixer.getRoot());
            mixers.splice(mixers.indexOf(mixer), 1);
            // Geometry/materials are shared with the template, so don't dispose them here
            scene.remove(group);
        }

        while (activeBelugas.length < effectiveCount) {
            const group = new THREE.Group();
            const model = SkeletonUtils.clone(belugaTemplate);
            group.add(model);
            scene.add(group);
            activeBelugas.push(group);
            updatables.push(group);

            const mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(belugaAnimation);
            action.time = Math.random() * belugaAnimation.duration;
            action.play();
            mixers.push(mixer);
            group.userData.mixer = mixer;

            const bobOffset = Math.random() * Math.PI * 2;
            group.userData.update = (delta, time) => {
                const { dir, offset, lane } = group.userData;
                const t = dir * swim.phase + offset;
                group.position.set(
                    Math.cos(t) * swim.a,
                    swim.laneYs[lane] + Math.sin(time * 0.12 + bobOffset) * swim.laneAmp,
                    Math.sin(t) * swim.b
                );
                // Face along the path (+z is the model's nose)
                group.rotation.y = Math.atan2(-Math.sin(t) * swim.a * dir, Math.cos(t) * swim.b * dir);
            };
        }
        layoutSwim();
    }

    // ---------- Render loop (paused while the canvas is off screen) ----------
    function animate() {
        const delta = Math.min(clock.getDelta(), 0.1);
        const time = clock.getElapsedTime();

        for (let i = fading.length - 1; i >= 0; i--) {
            const m = fading[i];
            m.opacity = Math.min(1, m.opacity + delta * 1.5);
            if (m.opacity >= 1) {
                m.transparent = false;
                m.needsUpdate = true;
                fading.splice(i, 1);
            }
        }
        for (const mixer of mixers) mixer.update(delta);
        for (const obj of updatables) obj.userData.update(delta, time);

        controls.update();
        renderer.render(scene, camera);
    }

    let running = false;
    function setRunning(on) {
        if (on === running) return;
        running = on;
        if (on) clock.getDelta();
        renderer.setAnimationLoop(on ? animate : null);
    }
    new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting)).observe(tankContainer);
    setRunning(true);

    new ResizeObserver(() => fitCamera()).observe(tankContainer);

    return { updateBelugas, updateTankSize, setHumanScaleMode, tankDims: () => [tankLength, tankWidth, tankHeight] };
}
