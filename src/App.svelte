<script>
  import Header from "./lib/Header.svelte";
  import MapContent from "./lib/MapContent.svelte";
  import Ticker from "./lib/Ticker.svelte";
  import CommsPanel from "./lib/CommsPanel.svelte";
  import NotificationArea from "./lib/NotificationArea.svelte";
  import UserProfileWindow from "./lib/user/UserProfileWindow.svelte"; // Import Profile
  import RadioWindow from "./lib/RadioWindow.svelte";
  import { onMount, onDestroy } from "svelte";

  // Day/Night Cycle Logic - PASSED TO HEADER AS PROP
  let timeOfDayIcon =
    "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"; // default sun
  let interval;

  // Profile State
  let isProfileOpen = false;
  // Radio State
  let isRadioOpen = false;

  const updateCycle = () => {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 17) {
      // Day
      timeOfDayIcon =
        "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z";
    } else if (hour >= 17 && hour < 19) {
      // Dusk (Sunset)
      timeOfDayIcon =
        "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z";
    } else if (hour >= 19 || hour < 5) {
      // Night (Moon)
      timeOfDayIcon =
        "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z";
    } else {
      // Dawn (Sunrise)
      timeOfDayIcon =
        "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z";
    }
  };

  onMount(() => {
    updateCycle();
    interval = setInterval(updateCycle, 60000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<main class="app-container">
  <Header
    {timeOfDayIcon}
    on:openProfile={() => (isProfileOpen = !isProfileOpen)}
    on:openRadio={() => (isRadioOpen = !isRadioOpen)}
  />

  <div class="map-wrapper">
    <MapContent />
    <!-- Notification Overlay -->
    <NotificationArea />
  </div>

  <CommsPanel />
  <Ticker />

  <!-- PROFILE MODAL -->
  <UserProfileWindow
    isOpen={isProfileOpen}
    on:close={() => (isProfileOpen = false)}
  />

  <!-- RADIO MODAL -->
  <RadioWindow isOpen={isRadioOpen} on:close={() => (isRadioOpen = false)} />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: var(--color-bg-dark);
    font-family: "Inter", sans-serif;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
  }

  .map-wrapper {
    flex: 1;
    position: relative;
    z-index: 1;
    overflow: hidden;
    background: #000;
  }
</style>
