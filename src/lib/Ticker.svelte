<script>
    const newsItems = [
        "IMPERIAL FLEET SPOTTED NEAR OUTER RIM TERRITORIES",
        "JAVA TRADERS REPORT SHORTAGE OF DROID PARTS",
        "PODRACING CHAMPIONSHIP FINALS SET FOR BOONTA EVE",
        "NEW REGULATIONS FOR MOS EISLEY CANTINA: 'NO BLASTERS'",
        "SANDSTORM WARNING IN EFFECT FOR DUNE SEA SECTOR 4",
    ];
</script>

<!-- Breaking News Ticker (Footer) -->
<footer class="news-ticker-container">
    <div class="news-label">BREAKING NEWS</div>
    <div class="ticker-wrapper">
        <div class="ticker-content">
            {#each newsItems as item}
                <span class="news-item">++ {item} ++</span>
            {/each}
            <!-- Duplicate for seamless loop -->
            {#each newsItems as item}
                <span class="news-item">++ {item} ++</span>
            {/each}
        </div>
    </div>
</footer>

<style>
    /* Ticker Styles */
    .news-ticker-container {
        background: #000;
        height: 36px;
        display: flex;
        align-items: center;
        overflow: hidden;
        position: relative;
        border-top: 1px solid var(--color-metal-light);
        width: 100%;
        z-index: 200; /* Ensure it stays above map if needed */
    }

    .news-label {
        background: var(--color-alert);
        color: #fff;
        padding: 0 1rem;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 700;
        z-index: 2;
        box-shadow: 4px 0 10px rgba(0, 0, 0, 0.5);
        font-family: var(--font-display);
    }

    .ticker-wrapper {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        mask-image: linear-gradient(
            to right,
            transparent,
            black 20px,
            black 100%
        );
    }

    .ticker-content {
        display: inline-block;
        animation: marquee 60s linear infinite;
        padding-left: 20px;
    }

    .news-item {
        display: inline-block;
        margin-right: 4rem;
        font-size: 0.9rem;
        color: var(--color-text-primary);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: var(--font-display);
    }

    @keyframes marquee {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }

    @media (max-width: 600px) {
        .news-label {
            padding: 0 0.5rem;
            font-size: 0.7rem;
        }
    }
</style>
