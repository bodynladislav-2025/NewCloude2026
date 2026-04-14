import { createContext, useContext, useReducer, useCallback } from 'react';
import { joinData, parseAktivityCSV, parseHodnoceniSheet, parseObchodniciSheet } from '../lib/parseFiles';
import {
  computeTeamStats, computeMonthlyTrend, computeMonthlyActivityTrend,
  groupByObchodnik, computeInsights, filterByPeriod, filterAktivityByPeriod,
  enrichObchodnikData, computeObchodnikTrend,
} from '../lib/calculations';
import { sampleAktivity, sampleHodnoceni, sampleObchodnici } from '../lib/sampleData';

// ── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  rawAktivity: [],
  rawHodnoceni: [],
  rawObchodnici: [],
  enrichedHovory: [],
  activeView: 'overview',
  selectedObchodnik: '',
  filterPeriod: '90d',
  filterSegment: 'all',
  filterTypHovoru: 'all',
  isLoading: false,
  uploadError: null,
  usingDemoData: true,
};

// ── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, uploadError: action.payload, isLoading: false };
    case 'LOAD_DATA': {
      const { rawAktivity, rawHodnoceni, rawObchodnici, usingDemoData } = action.payload;
      const enrichedHovory = joinData(rawAktivity, rawHodnoceni);
      const firstObchodnik = rawHodnoceni.length > 0
        ? [...new Set(rawHodnoceni.map(h => h.obchodnik))].sort()[0]
        : '';
      return {
        ...state,
        rawAktivity,
        rawHodnoceni,
        rawObchodnici,
        enrichedHovory,
        selectedObchodnik: firstObchodnik,
        uploadError: null,
        isLoading: false,
        usingDemoData: !!usingDemoData,
      };
    }
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'SET_OBCHODNIK':
      return { ...state, selectedObchodnik: action.payload };
    case 'SET_FILTER_PERIOD':
      return { ...state, filterPeriod: action.payload };
    case 'SET_FILTER_SEGMENT':
      return { ...state, filterSegment: action.payload };
    case 'SET_FILTER_TYP':
      return { ...state, filterTypHovoru: action.payload };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load demo data on mount
  const loadDemoData = useCallback(() => {
    dispatch({
      type: 'LOAD_DATA',
      payload: {
        rawAktivity: sampleAktivity,
        rawHodnoceni: sampleHodnoceni,
        rawObchodnici: sampleObchodnici,
        usingDemoData: true,
      },
    });
  }, []);

  // Upload real files
  const loadFiles = useCallback(async (aktivityFile, hodnoceniFile, obchodniciFile) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let rawAktivity = [];
      let rawObchodnici = [];

      if (aktivityFile) {
        rawAktivity = await parseAktivityCSV(aktivityFile);
      }
      const rawHodnoceni = await parseHodnoceniSheet(hodnoceniFile);
      if (obchodniciFile) {
        rawObchodnici = await parseObchodniciSheet(obchodniciFile);
      }

      dispatch({
        type: 'LOAD_DATA',
        payload: { rawAktivity, rawHodnoceni, rawObchodnici, usingDemoData: false },
      });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  // ── Derived Data (computed on demand) ──────────────────────────────────────
  const filteredHovory = (() => {
    let h = filterByPeriod(state.enrichedHovory, state.filterPeriod);
    if (state.filterSegment !== 'all') h = h.filter(x => x.segment === state.filterSegment);
    if (state.filterTypHovoru !== 'all') h = h.filter(x => x.typ_hovoru === state.filterTypHovoru);
    return h;
  })();

  const filteredAktivity = filterAktivityByPeriod(state.rawAktivity, state.filterPeriod);

  const teamStats = computeTeamStats(filteredHovory, filteredAktivity, state.rawObchodnici);
  const byObchodnik = groupByObchodnik(filteredHovory);
  const monthlyTrend = computeMonthlyTrend(state.enrichedHovory);
  const monthlyActivity = computeMonthlyActivityTrend(state.rawAktivity);
  const insights = computeInsights(teamStats, byObchodnik);

  const obchodnikList = Object.keys(byObchodnik).sort();

  const getObchodnikMeta = (prijmeni, index) =>
    enrichObchodnikData(prijmeni, state.rawObchodnici, index);

  const getObchodnikTrend = (prijmeni) =>
    computeObchodnikTrend(state.enrichedHovory, prijmeni);

  const rizikoveHovory = filteredHovory.filter(h => h.riziko && h.riziko !== 'none');

  const value = {
    // State
    ...state,
    // Actions
    loadDemoData,
    loadFiles,
    setView: (v) => dispatch({ type: 'SET_VIEW', payload: v }),
    setObchodnik: (o) => dispatch({ type: 'SET_OBCHODNIK', payload: o }),
    setFilterPeriod: (p) => dispatch({ type: 'SET_FILTER_PERIOD', payload: p }),
    setFilterSegment: (s) => dispatch({ type: 'SET_FILTER_SEGMENT', payload: s }),
    setFilterTyp: (t) => dispatch({ type: 'SET_FILTER_TYP', payload: t }),
    // Derived
    filteredHovory,
    filteredAktivity,
    teamStats,
    byObchodnik,
    monthlyTrend,
    monthlyActivity,
    insights,
    obchodnikList,
    rizikoveHovory,
    getObchodnikMeta,
    getObchodnikTrend,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
