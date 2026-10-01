import {
  AlertTriangle,
  ArrowRight,
  Ban,
  CarFront,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  CloudRain,
  Footprints,
  MapPin,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";

type Point = { x: number; y: number };
type Phase = "intro" | "playing" | "won" | "lost";
type ObstacleType = "traffic" | "rain" | "delay";

type Obstacle = Point & {
  type: ObstacleType;
  label: string;
};

const COLS = 14;
const ROWS = 10;
const START: Point = { x: 1, y: 8 };
const GOAL: Point = { x: 12, y: 1 };
const TOTAL_TIME = 45;

const OBSTACLES: Obstacle[] = [
  { x: 3, y: 8, type: "traffic", label: "Trancón" },
  { x: 3, y: 7, type: "rain", label: "Lluvia" },
  { x: 5, y: 7, type: "delay", label: "Fila larga" },
  { x: 5, y: 5, type: "traffic", label: "Trancón" },
  { x: 6, y: 3, type: "rain", label: "Lluvia" },
  { x: 8, y: 4, type: "delay", label: "Retraso" },
  { x: 9, y: 2, type: "traffic", label: "Trancón" },
  { x: 10, y: 7, type: "rain", label: "Lluvia" },
  { x: 11, y: 5, type: "delay", label: "Fila larga" },
  { x: 12, y: 7, type: "traffic", label: "Trancón" },
];

const CAMPUS_LABELS = [
  { x: 2, y: 2, label: "Plazoleta" },
  { x: 7, y: 5, label: "Bloque 16" },
  { x: 10, y: 1, label: "Cafetería" },
];

const obstacleSet = new Set(OBSTACLES.map(({ x, y }) => `${x}:${y}`));
const pointKey = (point: Point) => `${point.x}:${point.y}`;
const samePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

function obstacleIcon(type: ObstacleType) {
  if (type === "traffic") return <CarFront size={13} strokeWidth={2.2} />;
  if (type === "rain") return <CloudRain size={13} strokeWidth={2.2} />;
  return <Ban size={13} strokeWidth={2.2} />;
}

function initialSnake(): Point[] {
  return [START, { x: 1, y: 9 }, { x: 0, y: 9 }];
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [statusMessage, setStatusMessage] = useState("La ruta está despejada. ¿Listo para salir?");
  const [lastDirection, setLastDirection] = useState("NORTE");

  const resetGame = useCallback(() => {
    setSnake(initialSnake());
    setTimeLeft(TOTAL_TIME);
    setStatusMessage("La ruta está despejada. ¿Listo para salir?");
    setLastDirection("NORTE");
    setPhase("intro");
  }, []);

  const startGame = useCallback(() => {
    setSnake(initialSnake());
    setTimeLeft(TOTAL_TIME);
    setStatusMessage("¡Ya! Encuentra la cafetería antes de que cierre tu ventana.");
    setLastDirection("NORTE");
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setPhase("lost");
          setStatusMessage("Se acabó el tiempo. El almuerzo tendrá que esperar.");
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const movePlayer = useCallback(
    (dx: number, dy: number, direction: string) => {
      if (phase !== "playing") return;
      setLastDirection(direction);
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const next = { x: head.x + dx, y: head.y + dy };

        if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
          setTimeLeft((current) => Math.max(0, current - 1));
          setStatusMessage("Borde del campus: cambia de ruta y no pierdas el paso.");
          return currentSnake;
        }

        if (obstacleSet.has(pointKey(next))) {
          const obstacle = OBSTACLES.find((item) => samePoint(item, next));
          setTimeLeft((current) => Math.max(0, current - 3));
          setStatusMessage(`${obstacle?.label ?? "Obstáculo"}: pierdes 3 segundos.`);
          return currentSnake;
        }

        const hitsTail = currentSnake.slice(0, -1).some((part) => samePoint(part, next));
        if (hitsTail) {
          setTimeLeft((current) => Math.max(0, current - 2));
          setStatusMessage("Te cruzaste en tu propia fila: retrocede y busca otra ruta.");
          return currentSnake;
        }

        const nextSnake = [next, ...currentSnake].slice(0, Math.min(7, 3 + Math.floor((TOTAL_TIME - timeLeft) / 8)));
        if (samePoint(next, GOAL)) {
          setPhase("won");
          setStatusMessage("¡Almuerzo comprado! Misión cumplida.");
          return nextSnake;
        }
        return nextSnake;
      });
    },
    [phase, timeLeft],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const directions: Record<string, [number, number, string]> = {
        arrowup: [0, -1, "NORTE"],
        w: [0, -1, "NORTE"],
        arrowdown: [0, 1, "SUR"],
        s: [0, 1, "SUR"],
        arrowleft: [-1, 0, "OCCIDENTE"],
        a: [-1, 0, "OCCIDENTE"],
        arrowright: [1, 0, "ORIENTE"],
        d: [1, 0, "ORIENTE"],
      };
      const direction = directions[key];
      if (!direction) return;
      event.preventDefault();
      movePlayer(...direction);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [movePlayer]);

  const progress = useMemo(() => ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100, [timeLeft]);
  const mapStyle = { "--map-cols": COLS } as CSSProperties;
  const statusTone = phase === "won" ? "success" : phase === "lost" ? "danger" : "neutral";

  return (
    <div className="lunch-game">
      <header className="game-header">
        <a className="game-brand" href="#inicio" aria-label="Almuerzo Jave, inicio">
          <span className="brand-mark"><Utensils size={18} strokeWidth={2.5} /></span>
          <span>ALMUERZO<br /><strong>JAVE</strong></span>
        </a>
        <div className="header-route"><span>RUTA 01</span><i /> <span>CAMPUS PONTIFICIA</span></div>
        <div className="header-year">BOGOTÁ · 2026</div>
      </header>

      <main id="inicio">
        <section className="game-hero" aria-labelledby="game-title">
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={14} /> Juego de recorrido cotidiano</p>
            <h1 id="game-title">Compra el<br /><em>almuerzo.</em></h1>
            <p className="hero-description">Una sola misión en la Javeriana: sal de tu punto, elige la ruta y llega a la cafetería antes de que se cierre tu ventana de tiempo.</p>
          </div>
          <div className="hero-brief">
            <span className="brief-label">OBJETIVO ÚNICO</span>
            <strong>Comprar el almuerzo</strong>
            <p>Evita el trancón, la lluvia y las filas largas. Cada segundo cuenta.</p>
            <span className="brief-line" />
            <span className="brief-caption">No hay puntos extra. Solo llegar.</span>
          </div>
        </section>

        <section className="game-layout" aria-label="Juego Compra el almuerzo">
          <div className="map-card">
            <div className="card-topline">
              <span><span className="live-dot" /> MAPA DE CAMPUS / RECORRIDO</span>
              <span className={`timer ${timeLeft <= 10 && phase === "playing" ? "timer--urgent" : ""}`}><Clock3 size={15} /> {phase === "intro" ? "00:45" : `00:${String(timeLeft).padStart(2, "0")}`}</span>
            </div>
            <div className="map-frame">
              <div className="map-compass"><span>N</span><i /><span>O</span><i /><span>S</span><i /><span>E</span></div>
              <div className="map-board" style={mapStyle} aria-label="Mapa interactivo del campus">
                {Array.from({ length: COLS * ROWS }, (_, index) => {
                  const cell = { x: index % COLS, y: Math.floor(index / COLS) };
                  const obstacle = OBSTACLES.find((item) => samePoint(item, cell));
                  const campusLabel = CAMPUS_LABELS.find((item) => samePoint(item, cell));
                  const snakeIndex = snake.findIndex((part) => samePoint(part, cell));
                  const isGoal = samePoint(cell, GOAL);
                  const isStart = samePoint(cell, START);
                  return (
                    <div className={`map-cell ${obstacle ? `map-cell--${obstacle.type}` : ""} ${isGoal ? "map-cell--goal" : ""} ${isStart ? "map-cell--start" : ""}`} key={pointKey(cell)}>
                      {campusLabel && <span className="cell-label">{campusLabel.label}</span>}
                      {obstacle && <span className="obstacle-icon" title={obstacle.label}>{obstacleIcon(obstacle.type)}</span>}
                      {isGoal && <span className="goal-marker"><ShoppingBag size={20} /><small>ALMUERZO</small></span>}
                      {isStart && snakeIndex < 0 && <span className="start-marker"><MapPin size={15} /> SALIDA</span>}
                      {snakeIndex >= 0 && <span className={`runner runner--${snakeIndex === 0 ? "head" : "tail"}`} aria-label={snakeIndex === 0 ? "Tu posición" : "Tu rastro"}><Footprints size={snakeIndex === 0 ? 16 : 12} /></span>}
                    </div>
                  );
                })}
                {phase !== "playing" && (
                  <div className="map-overlay">
                    {phase === "intro" && <><span className="overlay-kicker">VENTANA ABIERTA</span><strong>La cafetería<br />queda al norte.</strong><p>Usa las flechas o WASD para moverte.</p><button className="primary-button" onClick={startGame}>Comenzar recorrido <ArrowRight size={17} /></button></>}
                    {phase === "won" && <><span className="overlay-kicker overlay-kicker--success">MISIÓN CUMPLIDA</span><strong>Almuerzo<br />comprado.</strong><p>Lograste llegar a la cafetería con tiempo.</p><button className="primary-button" onClick={resetGame}>Jugar de nuevo <RotateCcw size={16} /></button></>}
                    {phase === "lost" && <><span className="overlay-kicker overlay-kicker--danger">VENTANA CERRADA</span><strong>Te quedaste<br />sin tiempo.</strong><p>La ruta cambia todos los días. Intenta otra vez.</p><button className="primary-button" onClick={startGame}>Intentar de nuevo <RotateCcw size={16} /></button></>}
                  </div>
                )}
              </div>
              <div className="map-stamp"><span>PUJ</span><strong>J</strong><span>ALMUERZO</span></div>
            </div>
            <div className="map-footer">
              <div className="map-legend"><span><i className="legend-dot legend-dot--player" /> TU RUTA</span><span><i className="legend-dot legend-dot--goal" /> CAFETERÍA</span><span><i className="legend-dot legend-dot--obstacle" /> OBSTÁCULO</span></div>
              <span className="direction-readout">RUMBO <strong>{lastDirection}</strong></span>
            </div>
          </div>

          <aside className="game-sidebar">
            <div className="mission-card">
              <div className="mission-icon"><Utensils size={22} /></div>
              <p className="sidebar-label">MISIÓN DEL DÍA</p>
              <h2>Llegar a la<br /><em>cafetería.</em></h2>
              <p className="mission-copy">El almuerzo es la meta. No necesitas recoger nada más: solo encontrar el carrito amarillo y comprar.</p>
              <div className="progress-block">
                <div><span>TIEMPO USADO</span><strong>{Math.round(progress)}%</strong></div>
                <div className="progress-track"><span style={{ width: `${Math.min(progress, 100)}%` }} /></div>
              </div>
              <div className="rule-list">
                <div><Zap size={15} /><span>Muévete rápido</span><small>Flechas / WASD</small></div>
                <div><AlertTriangle size={15} /><span>Evita obstáculos</span><small>Restan segundos</small></div>
                <div><ShoppingBag size={15} /><span>Compra y gana</span><small>Una sola meta</small></div>
              </div>
            </div>
            <div className={`status-card status-card--${statusTone}`} role="status">
              <div className="status-heading"><span className="status-light" /> ESTADO DEL RECORRIDO</div>
              <p>{statusMessage}</p>
              {phase === "playing" && <span className="status-tip">Tip: rodea los obstáculos, no los atravieses.</span>}
            </div>
            <div className="control-card">
              <span className="sidebar-label">CONTROLES</span>
              <div className="controls-row">
                <div className="arrow-pad">
                  <button aria-label="Mover al norte" onClick={() => movePlayer(0, -1, "NORTE")}><ChevronUp size={17} /></button>
                  <div><button aria-label="Mover al occidente" onClick={() => movePlayer(-1, 0, "OCCIDENTE")}><ChevronLeft size={17} /></button><button aria-label="Mover al sur" onClick={() => movePlayer(0, 1, "SUR")}><ChevronDown size={17} /></button><button aria-label="Mover al oriente" onClick={() => movePlayer(1, 0, "ORIENTE")}><ChevronRight size={17} /></button></div>
                </div>
                <span>También puedes<br /><strong>usar el teclado</strong></span>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <footer className="game-footer"><span>UN RECORRIDO COTIDIANO, UNA DECISIÓN RÁPIDA</span><span><MapPin size={13} /> UNIVERSIDAD JAVERIANA · CAMPUS BOGOTÁ</span><span>TIEMPO LIMITADO / ALMUERZO</span></footer>
    </div>
  );
}
