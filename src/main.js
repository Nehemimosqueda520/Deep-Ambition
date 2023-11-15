import Phaser from "phaser";

import Preload from "./scenes/Preload";
import Lobby from "./scenes/Lobby";
import UI from "./scenes/UI";
import Game from "./scenes/Game";
import PrincipalMenu from "./scenes/PrincipalMenu";
import Settings from "./scenes/Settings";
import Pause from "./scenes/pause";
import Win from "./scenes/win";
import Lose from "./scenes/lose";
import Credits from "./scenes/credits";

import FirebasePlugin from "./plugins/FirebasePlugin";
import Login from "./scenes/Login";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [
    Preload,
    Login,
    Lobby,
    PrincipalMenu,
    Game,
    UI,
    Settings,
    Pause,
    Win,
    Lose,
    Credits
  ],
  plugins: {
    global: [
      {
        key: "FirebasePlugin",
        plugin: FirebasePlugin,
        start: true,
        mapping: "firebase",
      },
    ],
  },
};

export default new Phaser.Game(config);