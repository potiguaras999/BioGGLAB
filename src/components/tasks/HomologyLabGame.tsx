import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Play, XCircle } from 'lucide-react';
import { TaskResult } from '../../types/biology';
import { HOMOLOGY_QUESTIONS, scoreToStars } from '../../utils/gameLogic';
import { playError, playPop, playSuccess, playVictory } from '../../utils/sound';

interface HomologyLabGameProps {
  onComplete: (result: TaskResult) => void;
  onExit: () => void;
  autoStart?: boolean;
}

export function HomologyLabGame({
  onComplete,
  onExit,
  autoStart = false,
}: HomologyLabGameProps) {
  const [phase, setPhase] = useState<'title' | 'playing'>(autoStart ? 'playing' : 'title');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<'comum' | 'diferente' | null>(null);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);

  const current = HOMOLOGY_QUESTIONS[qIdx];
  const hasAnswered = selected !== null;
  const isCorrect = selected === current.correctType;

  useEffect(() => {
    document.body.dataset.state = phase;
    return () => {
      delete document.body.dataset.state;
    };
  }, [phase]);

  const handleChoose = (choice: 'comum' | 'diferente') => {
    if (hasAnswered) return;
    setSelected(choice);
    if (choice === current.correctType) {
      playSuccess();
      setHits((h) => h + 1);
      setScore((s) => s + 125);
    } else {
      playError();
    }
  };

  const handleNext = () => {
    playPop();
    if (qIdx + 1 < HOMOLOGY_QUESTIONS.length) {
      setQIdx((i) => i + 1);
      setSelected(null);
    } else {
      const accuracyPercent = Math.round((hits / HOMOLOGY_QUESTIONS.length) * 100);
      playVictory();
      onComplete({
        stars: scoreToStars(accuracyPercent),
        score,
        accuracyPercent,
        summaryLabel: `Você acertou ${hits} de ${HOMOLOGY_QUESTIONS.length} comparações de anatomia!`,
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
          <span className="text-xs font-medium text-purple-200">Mini-Game · Vídeo 05</span>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
            Morcego, Baleia e Você
          </h2>
          <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
            Compare o braço humano, a asa do morcego e a nadadeira da baleia no raio-X e descubra o
            que eles compartilham!
          </p>
        </div>

        <button
          type="button"
          data-start="true"
          onClick={() => {
            playPop();
            setPhase('playing');
          }}
          className="w-full min-h-[52px] rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#052E16] font-extrabold text-base inline-flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" aria-hidden="true" />
          Abrir Raio-X Comparativo
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
        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold tabular-nums">
          <span className="text-slate-600">
            Análise {qIdx + 1}/{HOMOLOGY_QUESTIONS.length}
          </span>
          <span className="text-[#16A34A]">{score} pts</span>
        </div>
      </div>

      {/* Comparative Bone X-Ray Diagram */}
      <div className="rounded-3xl bg-[#1E1030] text-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-purple-200">Raio-X Ósseo Comparado</span>
          <span className="text-slate-300">
            <span className="text-amber-400 font-bold">Braço</span> ·{' '}
            <span className="text-sky-400 font-bold">Antebraço</span> ·{' '}
            <span className="text-emerald-400 font-bold">Dedos</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          {/* Human Arm */}
          <div className="rounded-2xl bg-white/5 p-2.5 space-y-1">
            <svg viewBox="0 0 80 80" className="w-full h-16" aria-label="Ossos do braço humano">
              <line x1="20" y1="14" x2="36" y2="34" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
              <line x1="36" y1="34" x2="50" y2="54" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="39" y1="31" x2="53" y2="51" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="52" y1="53" x2="66" y2="66" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="52" y1="53" x2="61" y2="69" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="52" y1="53" x2="69" y2="60" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="font-semibold text-purple-100">Humano (Pegar)</p>
          </div>

          {/* Bat Wing */}
          <div className="rounded-2xl bg-white/5 p-2.5 space-y-1">
            <svg viewBox="0 0 80 80" className="w-full h-16" aria-label="Ossos da asa de morcego">
              <line x1="14" y1="22" x2="28" y2="38" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" />
              <line x1="28" y1="38" x2="44" y2="28" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
              <line x1="44" y1="28" x2="72" y2="18" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="44" y1="28" x2="70" y2="42" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="44" y1="28" x2="58" y2="64" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="font-semibold text-purple-100">Morcego (Voar)</p>
          </div>

          {/* Whale Flipper */}
          <div className="rounded-2xl bg-white/5 p-2.5 space-y-1">
            <svg viewBox="0 0 80 80" className="w-full h-16" aria-label="Ossos da nadadeira de baleia">
              <line x1="16" y1="20" x2="30" y2="32" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
              <line x1="30" y1="32" x2="46" y2="44" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
              <line x1="46" y1="44" x2="68" y2="56" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
              <line x1="46" y1="44" x2="62" y2="64" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
              <line x1="46" y1="44" x2="70" y2="48" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="font-semibold text-purple-100">Baleia (Nadar)</p>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-slate-900">{current.pairTitle}</h2>
          <p className="text-sm text-slate-600">{current.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={hasAnswered}
            onClick={() => handleChoose('comum')}
            className={`min-h-[60px] p-4 rounded-2xl border text-left transition-colors ${
              hasAnswered && current.correctType === 'comum'
                ? 'bg-emerald-50 border-[#16A34A] text-emerald-950'
                : hasAnswered && selected === 'comum'
                ? 'bg-red-50 border-red-500 text-red-950'
                : 'bg-white border-slate-200 hover:border-[#32064A] text-slate-900'
            }`}
          >
            <p className="font-display font-bold text-base">Mesma Origem Ancestral</p>
            <p className="text-xs opacity-80">Mesmo padrão de ossos</p>
          </button>

          <button
            type="button"
            disabled={hasAnswered}
            onClick={() => handleChoose('diferente')}
            className={`min-h-[60px] p-4 rounded-2xl border text-left transition-colors ${
              hasAnswered && current.correctType === 'diferente'
                ? 'bg-emerald-50 border-[#16A34A] text-emerald-950'
                : hasAnswered && selected === 'diferente'
                ? 'bg-red-50 border-red-500 text-red-950'
                : 'bg-white border-slate-200 hover:border-[#32064A] text-slate-900'
            }`}
          >
            <p className="font-display font-bold text-base">Origens Diferentes</p>
            <p className="text-xs opacity-80">Função parecida, mas sem parentesco ósseo</p>
          </button>
        </div>

        {hasAnswered && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div
              className={`rounded-xl p-3.5 text-sm flex items-start gap-2.5 border ${
                isCorrect
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                  : 'bg-amber-50 text-amber-950 border-amber-200'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <p>{current.explanation}</p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full min-h-[48px] rounded-xl bg-[#32064A] hover:bg-[#460B66] text-white font-bold text-sm"
            >
              {qIdx + 1 < HOMOLOGY_QUESTIONS.length ? 'Próxima Comparação' : 'Ver Resultado Final'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
