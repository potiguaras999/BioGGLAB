import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Layers, Pickaxe, Play, XCircle } from 'lucide-react';
import { TaskResult } from '../../types/biology';
import {
  FOSSILIZATION_STEPS,
  scoreToStars,
  STRATA_FOSSILS,
} from '../../utils/gameLogic';
import { playError, playPop, playSuccess, playVictory } from '../../utils/sound';

interface FossilExcavationGameProps {
  onComplete: (result: TaskResult) => void;
  onExit: () => void;
  autoStart?: boolean;
}

const LAYER_META = [
  { layer: 1, title: 'Camada Superior (Perto da Superfície)', subtitle: 'Registros mais recentes', bg: 'bg-amber-100 border-amber-300' },
  { layer: 2, title: 'Camada Intermediária', subtitle: 'Meio da sequência de rochas', bg: 'bg-orange-100 border-orange-300' },
  { layer: 3, title: 'Camada Mais Profunda', subtitle: 'Registros mais antigos de milhões de anos', bg: 'bg-stone-200 border-stone-400' },
];

export function FossilExcavationGame({
  onComplete,
  onExit,
  autoStart = false,
}: FossilExcavationGameProps) {
  const [phase, setPhase] = useState<'title' | 'stage1' | 'stage2'>(autoStart ? 'stage1' : 'title');
  const [nextOrder, setNextOrder] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [fossilIdx, setFossilIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const shuffledSteps = useMemo(() => {
    return [
      FOSSILIZATION_STEPS[2],
      FOSSILIZATION_STEPS[0],
      FOSSILIZATION_STEPS[3],
      FOSSILIZATION_STEPS[1],
    ];
  }, []);

  useEffect(() => {
    document.body.dataset.state = phase === 'title' ? 'title' : 'playing';
    return () => {
      delete document.body.dataset.state;
    };
  }, [phase]);

  const handlePickStep = (stepId: string, order: number) => {
    if (completedSteps.includes(stepId)) return;
    setAttempts((a) => a + 1);

    if (order === nextOrder) {
      playSuccess();
      const updated = [...completedSteps, stepId];
      setCompletedSteps(updated);
      setHits((h) => h + 1);
      setScore((s) => s + 90);
      setFeedback({ ok: true, text: `Etapa ${order}/4 correta!` });

      if (order === FOSSILIZATION_STEPS.length) {
        window.setTimeout(() => {
          setFeedback(null);
          setPhase('stage2');
        }, 700);
      } else {
        setNextOrder(order + 1);
      }
    } else {
      playError();
      setFeedback({
        ok: false,
        text: `Ainda não! Pense no que precisa acontecer primeiro para evitar a decomposição.`,
      });
    }
  };

  const currentFossil = STRATA_FOSSILS[fossilIdx];

  const handlePickLayer = (layerNum: number) => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (layerNum === currentFossil.correctLayer) {
      playSuccess();
      const nextHits = hits + 1;
      const nextScore = score + 130;
      setHits(nextHits);
      setScore(nextScore);
      setFeedback({
        ok: true,
        text: `Achado perfeito! ${currentFossil.fossilName} pertence à ${currentFossil.eraLabel}.`,
      });

      window.setTimeout(() => {
        if (fossilIdx + 1 < STRATA_FOSSILS.length) {
          setFossilIdx((i) => i + 1);
          setFeedback(null);
        } else {
          const accuracyPercent = Math.min(100, Math.round((nextHits / nextAttempts) * 100));
          playVictory();
          onComplete({
            stars: scoreToStars(accuracyPercent),
            score: nextScore,
            accuracyPercent,
            summaryLabel: `Você dominou as etapas da fossilização e a ordem das camadas geológicas!`,
          });
        }
      }, 950);
    } else {
      playError();
      setFeedback({
        ok: false,
        text: `Camada errada! Lembre-se: quanto mais antigo o fóssil, mais profunda é a rocha.`,
      });
    }
  };

  if (phase === 'title') {
    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-[#32064A] text-white p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="min-h-[44px] px-3 -ml-3 rounded-xl inline-flex items-center gap-1.5 text-sm font-semibold text-purple-100 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar
          </button>
          <span className="text-xs font-medium text-purple-200">Mini-Game · Vídeo 03</span>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
            Escavação Estratigráfica
          </h2>
          <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
            Como a Terra guarda segredos de milhões de anos? Primeiro monte a sequência da
            fossilização; depois escave cada camada geológica na profundidade certa!
          </p>
        </div>

        <button
          type="button"
          data-start="true"
          onClick={() => {
            playPop();
            setPhase('stage1');
          }}
          className="w-full min-h-[52px] rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#052E16] font-extrabold text-base inline-flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" aria-hidden="true" />
          Iniciar Escavação
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="min-h-[44px] px-3 -ml-3 rounded-xl inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Sair
        </button>
        <span className="text-xs sm:text-sm font-bold text-[#16A34A] tabular-nums">
          {score} pts
        </span>
      </div>

      {phase === 'stage1' ? (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#26043A] text-white p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[#4ADE80] inline-flex items-center gap-1.5">
              <Layers className="w-4 h-4" aria-hidden="true" />
              Etapa 1 de 2 · Ordem da Fossilização
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold">
              Toque na {nextOrder}ª etapa para preservar o organismo
            </h2>
          </div>

          {feedback && (
            <div
              role="status"
              className={`rounded-2xl p-3 text-sm font-medium flex items-center gap-2 border ${
                feedback.ok
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                  : 'bg-red-50 text-red-950 border-red-200'
              }`}
            >
              {feedback.ok ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div className="space-y-2.5">
            {shuffledSteps.map((step) => {
              const done = completedSteps.includes(step.id);
              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={done}
                  onClick={() => handlePickStep(step.id, step.order)}
                  className={`w-full min-h-[64px] p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-colors ${
                    done
                      ? 'bg-emerald-50 border-[#16A34A] text-emerald-950'
                      : 'bg-white border-slate-200 hover:border-[#32064A] text-slate-900'
                  }`}
                >
                  <div>
                    <p className="font-display font-bold text-base">{step.title}</p>
                    <p className="text-xs opacity-80">{step.detail}</p>
                  </div>
                  {done && (
                    <span className="font-mono text-sm font-extrabold text-[#16A34A] shrink-0">
                      #{step.order}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-3xl bg-[#26043A] text-white p-5 sm:p-6 space-y-2">
            <p className="text-xs font-semibold text-[#4ADE80] inline-flex items-center gap-1.5">
              <Pickaxe className="w-4 h-4" aria-hidden="true" />
              Etapa 2 de 2 · Fóssil {fossilIdx + 1}/{STRATA_FOSSILS.length}
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold">
              Onde escavar: {currentFossil.fossilName}?
            </h2>
            <p className="text-sm text-purple-100">{currentFossil.clue}</p>
          </div>

          {feedback && (
            <div
              role="status"
              className={`rounded-2xl p-3 text-sm font-medium flex items-center gap-2 border ${
                feedback.ok
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                  : 'bg-red-50 text-red-950 border-red-200'
              }`}
            >
              {feedback.ok ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div className="space-y-2.5">
            {LAYER_META.map((layer) => (
              <button
                key={layer.layer}
                type="button"
                onClick={() => handlePickLayer(layer.layer)}
                className={`w-full min-h-[72px] p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 active:scale-[0.98] transition-transform ${layer.bg}`}
              >
                <div>
                  <p className="font-display font-bold text-base text-slate-900">{layer.title}</p>
                  <p className="text-xs text-slate-700">{layer.subtitle}</p>
                </div>
                <Pickaxe className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
