import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HeartPulse, Wind, Plus, Trash2, Timer, Play, Square, ExternalLink, CloudUpload, AlertTriangle } from 'lucide-react';
import { DogHeartRateReading, DogSize } from '../../types';
import {
  RATIO_BY_SIZE,
  SIZE_LABEL,
  loadReadings,
  saveReadings,
  syncReadingToSheet,
  isSheetSyncConfigured,
} from '../../services/dogHeartRateService';

const COUNT_DURATIONS = [15, 30, 60] as const;

const DogHeartRateView: React.FC = () => {
  const [readings, setReadings] = useState<DogHeartRateReading[]>([]);
  const [dogName, setDogName] = useState('Mon chien');
  const [dogSize, setDogSize] = useState<DogSize>('medium');
  const [ratio, setRatio] = useState(RATIO_BY_SIZE.medium);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(20);
  const [notes, setNotes] = useState('');

  const [duration, setDuration] = useState<(typeof COUNT_DURATIONS)[number]>(30);
  const [isCounting, setIsCounting] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const timerRef = useRef<number | null>(null);

  const [syncMessage, setSyncMessage] = useState<{ type: 'ok' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    setReadings(loadReadings());
  }, []);

  useEffect(() => {
    setRatio(RATIO_BY_SIZE[dogSize]);
  }, [dogSize]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const estimatedHeartRate = useMemo(() => Math.round(respiratoryRate * ratio), [respiratoryRate, ratio]);

  const startCounting = () => {
    setBreathCount(0);
    setSecondsLeft(duration);
    setIsCounting(true);
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCounting = (finalCount?: number) => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setIsCounting(false);
    const count = finalCount ?? breathCount;
    const rpm = Math.round(count * (60 / duration));
    if (rpm > 0) setRespiratoryRate(rpm);
  };

  // Stop automatically once the countdown reaches zero
  useEffect(() => {
    if (isCounting && secondsLeft === 0) {
      stopCounting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const handleSave = async () => {
    const reading: DogHeartRateReading = {
      id: `${Date.now()}`,
      timestampIso: new Date().toISOString(),
      dogName: dogName.trim() || 'Chien',
      respiratoryRate,
      ratio,
      estimatedHeartRate,
      notes: notes.trim() || undefined,
    };

    const next = [...readings, reading];
    setReadings(next);
    saveReadings(next);
    setNotes('');

    if (isSheetSyncConfigured()) {
      setSyncMessage({ type: 'info', text: 'Synchronisation avec Google Sheet en cours...' });
      const result = await syncReadingToSheet(reading);
      setSyncMessage(
        result.ok
          ? { type: 'ok', text: 'Relevé envoyé vers le Google Sheet.' }
          : { type: 'error', text: result.error || 'Échec de la synchronisation.' }
      );
    } else {
      setSyncMessage({ type: 'info', text: 'Relevé enregistré localement (synchronisation Google Sheet non configurée).' });
    }
  };

  const handleDelete = (id: string) => {
    const next = readings.filter((r) => r.id !== id);
    setReadings(next);
    saveReadings(next);
  };

  const chartData = readings.map((r) => ({
    date: new Date(r.timestampIso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    'FC estimée (bpm)': r.estimatedHeartRate,
    'FR (resp/min)': r.respiratoryRate,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-800 font-mono flex items-center">
          <HeartPulse className="mr-2 text-blue-600" />
          MONITEUR FC CHIEN
        </h2>
        <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">MODULE: VETERINARY_EST</span>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm">
        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
        <p>
          Cet outil donne une <strong>estimation indicative</strong> de la fréquence cardiaque à partir du rythme
          respiratoire (ratio FC:FR configurable selon le gabarit du chien). Ce n'est pas un dispositif médical.
          En cas de doute sur la santé de votre chien, consultez un vétérinaire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breath counter + form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold font-mono text-blue-600 border-b border-slate-100 pb-2 flex items-center">
            <Wind className="mr-2" size={16} /> COMPTAGE RESPIRATOIRE
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Durée du comptage :</span>
            {COUNT_DURATIONS.map((d) => (
              <button
                key={d}
                disabled={isCounting}
                onClick={() => {
                  setDuration(d);
                  setSecondsLeft(d);
                }}
                className={`px-2 py-1 rounded-md text-xs font-bold font-mono border transition-colors ${
                  duration === d
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                } disabled:opacity-50`}
              >
                {d}s
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="text-4xl font-mono font-bold text-slate-800">
              {breathCount} <span className="text-base text-slate-400">respirations</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
              <Timer size={16} /> {secondsLeft}s restantes
            </div>

            {!isCounting ? (
              <button
                onClick={startCounting}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold font-mono hover:bg-blue-700 transition-colors"
              >
                <Play size={16} className="mr-2" /> DÉMARRER
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBreathCount((c) => c + 1)}
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg text-lg font-bold font-mono hover:bg-emerald-700 transition-colors active:scale-95"
                >
                  <Plus size={20} className="mr-1" /> RESPIRATION
                </button>
                <button
                  onClick={() => stopCounting()}
                  className="inline-flex items-center px-3 py-3 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold font-mono hover:bg-slate-200 transition-colors"
                >
                  <Square size={16} />
                </button>
              </div>
            )}
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Cliquez sur "RESPIRATION" à chaque cycle respiratoire observé (montée du thorax/abdomen) pendant le
              décompte. Le calcul se fait automatiquement à la fin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs text-slate-500 font-mono block mb-1">Nom du chien</label>
              <input
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-mono block mb-1">Gabarit</label>
              <select
                value={dogSize}
                onChange={(e) => setDogSize(e.target.value as DogSize)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {(Object.keys(SIZE_LABEL) as DogSize[]).map((s) => (
                  <option key={s} value={s}>
                    {SIZE_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-mono block mb-1">Fréquence respiratoire (resp/min)</label>
              <input
                type="number"
                min={1}
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-mono block mb-1">Ratio FC:FR ({ratio.toFixed(1)})</label>
              <input
                type="range"
                min={3}
                max={7}
                step={0.1}
                value={ratio}
                onChange={(e) => setRatio(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 font-mono block mb-1">Notes (optionnel)</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: après une balade, au repos..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Estimated HR + save */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold font-mono text-blue-600 border-b border-slate-100 pb-2 mb-6 flex items-center">
            <HeartPulse className="mr-2" size={16} /> ESTIMATION
          </h3>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-6xl font-mono font-black text-rose-500 flex items-center gap-2">
              <HeartPulse size={48} className="animate-pulse" />
              {estimatedHeartRate}
            </div>
            <div className="text-sm text-slate-500 font-mono mt-1">battements / min (estimé)</div>
            <div className="mt-4 text-xs text-slate-400 font-mono">
              {respiratoryRate} resp/min × ratio {ratio.toFixed(1)}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 inline-flex items-center justify-center px-4 py-3 bg-slate-800 text-white rounded-lg text-sm font-bold font-mono hover:bg-slate-900 transition-colors"
          >
            <Plus size={16} className="mr-2" /> ENREGISTRER LE RELEVÉ
          </button>

          {syncMessage && (
            <div
              className={`mt-3 text-xs font-mono px-3 py-2 rounded-lg border flex items-center gap-2 ${
                syncMessage.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : syncMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <CloudUpload size={14} className="shrink-0" />
              {syncMessage.text}
            </div>
          )}

          {!isSheetSyncConfigured() && (
            <p className="mt-3 text-[11px] text-slate-400 font-mono leading-relaxed">
              Synchronisation Google Sheet non configurée. Voir README (VITE_DOG_SHEET_WEBHOOK_URL) pour connecter le
              Google Sheet créé dans votre Drive.
            </p>
          )}
        </div>
      </div>

      {/* History chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold font-mono text-blue-600 mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
          <span>HISTORIQUE DES RELEVÉS</span>
          <a
            href="https://docs.google.com/spreadsheets/d/1PJdCWN0_MDNRWU_wPrpC7JFIYvTprh0NL6R8jj2ebes/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-slate-400 hover:text-blue-600 flex items-center gap-1 normal-case"
          >
            Ouvrir le Google Sheet <ExternalLink size={12} />
          </a>
        </h3>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm font-mono">
            Aucun relevé pour le moment. Enregistrez un premier relevé pour voir apparaître la courbe.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="FC estimée (bpm)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="FR (resp/min)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* History table */}
      {readings.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <h3 className="text-sm font-bold font-mono text-blue-600 mb-4 border-b border-slate-100 pb-2">DÉTAIL DES RELEVÉS</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 font-mono uppercase border-b border-slate-100">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Chien</th>
                <th className="py-2 pr-4">FR (resp/min)</th>
                <th className="py-2 pr-4">Ratio</th>
                <th className="py-2 pr-4">FC estimée (bpm)</th>
                <th className="py-2 pr-4">Notes</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {[...readings].reverse().map((r) => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2 pr-4 font-mono text-xs text-slate-500">
                    {new Date(r.timestampIso).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-2 pr-4 text-slate-700 font-medium">{r.dogName}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.respiratoryRate}</td>
                  <td className="py-2 pr-4 text-slate-600">{r.ratio.toFixed(1)}</td>
                  <td className="py-2 pr-4 font-bold text-rose-500">{r.estimatedHeartRate}</td>
                  <td className="py-2 pr-4 text-slate-500 text-xs max-w-[200px] truncate">{r.notes}</td>
                  <td className="py-2">
                    <button onClick={() => handleDelete(r.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DogHeartRateView;
