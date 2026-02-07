<script>
    import { onMount, onDestroy } from "svelte";

    let time = "";
    let millis = "00";
    let date = "";
    let interval;

    onMount(() => {
        const updateTime = () => {
            const now = new Date();
            time = now.toLocaleTimeString("en-US", { hour12: false });
            millis = Math.floor(Math.random() * 99)
                .toString()
                .padStart(2, "0");
            date = now
                .toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })
                .toUpperCase();
        };
        updateTime();
        interval = setInterval(updateTime, 100);
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<!-- DESKTOP SLIM TACTICAL BAR (PC ONLY) -->
<header class="desktop-slim-bar">
    <!-- Left: Status & Location -->
    <div class="bar-group">
        <div class="status-dot"></div>
        <div class="bar-item">
            <span class="bar-label">SYS:</span>
            <span class="bar-value success">ONLINE</span>
        </div>
        <div class="bar-sep"></div>
        <div class="bar-item">
            <span class="bar-label">LOC:</span>
            <span class="bar-value">TATOOINE // SECTOR 7G</span>
        </div>
    </div>

    <!-- Center: Free (Visual Reticle Only) -->
    <div class="bar-center-decor">
        <div class="reticle"></div>
    </div>

    <!-- Right: Telemetry & Time -->
    <div class="bar-group right">
        <div class="bar-item">
            <span class="bar-value warning">42°C</span>
            <span class="bar-label">WINDS.HIGH</span>
        </div>
        <div class="bar-sep"></div>
        <div class="bar-item">
            <!-- Tiny Clock SVG -->
            <svg
                class="bar-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span class="bar-value time">{time}</span>
            <span class="bar-millis">{millis}</span>
        </div>
    </div>
</header>

<!-- MOBILE COCKPIT (Visible on small screens - UNTOUCHED) -->
<div class="mobile-cockpit">
    <!-- LEFT: Target & Location -->
    <div class="cockpit-group left">
        <div class="data-block">
            <span class="label">TARGET</span>
            <span class="value prime">TATOOINE</span>
        </div>
        <div class="sep-line"></div>
        <div class="data-block">
            <span class="label">LOC</span>
            <span class="value">MOS EISLEY</span>
        </div>
    </div>

    <!-- RIGHT: Time & Env -->
    <div class="cockpit-group right">
        <div class="env-readout">
            <span class="value warning">42°C</span>
            <svg
                class="icon-small"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2" /><path d="M12 21v2" />
                <path d="M4.22 4.22l1.42 1.42" /><path
                    d="M18.36 18.36l1.42 1.42"
                />
            </svg>
        </div>
        <div class="sep-line"></div>
        <div class="time-readout">
            <span class="value time">{time}</span>
            <span class="millis">{millis}</span>
        </div>
    </div>
</div>

<style>
    /* =========================================
     DESKTOP STYLES (Slim & Military)
     ========================================= */
    .desktop-slim-bar {
        display: none; /* Mobile first hidden */
        width: 100%;
        height: 36px; /* Ultra slim as requested */
        background: #050505;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
        position: relative;
        z-index: 1000;
    }

    @media (min-width: 769px) {
        .desktop-slim-bar {
            display: flex;
        }
        .mobile-cockpit {
            display: none !important;
        }
    }

    .bar-group {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .bar-group.right {
        text-align: right;
    }

    /* Elements */
    .status-dot {
        width: 6px;
        height: 6px;
        background: var(--color-success);
        border-radius: 50%;
        box-shadow: 0 0 6px var(--color-success);
        animation: blink-dot 2s infinite;
    }

    .bar-item {
        display: flex;
        align-items: baseline;
        gap: 6px;
    }

    .bar-label {
        font-size: 10px;
        color: #666;
        font-weight: 700;
        letter-spacing: 1px;
    }
    .bar-value {
        font-size: 12px;
        color: #fff;
        font-weight: 600;
        letter-spacing: 1px;
        font-family: "Rajdhani", sans-serif;
    }
    .bar-value.success {
        color: var(--color-success);
    }
    .bar-value.warning {
        color: var(--color-warning);
    }
    .bar-value.time {
        font-family: "Orbitron", sans-serif;
        letter-spacing: 2px;
        font-size: 14px;
    }

    .bar-millis {
        font-size: 10px;
        color: var(--color-metal-light);
        width: 14px;
    }

    .bar-sep {
        width: 1px;
        height: 12px;
        background: #333;
        transform: skewX(-20deg);
    }

    .bar-icon {
        width: 14px;
        height: 14px;
        color: var(--color-text-secondary);
        opacity: 0.8;
    }

    /* Center Decoration */
    .bar-center-decor {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }
    .reticle {
        width: 100%;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
        );
    }
    .reticle::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    @keyframes blink-dot {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
    }

    /* =========================================
     MOBILE STYLES (EXACT COPY PRESERVED)
     ========================================= */
    .mobile-cockpit {
        position: absolute;
        top: 10px;
        left: 2%;
        width: 96%;
        height: 48px;
        background: rgba(10, 10, 12, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        z-index: 1000;
        font-family: "Rajdhani", sans-serif;
        color: #fff;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        clip-path: polygon(0 0, 100% 0, 100% 75%, 95% 100%, 5% 100%, 0 75%);
    }

    .cockpit-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .mobile-cockpit .label {
        font-size: 8px;
        color: #888;
        letter-spacing: 1px;
        display: block;
        line-height: 1;
        margin-bottom: 2px;
    }
    .mobile-cockpit .value {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
    }
    .mobile-cockpit .value.prime {
        color: var(--color-accent-blue);
        text-shadow: 0 0 5px rgba(77, 184, 255, 0.4);
    }
    .mobile-cockpit .value.warning {
        color: var(--color-warning);
    }
    .mobile-cockpit .value.time {
        font-family: "Orbitron", sans-serif;
        font-size: 14px;
    }
    .mobile-cockpit .millis {
        font-size: 10px;
        color: #666;
        margin-left: 2px;
    }
    .mobile-cockpit .sep-line {
        width: 1px;
        height: 20px;
        background: #333;
        transform: skewX(-15deg);
    }
    .mobile-cockpit .icon-small {
        width: 14px;
        height: 14px;
        opacity: 0.8;
    }
</style>
