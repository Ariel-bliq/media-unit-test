function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useEffect,
  useRef,
  useState
} = React;
const soundEffects = {
  startRide: "src/assets/start-ride.wav",
  voiceMode: "src/assets/voice-mode.wav",
  arrival: "src/assets/arrival.wav"
};
const audioTracks = {
  "Smooth Ride": "src/assets/smooth-ride.mp3",
  "Sunrise Glide": "src/assets/sunrise-glide.mp3",
  "High Way Sunset": "src/assets/high-way-sunset.mp3"
};
const mockRide = {
  passengerName: "Ariel",
  pickup: "Bliq depot",
  destination: "Alexanderplatz",
  eta: "12:42",
  duration: "18 min",
  cabinTemperature: "22°",
  playlists: ["Smooth Ride", "Sunrise Glide", "High Way Sunset", "Quiet focus", "City pop", "Evening ride", "Radio mix"],
  artists: {
    "Smooth Ride": "Bliq drive selection",
    "Sunrise Glide": "Bliq drive selection",
    "High Way Sunset": "Bliq drive selection",
    "Quiet focus": "Bliq Ambient",
    "City pop": "Night Drive",
    "Evening ride": "Soft Motion",
    "Radio mix": "Bliq Radio",
    "Radio": "Live station"
  },
  routeStops: ["Bliq depot", "Museum Island", "Alexanderplatz"],
  objects: ["Pedestrian", "Cyclist", "Parked car", "Traffic light", "Road edge"]
};
function useAnimatedPresence(open, exitDuration = 260) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    if (!mounted) return undefined;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, exitDuration);
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitDuration]);
  return {
    mounted,
    closing
  };
}
function App() {
  const [orientation, setOrientation] = useState("horizontal");
    const [fullViewport, setFullViewport] = useState(false);
  const [ridePhase, setRidePhase] = useState("welcome");
  const [view, setView] = useState("route");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMotion, setMenuMotion] = useState("idle");
  const [destinationMotion, setDestinationMotion] = useState(null);
  const [fullPage, setFullPage] = useState(null);
  const [activeMenuPage, setActiveMenuPage] = useState("media");
  const [settingsPage, setSettingsPage] = useState("main");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [routeDrawerOpen, setRouteDrawerOpen] = useState(false);
  const [addStopOpen, setAddStopOpen] = useState(false);
  const [confirmPullOverOpen, setConfirmPullOverOpen] = useState(false);
  const [confirmStopOpen, setConfirmStopOpen] = useState(false);
  const [quickPanel, setQuickPanel] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(68);
  const [nowPlaying, setNowPlaying] = useState("Smooth Ride");
  const [masterMuted, setMasterMuted] = useState(false);
  const [musicFade, setMusicFade] = useState(0);
  const [uiEntering, setUiEntering] = useState(false);
  const [temperature, setTemperature] = useState(21);
  const [fan, setFan] = useState(2);
  const [lightMood, setLightMood] = useState("Ambient");
  const [appearance, setAppearance] = useState("light");
  const [airflow, setAirflow] = useState("Face");
  const [doorsUnlocked, setDoorsUnlocked] = useState(false);
  const [textLarge, setTextLarge] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [phoneState, setPhoneState] = useState("Not connected");
    const [voiceHintVisible, setVoiceHintVisible] = useState(true);
  const previousRidePhase = useRef(ridePhase);
  const previousVoiceOpen = useRef(voiceOpen);
  const musicAudioRef = useRef(null);
  const soundEffectAudioRef = useRef(null);
  const startTimerRef = useRef(null);
  const uiTimerRef = useRef(null);
  const menuTimerRef = useRef(null);
  useEffect(() => {
    if (ridePhase !== "pullingOver") return undefined;
    const timer = window.setTimeout(() => setRidePhase("pulledOver"), 1400);
    return () => window.clearTimeout(timer);
  }, [ridePhase]);
  useEffect(() => {
    if (ridePhase === "arrived" && previousRidePhase.current !== "arrived") {
      playEffect(soundEffects.arrival);
    }
    previousRidePhase.current = ridePhase;
  }, [ridePhase]);
  useEffect(() => {
    if (voiceOpen && !previousVoiceOpen.current) {
      playEffect(soundEffects.voiceMode);
    }
    previousVoiceOpen.current = voiceOpen;
  }, [voiceOpen]);
  useEffect(() => {
    const audio = new Audio();
    const effectAudio = new Audio();
    audio.preload = "auto";
    effectAudio.preload = "auto";
    effectAudio.volume = 0.8;
    musicAudioRef.current = audio;
    soundEffectAudioRef.current = effectAudio;
    return () => {
      audio.pause();
      effectAudio.pause();
      if (startTimerRef.current) window.clearTimeout(startTimerRef.current);
      if (uiTimerRef.current) window.clearTimeout(uiTimerRef.current);
      if (menuTimerRef.current) window.clearTimeout(menuTimerRef.current);
    };
  }, []);
  useEffect(() => {
    const audio = musicAudioRef.current;
    const effectAudio = soundEffectAudioRef.current;
    if (!audio) return;
    audio.muted = masterMuted || musicMuted;
    audio.volume = Math.min(1, Math.max(0, musicVolume / 100 * musicFade));
    if (effectAudio) effectAudio.muted = masterMuted;
  }, [masterMuted, musicMuted, musicVolume, musicFade]);
  useEffect(() => {
    const audio = musicAudioRef.current;
    const source = audioTracks[nowPlaying];
    if (!audio) return;
    if (!source) {
      audio.pause();
      return;
    }
    if (!audio.src.endsWith(source)) {
      audio.src = source;
      audio.load();
    }
    if (musicPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [nowPlaying, musicPlaying]);
  function playEffect(source) {
    if (masterMuted) return;
    const audio = soundEffectAudioRef.current;
    if (!audio) return;
    audio.src = source;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
  function startRide() {
    playEffect(soundEffects.startRide);
    setNowPlaying("Smooth Ride");
    setMusicFade(0);
    setRidePhase("starting");
    setView("route");
    setMenuOpen(false);
    setFullPage(null);
    setDestinationMotion(null);
    setDoorsUnlocked(false);
    closeTransientUI();
    const audio = musicAudioRef.current;
    if (audio) {
      audio.src = audioTracks["Smooth Ride"];
      audio.volume = 0;
      audio.muted = masterMuted || musicMuted;
      audio.play().catch(() => {});
    }
    startTimerRef.current = window.setTimeout(() => {
      setRidePhase("driving");
      setUiEntering(true);
      setMusicPlaying(true);
      uiTimerRef.current = window.setTimeout(() => setUiEntering(false), 1200);
      let step = 0;
      const fadeTimer = window.setInterval(() => {
        step += 1;
        setMusicFade(Math.min(1, step / 18));
        if (step >= 18) window.clearInterval(fadeTimer);
      }, 100);
    }, 4000);
  }
  function closeTransientUI() {
    setVoiceOpen(false);
    setSupportOpen(false);
    setRouteDrawerOpen(false);
    setAddStopOpen(false);
    setConfirmPullOverOpen(false);
    setConfirmStopOpen(false);
    setQuickPanel(null);
  }
  function openThreeCardMenu() {
    if (menuTimerRef.current) window.clearTimeout(menuTimerRef.current);
    setQuickPanel(null);
    setRouteDrawerOpen(false);
    setAddStopOpen(false);
    setMenuMotion("opening");
    setMenuOpen(true);
    setView("home");
    setFullPage(null);
  }
  function closeThreeCardMenu() {
    if (menuTimerRef.current) window.clearTimeout(menuTimerRef.current);
    setMenuMotion("closing");
    menuTimerRef.current = window.setTimeout(() => {
      setMenuOpen(false);
      setView("route");
      setMenuMotion("idle");
    }, 260);
  }
  function jumpTo(target) {
    closeTransientUI();
    setMenuOpen(false);
    setFullPage(null);
    setDestinationMotion(null);
    setSettingsPage("main");
    if (target === "welcome") {
      setRidePhase("welcome");
      setView("route");
      return;
    }
    if (target === "pullingOver" || target === "pulledOver" || target === "arriving" || target === "arrived") {
      setRidePhase(target);
      setView("route");
      setDoorsUnlocked(false);
      return;
    }
    setRidePhase("driving");
    setDoorsUnlocked(false);
    if (target === "route") setView("route");
    if (target === "navigation") setView("navigation");
    if (target === "menu") {
      setView("home");
      setMenuOpen(true);
      setMenuMotion("opening");
    }
    if (target === "music" || target === "comfort" || target === "settings") {
      setView("home");
      setMenuOpen(true);
      setFullPage(target === "music" ? "media" : target === "comfort" ? "ac" : "settings");
      setDestinationMotion(null);
    }
    if (target === "voice") {
      setView("route");
      setVoiceOpen(true);
    }
    if (target === "support") {
      setView("route");
      setSupportOpen(true);
    }
  }
  function requestPullOver() {
    setRidePhase("pullingOver");
    setDoorsUnlocked(false);
    closeTransientUI();
  }
  function continueRide() {
    setRidePhase("driving");
    setView("navigation");
    setMenuOpen(false);
    setFullPage(null);
    setDoorsUnlocked(false);
    closeTransientUI();
    setAddStopOpen(true);
  }
  function endRide() {
    setRidePhase("arrived");
    closeTransientUI();
    setMenuOpen(false);
    setFullPage(null);
  }
  function playNextSong() {
    const playableTracks = Object.keys(audioTracks);
    const currentIndex = playableTracks.indexOf(nowPlaying);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % playableTracks.length;
    setNowPlaying(playableTracks[nextIndex]);
    setMusicFade(1);
    setMusicPlaying(true);
  }
  function selectMusic(title) {
    setNowPlaying(title);
    setMusicFade(1);
    setMusicPlaying(true);
  }
  function toggleMasterMute() {
    setMasterMuted(muted => !muted);
  }
  const frameClass = ["media-frame", "final-ui", orientation, `theme-${appearance}`, uiEntering ? "ui-entering" : "", textLarge ? "large-text" : "", highContrast ? "high-contrast" : ""].join(" ");
  const sharedProps = {
    ridePhase,
    view,
    setView,
    openMenu: () => {
      openThreeCardMenu();
    },
    openRouteDrawer: () => setRouteDrawerOpen(true),
    openAddStop: () => setAddStopOpen(true),
    openStopConfirm: () => setConfirmStopOpen(true),
    nowPlaying,
    setNowPlaying: selectMusic,
    musicPlaying,
    temperature,
    setTemperature,
    fan,
    setFan,
    lightMood,
    setLightMood,
    appearance,
    setAppearance,
    airflow,
    setAirflow,
    textLarge,
    setTextLarge,
    highContrast,
    setHighContrast,
    settingsPage,
    setSettingsPage,
    phoneState,
    setPhoneState
  };
  return React.createElement("div", {
    
 
   className: `prototype-shell ${fullViewport ? "full-viewport" : ""}`
  }, !fullViewport && React.createElement(ControllerPanel, {
    
 
   orientation: orientation,
        fullViewport: fullViewport

 
   onToggleMute: toggleMasterMute,
        onEnterFullScreen: () => {
          setOrientation(window.innerHeight > window.innerWidth ? "vertical" : "horizontal");
          setFullViewport(true);
  }
    onJump: jumpTo,
    muted: masterMuted,
    
 
 onToggleMute,
      onEnterFullScreen
    , React.createElement(MediaUnitFrame, {
    className: frameClass,
    orientation: orientation
  }, ridePhase === "welcome" ? React.createElement(WelcomeScreen, {
    onStart: startRide
  }) : ridePhase === "starting" ? React.createElement(StartRideTransition, null) : ridePhase === "pullingOver" || ridePhase === "pulledOver" ? React.createElement(PullOverFlow, {
    ridePhase: ridePhase,
    doorsUnlocked: doorsUnlocked,
    onUnlock: () => setDoorsUnlocked(true),
    onContinue: continueRide,
    onEnd: endRide
  }) : React.createElement(React.Fragment, null, React.createElement(FixedInfoBar, {
    ridePhase: ridePhase,
    view: view,
    setView: setView,
    menuOpen: menuOpen,
    fullPage: fullPage,
    onOpenMenu: () => {
      openThreeCardMenu();
    },
    onCloseContext: () => {
      setQuickPanel(null);
      if (fullPage) {
        setFullPage(null);
        setView("home");
        setMenuOpen(true);
        setMenuMotion("opening");
      } else {
        closeThreeCardMenu();
      }
    },
    onOpenSettings: () => {
      setSettingsPage("main");
      setFullPage("settings");
    }
  }), React.createElement("main", {
    className: "ride-surface"
  }, ridePhase === "arriving" || ridePhase === "arrived" ? React.createElement(DropOffSequence, {
    ridePhase: ridePhase,
    doorsUnlocked: doorsUnlocked,
    onUnlock: () => setDoorsUnlocked(true)
  }) : fullPage ? React.createElement(FullScreenDestination, {
    page: fullPage,
    motion: destinationMotion,
    nowPlaying: nowPlaying,
    setNowPlaying: selectMusic,
    setMusicPlaying: setMusicPlaying,
    phoneState: phoneState,
    setPhoneState: setPhoneState,
    temperature: temperature,
    setTemperature: setTemperature,
    fan: fan,
    setFan: setFan,
    lightMood: lightMood,
    setLightMood: setLightMood,
    appearance: appearance,
    setAppearance: setAppearance,
    airflow: airflow,
    setAirflow: setAirflow,
    settingsPage: settingsPage,
    setSettingsPage: setSettingsPage,
    textLarge: textLarge,
    setTextLarge: setTextLarge,
    highContrast: highContrast,
    setHighContrast: setHighContrast
  }) : view === "home" ? React.createElement(RideDashboard, {
    motion: menuMotion,
    openPage: page => {
      setDestinationMotion(page);
      if (page === "navigation") {
        setMenuOpen(false);
        setView("navigation");
      } else {
        setFullPage(page);
      }
    },
    temperature: temperature,
    setTemperature: setTemperature,
    fan: fan,
    setFan: setFan,
    lightMood: lightMood,
    setLightMood: setLightMood,
    appearance: appearance,
    setAppearance: setAppearance,
    nowPlaying: nowPlaying,
    musicPlaying: musicPlaying,
    setMusicPlaying: setMusicPlaying,
    onNextSong: playNextSong,
    musicVolume: musicVolume,
    setMusicVolume: setMusicVolume
  }) : view === "route" ? React.createElement(RouteVisualization, sharedProps) : React.createElement(NavigationVisualization, _extends({}, sharedProps, {
    motion: destinationMotion
  }))), React.createElement(FixedControlBar, {
    ridePhase: ridePhase,
    musicPlaying: musicPlaying,
    setMusicPlaying: setMusicPlaying,
    musicMuted: musicMuted,
    setMusicMuted: setMusicMuted,
    musicVolume: musicVolume,
    setMusicVolume: setMusicVolume,
    nowPlaying: nowPlaying,
    setNowPlaying: selectMusic,
    onNextSong: playNextSong,
    onMoreMusic: () => {
      setQuickPanel(null);
      setMenuOpen(true);
      setView("home");
      setFullPage("media");
    },
    temperature: temperature,
    setTemperature: setTemperature,
    fan: fan,
    setFan: setFan,
    lightMood: lightMood,
    setLightMood: setLightMood,
    appearance: appearance,
    setAppearance: setAppearance,
    quickPanel: quickPanel,
    setQuickPanel: setQuickPanel,
    compact: menuOpen && !fullPage && view === "home",
    fullPage: fullPage,
          voiceHintVisible: voiceHintVisible,
          onDismissVoiceHint: () => setVoiceHintVisible(false),
    onVoice: () => {
      setQuickPanel(null);
            setVoiceHintVisible(false);
      setVoiceOpen(true);
    },
    onSupport: () => {
      setQuickPanel(null);
      setSupportOpen(true);
    }
  })), React.createElement(RouteEditDrawer, {
    open: routeDrawerOpen,
    onClose: () => setRouteDrawerOpen(false),
    onAddStop: () => setAddStopOpen(true),
    onStopRide: () => setConfirmStopOpen(true)
  }), React.createElement(VoiceOverlay, {
    open: voiceOpen,
    onClose: () => setVoiceOpen(false),
    onSupport: () => {
      setVoiceOpen(false);
      setSupportOpen(true);
    },
    temperature: temperature,
    nowPlaying: nowPlaying,
    musicPlaying: musicPlaying,
    setMusicPlaying: setMusicPlaying,
    musicMuted: musicMuted,
    setMusicMuted: setMusicMuted,
    onNextSong: playNextSong
  }), React.createElement(SupportOverlay, {
    open: supportOpen,
    onClose: () => setSupportOpen(false),
    onRequestPullOver: () => {
      setSupportOpen(false);
      setConfirmPullOverOpen(true);
    }
  }), React.createElement(AddStopModal, {
    open: addStopOpen,
    onClose: () => setAddStopOpen(false)
  }), React.createElement(ConfirmModal, {
    open: confirmPullOverOpen,
    title: "Pull over?",
    body: "The car will look for a safe place to stop. You can continue the ride after it has pulled over.",
    primary: "Pull over",
    secondary: "Cancel",
    primaryLast: true,
    onPrimary: () => {
      setConfirmPullOverOpen(false);
      requestPullOver();
    },
    onSecondary: () => setConfirmPullOverOpen(false)
  }), React.createElement(ConfirmModal, {
    open: confirmStopOpen,
    title: "Stop ride?",
    body: "The vehicle will pull over before ending the ride.",
    primary: "Pull over first",
    secondary: "Keep riding",
    onPrimary: () => {
      setConfirmStopOpen(false);
      requestPullOver();
    },
    onSecondary: () => setConfirmStopOpen(false)
  })));
}
function ControllerPanel({
  orientation,
  setOrientation,
  onJump,
  muted,
  onToggleMute
}) {
  const [open, setOpen] = useState(false);
  const destinations = [["welcome", "Welcome"], ["route", "Route Visualization"], ["navigation", "Navigation Visualization"], ["menu", "Three-Card Menu"], ["music", "Full-Screen Music"], ["comfort", "Full-Screen Comfort"], ["settings", "Full-Screen Settings"], ["voice", "Voice"], ["support", "Support"], ["pullingOver", "Pulling Over"], ["pulledOver", "Pulled Over"], ["arriving", "Arriving"], ["arrived", "Arrived"]];
  return React.createElement("aside", {
    className: `controller-shell ${open ? "open" : ""}`,
    "aria-label": "Designer controller"
  }, React.createElement("div", {
    className: "controller-tools"
  }, React.createElement("button", {
    className: "controller-trigger",
    onClick: () => setOpen(!open)
  }, "Controller"), React.createElement("button", {
    className: `controller-mute ${muted ? "muted" : ""}`,
    onClick: onToggleMute,
    "aria-label": muted ? "Turn sound on" : "Mute sound effects and music",
    title: muted ? "Turn sound on" : "Mute all sound"
  }, React.createElement(Icon, {
    name: muted ? "volumeOff" : "volume"
  }))), open && React.createElement("div", {
    className: "controller-panel"
  }, React.createElement("div", {
    className: "controller-heading"
  }, React.createElement("strong", null, "Prototype Controller"), React.createElement("button", {
    onClick: () => setOpen(false),
    "aria-label": "Close controller"
  }, React.createElement(Icon, {
    name: "close"
  }))), React.createElement("span", null, "Format"), React.createElement("div", {
    className: "controller-formats"
  }, React.createElement("button", {
    className: orientation === "horizontal" ? "selected" : "",
    onClick: () => setOrientation("horizontal")
  }, "Horizontal", React.createElement("br", null), "1200 \xD7 800"), React.createElement("button", {
    className: orientation === "vertical" ? "selected" : "",
    onClick: () => setOrientation("vertical")
  
 
  }, "Vertical", React.createElement("br", null), "1080 \xD7 1920")), React.createElement("button", {
        className: "controller-full-screen",
        onClick: onEnterFullScreen
  }, React.createElement(Icon, {
        name: "expand"
  }), "Full screen"), React.createElement("span", null, "Jump to"), React.createElement("div", {
    className: "controller-jumps"
  }, destinations.map(([target, label]) => React.createElement("button", {
    key: target,
    onClick: () => onJump(target)
  }, label)))));
}
function MediaUnitFrame({
  className,
  orientation,
    fullViewport,
  children
}) {
  const dimensions = orientation === "horizontal" ? {
    width: 1200,
    height: 800
  } : {
    width: 1080,
    height: 1920
  };
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function resizeFrame() {
            if (fullViewport) {
                      setScale(Math.min(window.innerWidth / dimensions.width, window.innerHeight / dimensions.height));
                      return;
            }
      const horizontalPadding = window.innerWidth < 700 ? 24 : 88;
      const verticalPadding = window.innerHeight < 700 ? 24 : 64;
      setScale(Math.min(1, (window.innerWidth - horizontalPadding) / dimensions.width, (window.innerHeight - verticalPadding) / dimensions.height));
    }
    resizeFrame();
    window.addEventListener("resize", resizeFrame);
    return () => window.removeEventListener("resize", resizeFrame);
  
 
  }, [dimensions.width, dimensions.height, fullViewport]);
  return React.createElement("div", {
    
 
   className: `frame-stage ${fullViewport ? "full-viewport" : ""}`,
        style: fullViewport ? {
                width: "100vw",
                height: "100vh"
        } : {
          width: dimensions.width * scale,
      height: dimensions.height * scale
    }
  }, React.createElement("section", {
    
 
   className: `${className} ${fullViewport ? "full-viewport" : ""}`,
    style: {
      width: dimensions.width,
      height: dimensions.height,
      
 
     transform: fullViewport ? `translate(-50%, -50%) scale(${scale})` : `scale(${scale})`
      
  }, children));
}
function FixedInfoBar({
  ridePhase,
  view,
  setView,
  menuOpen,
  fullPage,
  onOpenMenu,
  onCloseContext,
  onOpenSettings
}) {
  const switchIcon = view === "route" ? "map" : view === "navigation" ? "scan" : "map";
  const contextualMenu = menuOpen || fullPage;
  return React.createElement("header", {
    className: "fixed-info-bar"
  }, React.createElement("div", {
    className: "info-bar-metrics"
  }, React.createElement(InfoItem, {
    label: "Arriving in",
    value: ridePhase === "arrived" ? "Now" : "23 min"
  }), React.createElement(InfoItem, {
    label: "At",
    value: ridePhase === "arrived" ? "Now" : mockRide.eta
  })), React.createElement("div", {
    className: "info-bar-actions"
  }, menuOpen && !fullPage ? React.createElement("button", {
    className: "map-view-button",
    onClick: onOpenSettings,
    "aria-label": "Open settings"
  }, React.createElement(Icon, {
    name: "settings"
  })) : !fullPage ? React.createElement("button", {
    className: "map-view-button",
    onClick: () => setView(view === "route" ? "navigation" : "route"),
    "aria-label": view === "route" ? "Open map" : "Open visualization"
  }, React.createElement(Icon, {
    name: switchIcon
  })) : null, React.createElement("button", {
    className: "header-menu-action",
    onClick: contextualMenu ? onCloseContext : onOpenMenu
  }, React.createElement(Icon, {
    name: contextualMenu ? "close" : "menu"
  }), React.createElement("span", {
    className: "visually-hidden"
  }, contextualMenu ? "Close" : "Menu"))));
}
function InfoItem({
  label,
  value,
  wide
}) {
  return React.createElement("div", {
    className: wide ? "info-item wide" : "info-item"
  }, React.createElement("span", null, label), React.createElement("strong", null, value));
}
function FixedControlBar({
  ridePhase,
  musicPlaying,
  setMusicPlaying,
  musicMuted,
  setMusicMuted,
  musicVolume,
  setMusicVolume,
  nowPlaying,
  setNowPlaying,
  onNextSong,
  onMoreMusic,
  temperature,
  setTemperature,
  fan,
  setFan,
  lightMood,
  setLightMood,
  appearance,
  setAppearance,
  quickPanel,
  setQuickPanel,
  compact,
  fullPage,
    voiceHintVisible,
    onDismissVoiceHint,
  onVoice,
  onSupport
}) {
  function toggleQuickPanel(panel) {
    setQuickPanel(quickPanel === panel ? null : panel);
  }
  return React.createElement(React.Fragment, null, React.createElement(QuickControlPanel, {
    panel: quickPanel,
    onClose: () => setQuickPanel(null),
    temperature: temperature,
    setTemperature: setTemperature,
    fan: fan,
    setFan: setFan,
    lightMood: lightMood,
    setLightMood: setLightMood,
    nowPlaying: nowPlaying,
    setNowPlaying: setNowPlaying,
    musicPlaying: musicPlaying,
    setMusicPlaying: setMusicPlaying,
    musicMuted: musicMuted,
    setMusicMuted: setMusicMuted,
    musicVolume: musicVolume,
    setMusicVolume: setMusicVolume,
    onNextSong: onNextSong,
    onMoreMusic: onMoreMusic
  }), React.createElement("footer", {
    className: ["fixed-control-bar", compact ? "compact-menu-dock" : "", fullPage === "media" ? "music-page-dock" : "", fullPage === "ac" ? "comfort-page-dock" : ""].join(" ")
  }, React.createElement("button", {
    className: "control-button support-action",
    onClick: onSupport
  }, React.createElement(Icon, {
    name: "support"
  
 
  }), "Help"), !compact && fullPage === "media" && React.createElement(React.Fragment, null, React.createElement("button", {
    className: "control-button volume-page-action volume-lower-action",
    onClick: () => setMusicVolume(Math.max(0, musicVolume - 10)),
    "aria-label": "Lower volume"
  }, React.createElement(Icon, {
    name: "volumeDown"
  })), React.createElement(MediaDock, {
    nowPlaying: nowPlaying,
    musicPlaying: musicPlaying,
    setMusicPlaying: setMusicPlaying,
    musicMuted: musicMuted,
    setMusicMuted: setMusicMuted,
    onNextSong: onNextSong
  }), React.createElement("button", {
    className: "control-button volume-page-action volume-raise-action",
    onClick: () => setMusicVolume(Math.min(100, musicVolume + 10)),
    "aria-label": "Raise volume"
  }, React.createElement(Icon, {
    name: "volumeUp"
  }))), !compact && fullPage === "ac" && React.createElement(React.Fragment, null, React.createElement(MediaDock, {
    nowPlaying: nowPlaying,
    musicPlaying: musicPlaying,
    setMusicPlaying: setMusicPlaying,
    musicMuted: musicMuted,
    setMusicMuted: setMusicMuted,
    onNextSong: onNextSong
  }), React.createElement("button", {
    className: "control-button appearance-page-action",
    onClick: () => setAppearance(appearance === "light" ? "dark" : "light"),
    "aria-label": "Toggle light and dark mode"
  }, React.createElement(Icon, {
    name: appearance === "light" ? "moon" : "sun"
  }), appearance === "light" ? "Dark" : "Light")), !compact && fullPage !== "media" && fullPage !== "ac" && React.createElement(React.Fragment, null, React.createElement("button", {
    className: `control-button climate-action ${quickPanel === "climate" ? "active-action" : ""}`,
    onClick: () => toggleQuickPanel("climate"),
    "aria-label": "Open climate and lights"
  }, React.createElement("strong", null, temperature, "\xB0"), React.createElement("span", null, "/"), React.createElement(Icon, {
    name: "light"
  })), React.createElement(MediaDock, {
    nowPlaying: nowPlaying,
    musicPlaying: musicPlaying,
    setMusicPlaying: setMusicPlaying,
    musicMuted: musicMuted,
    setMusicMuted: setMusicMuted,
    onNextSong: onNextSong,
    onOpen: () => toggleQuickPanel("music"),
    active: quickPanel === "music"
  })
 
                                                                                                                                })), React.createElement("div", {
        className: "voice-action-wrap"
  }, voiceHintVisible && React.createElement("div", {
        className: "voice-wake-hint",
        role: "status"
  }, React.createElement("span", null, "Start voice mode by saying \u201COK car\u201D"), React.createElement("button", {
        onClick: onDismissVoiceHint,
        "aria-label": "Dismiss voice tip"
  }, React.createElement(Icon, {
        name: "close"
  }))), React.createElement("button", {
        className: "control-button voice-action",
        onClick: onVoice,
        "aria-label": "Voice control"
  }, React.createElement(Icon, {
        name: "voice"
  })))));
  
function MediaDock({
  nowPlaying,
  musicPlaying,
  setMusicPlaying,
  musicMuted,
  setMusicMuted,
  onNextSong,
  onOpen,
  active
}) {
  return React.createElement("div", {
    className: `media-dock-control ${active ? "active" : ""}`
  }, React.createElement("button", {
    className: "now-playing-link",
    onClick: onOpen,
    "aria-label": onOpen ? "Open music controls" : "Current music"
  }, React.createElement("span", {
    className: "song-art",
    "aria-hidden": "true"
  }), React.createElement("span", {
    className: "song-copy"
  }, React.createElement("strong", null, nowPlaying), React.createElement("small", null, mockRide.artists[nowPlaying] || "Bliq Audio"))), React.createElement("div", {
    className: "media-dock-actions"
  }, React.createElement("button", {
    onClick: () => setMusicPlaying(!musicPlaying),
    "aria-label": musicPlaying ? "Pause music" : "Play music"
  }, React.createElement(Icon, {
    name: musicPlaying ? "pause" : "play"
  })), React.createElement("button", {
    onClick: onNextSong,
    "aria-label": "Next song"
  }, React.createElement(Icon, {
    name: "next"
  })), React.createElement("button", {
    className: musicMuted ? "selected" : "",
    onClick: () => setMusicMuted(!musicMuted),
    "aria-label": musicMuted ? "Unmute music" : "Mute music"
  }, React.createElement(Icon, {
    name: musicMuted ? "volumeOff" : "volume"
  }))));
}
function QuickControlPanel({
  panel,
  onClose,
  temperature,
  setTemperature,
  fan,
  setFan,
  lightMood,
  setLightMood,
  nowPlaying,
  setNowPlaying,
  musicPlaying,
  setMusicPlaying,
  musicMuted,
  setMusicMuted,
  musicVolume,
  setMusicVolume,
  onNextSong,
  onMoreMusic
}) {
  const [renderedPanel, setRenderedPanel] = useState(panel);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (panel) {
      setRenderedPanel(panel);
      setClosing(false);
      return undefined;
    }
    if (!renderedPanel) return undefined;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setRenderedPanel(null);
      setClosing(false);
    }, 220);
    return () => window.clearTimeout(timer);
  }, [panel, renderedPanel]);
  if (!renderedPanel) return null;
  return React.createElement("section", {
    className: `quick-control-panel quick-${renderedPanel} ${closing ? "is-closing" : ""}`,
    "aria-label": `${renderedPanel} quick controls`
  }, React.createElement("div", {
    className: "quick-panel-heading"
  }, React.createElement("strong", null, renderedPanel === "music" ? "Music" : "Cabin comfort"), React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close quick controls"
  }, React.createElement(Icon, {
    name: "close"
  }))), renderedPanel === "climate" ? React.createElement("div", {
    className: "quick-climate-grid"
  }, React.createElement("div", {
    className: "quick-stepper",
    "aria-label": "Temperature"
  }, React.createElement("span", {
    className: "quick-control-icon",
    title: "Temperature"
  }, React.createElement(Icon, {
    name: "temp"
  })), React.createElement("div", null, React.createElement("button", {
    "aria-label": "Lower temperature",
    onClick: () => setTemperature(Math.max(16, temperature - 1))
  }, React.createElement(Icon, {
    name: "minus"
  })), React.createElement("strong", null, temperature, "\xB0"), React.createElement("button", {
    "aria-label": "Raise temperature",
    onClick: () => setTemperature(Math.min(28, temperature + 1))
  }, React.createElement(Icon, {
    name: "plus"
  })))), React.createElement("div", {
    className: "quick-stepper",
    "aria-label": "Fan speed"
  }, React.createElement("span", {
    className: "quick-control-icon",
    title: "Fan speed"
  }, React.createElement(Icon, {
    name: "fan"
  })), React.createElement("div", null, React.createElement("button", {
    "aria-label": "Lower fan speed",
    onClick: () => setFan(Math.max(0, fan - 1))
  }, React.createElement(Icon, {
    name: "minus"
  })), React.createElement("strong", null, fan), React.createElement("button", {
    "aria-label": "Raise fan speed",
    onClick: () => setFan(Math.min(5, fan + 1))
  }, React.createElement(Icon, {
    name: "plus"
  })))), React.createElement("div", {
    className: "quick-light-moods",
    "aria-label": "Cabin light mood"
  }, React.createElement("span", {
    className: "quick-control-icon",
    title: "Cabin lights"
  }, React.createElement(Icon, {
    name: "light"
  })), ["On", "Off", "Ambient"].map(mood => React.createElement("button", {
    key: mood,
    className: lightMood === mood ? "selected" : "",
    onClick: () => setLightMood(mood)
  }, mood)))) : React.createElement("div", {
    className: "quick-music-layout"
  }, React.createElement("div", {
    className: "quick-track"
  }, React.createElement("span", {
    className: "song-art",
    "aria-hidden": "true"
  }), React.createElement("span", null, React.createElement("strong", null, nowPlaying), React.createElement("small", null, mockRide.artists[nowPlaying] || "Bliq Audio"))), React.createElement("div", {
    className: "quick-music-actions"
  }, React.createElement("button", {
    onClick: () => setMusicPlaying(!musicPlaying),
    "aria-label": musicPlaying ? "Pause music" : "Play music"
  }, React.createElement(Icon, {
    name: musicPlaying ? "pause" : "play"
  })), React.createElement("button", {
    onClick: onNextSong,
    "aria-label": "Next song"
  }, React.createElement(Icon, {
    name: "next"
  })), React.createElement("button", {
    onClick: () => setMusicMuted(!musicMuted),
    "aria-label": musicMuted ? "Unmute music" : "Mute music"
  }, React.createElement(Icon, {
    name: musicMuted ? "volumeOff" : "volume"
  }))), React.createElement("div", {
    className: "quick-volume-buttons",
    "aria-label": "Music volume"
  }, React.createElement("button", {
    "aria-label": "Lower volume",
    onClick: () => setMusicVolume(Math.max(0, musicVolume - 10))
  }, React.createElement(Icon, {
    name: "volumeDown"
  })), React.createElement("button", {
    "aria-label": "Raise volume",
    onClick: () => setMusicVolume(Math.min(100, musicVolume + 10))
  }, React.createElement(Icon, {
    name: "volumeUp"
  }))), React.createElement("button", {
    className: "more-music-button",
    onClick: onMoreMusic
  }, "More music", React.createElement(Icon, {
    name: "arrowRight"
  }))));
}
function WelcomeScreen({
  onStart
}) {
  return React.createElement("section", {
    className: "welcome-screen"
  }, React.createElement("div", {
        className: "welcome-header"
  }, React.createElement(CurrentConditions, null), React.createElement("div", {
        className: "bliq-wordmark",
        "aria-label": "Bliq"
  }, "bliq")), React.createElement("div", {
    className: "welcome-copy"
  }, React.createElement("p", {
    className: "eyebrow"
  
 
  }, "Bliq driverless"), React.createElement("h1", null, "Welcome aboard, ", mockRide.passengerName, "."), React.createElement(WelcomeRideSummary, null)), React.createElement("button", {
    className: "start-ride-button",
    onClick: onStart
  }, "Tap to start the ride"));
}
function CurrentConditions() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  }).format(now);
  return React.createElement("div", {
    className: "welcome-conditions",
    "aria-label": "Current time and cabin temperature"
  }, React.createElement("span", null, time), React.createElement("span", null, mockRide.cabinTemperature));
}
function PrivacyNotice() {
  return React.createElement("p", {
    className: "privacy-notice"
  }, "Privacy: microphones are used only when you connect to support. Cameras are used for navigation and vehicle awareness.");
}
function StartRideTransition() {
  return React.createElement("section", {
    className: "start-ride-transition",
    "aria-label": "Starting ride",
    "aria-live": "polite"
  }, React.createElement("div", {
    className: "start-transition-image"
  }), React.createElement("div", {
    className: "start-transition-glow"
  }), React.createElement("div", {
    className: "start-transition-copy"
  }, React.createElement("div", {
    className: "start-transition-spinner",
    "aria-hidden": "true"
  }), React.createElement("strong", null, "Starting ride"), React.createElement("span", null, "Please fasten your seat belt")));
}
function WelcomeRideSummary() {
  return React.createElement("div", {
    className: "welcome-route-summary"
  }, React.createElement(InfoItem, {
    label: "Destination",
    value: mockRide.destination
  }), React.createElement(InfoItem, {
    label: "Arrival",
    value: mockRide.eta
  }), React.createElement(InfoItem, {
    label: "Trip time",
    value: mockRide.duration
  }));
}
function RideDashboard({
  motion,
  openPage,
  temperature,
  setTemperature,
  fan,
  setFan,
  lightMood,
  setLightMood,
  appearance,
  setAppearance,
  nowPlaying,
  musicPlaying,
  setMusicPlaying,
  onNextSong,
  musicVolume,
  setMusicVolume
}) {
  return React.createElement("section", {
    className: `ride-dashboard menu-motion-${motion}`,
    "aria-label": "Ride controls"
  }, React.createElement("article", {
    className: "ride-card navigation-card"
  }, React.createElement("button", {
    className: "card-expand",
    onClick: () => openPage("navigation"),
    "aria-label": "Expand navigation"
  }, React.createElement(Icon, {
    name: "expand"
  })), React.createElement("div", {
    className: "dashboard-map",
    "aria-hidden": "true"
  }, React.createElement("div", {
    className: "dashboard-route-line"
  }), React.createElement(Icon, {
    name: "navigationArrow"
  })), React.createElement("div", {
    className: "ride-card-copy"
  }, React.createElement("span", null, "Navigation"), React.createElement("strong", null, "8.9 km"), React.createElement("small", null, "23 minutes remaining"))), React.createElement("article", {
    className: "ride-card music-card"
  }, React.createElement("button", {
    className: "card-expand",
    onClick: () => openPage("media"),
    "aria-label": "Expand music"
  }, React.createElement(Icon, {
    name: "expand"
  })), React.createElement("div", {
    className: "dashboard-album",
    "aria-hidden": "true"
  }, React.createElement(Icon, {
    name: "music"
  })), React.createElement("div", {
    className: "dashboard-track"
  }, React.createElement("strong", null, nowPlaying), React.createElement("small", null, mockRide.artists[nowPlaying] || "Bliq Audio")), React.createElement("div", {
    className: "dashboard-media-actions"
  }, React.createElement("button", {
    onClick: () => setMusicVolume(Math.max(0, musicVolume - 10)),
    "aria-label": "Lower volume"
  }, React.createElement(Icon, {
    name: "volumeDown"
  })), React.createElement("button", {
    onClick: () => setMusicPlaying(!musicPlaying),
    "aria-label": musicPlaying ? "Pause music" : "Play music"
  }, React.createElement(Icon, {
    name: musicPlaying ? "pause" : "play"
  })), React.createElement("button", {
    onClick: onNextSong,
    "aria-label": "Next song"
  }, React.createElement(Icon, {
    name: "next"
  })), React.createElement("button", {
    onClick: () => setMusicVolume(Math.min(100, musicVolume + 10)),
    "aria-label": "Raise volume"
  }, React.createElement(Icon, {
    name: "volumeUp"
  })))), React.createElement("article", {
    className: "ride-card climate-card"
  }, React.createElement("button", {
    className: "card-expand",
    onClick: () => openPage("ac"),
    "aria-label": "Expand climate controls"
  }, React.createElement(Icon, {
    name: "expand"
  })), React.createElement("h2", {
    className: "comfort-card-heading"
  }, "Cabin comfort"), React.createElement("div", {
    className: "comfort-climate-section"
  }, React.createElement("div", {
    className: "dashboard-stepper",
    "aria-label": "Temperature"
  }, React.createElement("button", {
    onClick: () => setTemperature(Math.max(16, temperature - 1)),
    "aria-label": "Lower temperature"
  }, React.createElement(Icon, {
    name: "minus"
  })), React.createElement("span", null, temperature, "\xB0"), React.createElement("button", {
    onClick: () => setTemperature(Math.min(28, temperature + 1)),
    "aria-label": "Raise temperature"
  }, React.createElement(Icon, {
    name: "plus"
  }))), React.createElement("div", {
    className: "dashboard-stepper",
    "aria-label": "Fan speed"
  }, React.createElement("button", {
    onClick: () => setFan(Math.max(0, fan - 1)),
    "aria-label": "Lower fan speed"
  }, React.createElement(Icon, {
    name: "minus"
  })), React.createElement("span", null, React.createElement(Icon, {
    name: "fan"
  }), " ", fan), React.createElement("button", {
    onClick: () => setFan(Math.min(5, fan + 1)),
    "aria-label": "Raise fan speed"
  }, React.createElement(Icon, {
    name: "plus"
  })))), React.createElement("div", {
    className: "comfort-light-section"
  }, React.createElement("div", {
    className: "dashboard-light-moods",
    "aria-label": "Cabin light mood"
  }, [["On", "bulb"], ["Ambient", "bulb"], ["Off", "bulb"]].map(([mood, icon]) => React.createElement("button", {
    key: mood,
    className: lightMood === mood ? "selected" : "",
    onClick: () => setLightMood(mood),
    "aria-label": `${mood} cabin lights`
  }, React.createElement(Icon, {
    name: icon
  })))), React.createElement("div", {
    className: "dashboard-night-mode",
    "aria-label": "Night and dark mode"
  }, React.createElement("button", {
    className: appearance === "dark" ? "selected" : "",
    onClick: () => setAppearance("dark"),
    "aria-label": "Dark mode"
  }, React.createElement(Icon, {
    name: "moon"
  })), React.createElement("button", {
    className: appearance === "light" ? "selected" : "",
    onClick: () => setAppearance("light"),
    "aria-label": "Light mode"
  }, React.createElement(Icon, {
    name: "sun"
  }))))));
}
function RouteVisualization({
  setView,
  openMenu
}) {
  return React.createElement("section", {
    className: "route-page page-fill"
  }, React.createElement("div", {
    className: "visualization-panel perception"
  }));
}
function NavigationVisualization({
  setView,
  openMenu,
  openRouteDrawer,
  openAddStop,
  openStopConfirm,
  motion
}) {
  return React.createElement("section", {
    className: `navigation-page page-fill destination-reveal destination-reveal-${motion || "navigation"}`
  }, React.createElement("div", {
    className: "map-panel"
  }, React.createElement("div", {
    className: "map-canvas"
  }), React.createElement("div", {
    className: "center-map-control"
  }, React.createElement("button", {
    "aria-label": "Center map"
  }, React.createElement(Icon, {
    name: "navigationArrow"
  })))), React.createElement("aside", {
    className: "route-summary"
  
 
  }, React.createElement(RouteRow, {
        label: "From",
    value: mockRide.pickup
  }), React.createElement(RouteRow, {
    label: "Destination",
    value: mockRide.destination
  })
 
                             })));
  
function RouteEditDrawer({
  open,
  onClose,
  onAddStop,
  onStopRide
}) {
  return React.createElement("aside", {
    className: `route-drawer ${open ? "open" : ""}`,
    "aria-hidden": !open
  }, React.createElement("div", {
    className: "drawer-handle"
  }), React.createElement("div", {
    className: "panel-heading"
  }, React.createElement("h2", null, "Edit route"), React.createElement("button", {
    onClick: onClose
  }, React.createElement(Icon, {
    name: "close"
  }), " Close")), mockRide.routeStops.map((stop, index) => React.createElement(RouteRow, {
    key: stop,
    label: index === 0 ? "Pickup" : index === 2 ? "Destination" : "Stop",
    value: stop
  })), React.createElement("button", {
    onClick: onAddStop
  }, React.createElement(Icon, {
    name: "plus"
  }), " Add stop"), React.createElement("button", {
    className: "danger-text",
    onClick: onStopRide
  }, React.createElement(Icon, {
    name: "stop"
  }), " Stop ride"));
}
function FullScreenDestination(props) {
  return React.createElement("section", {
    className: `full-screen-destination destination-${props.page} destination-reveal destination-reveal-${props.motion || props.page}`
  }, props.page === "media" && React.createElement(MusicCarouselPage, {
    nowPlaying: props.nowPlaying,
    setNowPlaying: props.setNowPlaying,
    setMusicPlaying: props.setMusicPlaying,
    phoneState: props.phoneState,
    setPhoneState: props.setPhoneState
  }), props.page === "ac" && React.createElement(ComfortCarouselPage, {
    temperature: props.temperature,
    setTemperature: props.setTemperature,
    fan: props.fan,
    setFan: props.setFan,
    lightMood: props.lightMood,
    setLightMood: props.setLightMood,
    appearance: props.appearance,
    setAppearance: props.setAppearance,
    airflow: props.airflow,
    setAirflow: props.setAirflow
  }), props.page === "settings" && React.createElement(SettingsPage, props));
}
function MusicCarouselPage({
  nowPlaying,
  setNowPlaying,
  setMusicPlaying,
  phoneState,
  setPhoneState
}) {
  const mediaItems = [...mockRide.playlists.map(title => ({
    title,
    subtitle: mockRide.artists[title],
    type: "playlist",
    icon: "music"
  })), {
    title: "Connect phone",
    subtitle: phoneState,
    type: "phone",
    icon: "phone"
  }, {
    title: "Radio",
    subtitle: "Live station",
    type: "radio",
    icon: "radio"
  }];
  function selectItem(item) {
    if (item.type === "phone") {
      setPhoneState(phoneState === "Phone connected" ? "Not connected" : "Phone connected");
      return;
    }
    setNowPlaying(item.type === "radio" ? "Radio" : item.title);
    setMusicPlaying(true);
  }
  return React.createElement("section", {
    className: "carousel-page music-carousel-page"
  }, React.createElement("div", {
    className: "carousel-heading"
  }, React.createElement("h1", null, "Music")), React.createElement("div", {
    className: "settings-carousel",
    "aria-label": "Music choices"
  }, mediaItems.map((item, index) => React.createElement("button", {
    key: item.title,
    className: `carousel-card music-carousel-card ${nowPlaying === item.title || item.type === "phone" && phoneState === "Phone connected" ? "selected" : ""}`,
    onClick: () => selectItem(item)
  }, React.createElement("span", {
    className: `carousel-art art-${index % 4 + 1}`
  }, React.createElement(Icon, {
    name: item.icon
  })), React.createElement("span", {
    className: "carousel-card-copy"
  }, React.createElement("strong", null, item.title), React.createElement("small", null, item.subtitle))))));
}
function ComfortCarouselPage({
  temperature,
  setTemperature,
  fan,
  setFan,
  lightMood,
  setLightMood,
  appearance,
  setAppearance,
  airflow,
  setAirflow
}) {
  return React.createElement("section", {
    className: "carousel-page comfort-carousel-page"
  }, React.createElement("div", {
    className: "carousel-heading"
  }, React.createElement("h1", null, "Comfort")), React.createElement("div", {
    className: "settings-carousel comfort-carousel",
    "aria-label": "Cabin comfort controls"
  }, React.createElement("article", {
    className: "carousel-card comfort-carousel-card"
  }, React.createElement("div", {
    className: "comfort-card-title"
  }, React.createElement("span", null, "Temperature")), React.createElement("strong", {
    className: "comfort-value"
  }, temperature, "\xB0"), React.createElement("div", {
    className: "comfort-primary-actions"
  }, React.createElement("button", {
    onClick: () => setTemperature(Math.max(16, temperature - 1)),
    "aria-label": "Lower temperature"
  }, React.createElement(Icon, {
    name: "minus"
  })), React.createElement("button", {
    onClick: () => setTemperature(Math.min(28, temperature + 1)),
    "aria-label": "Raise temperature"
  }, React.createElement(Icon, {
    name: "plus"
  })))), React.createElement("article", {
    className: "carousel-card comfort-carousel-card"
  }, React.createElement("div", {
    className: "comfort-card-title"
  }, React.createElement("span", null, "Fan speed")), React.createElement("strong", {
    className: "comfort-value comfort-value-with-icon"
  }, React.createElement(Icon, {
    name: "fan"
  }), fan), React.createElement("div", {
    className: "comfort-primary-actions"
  }, React.createElement("button", {
    onClick: () => setFan(Math.max(0, fan - 1)),
    "aria-label": "Lower fan speed"
  }, React.createElement(Icon, {
    name: "minus"
  })), React.createElement("button", {
    onClick: () => setFan(Math.min(5, fan + 1)),
    "aria-label": "Raise fan speed"
  }, React.createElement(Icon, {
    name: "plus"
  })))), React.createElement("article", {
    className: "carousel-card comfort-carousel-card"
  }, React.createElement("div", {
    className: "comfort-card-title"
  }, React.createElement(Icon, {
    name: "light"
  }), React.createElement("span", null, "Cabin lights")), React.createElement("strong", {
    className: "comfort-value comfort-word-value"
  }, lightMood), React.createElement("div", {
    className: "comfort-options"
  }, ["On", "Off", "Ambient"].map(mood => React.createElement("button", {
    key: mood,
    className: lightMood === mood ? "selected" : "",
    onClick: () => setLightMood(mood)
  }, mood)))), React.createElement("article", {
    className: "carousel-card comfort-carousel-card"
  }, React.createElement("div", {
    className: "comfort-card-title"
  }, React.createElement(Icon, {
    name: "route"
  }), React.createElement("span", null, "Airflow direction")), React.createElement("strong", {
    className: "comfort-value comfort-word-value"
  }, airflow), React.createElement("div", {
    className: "comfort-options"
  }, ["Face", "Feet", "Both"].map(option => React.createElement("button", {
    key: option,
    className: airflow === option ? "selected" : "",
    onClick: () => setAirflow(option)
  }, option)))), React.createElement("article", {
    className: "carousel-card comfort-carousel-card"
  }, React.createElement("div", {
    className: "comfort-card-title"
  }, React.createElement(Icon, {
    name: "contrast"
  }), React.createElement("span", null, "Interface appearance")), React.createElement("strong", {
    className: "comfort-value comfort-word-value"
  }, appearance === "light" ? "Light" : "Dark"), React.createElement("div", {
    className: "comfort-options"
  }, React.createElement("button", {
    className: appearance === "light" ? "selected" : "",
    onClick: () => setAppearance("light")
  }, React.createElement(Icon, {
    name: "light"
  }), " Light"), React.createElement("button", {
    className: appearance === "dark" ? "selected" : "",
    onClick: () => setAppearance("dark")
  }, React.createElement(Icon, {
    name: "moon"
  }), " Dark")))));
}
function ComfortOptionCard({
  icon,
  title,
  options
}) {
  const [selected, setSelected] = useState(options[0]);
  return React.createElement("article", {
    className: "carousel-card comfort-carousel-card"
  }, React.createElement("div", {
    className: "comfort-card-title"
  }, React.createElement(Icon, {
    name: icon
  }), React.createElement("span", null, title)), React.createElement("strong", {
    className: "comfort-value comfort-word-value"
  }, selected), React.createElement("div", {
    className: "comfort-options"
  }, options.map(option => React.createElement("button", {
    key: option,
    className: selected === option ? "selected" : "",
    onClick: () => setSelected(option)
  }, option))));
}
function MainMenu({
  open,
  onClose,
  activePage,
  setActivePage,
  nowPlaying,
  setNowPlaying,
  temperature,
  setTemperature,
  fan,
  setFan,
  lightMood,
  setLightMood,
  appearance,
  setAppearance,
  textLarge,
  setTextLarge,
  highContrast,
  setHighContrast,
  settingsPage,
  setSettingsPage,
  phoneState,
  setPhoneState
}) {
  const pages = [["media", "Media", "music"], ["ac", "A/C", "temp"], ["lights", "Lights", "light"], ["settings", "Settings", "settings"], ["about", "About", "info"]];
  return React.createElement("aside", {
    className: `main-menu ${open ? "open" : ""}`,
    "aria-hidden": !open
  }, React.createElement("button", {
    className: "menu-close",
    onClick: onClose,
    "aria-label": "Close menu"
  }, React.createElement(Icon, {
    name: "close"
  })), React.createElement("div", {
    className: "menu-rail"
  }, React.createElement("h2", null, "Menu"), pages.map(([key, label, icon]) => React.createElement("button", {
    key: key,
    className: activePage === key ? "active" : "",
    onClick: () => {
      setActivePage(key);
      setSettingsPage("main");
    }
  }, React.createElement(Icon, {
    name: icon
  }), React.createElement("span", {
    className: "menu-button-label"
  }, label)))), React.createElement("div", {
    className: "menu-page"
  }, activePage === "media" && React.createElement(MediaPage, {
    nowPlaying: nowPlaying,
    setNowPlaying: setNowPlaying,
    phoneState: phoneState,
    setPhoneState: setPhoneState
  }), activePage === "ac" && React.createElement(ACPage, {
    temperature: temperature,
    setTemperature: setTemperature,
    fan: fan,
    setFan: setFan
  }), activePage === "lights" && React.createElement(LightsPage, {
    lightMood: lightMood,
    setLightMood: setLightMood,
    appearance: appearance,
    setAppearance: setAppearance
  }), activePage === "settings" && React.createElement(SettingsPage, {
    settingsPage: settingsPage,
    setSettingsPage: setSettingsPage,
    textLarge: textLarge,
    setTextLarge: setTextLarge,
    highContrast: highContrast,
    setHighContrast: setHighContrast,
    phoneState: phoneState,
    setPhoneState: setPhoneState
  }), activePage === "about" && React.createElement(AboutPage, null)));
}
function MediaPage({
  nowPlaying,
  setNowPlaying,
  phoneState,
  setPhoneState
}) {
  const mediaItems = [...mockRide.playlists.map(title => ({
    title,
    type: "playlist"
  })), {
    title: "Connect phone",
    type: "phone",
    icon: "phone"
  }, {
    title: "Radio",
    type: "radio",
    icon: "radio"
  }];
  function selectMediaItem(item) {
    if (item.type === "phone") {
      setPhoneState(phoneState === "Phone connected" ? "Not connected" : "Phone connected");
      return;
    }
    setNowPlaying(item.type === "radio" ? "Radio" : item.title);
  }
  return React.createElement("section", {
    className: "menu-content"
  }, React.createElement("h1", null, "Pick your music"), React.createElement("div", {
    className: "playlist-grid"
  }, mediaItems.map(item => React.createElement("button", {
    key: item.title,
    className: ["playlist-card", item.type !== "playlist" ? "media-utility-card" : "", nowPlaying === item.title || item.type === "phone" && phoneState === "Phone connected" ? "selected" : ""].join(" "),
    onClick: () => selectMediaItem(item)
  }, React.createElement("div", {
    className: "album-placeholder"
  }), item.icon && React.createElement(Icon, {
    name: item.icon
  }), React.createElement("strong", null, item.title)))), React.createElement(NowPlaying, {
    title: nowPlaying
  }));
}
function ACPage({
  temperature,
  setTemperature,
  fan,
  setFan
}) {
  return React.createElement("section", {
    className: "menu-content"
  }, React.createElement("h1", null, "Control temperature"), React.createElement("div", {
    className: "control-cluster"
  }, React.createElement(Stepper, {
    label: "Temperature",
    value: `${temperature}°`,
    onMinus: () => setTemperature(Math.max(16, temperature - 1)),
    onPlus: () => setTemperature(Math.min(28, temperature + 1))
  }), React.createElement(Stepper, {
    label: "Fan",
    value: fan,
    onMinus: () => setFan(Math.max(0, fan - 1)),
    onPlus: () => setFan(Math.min(5, fan + 1))
  })), React.createElement(SegmentedControl, {
    label: "A/C direction",
    options: ["Face", "Feet", "Both"]
  }), React.createElement("div", {
    className: "gray-visual ac-visual"
  }, "A/C visualization placeholder"));
}
function LightsPage({
  lightMood,
  setLightMood,
  appearance,
  setAppearance
}) {
  return React.createElement("section", {
    className: "menu-content"
  }, React.createElement("div", {
    className: "lights-heading"
  }, React.createElement("h1", null, "Lights"), React.createElement("div", {
    className: "appearance-toggle",
    "aria-label": "Interface appearance"
  }, React.createElement("button", {
    className: appearance === "light" ? "selected" : "",
    onClick: () => setAppearance("light")
  }, React.createElement(Icon, {
    name: "light"
  }), "Light"), React.createElement("button", {
    className: appearance === "dark" ? "selected" : "",
    onClick: () => setAppearance("dark")
  }, React.createElement(Icon, {
    name: "moon"
  }), "Dark"))), React.createElement("div", {
    className: "light-mood-control",
    "aria-label": "Cabin light mood"
  }, React.createElement(Icon, {
    name: "light"
  }), ["On", "Off", "Ambient"].map(mood => React.createElement("button", {
    key: mood,
    className: lightMood === mood ? "selected" : "",
    onClick: () => setLightMood(mood)
  }, mood))), React.createElement(SegmentedControl, {
    label: "Control direction",
    options: ["Reading", "Cabin", "Floor"]
  }), React.createElement("div", {
    className: "gray-visual light-visual"
  }, "Light visualization placeholder"));
}
function SettingsPage(props) {
  if (props.settingsPage === "a11y") return React.createElement(A11yPage, props);
  if (props.settingsPage === "membership") return React.createElement(MembershipPage, {
    onBack: () => props.setSettingsPage("main")
  });
  if (props.settingsPage === "sync") return React.createElement(SyncPhonePage, props);
  if (props.settingsPage === "about") {
    return React.createElement("section", {
      className: "menu-content"
    }, React.createElement(BackButton, {
      onClick: () => props.setSettingsPage("main")
    }), React.createElement(AboutPage, null));
  }
  return React.createElement("section", {
    className: "menu-content"
  }, React.createElement("h1", null, "Settings"), React.createElement("div", {
    className: "settings-cards"
  }, React.createElement("button", {
    onClick: () => props.setSettingsPage("a11y")
  }, React.createElement(Icon, {
    name: "a11y"
  }), " A11y settings"), React.createElement("button", {
    onClick: () => props.setSettingsPage("membership")
  }, React.createElement(Icon, {
    name: "member"
  }), " Membership"), React.createElement("button", {
    onClick: () => props.setSettingsPage("sync")
  }, React.createElement(Icon, {
    name: "phone"
  }), " Sync phone"), React.createElement("button", {
    onClick: () => props.setSettingsPage("about")
  }, React.createElement(Icon, {
    name: "info"
  }), " About Bliq")));
}
function A11yPage({
  setSettingsPage,
  textLarge,
  setTextLarge,
  highContrast,
  setHighContrast
}) {
  return React.createElement("section", {
    className: "menu-content"
  }, React.createElement(BackButton, {
    onClick: () => setSettingsPage("main")
  }), React.createElement("h1", null, "A11y settings"), React.createElement("div", {
    className: "setting-list"
  }, React.createElement(ToggleRow, {
    title: "Pick up and drop off preferences",
    value: "Prefer curbside stops"
  }), React.createElement(ToggleRow, {
    title: "Voice control settings",
    value: "Wake phrase enabled"
  }), React.createElement("button", {
    className: "toggle-row",
    onClick: () => setTextLarge(!textLarge)
  }, React.createElement(Icon, {
    name: "text"
  }), React.createElement("span", null, "Text size"), React.createElement("strong", null, textLarge ? "Large" : "Standard")), React.createElement("button", {
    className: "toggle-row",
    onClick: () => setHighContrast(!highContrast)
  }, React.createElement(Icon, {
    name: "contrast"
  }), React.createElement("span", null, "Contrast"), React.createElement("strong", null, highContrast ? "High" : "Normal"))), React.createElement("div", {
    className: textLarge ? "preview-text large" : "preview-text"
  }, "Preview text: Ride controls remain readable from the back seat."));
}
function MembershipPage({
  onBack
}) {
  return React.createElement("section", {
    className: "menu-content"
  }, React.createElement(BackButton, {
    onClick: onBack
  }), React.createElement("h1", null, "Your membership"), React.createElement("div", {
    className: "membership-grid"
  }, React.createElement(PlaceholderCard, {
    title: "Monthly credit",
    value: "\u20AC120 remaining"
  }), React.createElement(PlaceholderCard, {
    title: "Member's name",
    value: mockRide.passengerName
  }), React.createElement(PlaceholderCard, {
    title: "Home address",
    value: "Not set"
  }), React.createElement(PlaceholderCard, {
    title: "Work",
    value: "Not set"
  }), React.createElement(PlaceholderCard, {
    title: "Planned drive calendar",
    value: "No drives planned"
  })));
}
function SyncPhonePage({
  setSettingsPage,
  phoneState,
  setPhoneState
}) {
  return React.createElement("section", {
    className: "menu-content"
  }, React.createElement(BackButton, {
    onClick: () => setSettingsPage("main")
  }), React.createElement("h1", null, "Connect your phone"), React.createElement("div", {
    className: "settings-cards"
  }, ["Bluetooth", "Cable", "CarPlay"].map(method => React.createElement("button", {
    key: method,
    onClick: () => setPhoneState(`${method} selected.`)
  }, React.createElement(Icon, {
    name: method === "Bluetooth" ? "bluetooth" : method === "Cable" ? "cable" : "screen"
  }), method))), React.createElement("div", {
    className: "connection-state"
  }, phoneState));
}
function AboutPage() {
  return React.createElement("section", {
    className: "menu-content"
  }, React.createElement("h1", null, "About Bliq"), React.createElement("div", {
    className: "gray-visual car-image"
  }, "Vehicle information"), React.createElement("div", {
    className: "about-grid"
  }, React.createElement(PlaceholderCard, {
    title: "Car data",
    value: "Vehicle ID, sensor status, ride mode"
  }), React.createElement(PlaceholderCard, {
    title: "Autonomous ride note",
    value: "This vehicle drives autonomously. Remote support is available during the ride."
  })), React.createElement(PrivacyNotice, null));
}
function VoiceOverlay({
  open,
  onClose,
  onSupport,
  temperature,
  nowPlaying,
  musicPlaying,
  setMusicPlaying,
  musicMuted,
  setMusicMuted,
  onNextSong
}) {
  const commands = ["Change destination", "Pull over", "End ride", "Play music", "Call support"];
  const loopCommands = [...commands, ...commands, ...commands];
  const transcriptWords = ["Drop", "me", "off", "at", "Alexanderplatz"];
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [activeCommand, setActiveCommand] = useState(commands.length + 1);
  const [transcriptWordCount, setTranscriptWordCount] = useState(0);
  const commandListRef = useRef(null);
  const {
    mounted,
    closing
  } = useAnimatedPresence(open, 280);
  useEffect(() => {
    if (!mounted) {
      setCommandsOpen(false);
      setActiveCommand(commands.length + 1);
      setTranscriptWordCount(0);
      return undefined;
    }
    const timer = window.setInterval(() => {
      setTranscriptWordCount(count => count >= transcriptWords.length ? 0 : count + 1);
    }, 520);
    return () => window.clearInterval(timer);
  }, [mounted]);
  useEffect(() => {
    if (!commandsOpen || !commandListRef.current) return;
    const itemHeight = commandListRef.current.firstElementChild?.offsetHeight || 78;
    commandListRef.current.scrollTop = activeCommand * itemHeight;
  }, [commandsOpen]);
  function handleCommandScroll(event) {
    const itemHeight = event.currentTarget.firstElementChild?.offsetHeight || 78;
    const nextIndex = Math.round(event.currentTarget.scrollTop / itemHeight);
    setActiveCommand(nextIndex);
    if (nextIndex < commands.length) {
      event.currentTarget.scrollTop += commands.length * itemHeight;
      setActiveCommand(nextIndex + commands.length);
    } else if (nextIndex >= commands.length * 2) {
      event.currentTarget.scrollTop -= commands.length * itemHeight;
      setActiveCommand(nextIndex - commands.length);
    }
  }
  return React.createElement(ModalShell, {
    open: mounted,
    className: `voice-modal ${closing ? "is-closing" : ""}`,
    backdropClassName: `voice-backdrop ${closing ? "is-closing" : ""}`
  }, React.createElement("div", {
    className: "panel-heading"
  }, React.createElement("button", {
    onClick: onClose
  }, React.createElement(Icon, {
    name: "close"
  }), " Close")), React.createElement("div", {
    className: "voice-top-metrics"
  }, React.createElement(InfoItem, {
    label: "Arriving in",
    value: "23 min"
  }), React.createElement(InfoItem, {
    label: "At",
    value: mockRide.eta
  })), React.createElement("div", {
    className: "voice-orb-group"
  }, React.createElement("span", null, "Listening..."), React.createElement("div", {
    className: "voice-waveform",
    "aria-hidden": "true"
  }, Array.from({
    length: 30
  }).map((_, index) => React.createElement("i", {
    key: index,
    style: {
      "--wave": `${14 + index % 7 * 6}px`
    }
  })))), React.createElement("div", {
    className: "voice-transcript-group"
  }, React.createElement("p", {
    className: "voice-transcript"
  }, "\u201C", transcriptWords.slice(0, transcriptWordCount).join(" "), transcriptWordCount === transcriptWords.length ? "”" : "", React.createElement("span", {
    className: "transcript-caret"
  })), React.createElement("button", {
    className: `voice-command-trigger ${commandsOpen ? "open" : ""}`,
    onClick: () => setCommandsOpen(!commandsOpen)
  }, "Try these voice commands", React.createElement(Icon, {
    name: "chevronDown"
  })), commandsOpen && React.createElement("div", {
    ref: commandListRef,
    className: "voice-command-picker",
    onScroll: handleCommandScroll,
    "aria-label": "Voice command examples"
  }, loopCommands.map((command, index) => React.createElement("button", {
    key: `${command}-${index}`,
    className: ["voice-command-option", index === activeCommand ? "current" : "", Math.abs(index - activeCommand) === 1 ? "neighbor" : ""].join(" "),
    onClick: () => {
      setActiveCommand(index);
      const itemHeight = commandListRef.current?.firstElementChild?.offsetHeight || 78;
      commandListRef.current?.scrollTo({
        top: index * itemHeight,
        behavior: "smooth"
      });
    }
  }, command)))), React.createElement("div", {
    className: "voice-action-bar"
  }, React.createElement("button", {
    className: "voice-support-action",
    onClick: onSupport
  }, React.createElement(Icon, {
    name: "support"
  }), " Support"), React.createElement("button", {
    className: "voice-climate-action"
  }, React.createElement(Icon, {
    name: "bulb"
  }), React.createElement("span", null, temperature, "\xB0")), React.createElement("div", {
    className: "voice-media-action"
  }, React.createElement("span", {
    className: "song-art",
    "aria-hidden": "true"
  }), React.createElement("span", {
    className: "song-copy"
  }, React.createElement("strong", null, nowPlaying), React.createElement("small", null, mockRide.artists[nowPlaying])), React.createElement("button", {
    onClick: () => setMusicPlaying(!musicPlaying),
    "aria-label": musicPlaying ? "Pause music" : "Play music"
  }, React.createElement(Icon, {
    name: musicPlaying ? "pause" : "play"
  })), React.createElement("button", {
    onClick: () => setMusicMuted(!musicMuted),
    "aria-label": musicMuted ? "Unmute music" : "Mute music"
  }, React.createElement(Icon, {
    name: musicMuted ? "volumeOff" : "volume"
  })), React.createElement("button", {
    onClick: onNextSong,
    "aria-label": "Next song"
  }, React.createElement(Icon, {
    name: "next"
  }))), React.createElement("button", {
    className: "voice-mic-action",
    onClick: onClose,
    "aria-label": "Close voice control"
  }, React.createElement(Icon, {
    name: "voice"
  }))));
}
function SupportOverlay({
  open,
  onClose,
  onRequestPullOver
}) {
  return React.createElement(ModalShell, {
    open: open,
    className: "support-modal",
    backdropClassName: "support-backdrop"
  }, React.createElement("div", {
    className: "support-heading"
  }, React.createElement("h1", null, "Call support"), React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close support"
  }, React.createElement(Icon, {
    name: "close"
  }))), React.createElement("p", null, "Need help? A Bliq support operator can assist you during the ride."), React.createElement("div", {
    className: "support-actions"
  }, React.createElement("button", null, React.createElement(Icon, {
    name: "plus"
  }), " Call support"), React.createElement("button", {
        className: "support-pull-over",
    onClick: onRequestPullOver
  }, "Request pull over"), React.createElement("button", {
    className: "support-cancel",
    onClick: onClose
  }, "Cancel")));
}
function AddStopModal({
  open,
  onClose
}) {
  return React.createElement(ModalShell, {
    open: open,
    className: "support-modal"
  }, React.createElement("h1", null, "Add stop"), React.createElement("div", {
    className: "input-placeholder"
  }, "Search destination placeholder"), React.createElement("div", {
    className: "modal-actions"
  }, React.createElement("button", null, React.createElement(Icon, {
    name: "map"
  }), " Preview stop"), React.createElement("button", {
    onClick: onClose
  }, React.createElement(Icon, {
    name: "close"
  }), " Cancel")));
}
function ConfirmModal({
  open,
  title,
  body,
  primary,
  secondary,
  onPrimary,
  onSecondary,
  primaryLast = false
}) {
  const primaryButton = React.createElement("button", {
    className: "danger-fill",
    onClick: onPrimary
  }, React.createElement(Icon, {
    name: "stop"
  }), " ", primary);
  const secondaryButton = React.createElement("button", {
    onClick: onSecondary
  }, React.createElement(Icon, {
    name: "undo"
  }), " ", secondary);
  return React.createElement(ModalShell, {
    open: open,
    className: "support-modal"
  }, React.createElement("h1", null, title), React.createElement("p", null, body), React.createElement("div", {
    className: "modal-actions"
  }, primaryLast ? secondaryButton : primaryButton, primaryLast ? primaryButton : secondaryButton));
}
function ModalShell({
  open,
  className,
  backdropClassName = "",
  children
}) {
  if (!open) return null;
  return React.createElement("div", {
    className: `overlay-backdrop ${backdropClassName}`
  }, React.createElement("section", {
    className: `modal-panel ${className}`
  }, children));
}
function PullOverFlow({
  ridePhase,
  doorsUnlocked,
  onUnlock,
  onContinue,
  onEnd
}) {
  const pullingOver = ridePhase === "pullingOver";
  return React.createElement("section", {
    className: `pull-over-panel ${pullingOver ? "is-pulling-over" : "is-pulled-over"}`
  }, React.createElement("div", {
    className: "pull-over-visual",
    "aria-hidden": "true"
  }, React.createElement(Icon, {
    name: pullingOver ? "route" : "pull"
  })), React.createElement("div", {
    className: "pull-over-content"
  }, React.createElement("p", {
    className: "eyebrow"
  }, pullingOver ? "Finding a safe place" : "Vehicle stopped"), React.createElement("h1", null, pullingOver ? "Car is pulling over…" : "Car is pulled over"), React.createElement("p", null, pullingOver ? "Please remain seated and keep your seatbelt fastened." : "It is safe to exit when your surroundings are clear."), !pullingOver && React.createElement("div", {
    className: "pull-actions"
  }, React.createElement("button", {
    onClick: onContinue
  }, React.createElement(Icon, {
    name: "route"
  }), " Continue ride"), React.createElement("button", {
    onClick: onUnlock
  }, React.createElement(Icon, {
    name: "unlock"
  }), " ", doorsUnlocked ? "Car unlocked" : "Unlock car"), React.createElement("button", {
    className: "end-ride-button",
    onClick: onEnd
  }, React.createElement(Icon, {
    name: "stop"
  }), " End ride here"))));
}
function DropOffSequence({
  ridePhase,
  doorsUnlocked,
  onUnlock
}) {
  const arrived = ridePhase === "arrived";
  return React.createElement("section", {
    className: `dropoff-sequence ${arrived ? "dropoff-arrived" : "dropoff-arriving"}`
  }, React.createElement("div", {
    className: "dropoff-location",
    "aria-hidden": "true"
  }, React.createElement("div", {
    className: "dropoff-map-placeholder"
  }, React.createElement(Icon, {
    name: "map"
  }), React.createElement("span", null, mockRide.destination))), React.createElement("div", {
    className: "dropoff-message"
  }, React.createElement("p", {
    className: "eyebrow"
  }, arrived ? "You have arrived" : "Drop-off"), React.createElement("h1", null, arrived ? "You’re here" : `Arriving at your drop-off in 2 min`), React.createElement("p", null, arrived ? "It’s safe to leave the vehicle. Please don’t forget your things." : `${mockRide.destination} is just ahead. We’ll stop in a safe place for you.`), arrived && React.createElement("button", {
    className: "unlock-car-button",
    onClick: onUnlock
  }, React.createElement(Icon, {
    name: "unlock"
  }), doorsUnlocked ? "Car doors unlocked" : "Unlock car doors")));
}
function SlideToStart({
  onComplete
}) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [thumbTravel, setThumbTravel] = useState(282);
  function updateProgress(clientX) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const travel = Math.max(220, rect.width - 116);
    setThumbTravel(travel);
    const nextProgress = Math.max(0, Math.min(1, (clientX - rect.left - 52) / travel));
    setProgress(nextProgress);
    if (nextProgress > 0.86) {
      setSliding(false);
      setProgress(1);
      window.setTimeout(onComplete, 180);
    }
  }
  function startSlide(event) {
    setSliding(true);
    updateProgress(event.clientX || event.touches?.[0]?.clientX || 0);
  }
  function moveSlide(event) {
    if (!sliding) return;
    updateProgress(event.clientX || event.touches?.[0]?.clientX || 0);
  }
  function endSlide() {
    if (progress < 0.86) setProgress(0);
    setSliding(false);
  }
  return React.createElement("div", {
    ref: trackRef,
    className: "slide-start",
    onMouseMove: moveSlide,
    onMouseUp: endSlide,
    onMouseLeave: endSlide,
    onTouchMove: moveSlide,
    onTouchEnd: endSlide
  }, React.createElement("div", {
    className: "slide-fill",
    style: {
      width: `${Math.max(18, progress * 100)}%`
    }
  }), React.createElement("button", {
    className: "slide-thumb",
    style: {
      transform: `translateX(${progress * thumbTravel}px)`
    },
    onMouseDown: startSlide,
    onTouchStart: startSlide,
    "aria-label": "Slide to start ride"
  }, React.createElement(Icon, {
    name: "arrowRight"
  })), React.createElement("span", null, "Slide to start ride"), React.createElement(Icon, {
    name: "seatbelt"
  }));
}
function TopActions({
  children
}) {
  return React.createElement("div", {
    className: "top-actions"
  }, children);
}
function RouteRow({
  label,
  value
}) {
  return React.createElement("div", {
    className: "route-row"
  }, React.createElement("span", null, label), React.createElement("strong", null, value));
}
function Stepper({
  label,
  value,
  onMinus,
  onPlus
}) {
  return React.createElement("div", {
    className: "stepper"
  }, React.createElement("span", null, label), React.createElement("div", null, React.createElement("button", {
    onClick: onMinus
  }, React.createElement(Icon, {
    name: "minus"
  })), React.createElement("strong", null, value), React.createElement("button", {
    onClick: onPlus
  }, React.createElement(Icon, {
    name: "plus"
  }))));
}
function SegmentedControl({
  label,
  options
}) {
  const [selected, setSelected] = useState(options[0]);
  return React.createElement("div", {
    className: "segmented-block"
  }, React.createElement("span", null, label), React.createElement("div", {
    className: "segmented"
  }, options.map(option => React.createElement("button", {
    key: option,
    className: selected === option ? "selected" : "",
    onClick: () => setSelected(option)
  }, option))));
}
function ToggleRow({
  title,
  value
}) {
  return React.createElement("div", {
    className: "toggle-row"
  }, React.createElement("span", null, title), React.createElement("strong", null, value));
}
function PlaceholderCard({
  title,
  value = "Placeholder"
}) {
  return React.createElement("div", {
    className: "placeholder-card"
  }, React.createElement("span", null, title), React.createElement("strong", null, value));
}
function NowPlaying({
  title
}) {
  return React.createElement("div", {
    className: "now-playing"
  }, React.createElement("span", null, "Now playing"), React.createElement("strong", null, title));
}
function BackButton({
  onClick
}) {
  return React.createElement("button", {
    className: "back-button",
    onClick: onClick
  }, React.createElement(Icon, {
    name: "back"
  }), " Back");
}
function Icon({
  name
}) {
  const imageIcons = {
    support: "src/assets/figma-support-action-icon.svg",
    pull: "src/assets/figma-pull-over-action-icon.svg",
    play: "src/assets/figma-play-music-action-icon.svg",
    scan: "src/assets/figma-cube-icon.svg",
    menu: "src/assets/figma-menu-icon.svg",
    music: "src/assets/figma-menu-music-icon.svg",
    fan: "src/assets/figma-menu-fan-icon.svg",
    light: "src/assets/figma-menu-sun-icon.svg",
    settings: "src/assets/figma-menu-settings-icon.svg",
    info: "src/assets/figma-menu-info-icon.svg",
    close: "src/assets/figma-menu-close-icon.svg"
  };
  if (imageIcons[name]) {
    return React.createElement("img", {
      className: `icon icon-${name}`,
      "aria-hidden": "true",
      src: imageIcons[name],
      alt: ""
    });
  }
  const paths = {
    support: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "7"
    }), React.createElement("path", {
      d: "M8 16v2h8v-2"
    }), React.createElement("path", {
      d: "M7 12H5v-1a7 7 0 0 1 14 0v1h-2"
    })),
    pull: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M6 6h12v12H6z"
    }), React.createElement("path", {
      d: "M9 12h6"
    })),
    pause: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M9 7v10"
    }), React.createElement("path", {
      d: "M15 7v10"
    })),
    next: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M7 6l8 6-8 6z"
    }), React.createElement("path", {
      d: "M17 6v12"
    })),
    volume: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 10h4l5-4v12l-5-4H5z"
    }), React.createElement("path", {
      d: "M17 9a4 4 0 0 1 0 6"
    }), React.createElement("path", {
      d: "M19 6a8 8 0 0 1 0 12"
    })),
    volumeDown: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 10h4l5-4v12l-5-4H5z"
    }), React.createElement("path", {
      d: "M18 12h4"
    })),
    volumeUp: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 10h4l5-4v12l-5-4H5z"
    }), React.createElement("path", {
      d: "M18 12h4"
    }), React.createElement("path", {
      d: "M20 10v4"
    })),
    volumeOff: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 10h4l5-4v12l-5-4H5z"
    }), React.createElement("path", {
      d: "M17 10l4 4"
    }), React.createElement("path", {
      d: "M21 10l-4 4"
    })),
    play: React.createElement("path", {
      d: "M9 6v12l9-6z"
    }),
    voice: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M12 4a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z"
    }), React.createElement("path", {
      d: "M6 11a6 6 0 0 0 12 0"
    }), React.createElement("path", {
      d: "M12 17v3"
    })),
    seatbelt: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "9",
      cy: "6",
      r: "2"
    }), React.createElement("path", {
      d: "M7 20l5-12 5 12"
    }), React.createElement("path", {
      d: "M6 13h12"
    })),
    map: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"
    }), React.createElement("path", {
      d: "M9 4v14"
    }), React.createElement("path", {
      d: "M15 6v14"
    })),
    menu: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M6 8h12"
    }), React.createElement("path", {
      d: "M6 12h12"
    }), React.createElement("path", {
      d: "M6 16h12"
    })),
    scan: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 9V5h4"
    }), React.createElement("path", {
      d: "M15 5h4v4"
    }), React.createElement("path", {
      d: "M19 15v4h-4"
    }), React.createElement("path", {
      d: "M9 19H5v-4"
    }), React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    })),
    plus: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M12 5v14"
    }), React.createElement("path", {
      d: "M5 12h14"
    })),
    minus: React.createElement("path", {
      d: "M5 12h14"
    }),
    edit: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 18h4l10-10-4-4L5 14z"
    }), React.createElement("path", {
      d: "M13 6l4 4"
    })),
    stop: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M7 7h10v10H7z"
    })),
    close: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M7 7l10 10"
    }), React.createElement("path", {
      d: "M17 7L7 17"
    })),
    music: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M9 18V6l10-2v12"
    }), React.createElement("circle", {
      cx: "7",
      cy: "18",
      r: "2"
    }), React.createElement("circle", {
      cx: "17",
      cy: "16",
      r: "2"
    })),
    temp: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M10 14.5V5a2 2 0 0 1 4 0v9.5"
    }), React.createElement("circle", {
      cx: "12",
      cy: "17",
      r: "3"
    })),
    light: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M8 14a6 6 0 1 1 8 0"
    }), React.createElement("path", {
      d: "M9 18h6"
    }), React.createElement("path", {
      d: "M10 21h4"
    })),
    bulb: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M8 14a6 6 0 1 1 8 0"
    }), React.createElement("path", {
      d: "M9 17h6"
    }), React.createElement("path", {
      d: "M10 20h4"
    })),
    moon: React.createElement("path", {
      d: "M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z"
    }),
    sun: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4"
    }), React.createElement("path", {
      d: "M12 2v2"
    }), React.createElement("path", {
      d: "M12 20v2"
    }), React.createElement("path", {
      d: "M4.9 4.9l1.4 1.4"
    }), React.createElement("path", {
      d: "M17.7 17.7l1.4 1.4"
    }), React.createElement("path", {
      d: "M2 12h2"
    }), React.createElement("path", {
      d: "M20 12h2"
    }), React.createElement("path", {
      d: "M4.9 19.1l1.4-1.4"
    }), React.createElement("path", {
      d: "M17.7 6.3l1.4-1.4"
    })),
    settings: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), React.createElement("path", {
      d: "M12 3v3"
    }), React.createElement("path", {
      d: "M12 18v3"
    }), React.createElement("path", {
      d: "M3 12h3"
    }), React.createElement("path", {
      d: "M18 12h3"
    }), React.createElement("path", {
      d: "M5.6 5.6l2.1 2.1"
    }), React.createElement("path", {
      d: "M16.3 16.3l2.1 2.1"
    }), React.createElement("path", {
      d: "M18.4 5.6l-2.1 2.1"
    }), React.createElement("path", {
      d: "M7.7 16.3l-2.1 2.1"
    })),
    info: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), React.createElement("path", {
      d: "M12 11v5"
    }), React.createElement("path", {
      d: "M12 7h.01"
    })),
    phone: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M8 4h8v16H8z"
    }), React.createElement("path", {
      d: "M11 17h2"
    })),
    radio: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 10h14v10H5z"
    }), React.createElement("path", {
      d: "M8 14h4"
    }), React.createElement("path", {
      d: "M16 14h.01"
    }), React.createElement("path", {
      d: "M8 7l9-3"
    })),
    a11y: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "5",
      r: "2"
    }), React.createElement("path", {
      d: "M5 9h14"
    }), React.createElement("path", {
      d: "M12 9v12"
    }), React.createElement("path", {
      d: "M8 21l4-8 4 8"
    })),
    member: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "8",
      r: "4"
    }), React.createElement("path", {
      d: "M5 20a7 7 0 0 1 14 0"
    })),
    text: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 6h14"
    }), React.createElement("path", {
      d: "M8 6v12"
    }), React.createElement("path", {
      d: "M16 6v12"
    }), React.createElement("path", {
      d: "M6 18h6"
    }), React.createElement("path", {
      d: "M14 18h4"
    })),
    contrast: React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), React.createElement("path", {
      d: "M12 3v18"
    })),
    bluetooth: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M10 4l6 5-6 5V4z"
    }), React.createElement("path", {
      d: "M10 14l6 5-6 1v-6z"
    }), React.createElement("path", {
      d: "M5 8l11 11"
    }), React.createElement("path", {
      d: "M5 16L16 5"
    })),
    cable: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M7 8h10"
    }), React.createElement("path", {
      d: "M9 8v6a3 3 0 0 0 6 0V8"
    }), React.createElement("path", {
      d: "M12 17v4"
    })),
    screen: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M4 5h16v12H4z"
    }), React.createElement("path", {
      d: "M9 21h6"
    }), React.createElement("path", {
      d: "M12 17v4"
    })),
    route: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M6 18c5-8 11 0 12-10"
    }), React.createElement("circle", {
      cx: "6",
      cy: "18",
      r: "2"
    }), React.createElement("circle", {
      cx: "18",
      cy: "8",
      r: "2"
    })),
    unlock: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M8 11h10v9H6v-9h2"
    }), React.createElement("path", {
      d: "M9 11V8a4 4 0 0 1 7-2"
    })),
    expand: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M8 4H4v4"
    }), React.createElement("path", {
      d: "M4 4l6 6"
    }), React.createElement("path", {
      d: "M16 20h4v-4"
    }), React.createElement("path", {
      d: "M20 20l-6-6"
    })),
    navigationArrow: React.createElement("path", {
      d: "M12 3l7 18-7-4-7 4z"
    }),
    undo: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M9 7H5v4"
    }), React.createElement("path", {
      d: "M5 11a7 7 0 1 0 2-5"
    })),
    back: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M15 6l-6 6 6 6"
    })),
    arrowRight: React.createElement(React.Fragment, null, React.createElement("path", {
      d: "M5 12h14"
    }), React.createElement("path", {
      d: "M13 6l6 6-6 6"
    })),
    chevronDown: React.createElement("path", {
      d: "M6 9l6 6 6-6"
    })
  };
  return React.createElement("svg", {
    className: `icon icon-${name}`,
    "aria-hidden": "true",
    viewBox: "0 0 24 24",
    fill: "none"
  }, paths[name] || paths.info);
}
function commandIcon(command) {
  if (command === "Change destination") return "map";
  if (command === "Pull over") return "pull";
  if (command === "End ride") return "stop";
  return "music";
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
