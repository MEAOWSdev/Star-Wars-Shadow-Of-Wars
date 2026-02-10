<script>
    import { onMount, onDestroy } from "svelte";
    import { POI_TYPES } from "./data/poiData.js";
    import PodRacerLobby from "./podracer/PodRacerLobby.svelte";
    import MapMarker from "./map/MapMarker.svelte";

    // --- CONFIGURAÇÃO TÁTICA ---
    let mapSrc = "/map.jpg";
    let minScale = 1; // Zoom mínimo (Caber na tela)
    let maxScale = 4; // Zoom máximo (4x)

    // --- POD RACER MODAL LOGIC ---
    let showPodLobby = false;

    function handleMarkerClick(point) {
        console.log("Marker Clicked:", point);
        focusPoi(point);
        // Check if this is the Pod Racer POI
        if (
            point.type === "RACING" ||
            point.type === "RACE" ||
            (point.label && point.label.toUpperCase().includes("RACE")) ||
            (point.label && point.label.toUpperCase().includes("POD"))
        ) {
            console.log("Opening Pod Lobby...");
            showPodLobby = true;
        }
    }

    // Estado
    let scale = 1;
    let x = 0;
    let y = 0;

    // Dimensoes
    let cw, ch; // Container
    let iw, ih; // Imagem Natural
    let mapViewport; // Referência ao elemento DOM

    // Controle
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    let mapError = false;
    let resizeObserver;

    // Mobile Pinch Logic
    let initialPinchDistance = null;
    let initialPinchScale = null;
    let isMobile = false; // Detectar mobile

    // --- POI DATA ---
    // --- POI DATA ---

    let points = [];

    function generatePoints() {
        points = [];
        if (!iw || !ih) return;

        const margin = 120;
        const minDist = 80; // Collisions check

        const isValidPos = (x, y) => {
            return !points.some((p) => Math.hypot(p.x - x, p.y - y) < minDist);
        };

        const tryAddPoint = (type, config, x, y) => {
            if (isValidPos(x, y)) {
                points.push({
                    id: Math.random().toString(36).slice(2, 9),
                    x,
                    y,
                    type,
                    ...config,
                });
                return true;
            }
            return false;
        };

        // 1. Hangars (Edges)
        tryAddPoint("HANGAR", POI_TYPES.HANGAR, 80, ih / 2);
        tryAddPoint("HANGAR", POI_TYPES.HANGAR, iw - 80, ih / 2);

        // 2. Others
        Object.keys(POI_TYPES).forEach((key) => {
            if (key === "HANGAR") return;
            const config = POI_TYPES[key];

            for (let i = 0; i < config.count; i++) {
                let attempts = 0;
                let added = false;
                while (attempts < 50 && !added) {
                    const rx = margin + Math.random() * (iw - margin * 2);
                    const ry = margin + Math.random() * (ih - margin * 2);
                    if (tryAddPoint(key, config, rx, ry)) {
                        added = true;
                    }
                    attempts++;
                }
            }
        });
    }

    function onImageLoad(e) {
        iw = e.target.naturalWidth;
        ih = e.target.naturalHeight;
        generatePoints(); // Generate points once map is loaded
        checkDeviceAndFit();
    }

    // Detectar mobile simplificado (resize tbm chama isso)
    function checkDeviceAndFit() {
        if (!cw || !ih) return;
        isMobile = cw <= 768; // Breakpoint de Mobile

        if (isMobile) {
            // MOBILE: Comportamento Zoom/Pam Normal
            // Comeca com um zoom leve para nao sobrar bordas se a img for fina
            const scaleW = cw / iw;
            const scaleH = ch / ih;
            const fitScale = Math.max(scaleW, scaleH);

            // Se nunca ajustamos, ou se mudou de desktop->mobile
            if (minScale !== fitScale) {
                minScale = fitScale;
                scale = fitScale * 1.2; // Começa um pouco com zoom no mobile
                // Centraliza
                x = (cw - iw * scale) / 2;
                y = (ch - ih * scale) / 2;
            }
        } else {
            // PC: ENCAIXAR PERFEITAMENTE (COVER) E TRAVAR
            const scaleW = cw / iw;
            const scaleH = ch / ih;
            // Cover: max(scaleW, scaleH)
            const coverScale = Math.max(scaleW, scaleH);

            scale = coverScale;
            minScale = coverScale;
            maxScale = coverScale; // TRAVA ZOOM NO PC? User pediu "sem precisar de pam"
            // Se "sem precisar de pam" significa estatico:

            // Centraliza Absoluto
            x = (cw - iw * scale) / 2;
            y = (ch - ih * scale) / 2;
        }
        clampPosition();
    }

    // --- DRAG LOGIC (PAN) ---
    function startDrag(e) {
        // PC: Se tiver encaixado (scale == minScale) e travado, nao arrasta
        // Mas se o user der zoom (scroll), ai pode arrastar?
        // O user disse: "sem precisar de pam". Entao no PC, se estiver no fit, nao arrasta.
        if (!isMobile && scale <= minScale + 0.01) return;

        if (e.touches && e.touches.length === 2) {
            // Start Pinch
            isDragging = false;
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            initialPinchDistance = Math.hypot(
                t1.clientX - t2.clientX,
                t1.clientY - t2.clientY,
            );
            initialPinchScale = scale;
            return;
        }

        e.preventDefault();
        isDragging = true;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;
        initialX = x;
        initialY = y;
    }

    function onMove(e) {
        // PINCH ZOOM (Mobile only basically)
        if (e.touches && e.touches.length === 2 && initialPinchDistance) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const currentDist = Math.hypot(
                t1.clientX - t2.clientX,
                t1.clientY - t2.clientY,
            );

            const zoomFactor = currentDist / initialPinchDistance;
            let newScale = initialPinchScale * zoomFactor;

            newScale = Math.min(Math.max(newScale, minScale), 4); // Hardcoded max zoom mobile

            const centerX = cw / 2;
            const centerY = ch / 2;
            const scaleRatio = newScale / scale;
            x = centerX - (centerX - x) * scaleRatio;
            y = centerY - (centerY - y) * scaleRatio;

            scale = newScale;
            clampPosition();
            return;
        }

        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        x = initialX + dx;
        y = initialY + dy;

        clampPosition();
    }

    function stopDrag() {
        isDragging = false;
        initialPinchDistance = null;
    }

    // --- ZOOM LOGIC (Mouse Wheel) ---
    function onWheel(e) {
        // Se quisermos travar totalmente no PC, comentamos isso.
        // Mas geralmente "encaixar perfeitamente" eh o estado inicial. Zoom eh feature.
        // O user disse "sem precisar de pam", entao o padrao é fit. Se ele der scroll, vira pam.
        e.preventDefault();

        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        let newScale = scale * (1 + delta);

        // No PC, o minScale ja é o Cover.
        newScale = Math.min(Math.max(newScale, minScale), 4);

        const rect = e.currentTarget.getBoundingClientRect();
        const pointerX = e.clientX - rect.left;
        const pointerY = e.clientY - rect.top;

        const scaleRatio = newScale / scale;
        x = pointerX - (pointerX - x) * scaleRatio;
        y = pointerY - (pointerY - y) * scaleRatio;

        scale = newScale;
        clampPosition();
    }

    // --- BOUNDARY SYSTEM ---
    function clampPosition() {
        const currentW = iw * scale;
        const currentH = ih * scale;

        // Se a imagem for MENOR ou IGUAL ao container (caso do PC Fit), centralizar forçado
        if (currentW <= cw + 1) {
            // +1 tolerancia float
            x = (cw - currentW) / 2;
        } else {
            // Drag logic normal
            if (x > 0) x = 0;
            if (x < cw - currentW) x = cw - currentW;
        }

        if (currentH <= ch + 1) {
            y = (ch - currentH) / 2;
        } else {
            if (y > 0) y = 0;
            if (y < ch - currentH) y = ch - currentH;
        }
    }

    // --- DOCK LOGIC ---
    let activePoiId = null;
    let poiGroups = [];

    // Reactive grouping
    $: {
        if (points.length) {
            const groups = {};
            points.forEach((p) => {
                if (!groups[p.type]) {
                    groups[p.type] = {
                        type: p.type,
                        icon: p.icon,
                        color: p.color,
                        list: [],
                        currentIndex: 0,
                    };
                }
                groups[p.type].list.push(p);
            });
            // Convert to array
            poiGroups = Object.values(groups);
        }
    }

    function focusPoi(point) {
        if (!point) return;
        activePoiId = point.id;

        // Calculate center position
        // x = (cw - iw * scale) / 2  <-- This is center for full image
        // Target: point.x, point.y should be at center of screen (cw/2, ch/2)
        // ScreenX = x + point.x * scale = cw/2
        // => x = cw/2 - point.x * scale

        let targetX = cw / 2 - point.x * scale;
        let targetY = ch / 2 - point.y * scale;

        // Animated transition? Or instant? User said "leva para o mapa". Instant snap is cleaner for tactical feel.
        x = targetX;
        y = targetY;

        clampPosition();
    }

    function cyclePoi(group, dir) {
        // Find group in our state (reactivity might rebuild it, so refer by type)
        const gIndex = poiGroups.findIndex((g) => g.type === group.type);
        if (gIndex === -1) return;

        const g = poiGroups[gIndex];
        let newIdx = g.currentIndex + dir;

        // Wrap around
        if (newIdx >= g.list.length) newIdx = 0;
        if (newIdx < 0) newIdx = g.list.length - 1;

        // Update state logic (mutate local array to keep track of index)
        poiGroups[gIndex].currentIndex = newIdx;
        poiGroups = [...poiGroups]; // Trigger update

        focusPoi(g.list[newIdx]);
    }

    onMount(() => {
        resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                checkDeviceAndFit();
            });
        });

        if (mapViewport) {
            resizeObserver.observe(mapViewport);
        }
    });

    onDestroy(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    });
</script>

<svelte:window
    on:mouseup={stopDrag}
    on:touchend={stopDrag}
    on:mousemove={onMove}
    on:touchmove|nonpassive={onMove}
/>

<!-- TACTICAL DOCK (POI SELECTOR) -->
{#if poiGroups.length > 0}
    <div class="tactical-dock">
        {#each poiGroups as group}
            <div class="dock-item" style="--d-color: {group.color}">
                <!-- PREV ARROW -->
                {#if group.list.length > 1}
                    <button
                        class="nav-arrow left"
                        on:click={() => cyclePoi(group, -1)}
                    >
                        <svg viewBox="0 0 24 24"
                            ><path
                                fill="currentColor"
                                d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                            /></svg
                        >
                    </button>
                {/if}

                <!-- ICON -->
                <button
                    class="icon-btn"
                    on:click={() => focusPoi(group.list[group.currentIndex])}
                >
                    <svg viewBox="0 0 24 24"
                        ><path fill="currentColor" d={group.icon} /></svg
                    >
                    <span class="count-badge"
                        >{group.currentIndex + 1}/{group.list.length}</span
                    >
                </button>

                <!-- NEXT ARROW -->
                {#if group.list.length > 1}
                    <button
                        class="nav-arrow right"
                        on:click={() => cyclePoi(group, 1)}
                    >
                        <svg viewBox="0 0 24 24"
                            ><path
                                fill="currentColor"
                                d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                            /></svg
                        >
                    </button>
                {/if}
            </div>
        {/each}
    </div>
{/if}

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
    class="map-viewport"
    bind:this={mapViewport}
    bind:clientWidth={cw}
    bind:clientHeight={ch}
    on:mousedown={startDrag}
    on:touchstart|nonpassive={startDrag}
    on:wheel|nonpassive={onWheel}
    role="region"
    aria-label="Tactical Map"
    tabindex="0"
    style="cursor: {isDragging
        ? 'grabbing'
        : !isMobile && scale <= minScale + 0.01
          ? 'default'
          : 'grab'}"
>
    {#if !mapError}
        <div
            class="world-layer"
            style="
                width: {iw}px; 
                height: {ih}px; 
                transform: translate3d({x}px, {y}px, 0) scale({scale});
                transform-origin: 0 0;
                --map-scale: {scale};
            "
        >
            <img
                src={mapSrc}
                alt="Map Texture"
                class="map-texture"
                draggable="false"
                decoding="async"
                on:load={onImageLoad}
                on:error={() => (mapError = true)}
            />
            <div class="grid-overlay"></div>

            <!-- POI MARKERS -->
            {#each points as point (point.id || point)}
                <MapMarker
                    {...point}
                    mapScale={scale}
                    mapWidth={iw}
                    mapHeight={ih}
                    active={activePoiId === point.id}
                    on:click={() => handleMarkerClick(point)}
                />
            {/each}
        </div>
    {/if}

    {#if mapError || !iw}
        <div class="status-overlay">
            {#if mapError}
                <span class="blink danger">SIGNAL LOST</span>
            {:else}
                <span class="blink">ESTABLISHING UPLINK...</span>
            {/if}
        </div>
    {/if}
</div>

<!-- POD RACER LOBBY MODAL -->
<PodRacerLobby
    bind:isOpen={showPodLobby}
    onClose={() => (showPodLobby = false)}
/>

<style>
    /* DOCK STYLES (TECH THEME) */
    .tactical-dock {
        position: fixed;
        bottom: 60px; /* Aligned with News Ticker area */
        left: 50%;
        transform: translateX(-50%);
        z-index: 2000;
        display: flex;
        gap: 8px;
        background: rgba(5, 10, 20, 0.95);
        backdrop-filter: blur(10px);
        padding: 6px 12px;
        /* Tech Borders */
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-top: 2px solid #3b82f6; /* Tactical Blue Top Accent */
        border-radius: 2px; /* Sharp corners */
        box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.8),
            inset 0 0 20px rgba(59, 130, 246, 0.05); /* Inner glow */
        align-items: center;

        max-width: 95vw;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .tactical-dock::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 768px) {
        .tactical-dock {
            bottom: 50px; /* Closer to breaking news */
            width: 100%;
            max-width: 100%;
            border-radius: 0;
            border-left: none;
            border-right: none;
            border-bottom: none; /* Only top border remains */
            justify-content: flex-start;
            flex-wrap: nowrap;
            padding: 8px 16px;
            gap: 12px;
            /* Scroll fade masks */
            mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
            );
            -webkit-mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
            );
        }

        .dock-item {
            flex-shrink: 0;
            min-width: 60px; /* Ensure touch targets differ */
            justify-content: center;
        }
    }

    .dock-item {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.02);
        padding: 4px 6px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s;
        /* Small cut corner bottom-right */
        clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%);
    }

    .dock-item:hover {
        border-color: var(--d-color);
        background: rgba(255, 255, 255, 0.08); /* Brighter interaction */
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.1);
    }

    .nav-arrow {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }
    .nav-arrow:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
    .nav-arrow svg {
        width: 16px;
        height: 16px;
    }

    .icon-btn {
        background: none;
        border: none;
        color: var(--d-color);
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
    }
    .icon-btn svg {
        width: 24px;
        height: 24px;
        filter: drop-shadow(0 0 5px var(--d-color));
    }

    .count-badge {
        position: absolute;
        bottom: -2px;
        right: -2px;
        background: #000;
        color: #fff;
        font-size: 8px;
        padding: 1px 3px;
        border-radius: 4px;
        border: 1px solid var(--d-color);
    }

    .map-viewport {
        width: 100%;
        height: 100%;
        background: #000;
        overflow: hidden;
        position: relative;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
    }

    .world-layer {
        position: absolute;
        top: 0;
        left: 0;
        will-change: transform;
        /* Define scale for children to inverse if needed */
        --map-scale: 1;
    }

    .map-texture {
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        image-rendering: high-quality;
    }

    .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
                rgba(59, 130, 246, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
        background-size: 100px 100px;
        pointer-events: none;
        z-index: 2;
    }

    .status-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        font-family: "Orbitron", monospace;
        letter-spacing: 2px;
        z-index: 10;
        pointer-events: none;
    }

    .blink {
        animation: blink 2s infinite;
    }
    .danger {
        color: #ef4444;
    }
    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>
