import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

console.log('App.js loaded');

document.addEventListener('DOMContentLoaded', () => {
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

    // DOM Elements
    const select = document.getElementById('aquarium-select');
    const infoName = document.getElementById('info-name');
    const infoSize = document.getElementById('info-size');
    const infoCount = document.getElementById('info-count');
    const infoLocation = document.getElementById('info-location');
    const tankContainer = document.getElementById('tank-container');

    // State
    let sceneUpdateFn = null;

    // Initialize UI
    populateDropdown(aquariums);

    // Initialize Three.js
    sceneUpdateFn = initThreeJS();

    // Initial load
    if (aquariums.length > 0) {
        updateInfo(aquariums[0]);
    }

    // View Mode Toggle Logic
    const btnTank = document.getElementById('btn-tank');
    const btnHuman = document.getElementById('btn-human');

    setActiveMode(btnTank, btnHuman);

    // Populate Dropdown
    function populateDropdown(data) {
        select.innerHTML = '';
        data.forEach((aquarium, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${aquarium.name} - ${aquarium.city}`;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            const selectedIndex = e.target.value;
            updateInfo(data[selectedIndex]);
        });
    }

    btnTank.addEventListener('click', () => {
        // 切换到「正常 Tank 模式」
        if (sceneUpdateFn) {
            sceneUpdateFn.setHumanScaleMode(false);
        }

        // 按钮 UI 状态
        setActiveMode(btnTank, btnHuman);
    });

    btnHuman.addEventListener('click', () => {
        // 切换到「Human Scale 模式」
        if (sceneUpdateFn) {
            sceneUpdateFn.setHumanScaleMode(true);
        }

        // 按钮 UI 状态
        setActiveMode(btnHuman, btnTank);
    });

    // Update Info Cards
    function updateInfo(aquarium) {
        infoName.textContent = aquarium.name;
        infoSize.textContent = aquarium['tank_size ( L * W * H)'] || 'Unknown';
        infoCount.textContent = `${aquarium.beluga_count} 头`;
        infoLocation.textContent = `${aquarium.city}, ${aquarium.province}`;

        // Update 3D Scene
        if (sceneUpdateFn) {
            // 先更新鱼缸尺寸
            sceneUpdateFn.updateTankSize(aquarium);
            const count = parseInt(aquarium.beluga_count) || 1;
            sceneUpdateFn.updateBelugas(count);
        }
    }



    function setActiveMode(activeBtn, inactiveBtn) {
        activeBtn.classList.add('bg-accent-blue', 'text-white', 'shadow-lg');
        activeBtn.classList.remove('text-gray-400', 'hover:text-white');

        inactiveBtn.classList.remove('bg-accent-blue', 'text-white', 'shadow-lg');
        inactiveBtn.classList.add('text-gray-400', 'hover:text-white');
    }


    // Three.js Implementation
    function initThreeJS() {
        // Remove placeholder
        tankContainer.innerHTML = '';

        // Scene Setup
        const scene = new THREE.Scene();

        let human = null;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, tankContainer.clientWidth / tankContainer.clientHeight, 0.1, 100);
        camera.position.set(6, 6, 20);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(tankContainer.clientWidth, tankContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        tankContainer.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 10; // Prevent getting too close (inside tank walls)
        controls.maxDistance = 60; // Prevent getting too far
        controls.maxPolarAngle = Math.PI / 2; // Prevent going below the floor
        controls.enablePan = false; // Keep focus on center

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0x00A3FF, 20);
        spotLight.position.set(0, 15, 0);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.5;
        spotLight.decay = 1;
        spotLight.distance = 50;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        scene.add(spotLight);


        // === Tank 基准几何 (20m x 5m x 5m) ===
        const BASE_TANK_LENGTH = 20;
        const BASE_TANK_WIDTH = 5;
        const BASE_TANK_HEIGHT = 5;

        // 当前实际尺寸（后面会根据 facility 更新）
        let tankLength = BASE_TANK_LENGTH;
        let tankWidth = BASE_TANK_WIDTH;
        let tankHeight = BASE_TANK_HEIGHT;

        // 用来装所有尺寸线 + 文本的组，每次更新时重建
        let dimensionGroup = null;

        // 建一个 group 来装鱼缸，方便整体 scale
        const tankGroup = new THREE.Group();
        scene.add(tankGroup);

        // 基准几何，只建一次
        const tankGeometry = new THREE.BoxGeometry(
            BASE_TANK_LENGTH,
            BASE_TANK_HEIGHT,
            BASE_TANK_WIDTH
        );
        const edges = new THREE.EdgesGeometry(tankGeometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00A3FF,
            transparent: true,
            opacity: 0.3,
            linewidth: 2
        });
        const tankLines = new THREE.LineSegments(edges, lineMaterial);

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00A3FF,
            metalness: 0,
            roughness: 0,
            transmission: 0.9,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const tankMesh = new THREE.Mesh(tankGeometry, glassMaterial);

        // 挂到 group 上
        tankGroup.add(tankLines);
        tankGroup.add(tankMesh);

        // Grid Helper

        const gridHelper = new THREE.GridHelper(50, 50, 0x333333, 0x111111);
        gridHelper.position.y = -BASE_TANK_HEIGHT / 2;
        scene.add(gridHelper);

        // 让格子线几乎看不见
        if (Array.isArray(gridHelper.material)) {
            gridHelper.material.forEach(m => {
                m.transparent = true;
                m.opacity = 0.08;      // 你可以调到 0.05 ~ 0.15 之间试试
            });
        } else {
            gridHelper.material.transparent = true;
            gridHelper.material.opacity = 0.08;
        }

        // Architectural Dimension Helper
        function createDimension(p1, p2, text, offsetVector) {
            const group = new THREE.Group();

            const p1Ext = new THREE.Vector3().copy(p1).add(offsetVector);
            const p2Ext = new THREE.Vector3().copy(p2).add(offsetVector);

            const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, depthTest: false });
            const tickMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1.0, depthTest: false });

            // 1. Extension Lines (from object to dimension line + overshoot)
            const extOvershoot = new THREE.Vector3().copy(offsetVector).normalize().multiplyScalar(0.2);
            const ext1Geo = new THREE.BufferGeometry().setFromPoints([p1, new THREE.Vector3().copy(p1Ext).add(extOvershoot)]);
            const ext2Geo = new THREE.BufferGeometry().setFromPoints([p2, new THREE.Vector3().copy(p2Ext).add(extOvershoot)]);
            group.add(new THREE.Line(ext1Geo, material));
            group.add(new THREE.Line(ext2Geo, material));

            // 2. Dimension Line (between extensions)
            const dimGeo = new THREE.BufferGeometry().setFromPoints([p1Ext, p2Ext]);
            group.add(new THREE.Line(dimGeo, material));

            // 3. Ticks (Diagonal at intersections)
            // Tick direction: Perpendicular to offset and dimension line? 
            // Simple diagonal 45 degrees relative to the view is hard in 3D.
            // Let's make a small cross or a specific diagonal based on the plane.
            // Assuming dimensions are mostly axis-aligned.
            const tickSize = 0.2;
            const tickDir = new THREE.Vector3(1, 1, 0).normalize().multiplyScalar(tickSize);
            // This tick direction is arbitrary, might look weird from some angles.
            // Better: Tick perpendicular to the dimension line.
            // If dim line is X axis, tick is Y+Z?
            // Let's try a simple 45 deg tick in the plane of the dimension.

            // Calculate direction of dimension line
            const dimDir = new THREE.Vector3().subVectors(p2, p1).normalize();
            // Calculate direction of offset
            const offDir = new THREE.Vector3().copy(offsetVector).normalize();
            // Cross product to find "up" or "depth"
            const cross = new THREE.Vector3().crossVectors(dimDir, offDir).normalize();
            // Tick vector: combination of dimDir and offDir? 
            // Standard architectural tick is often 45 deg.
            const tickVec = new THREE.Vector3().addVectors(dimDir, offDir).normalize().multiplyScalar(tickSize);

            const t1Geo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3().copy(p1Ext).sub(tickVec),
                new THREE.Vector3().copy(p1Ext).add(tickVec)
            ]);
            const t2Geo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3().copy(p2Ext).sub(tickVec),
                new THREE.Vector3().copy(p2Ext).add(tickVec)
            ]);
            group.add(new THREE.Line(t1Geo, tickMaterial));
            group.add(new THREE.Line(t2Geo, tickMaterial));

            // 4. Text Label
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 64;
            context.font = '16px Inter, sans-serif';
            context.fillStyle = 'rgba(255, 255, 255, 0.9)';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, 128, 32);

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
            const sprite = new THREE.Sprite(spriteMaterial);

            // Position text at midpoint + slight offset away
            const midPoint = new THREE.Vector3().addVectors(p1Ext, p2Ext).multiplyScalar(0.5);
            const textOffset = new THREE.Vector3().copy(offsetVector).normalize().multiplyScalar(0.5);
            sprite.position.copy(midPoint).add(textOffset);
            sprite.scale.set(4, 1, 1);

            group.add(sprite);

            return group;
        }


        function formatMeters(v) {
            const rounded = Math.round(v * 10) / 10; // 保留 1 位小数
            if (Math.abs(rounded - Math.round(rounded)) < 1e-3) {
                return Math.round(rounded) + 'm';
            }
            return rounded.toFixed(1) + 'm';
        }

        // 根据当前 tankLength / tankWidth / tankHeight 重建尺寸线 + 文本
        // function rebuildDimensions() {
        //     // 先把旧的删掉
        //     if (dimensionGroup) {
        //         scene.remove(dimensionGroup);
        //     }
        //     dimensionGroup = new THREE.Group();
        //     scene.add(dimensionGroup);

        //     const halfL = tankLength / 2;
        //     const halfW = tankWidth / 2;
        //     const halfH = tankHeight / 2;

        //     // 1) Length 尺寸：底部前侧，从左到右
        //     // 从 (-L/2, -H/2, +W/2) 到 (+L/2, -H/2, +W/2)，向 +Z 偏一点
        //     const lenDim = createDimension(
        //         new THREE.Vector3(-halfL, -halfH, halfW),
        //         new THREE.Vector3(halfL, -halfH, halfW),
        //         formatMeters(tankLength),
        //         new THREE.Vector3(0, 0, 1.5)
        //     );
        function rebuildDimensions() {
            if (dimensionGroup) {
                scene.remove(dimensionGroup);
            }
            dimensionGroup = new THREE.Group();
            scene.add(dimensionGroup);

            const halfL = tankLength / 2;
            const halfW = tankWidth / 2;
            const halfH = tankHeight / 2;

            // 文案：根据模式切换
            const lengthLabel = isHumanScale
                ? formatMeters(tankLength * HUMAN_EQUIV_FACTOR)  // 8.5m
                : formatMeters(tankLength);                      // 20m

            const heightLabel = isHumanScale
                ? formatMeters(tankHeight * HUMAN_EQUIV_FACTOR)  // 大约 2.1m
                : formatMeters(tankHeight);

            const widthLabel = isHumanScale
                ? formatMeters(tankWidth * HUMAN_EQUIV_FACTOR)
                : formatMeters(tankWidth);

            const lenDim = createDimension(
                new THREE.Vector3(-halfL, -halfH, halfW),
                new THREE.Vector3(halfL, -halfH, halfW),
                lengthLabel,
                new THREE.Vector3(0, 0, 1.5)
            );
            dimensionGroup.add(lenDim);

            // 2) Height 尺寸：右前侧，从下到上
            // 从 (L/2, -H/2, +W/2) 到 (L/2, +H/2, +W/2)，向 +X 偏一点
            const heightDim = createDimension(
                new THREE.Vector3(halfL, -halfH, halfW),
                new THREE.Vector3(halfL, halfH, halfW),
                // formatMeters(tankHeight),
                heightLabel,
                new THREE.Vector3(1.5, 0, 0)
            );
            dimensionGroup.add(heightDim);

            // 3) Width 尺寸：右侧，从前到后
            // 从 (L/2, -H/2, +W/2) 到 (L/2, -H/2, -W/2)，向 +X 偏一点
            const widthDim = createDimension(
                new THREE.Vector3(halfL, -halfH, halfW),
                new THREE.Vector3(halfL, -halfH, -halfW),
                widthLabel,
                new THREE.Vector3(1.5, 0, 0)
            );
            dimensionGroup.add(widthDim);
        }

        // 解析 "20m * 5m * 5m" 这类字符串
        function parseTankSize(str) {
            const fallback = {
                length: BASE_TANK_LENGTH,
                width: BASE_TANK_WIDTH,
                height: BASE_TANK_HEIGHT,
            };
            if (!str) return fallback;

            const parts = str.split('*').map(p => p.trim());
            if (parts.length !== 3) return fallback;

            const toNumber = (s) => {
                const m = s.match(/([\d.]+)/);
                return m ? parseFloat(m[1]) : NaN;
            };

            const L = toNumber(parts[0]);
            const W = toNumber(parts[1]);
            const H = toNumber(parts[2]);

            if (isNaN(L) || isNaN(W) || isNaN(H)) return fallback;
            return { length: L, width: W, height: H };
        }

        // function repositionHumanForTank() {
        //     if (!human) return;

        //     const floorY = -tankHeight / 2;       // 缸底高度
        //     const offsetZ = tankWidth / 2 + 1.0;  // 比玻璃前再往外 1m，当走道
        //     const patrolRange = tankLength / 2;   // 沿着整条长边走

        //     // 起始点：左前下角稍微往外一点
        //     human.position.set(-patrolRange, floorY, offsetZ);
        //     human.rotation.y = Math.PI / 2;       // 面向 +X 方向走

        //     // 更新行走范围
        //     human.userData.patrolRange = patrolRange;
        //     // 每次重置方向，从左往右
        //     human.userData.direction = 1;
        // }


        // 根据选中的 facility 更新鱼缸尺寸
        function updateTankSize(aquarium) {
            const sizeStr = aquarium['tank_size ( L * W * H)'];
            const { length, width, height } = parseTankSize(sizeStr);

            tankLength = length;
            tankWidth = width;
            tankHeight = height;

            // 相对基准尺寸缩放 group
            const sx = length / BASE_TANK_LENGTH;
            const sy = height / BASE_TANK_HEIGHT;
            const sz = width / BASE_TANK_WIDTH;
            tankGroup.scale.set(sx, sy, sz);

            // 让地面始终在缸底
            gridHelper.position.y = -tankHeight / 2;

            // 尺寸线 + 标注重建
            rebuildDimensions();

            repositionHumanForTank();  // 👈 每次更新缸尺寸后，顺带重摆人和行走范围

            console.log('Tank size updated:', { length, width, height });
        }


        // Load Models
        const loader = new GLTFLoader();
        const mixers = [];
        const clock = new THREE.Clock();

        // Beluga Management
        let belugaTemplate = null;
        let belugaAnimation = null;
        let belugaHalfHeight = 0; // Store half-height for bounds checking
        const activeBelugas = [];

        // Load Human
        loader.load('human_slow_walk_1.glb', (gltf) => {
            human = gltf.scene;
            const h = human;

            // Scale to 1.7m height
            // Previous attempts to measure mesh failed (gave huge or tiny values).
            // Let's hardcode a reasonable scale based on visual feedback.
            // If the model is ~1.7m tall in its own units, scale should be 1.
            // If it's huge (28 units), we need to scale down.
            // 1.7 / 28 = ~0.06. This might be what happened and it looked like a dot.
            // Maybe the "28" was actually correct and it just LOOKED small in a 20m tank?
            // A 1.7m human in a 20m tank is small (less than 1/10th).
            // But "red dot" implies it's barely visible.
            // Let's try a fixed scale that looks good visually, e.g., 1.0 or 0.5.
            // User said "red dot", so it was too small.
            // Let's try setting scale to 1.0 first to see the "natural" size.
            h.scale.set(1, 1, 1);

            // 先临时放到原来的位置，后面会统一 reposition
            h.position.set(-12, -2.5, 4)
            h.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material.emissive = new THREE.Color(0x88ccff);
                    node.material.emissiveIntensity = 0.5;
                    node.material.color = new THREE.Color(0xffffff);
                }
            });
            scene.add(h);

            const mixer = new THREE.AnimationMixer(h);
            const clip = gltf.animations.find(a => a.name === '2953314151920_TempMotion') || gltf.animations[0];
            if (clip) {
                const action = mixer.clipAction(clip);
                action.play();
            }
            mixers.push(mixer);

            // 行走参数改成挂在 userData 上，方便之后更新
            h.userData.speed = 1.0;
            h.userData.patrolRange = BASE_TANK_LENGTH / 2; // 默认 20m 缸 -> 10
            h.userData.direction = 1;

            h.userData.update = (delta) => {
                const speed = h.userData.speed;
                const patrolRange = h.userData.patrolRange;
                let dir = h.userData.direction;

                h.position.x += speed * delta * dir;

                if (h.position.x > patrolRange) {
                    dir = -1;
                    h.rotation.y = -Math.PI / 2;
                } else if (h.position.x < -patrolRange) {
                    dir = 1;
                    h.rotation.y = Math.PI / 2;
                }

                h.userData.direction = dir;
            };
        });


        //     // Animation
        //     const mixer = new THREE.AnimationMixer(human);
        //     const clip = gltf.animations.find(a => a.name === '2953314151920_TempMotion') || gltf.animations[0];
        //     if (clip) {
        //         const action = mixer.clipAction(clip);
        //         action.play();
        //     }
        //     mixers.push(mixer);

        //     // Patrol Logic
        //     const speed = 1.0;
        //     const patrolRange = 10;
        //     let direction = 1;

        //     human.userData.update = (delta) => {
        //         human.position.x += speed * delta * direction;
        //         if (human.position.x > patrolRange) {
        //             direction = -1;
        //             human.rotation.y = -Math.PI / 2;
        //         } else if (human.position.x < -patrolRange) {
        //             direction = 1;
        //             human.rotation.y = Math.PI / 2;
        //         }
        //     };
        // });

        // === Human Scale Logic ===
        const HUMAN_AS_BELUGA_SCALE = 4 / 1.7;
        let isHumanScale = false;
        const HUMAN_HEIGHT = 1.7;
        const BELUGA_LENGTH = 4.0;
        const HUMAN_EQUIV_FACTOR = HUMAN_HEIGHT / BELUGA_LENGTH; // ≈ 0.425
        // Store desired count to restore when switching back
        let desiredBelugaCount = 1;

        function repositionHumanForTank() {
            if (!human) return;

            const floorY = -tankHeight / 2;

            if (isHumanScale) {
                // Human becomes "Beluga Sized" and trapped inside
                human.scale.set(
                    HUMAN_AS_BELUGA_SCALE,
                    HUMAN_AS_BELUGA_SCALE,
                    HUMAN_AS_BELUGA_SCALE
                );

                const patrolRange = tankLength / 2 - 1.0; // Margin
                human.position.set(-patrolRange, floorY, 0); // Center of tank, on floor
                human.rotation.y = Math.PI / 2;

                human.userData.patrolRange = patrolRange;
                human.userData.direction = 1;
            } else {
                // Normal Mode: Human as reference outside
                human.scale.set(1, 1, 1);

                const patrolRange = tankLength / 2;
                const offsetZ = tankWidth / 2 + 1.0; // 1m walkway outside

                human.position.set(-patrolRange, floorY, offsetZ);
                human.rotation.y = Math.PI / 2;

                human.userData.patrolRange = patrolRange;
                human.userData.direction = 1;
            }
        }

        function setHumanScaleMode(flag) {
            isHumanScale = flag;

            // Reposition human (inside/outside)
            repositionHumanForTank();
            rebuildDimensions();

            // Refresh belugas (hide/show)
            updateBelugas(desiredBelugaCount);
        }

        // Load Beluga Template
        loader.load('beluga_whale_converted.glb', (gltf) => {
            belugaTemplate = gltf.scene;
            belugaAnimation = gltf.animations[0];

            // 1. Scale Template to ~4m length
            let box = new THREE.Box3().setFromObject(belugaTemplate);
            const size = box.getSize(new THREE.Vector3());
            const currentLength = Math.max(size.x, size.y, size.z);
            const scaleFactor = 4.0 / currentLength;
            belugaTemplate.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // 2. Re-calculate bounding box and center model to (0,0,0)
            box = new THREE.Box3().setFromObject(belugaTemplate);
            const center = box.getCenter(new THREE.Vector3());
            belugaTemplate.position.sub(center);

            // 3. Store half-height for safe Y-bounds calculation
            belugaHalfHeight = (box.max.y - box.min.y) / 2;

            belugaTemplate.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material.emissive = new THREE.Color(0x004488);
                    node.material.emissiveIntensity = 0.3;
                }
            });

            // Initial population
            const currentSelectIndex = document.getElementById('aquarium-select').value;
            if (currentSelectIndex !== "") {
                const count = parseInt(aquariums[currentSelectIndex].beluga_count) || 1;
                updateBelugas(count);
            } else {
                updateBelugas(1);
            }
        });

        function updateBelugas(count) {
            // Update desired count for restoration
            desiredBelugaCount = count;

            if (!belugaTemplate) return; // Not loaded yet

            // In Human Scale mode, force count to 0 (hide belugas)
            const effectiveCount = isHumanScale ? 0 : count;

            // === 1. Vertical range: from almost bottom to mid-water ===
            const tankHalfH = tankHeight / 2

            // 这里用当前缸高算：
            // - yBottom：几乎贴地板（-tankHalfH + 0.1）
            // - yTop：在中部（0），你可以改成 -0.3 更压抑
            const yBottom = -tankHalfH + 0.1;
            const yTop = 0.0;

            const verticalRange = yTop - yBottom; // > 0

            console.log('Vertical range (dynamic):',
                yBottom.toFixed(2), '->', yTop.toFixed(2),
                'tankHeight=', tankHeight
            );

            // ……后面是 Remove / Add belugas 的逻辑

            while (activeBelugas.length > effectiveCount) {
                const belugaGroup = activeBelugas.pop();
                if (belugaGroup.userData.helper) {
                    scene.remove(belugaGroup.userData.helper);
                }
                scene.remove(belugaGroup);
                // Find mixer associated with the model inside the group
                // The mixer root is the model, not the group.
                // We need to find the mixer whose root is a child of this group.
                const mixerIndex = mixers.findIndex(m => m.getRoot().parent === belugaGroup);
                if (mixerIndex !== -1) mixers.splice(mixerIndex, 1);
            }

            // Add new
            while (activeBelugas.length < effectiveCount) {
                // Create a container group for movement
                const belugaGroup = new THREE.Group();
                belugaGroup.name = 'BelugaGroup';
                scene.add(belugaGroup);
                activeBelugas.push(belugaGroup);

                // Clone the model and add to group
                // Use SkeletonUtils to ensure unique skeleton for SkinnedMesh
                const belugaModel = SkeletonUtils.clone(belugaTemplate);
                belugaModel.name = 'BelugaModel';
                // Note: Position offset from template is preserved by clone
                belugaGroup.add(belugaModel);

                // Setup Animation on the MODEL
                const mixer = new THREE.AnimationMixer(belugaModel);
                if (belugaAnimation) {
                    const action = mixer.clipAction(belugaAnimation);
                    action.time = Math.random() * belugaAnimation.duration;
                    action.play();
                }
                mixers.push(mixer);

                // Setup Random Movement Logic on the GROUP
                // Constrain to Tank Size using defined constants
                const speed = 0.25 + Math.random() * 0.25;
                const angleOffset = Math.random() * Math.PI * 2;

                // Visual Debug Helper
                // const boxHelper = new THREE.BoxHelper(belugaGroup, 0xff0000);
                // scene.add(boxHelper);
                // belugaGroup.userData.helper = boxHelper; // Store reference for removal

                // Assign update function to userData of the GROUP
                belugaGroup.userData.update = (delta, time) => {
                    // 当前缸半长/半宽（每帧用最新的 tankLength/tankWidth）
                    const halfL = tankLength / 2 - 0.5; // 留一点 margin
                    const halfW = tankWidth / 2 - 0.5;

                    // Elliptical movement logic
                    const angle = time * speed + angleOffset;

                    // Horizontal bounds check
                    const x = Math.cos(angle) * (halfL * 0.8); // ~ +/- 8m
                    const z = Math.sin(angle) * (halfW * 0.8); // ~ +/- 2m

                    // Vertical movement: Oscillate within the full safe range
                    // 垂直：显式把 [-1,1] 映射到 [yBottom, yTop]
                    const phase = time * speed * 0.125 + angleOffset;   // 越小越慢
                    const s = Math.sin(phase);                        // [-1, 1]
                    const t = (s + 1) / 2;                            // [0, 1]
                    const y = yBottom + t * verticalRange;            // [yBottom, yTop]

                    const targetPos = new THREE.Vector3(x, y, z);

                    // Look at target position (move direction)
                    // Tangent for ellipse: dx/dt = -a*sin(t), dz/dt = b*cos(t)
                    const tangentX = -Math.sin(angle) * (halfL * 0.8);
                    const tangentZ = Math.cos(angle) * (halfW * 0.8);


                    const lookTarget = new THREE.Vector3(
                        belugaGroup.position.x + tangentX,
                        belugaGroup.position.y,
                        belugaGroup.position.z + tangentZ
                    );

                    belugaGroup.lookAt(lookTarget);
                    belugaGroup.position.copy(targetPos);

                    // Update Debug Helper
                    // if (boxHelper) boxHelper.update();

                    // Debug log (reduced frequency)
                    if (Math.random() < 0.001) {
                        console.log('BelugaGroup pos:', belugaGroup.position.x.toFixed(2), belugaGroup.position.y.toFixed(2), belugaGroup.position.z.toFixed(2));
                    }
                };
            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            mixers.forEach(mixer => mixer.update(delta));

            scene.traverse((obj) => {
                if (obj.userData.update) {
                    obj.userData.update(delta, time);
                }
            });

            controls.update();
            renderer.render(scene, camera);
        }

        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = tankContainer.clientWidth / tankContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(tankContainer.clientWidth, tankContainer.clientHeight);
        });

        return { updateBelugas, updateTankSize, setHumanScaleMode };
    }
});
