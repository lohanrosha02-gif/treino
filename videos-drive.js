/* Biblioteca de vídeos instrutivos. MP4s de demonstração real do projeto free-exercise-db-with-videos (MIT);
   vídeos externos YouTube são incorporados, não copiados. Os antigos GIFs não são usados na interface.
   Para vídeos próprios, preencher "videos" com IDs da pasta Google Drive. */
window.MeuTreinoVideos = Object.freeze({
  pastaId: "1P1cEjL-pOF4l2WX_SFgJHqzoSvN9jQs6",
  pastaUrl: "https://drive.google.com/drive/folders/1P1cEjL-pOF4l2WX_SFgJHqzoSvN9jQs6",
  videos: {},
  clips: {
  "a2": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-reverse-t-bar-row.mp4",
    "name": "Lever Reverse T-Bar Row"
  },
  "a3": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-incline-hammer-chest-press.mp4",
    "name": "Lever Incline Hammer Chest Press"
  },
  "a4": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-bar-lateral-pulldown-wide-shoulder-grip.mp4",
    "name": "Wide Grip Cable Lat Pulldown"
  },
  "a5": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-seated-lateral-raise.mp4",
    "name": "Dumbbell Seated Lateral Raise"
  },
  "a6": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-pushdown-rope-attachment.mp4",
    "name": "Cable Rope Triceps Pushdown"
  },
  "a7": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-alternate-seated-biceps-curl.mp4",
    "name": "Seated Alternating Dumbbell Curl"
  },
  "mB1": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-feet-and-ankles-stretch.mp4",
    "name": "Feet and Ankles Stretch"
  },
  "b1": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-hip-abduction.mp4",
    "name": "Lever Seated Hip Abduction"
  },
  "b3": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-seated-calf-raise.mp4",
    "name": "Dumbbell Seated Calf Raise"
  },
  "b6": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-hip-adduction.mp4",
    "name": "Lever Seated Hip Adduction"
  },
  "c1": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-incline-hammer-chest-press.mp4",
    "name": "Lever Incline Hammer Chest Press"
  },
  "c2": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-reverse-t-bar-row.mp4",
    "name": "Lever Reverse T-Bar Row"
  },
  "c3": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-pec-deck-fly.mp4",
    "name": "Pec Deck Fly"
  },
  "c4": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-bar-lateral-pulldown-wide-shoulder-grip.mp4",
    "name": "Wide Grip Cable Lat Pulldown"
  },
  "c7": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/cable-pushdown-rope-attachment.mp4",
    "name": "Cable Rope Triceps Pushdown"
  },
  "mD1": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stretching-feet-and-ankles-rotation-stretch.mp4",
    "name": "Feet and Ankles Rotation Stretch"
  },
  "d1": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/lever-seated-hip-abduction.mp4",
    "name": "Lever Seated Hip Abduction"
  },
  "d3": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/dumbbell-seated-calf-raise.mp4",
    "name": "Dumbbell Seated Calf Raise"
  },
  "cardioA": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stationary-bike.mp4",
    "name": "Stationary Bike"
  },
  "cardioB": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stationary-bike.mp4",
    "name": "Stationary Bike"
  },
  "cardioC": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stationary-bike.mp4",
    "name": "Stationary Bike"
  },
  "cardioD": {
    "type": "mp4",
    "url": "https://pub-585d42eb1aa64a67aedf483ec328d3fe.r2.dev/exercise-videos/male/stationary-bike.mp4",
    "name": "Stationary Bike"
  },
  "a1": {
    "type": "youtube",
    "videoId": "6CPnYJonfUo",
    "name": "How to Use the Chest Press Machine"
  },
  "c5": {
    "type": "youtube",
    "videoId": "BzeAjF1EeCY",
    "name": "Face Pulls — QMotion"
  }
}
});
