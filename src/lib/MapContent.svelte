<script>
    import { onMount } from "svelte";

    let zoom = 150; // 150%

    let cw, ch; // Container dimensions
    let iw, ih; // Image dimensions (at 150%)

    let x = 0;
    let y = 0;

    let isDragging = false;
    let startX, startY;
    let initialX, initialY;

    // Center the map on mount? Or start top-left?
    // "nada de mostrar o vazio o vacuo" implies starts fully covered.
    // 0,0 covers top-left.

    function startDrag(e) {
        if (
            e.target.tagName === "IMG" ||
            e.target.classList.contains("map-container")
        ) {
            isDragging = true;
            // Handle touch and mouse
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;
            initialX = x;
            initialY = y;

            e.preventDefault(); // Prevent text selection
        }
    }

    function onMove(e) {
        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        let nextX = initialX + dx;
        let nextY = initialY + dy;

        // Constraints (Clamp)
        // Max X is 0 (Image left edge at Container left edge)
        // Min X is ContainerWidth - ImageWidth (Image right edge at Container right edge)
        const minX = cw - iw;
        const minY = ch - ih;

        // Ensure we don't drag past boundaries
        if (nextX > 0) nextX = 0;
        if (nextX < minX) nextX = minX;

        if (nextY > 0) nextY = 0;
        if (nextY < minY) nextY = minY;

        x = nextX;
        y = nextY;
    }

    function stopDrag() {
        isDragging = false;
    }
</script>

<svelte:window
    on:mousemove={onMove}
    on:mouseup={stopDrag}
    on:touchmove={onMove}
    on:touchend={stopDrag}
/>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
    class="map-viewport"
    role="region"
    aria-label="Interactive Map"
    tabindex="0"
    bind:clientWidth={cw}
    bind:clientHeight={ch}
    on:mousedown={startDrag}
    on:touchstart={startDrag}
>
    {#if cw && ch}
        <!-- Only render/calc when we have dimensions -->
        <img
            src="/map.jpg"
            alt="Tatooine Surface Map"
            class="map-image"
            draggable="false"
            bind:clientWidth={iw}
            bind:clientHeight={ih}
            style="width: {zoom}%; height: {zoom}%; transform: translate3d({x}px, {y}px, 0);"
        />
    {/if}

    <!-- Overlay grid for military effect -->
    <div class="grid-overlay"></div>
</div>

<style>
    .map-viewport {
        width: 100%;
        flex: 1; /* Takes remaining height */
        overflow: hidden;
        position: relative;
        background-color: #000; /* Fallback */
        cursor: grab;
        user-select: none;
    }

    .map-viewport:active {
        cursor: grabbing;
    }

    .map-image {
        display: block;
        object-fit: cover;
        will-change: transform;
        /* Transition only when not dragging? No, direct manipulation needs instant response */
    }

    .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-image: linear-gradient(
                rgba(0, 74, 124, 0.1) 1px,
                transparent 1px
            ),
            linear-gradient(90deg, rgba(0, 74, 124, 0.1) 1px, transparent 1px);
        background-size: 100px 100px;
        z-index: 10;
        border: 1px solid rgba(0, 74, 124, 0.3);
    }
</style>
