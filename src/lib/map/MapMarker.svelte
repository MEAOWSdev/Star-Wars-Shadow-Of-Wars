<script>
    export let type = "POINT";
    export let label = "Unknown";
    export let color = "#ffffff";
    export let icon = "";
    export let x = 0;
    export let y = 0;
    export let mapScale = 1;
    export let mapWidth = 2048;
    export let mapHeight = 2048;

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    function handleClick() {
        console.log("Marker inner click!");
        dispatch("click");
    }

    export let active = false; // Controlled by parent

    let tooltipPos = "top";

    $: {
        // Enforce numeric dimensions to avoid undefined arithmetic
        const w = mapWidth || 2048;
        const h = mapHeight || 2048;
        const edge = 400;

        if (y < edge) {
            tooltipPos = "bottom";
        } else if (y > h - edge) {
            tooltipPos = "top";
        } else if (x < edge) {
            tooltipPos = "right";
        } else if (x > w - edge) {
            tooltipPos = "left";
        } else {
            tooltipPos = "top";
        }
    }
</script>

<div
    class="marker-container {active ? 'active-mode' : ''}"
    style="left: {x}px; top: {y}px; --poi-color: {color};"
    on:click|stopPropagation={handleClick}
    on:mousedown|stopPropagation
    on:touchstart|stopPropagation
    on:keydown={(e) => e.key === "Enter" && handleClick()}
    on:keydown={(e) => e.key === "Enter" && handleClick()}
    role="button"
    tabindex="0"
    aria-label={label}
>
    <!-- Transformer scales inversely to keep marker size constant -->
    <div
        class="marker-transformer"
        style="transform: translate(-50%, -50%) scale(calc(1 / {mapScale}));"
    >
        <!-- TOOLTIP: Position Class Applied Here -->
        <div class="marker-label pos-{tooltipPos}">
            <div class="ml-content">
                <div class="ml-main">
                    <span class="ml-name">{label}</span>
                </div>
                <div class="ml-data">
                    <span class="ml-tag">LOC</span>
                    <span class="ml-val"
                        >{Math.floor(x)}<span class="ml-sep">:</span
                        >{Math.floor(y)}</span
                    >
                </div>
            </div>
            <!-- Decorative connection line/arrow could go here if needed, keeping it simple but techy -->
        </div>

        <!-- HEXAGON VISUAL -->
        <div class="marker-visual">
            <svg
                viewBox="0 0 100 100"
                class="hex-svg"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter
                        id="glow-{type}"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <path
                    d="M25 10 L75 10 L95 50 L75 90 L25 90 L5 50 Z"
                    fill="#0a0f19"
                    fill-opacity="0.95"
                    stroke="var(--poi-color)"
                    stroke-width="2"
                    class="hex-bg"
                />

                <path
                    d="M25 10 L5 50 L25 90"
                    stroke="var(--poi-color)"
                    stroke-width="4"
                    stroke-opacity="0.5"
                    fill="none"
                />
                <path
                    d="M75 10 L95 50 L75 90"
                    stroke="var(--poi-color)"
                    stroke-width="4"
                    stroke-opacity="0.5"
                    fill="none"
                />
            </svg>

            <div class="icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d={icon} />
                </svg>
            </div>
        </div>
    </div>
</div>

<style>
    /* CONTAINER */
    .marker-container {
        position: absolute;
        width: 0;
        height: 0;
        z-index: 100;
        cursor: pointer;
        pointer-events: auto;
    }

    .marker-container:hover {
        z-index: 200;
    }
    /* ACTIVE MODE OVERRIDES */
    .marker-container.active-mode {
        z-index: 999 !important;
    }
    .active-mode .marker-visual {
        animation: pulse-marker 1.5s infinite;
        filter: drop-shadow(0 0 20px var(--poi-color));
    }
    .active-mode .marker-label {
        opacity: 1 !important;
        transform: translateY(0) scale(1.1) !important;
    }
    .active-mode .hex-bg {
        fill: var(--poi-color);
        stroke: #fff;
    }
    .active-mode .icon-wrapper {
        color: #000;
    }

    @keyframes pulse-marker {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }

    /* TRANSFORMER */
    .marker-transformer {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.1s linear;
    }

    /* VISUAL */
    .marker-visual {
        position: relative;
        width: 64px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
        transition: filter 0.2s;
    }

    .hex-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .hex-bg {
        transition:
            fill 0.2s,
            stroke 0.2s;
    }

    .icon-wrapper {
        position: absolute;
        width: 28px;
        height: 28px;
        color: var(--poi-color);
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            color 0.2s,
            transform 0.2s;
        pointer-events: none;
    }

    .icon-wrapper svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.8));
    }

    /* HOVER */
    .marker-container:hover .hex-svg {
        transform: scale(1.15);
        filter: drop-shadow(0 0 15px var(--poi-color));
    }

    .marker-container:hover .hex-bg {
        fill: rgba(20, 30, 40, 1);
        stroke-width: 3;
    }

    .marker-container:hover .icon-wrapper {
        color: #ffffff;
        transform: scale(1.1);
    }

    /* TOOLTIP BASE */
    .marker-label {
        position: absolute;
        /* Constructing a Tech Card */
        display: flex;
        flex-direction: column;
        pointer-events: none;
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: 300;
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.8));
    }

    .ml-content {
        display: flex;
        height: 32px;
        background: #0b0f16;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 2px;
        overflow: hidden;
    }

    /* Name Section */
    .ml-main {
        background: rgba(255, 255, 255, 0.05);
        padding: 0 12px;
        display: flex;
        align-items: center;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    .ml-name {
        font-family: "Orbitron", sans-serif;
        font-weight: 700;
        font-size: 12px;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 0 8px var(--poi-color);
        white-space: nowrap;
    }

    /* Data Section */
    .ml-data {
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 8px;
        background: rgba(0, 0, 0, 0.4);
    }
    .ml-tag {
        font-family: "Inter", sans-serif;
        font-size: 9px;
        font-weight: 600;
        color: var(--poi-color);
        opacity: 0.8;
        letter-spacing: 0.5px;
    }
    .ml-val {
        font-family: "JetBrains Mono", monospace;
        font-size: 11px;
        color: #adb5bd;
        letter-spacing: -0.5px;
    }
    .ml-sep {
        color: rgba(255, 255, 255, 0.2);
        margin: 0 1px;
    }

    /* Show on hover */
    .marker-container:hover .marker-label {
        opacity: 1;
    }

    /* POSITION VARIANTS */

    /* TOP (Default) */
    .pos-top {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-15px) scale(0.95);
        padding-bottom: 5px; /* Spacing */
    }
    .pos-top .ml-content {
        border-bottom: 2px solid var(--poi-color);
    }
    .marker-container:hover .pos-top {
        transform: translateX(-50%) translateY(-5px) scale(1);
    }

    /* BOTTOM */
    .pos-bottom {
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(15px) scale(0.95);
        padding-top: 5px;
    }
    .pos-bottom .ml-content {
        border-top: 2px solid var(--poi-color);
    }
    .marker-container:hover .pos-bottom {
        transform: translateX(-50%) translateY(5px) scale(1);
    }

    /* LEFT (Appears RIGHT) */
    .pos-right {
        left: 100%;
        top: 50%;
        transform: translateY(-50%) translateX(15px) scale(0.95);
        padding-left: 5px;
    }
    .pos-right .ml-content {
        border-left: 2px solid var(--poi-color);
    }
    .marker-container:hover .pos-right {
        transform: translateY(-50%) translateX(5px) scale(1);
    }

    /* RIGHT (Appears LEFT) */
    .pos-left {
        right: 100%;
        top: 50%;
        transform: translateY(-50%) translateX(-15px) scale(0.95);
        padding-right: 5px;
    }
    .pos-left .ml-content {
        border-right: 2px solid var(--poi-color);
    }
    .marker-container:hover .pos-left {
        transform: translateY(-50%) translateX(-5px) scale(1);
    }
</style>
