<script>
  import Header from "./lib/Header.svelte";
  import MapContent from "./lib/MapContent.svelte";
  import Ticker from "./lib/Ticker.svelte";
  import CommsPanel from "./lib/CommsPanel.svelte"; // New Comms Module
</script>

<main class="app-container">
  <Header />
  <MapContent />

  <!-- Overlay UI Elements -->
  <CommsPanel />

  <Ticker />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: var(--color-bg-dark);
    font-family: "Rajdhani", sans-serif;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative; /* For overlays */
  }
</style>
