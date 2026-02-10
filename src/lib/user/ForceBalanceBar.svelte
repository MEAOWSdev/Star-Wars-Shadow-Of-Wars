<script>
    export let balance = 0; // -100 (Dark) to 100 (Light), 0 is neutral
</script>

<div class="force-container">
    <div class="force-labels">
        <span class="label dark">DARK SIDE</span>
        <span class="label light">LIGHT SIDE</span>
    </div>

    <div class="force-track">
        <!-- Gradient Background -->
        <div class="track-bg"></div>

        <!-- Indicator -->
        <div class="force-indicator" style="left: {50 + balance / 2}%;">
            <div class="marker-line"></div>
            <div class="marker-glow"></div>
        </div>
    </div>

    <div class="force-value">
        {#if balance < -10}
            <span class="val dark-text">DARKNESS CONSUMES YOU</span>
        {:else if balance > 10}
            <span class="val light-text">THE LIGHT GUIDES YOU</span>
        {:else}
            <span class="val grey-text">BALANCED</span>
        {/if}
    </div>
</div>

<style>
    .force-container {
        width: 100%;
        margin: 16px 0;
        font-family: "Orbitron", sans-serif;
    }

    .force-labels {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 10px;
        letter-spacing: 2px;
        font-weight: 700;
    }

    .label.dark {
        color: #ff3e3e;
        text-shadow: 0 0 5px rgba(255, 62, 62, 0.5);
    }
    .label.light {
        color: #4db8ff;
        text-shadow: 0 0 5px rgba(77, 184, 255, 0.5);
    }

    .force-track {
        position: relative;
        height: 12px;
        background: #111;
        border: 1px solid #333;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.8);
    }

    .track-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.6) 0%,
            rgba(60, 0, 0, 0.8) 40%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 60, 100, 0.8) 60%,
            rgba(0, 150, 255, 0.6) 100%
        );
    }

    .force-indicator {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 4px;
        transform: translateX(-50%);
        z-index: 2;
        transition: left 0.5s ease-out;
    }

    .marker-line {
        width: 2px;
        height: 100%;
        background: #fff;
        margin: 0 auto;
        box-shadow: 0 0 4px #fff;
    }

    .marker-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
        filter: blur(2px);
    }

    .force-value {
        text-align: center;
        margin-top: 6px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .dark-text {
        color: #ff6b6b;
    }
    .light-text {
        color: #7ec7ff;
    }
    .grey-text {
        color: #888;
    }
</style>
