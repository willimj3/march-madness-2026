import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell, Legend, CartesianGrid
} from "recharts";
import { Search, Trophy, AlertTriangle, BarChart3, GitCompare, Share2, Loader2, Check } from "lucide-react";
import { useBracket } from "./hooks/useBracket";

// ─────────────────────────────────────────────────────────────
// DATA LAYER
// ─────────────────────────────────────────────────────────────

const TEAMS = [
  // ── EAST ──
  { seed: 1, team: "Duke", region: "East", kenpom: 1, adjO: 128.0, adjD: 89.1, offPct: 127.96, possPerGame: 65.3, projPts: 80.2, calcedTotal: 134.95, calcedSpread: -25.45, vegasSpread: -29.5, spreadDiff: 4.05, vegasOU: 136.0, record: "32-2" },
  { seed: 16, team: "Siena", region: "East", kenpom: 192, adjO: 107.1, adjD: 109.2, offPct: 87.36, possPerGame: 64.6, projPts: 54.75, calcedTotal: 134.95, calcedSpread: 25.45, vegasSpread: 29.5, spreadDiff: -4.05, vegasOU: 136.0, record: "23-11" },
  { seed: 8, team: "Ohio St", region: "East", kenpom: 26, adjO: 124.3, adjD: 102.1, offPct: 111.29, possPerGame: 66.1, projPts: 73.99, calcedTotal: 145.71, calcedSpread: -2.28, vegasSpread: -2.5, spreadDiff: 0.22, vegasOU: 146.5, record: "21-12" },
  { seed: 9, team: "TCU", region: "East", kenpom: 43, adjO: 115.4, adjD: 97.8, offPct: 107.87, possPerGame: 67.7, projPts: 71.72, calcedTotal: 145.71, calcedSpread: 2.28, vegasSpread: 2.5, spreadDiff: -0.22, vegasOU: 146.5, record: "22-11" },
  { seed: 5, team: "St. John's", region: "East", kenpom: 17, adjO: 120.1, adjD: 94.2, offPct: 107.97, possPerGame: 69.6, projPts: 69.56, calcedTotal: 130.67, calcedSpread: -8.44, vegasSpread: -10.5, spreadDiff: 2.06, vegasOU: 131.5, record: "28-6" },
  { seed: 12, team: "Northern Iowa", region: "East", kenpom: 72, adjO: 110.0, adjD: 98.2, offPct: 94.86, possPerGame: 62.3, projPts: 61.11, calcedTotal: 130.67, calcedSpread: 8.44, vegasSpread: 10.5, spreadDiff: -2.06, vegasOU: 131.5, record: "23-12" },
  { seed: 4, team: "Kansas", region: "East", kenpom: 21, adjO: 118.3, adjD: 93.9, offPct: 110.36, possPerGame: 67.6, projPts: 72.93, calcedTotal: 134.23, calcedSpread: -11.63, vegasSpread: -14.5, spreadDiff: 2.87, vegasOU: 137.5, record: "23-10" },
  { seed: 13, team: "Cal Baptist", region: "East", kenpom: 106, adjO: 107.9, adjD: 101.9, offPct: 92.76, possPerGame: 65.8, projPts: 61.3, calcedTotal: 134.23, calcedSpread: 11.63, vegasSpread: 14.5, spreadDiff: -2.87, vegasOU: 137.5, record: "25-8" },
  { seed: 6, team: "Louisville", region: "East", kenpom: 19, adjO: 124.1, adjD: 98.6, offPct: 114.64, possPerGame: 69.6, projPts: 84.76, calcedTotal: 163.04, calcedSpread: -6.47, vegasSpread: -5.5, spreadDiff: -0.97, vegasOU: 165.5, record: "23-10" },
  { seed: 11, team: "South Florida", region: "East", kenpom: 47, adjO: 117.3, adjD: 100.9, offPct: 105.88, possPerGame: 71.5, projPts: 78.29, calcedTotal: 163.04, calcedSpread: 6.47, vegasSpread: 5.5, spreadDiff: 0.97, vegasOU: 165.5, record: "25-8" },
  { seed: 3, team: "Michigan St", region: "East", kenpom: 9, adjO: 123.0, adjD: 94.7, offPct: 120.04, possPerGame: 66.0, projPts: 78.04, calcedTotal: 141.0, calcedSpread: -15.08, vegasSpread: -16.5, spreadDiff: 1.42, vegasOU: 143.5, record: "25-7" },
  { seed: 14, team: "North Dakota St", region: "East", kenpom: 113, adjO: 111.7, adjD: 106.6, offPct: 96.84, possPerGame: 66.3, projPts: 62.96, calcedTotal: 141.0, calcedSpread: 15.08, vegasSpread: 16.5, spreadDiff: -1.42, vegasOU: 143.5, record: "27-7" },
  { seed: 7, team: "UCLA", region: "East", kenpom: 27, adjO: 123.7, adjD: 102.1, offPct: 119.36, possPerGame: 64.6, projPts: 79.28, calcedTotal: 154.08, calcedSpread: -4.47, vegasSpread: -6.0, spreadDiff: 1.53, vegasOU: 152.5, record: "23-11" },
  { seed: 10, team: "UCF", region: "East", kenpom: 54, adjO: 120.5, adjD: 105.4, offPct: 112.63, possPerGame: 69.2, projPts: 74.81, calcedTotal: 154.08, calcedSpread: 4.47, vegasSpread: 6.0, spreadDiff: -1.53, vegasOU: 152.5, record: "21-11" },
  { seed: 2, team: "Connecticut", region: "East", kenpom: 11, adjO: 122.0, adjD: 94.1, offPct: 122.19, possPerGame: 64.4, projPts: 77.04, calcedTotal: 135.44, calcedSpread: -18.65, vegasSpread: -20.5, spreadDiff: 1.85, vegasOU: 137.0, record: "29-5" },
  { seed: 15, team: "Furman", region: "East", kenpom: 191, adjO: 107.5, adjD: 109.4, offPct: 92.61, possPerGame: 65.9, projPts: 58.39, calcedTotal: 135.44, calcedSpread: 18.65, vegasSpread: 20.5, spreadDiff: -1.85, vegasOU: 137.0, record: "22-12" },

  // ── SOUTH ──
  { seed: 1, team: "Florida", region: "South", kenpom: 4, adjO: 125.5, adjD: 91.7, offPct: null, possPerGame: 70.5, projPts: null, calcedTotal: null, calcedSpread: null, vegasSpread: null, spreadDiff: null, vegasOU: null, record: "26-7", firstFourSlot: true },
  { seed: 8, team: "Clemson", region: "South", kenpom: 36, adjO: 116.5, adjD: 97.3, offPct: 105.91, possPerGame: 64.2, projPts: 63.64, calcedTotal: 128.79, calcedSpread: -1.5, vegasSpread: -2.0, spreadDiff: -0.5, vegasOU: 129.0, record: "24-10" },
  { seed: 9, team: "Iowa", region: "South", kenpom: 25, adjO: 121.7, adjD: 99.3, offPct: 108.41, possPerGame: 63.0, projPts: 65.14, calcedTotal: 128.79, calcedSpread: 1.5, vegasSpread: 2.0, spreadDiff: 0.5, vegasOU: 129.0, record: "21-12" },
  { seed: 5, team: "Vanderbilt", region: "South", kenpom: 12, adjO: 126.8, adjD: 99.3, offPct: 118.17, possPerGame: 68.8, projPts: 79.97, calcedTotal: 150.28, calcedSpread: -9.65, vegasSpread: -11.5, spreadDiff: 1.85, vegasOU: 150.5, record: "26-8" },
  { seed: 12, team: "McNeese", region: "South", kenpom: 68, adjO: 114.3, adjD: 101.8, offPct: 103.91, possPerGame: 66.2, projPts: 70.31, calcedTotal: 150.28, calcedSpread: 9.65, vegasSpread: 11.5, spreadDiff: -1.85, vegasOU: 150.5, record: "28-5" },
  { seed: 4, team: "Nebraska", region: "South", kenpom: 14, adjO: 118.5, adjD: 92.4, offPct: 118.25, possPerGame: 66.7, projPts: 76.05, calcedTotal: 136.28, calcedSpread: -15.83, vegasSpread: -13.0, spreadDiff: -2.83, vegasOU: 137.5, record: "26-6" },
  { seed: 13, team: "Troy", region: "South", kenpom: 143, adjO: 110.7, adjD: 109.0, offPct: 93.64, possPerGame: 64.9, projPts: 60.23, calcedTotal: 136.28, calcedSpread: 15.83, vegasSpread: 13.0, spreadDiff: 2.83, vegasOU: 137.5, record: "22-11" },
  { seed: 6, team: "North Carolina", region: "South", kenpom: 29, adjO: 121.4, adjD: 100.5, offPct: 114.14, possPerGame: 67.9, projPts: 78.88, calcedTotal: 155.11, calcedSpread: -2.64, vegasSpread: -2.5, spreadDiff: -0.14, vegasOU: 154.0, record: "24-8" },
  { seed: 11, team: "VCU", region: "South", kenpom: 45, adjO: 119.9, adjD: 102.7, offPct: 110.32, possPerGame: 68.5, projPts: 76.23, calcedTotal: 155.11, calcedSpread: 2.64, vegasSpread: 2.5, spreadDiff: 0.14, vegasOU: 154.0, record: "27-7" },
  { seed: 3, team: "Illinois", region: "South", kenpom: 7, adjO: 131.2, adjD: 99.1, offPct: 127.2, possPerGame: 65.5, projPts: 85.41, calcedTotal: 150.84, calcedSpread: -19.98, vegasSpread: -24.5, spreadDiff: 4.52, vegasOU: 150.0, record: "24-8" },
  { seed: 14, team: "Penn", region: "South", kenpom: 150, adjO: 107.4, adjD: 105.9, offPct: 97.44, possPerGame: 69.0, projPts: 65.43, calcedTotal: 150.84, calcedSpread: 19.98, vegasSpread: 24.5, spreadDiff: -4.52, vegasOU: 150.0, record: "18-11" },
  { seed: 7, team: "Saint Mary's", region: "South", kenpom: 24, adjO: 120.3, adjD: 97.2, offPct: 111.24, possPerGame: 65.2, projPts: 75.97, calcedTotal: 148.71, calcedSpread: -3.22, vegasSpread: -3.0, spreadDiff: -0.22, vegasOU: 147.0, record: "27-5" },
  { seed: 10, team: "Texas A&M", region: "South", kenpom: 39, adjO: 119.7, adjD: 101.0, offPct: 106.52, possPerGame: 70.5, projPts: 72.74, calcedTotal: 148.71, calcedSpread: 3.22, vegasSpread: 3.0, spreadDiff: 0.22, vegasOU: 147.0, record: "21-11" },
  { seed: 2, team: "Houston", region: "South", kenpom: 5, adjO: 124.9, adjD: 91.4, offPct: 122.69, possPerGame: 63.3, projPts: 78.12, calcedTotal: 136.08, calcedSpread: -20.15, vegasSpread: -23.5, spreadDiff: 3.35, vegasOU: 136.0, record: "28-6" },
  { seed: 15, team: "Idaho", region: "South", kenpom: 145, adjO: 108.8, adjD: 107.3, offPct: 91.04, possPerGame: 67.7, projPts: 57.96, calcedTotal: 136.08, calcedSpread: 20.15, vegasSpread: 23.5, spreadDiff: -3.35, vegasOU: 136.0, record: "21-14" },

  // ── WEST ──
  { seed: 1, team: "Arizona", region: "West", kenpom: 2, adjO: 127.7, adjD: 90.0, offPct: 128.13, possPerGame: 69.8, projPts: 90.09, calcedTotal: 151.27, calcedSpread: -28.91, vegasSpread: -31.5, spreadDiff: 2.59, vegasOU: 151.5, record: "32-2" },
  { seed: 16, team: "Long Island", region: "West", kenpom: 216, adjO: 105.6, adjD: 109.6, offPct: 87.01, possPerGame: 67.8, projPts: 61.18, calcedTotal: 151.27, calcedSpread: 28.91, vegasSpread: 31.5, spreadDiff: -2.59, vegasOU: 151.5, record: "24-10" },
  { seed: 8, team: "Villanova", region: "West", kenpom: 33, adjO: 120.4, adjD: 100.4, offPct: 111.77, possPerGame: 65.2, projPts: 73.3, calcedTotal: 146.9, calcedSpread: -0.3, vegasSpread: -2.0, spreadDiff: -1.7, vegasOU: 147.0, record: "24-8" },
  { seed: 9, team: "Utah St", region: "West", kenpom: 30, adjO: 122.1, adjD: 101.4, offPct: 112.23, possPerGame: 67.7, projPts: 73.6, calcedTotal: 146.9, calcedSpread: 0.3, vegasSpread: 2.0, spreadDiff: 1.7, vegasOU: 147.0, record: "28-6" },
  { seed: 5, team: "Wisconsin", region: "West", kenpom: 22, adjO: 125.3, adjD: 102.0, offPct: 124.58, possPerGame: 68.7, projPts: 88.88, calcedTotal: 166.83, calcedSpread: -10.93, vegasSpread: -10.0, spreadDiff: -0.93, vegasOU: 164.5, record: "24-10" },
  { seed: 12, team: "High Point", region: "West", kenpom: 92, adjO: 117.0, adjD: 108.6, offPct: 109.26, possPerGame: 69.9, projPts: 77.95, calcedTotal: 166.83, calcedSpread: 10.93, vegasSpread: 10.0, spreadDiff: 0.93, vegasOU: 164.5, record: "30-4" },
  { seed: 4, team: "Arkansas", region: "West", kenpom: 15, adjO: 127.7, adjD: 101.6, offPct: 118.31, possPerGame: 71.0, projPts: 86.99, calcedTotal: 160.23, calcedSpread: -13.74, vegasSpread: -15.0, spreadDiff: 1.26, vegasOU: 160.0, record: "26-8" },
  { seed: 13, team: "Hawaii", region: "West", kenpom: 108, adjO: 107.1, adjD: 101.2, offPct: 99.62, possPerGame: 69.7, projPts: 73.24, calcedTotal: 160.23, calcedSpread: 13.74, vegasSpread: 15.0, spreadDiff: -1.26, vegasOU: 160.0, record: "24-8" },
  { seed: 6, team: "BYU", region: "West", kenpom: 23, adjO: 125.5, adjD: 102.2, offPct: null, possPerGame: 69.9, projPts: null, calcedTotal: null, calcedSpread: null, vegasSpread: null, spreadDiff: null, vegasOU: null, record: "23-11", firstFourSlot: true },
  { seed: 3, team: "Gonzaga", region: "West", kenpom: 10, adjO: 122.0, adjD: 93.9, offPct: 122.97, possPerGame: 68.6, projPts: 89.24, calcedTotal: 158.23, calcedSpread: -20.24, vegasSpread: -20.5, spreadDiff: 0.26, vegasOU: 154.5, record: "30-3" },
  { seed: 14, team: "Kennesaw St", region: "West", kenpom: 163, adjO: 110.6, adjD: 110.1, offPct: 95.08, possPerGame: 71.2, projPts: 69.0, calcedTotal: 158.23, calcedSpread: 20.24, vegasSpread: 20.5, spreadDiff: -0.26, vegasOU: 154.5, record: "21-13" },
  { seed: 7, team: "Miami FL", region: "West", kenpom: 31, adjO: 121.4, adjD: 100.7, offPct: 115.7, possPerGame: 67.6, projPts: 76.93, calcedTotal: 150.17, calcedSpread: -3.68, vegasSpread: -2.0, spreadDiff: -1.68, vegasOU: 147.0, record: "25-8" },
  { seed: 10, team: "Missouri", region: "West", kenpom: 52, adjO: 119.5, adjD: 104.1, offPct: 110.17, possPerGame: 66.2, projPts: 73.25, calcedTotal: 150.17, calcedSpread: 3.68, vegasSpread: 2.0, spreadDiff: 1.68, vegasOU: 147.0, record: "20-12" },
  { seed: 2, team: "Purdue", region: "West", kenpom: 8, adjO: 131.6, adjD: 100.4, offPct: 141.2, possPerGame: 64.4, projPts: 94.03, calcedTotal: 164.91, calcedSpread: -23.15, vegasSpread: -25.5, spreadDiff: 2.35, vegasOU: 162.5, record: "27-8" },
  { seed: 15, team: "Queens", region: "West", kenpom: 181, adjO: 115.8, adjD: 117.2, offPct: 106.44, possPerGame: 69.6, projPts: 70.88, calcedTotal: 164.91, calcedSpread: 23.15, vegasSpread: 25.5, spreadDiff: -2.35, vegasOU: 162.5, record: "21-13" },

  // ── MIDWEST ──
  { seed: 1, team: "Michigan", region: "Midwest", kenpom: 3, adjO: 126.6, adjD: 89.0, offPct: null, possPerGame: 70.9, projPts: null, calcedTotal: null, calcedSpread: null, vegasSpread: null, spreadDiff: null, vegasOU: null, record: "31-3", firstFourSlot: true },
  { seed: 8, team: "Georgia", region: "Midwest", kenpom: 32, adjO: 124.7, adjD: 104.2, offPct: 115.53, possPerGame: 71.4, projPts: 87.02, calcedTotal: 172.88, calcedSpread: -1.16, vegasSpread: -2.5, spreadDiff: 1.34, vegasOU: 170.0, record: "22-10" },
  { seed: 9, team: "Saint Louis", region: "Midwest", kenpom: 41, adjO: 119.5, adjD: 101.2, offPct: 114.0, possPerGame: 71.0, projPts: 85.86, calcedTotal: 172.88, calcedSpread: 1.16, vegasSpread: 2.5, spreadDiff: -1.34, vegasOU: 170.0, record: "28-5" },
  { seed: 5, team: "Texas Tech", region: "Midwest", kenpom: 20, adjO: 125.0, adjD: 99.8, offPct: 121.3, possPerGame: 66.2, projPts: 83.87, calcedTotal: 158.92, calcedSpread: -8.82, vegasSpread: -7.5, spreadDiff: -1.32, vegasOU: 156.5, record: "22-10" },
  { seed: 12, team: "Akron", region: "Midwest", kenpom: 64, adjO: 118.8, adjD: 106.0, offPct: 108.54, possPerGame: 70.3, projPts: 75.05, calcedTotal: 158.92, calcedSpread: 8.82, vegasSpread: 7.5, spreadDiff: 1.32, vegasOU: 156.5, record: "29-5" },
  { seed: 4, team: "Alabama", region: "Midwest", kenpom: 18, adjO: 129.0, adjD: 103.3, offPct: 124.12, possPerGame: 73.1, projPts: 87.22, calcedTotal: 163.37, calcedSpread: -11.06, vegasSpread: -13.0, spreadDiff: 1.94, vegasOU: 159.5, record: "23-9" },
  { seed: 13, team: "Hofstra", region: "Midwest", kenpom: 87, adjO: 114.6, adjD: 105.1, offPct: 108.38, possPerGame: 64.7, projPts: 76.16, calcedTotal: 163.37, calcedSpread: 11.06, vegasSpread: 13.0, spreadDiff: -1.94, vegasOU: 159.5, record: "24-10" },
  { seed: 6, team: "Tennessee", region: "Midwest", kenpom: 16, adjO: 121.1, adjD: 95.0, offPct: null, possPerGame: 65.0, projPts: null, calcedTotal: null, calcedSpread: null, vegasSpread: null, spreadDiff: null, vegasOU: null, record: "22-11", firstFourSlot: true },
  { seed: 3, team: "Virginia", region: "Midwest", kenpom: 13, adjO: 122.5, adjD: 95.8, offPct: 123.36, possPerGame: 65.7, projPts: 80.92, calcedTotal: 145.41, calcedSpread: -16.43, vegasSpread: -18.5, spreadDiff: 2.07, vegasOU: 145.5, record: "29-5" },
  { seed: 14, team: "Wright St", region: "Midwest", kenpom: 140, adjO: 112.1, adjD: 110.0, offPct: 98.32, possPerGame: 67.2, projPts: 64.49, calcedTotal: 145.41, calcedSpread: 16.43, vegasSpread: 18.5, spreadDiff: -2.07, vegasOU: 145.5, record: "23-11" },
  { seed: 7, team: "Kentucky", region: "Midwest", kenpom: 28, adjO: 120.5, adjD: 99.0, offPct: 114.95, possPerGame: 68.3, projPts: 80.72, calcedTotal: 159.38, calcedSpread: -2.06, vegasSpread: -3.5, spreadDiff: 1.44, vegasOU: 160.5, record: "21-13" },
  { seed: 10, team: "Santa Clara", region: "Midwest", kenpom: 35, adjO: 123.6, adjD: 104.2, offPct: 112.02, possPerGame: 69.2, projPts: 78.66, calcedTotal: 159.38, calcedSpread: 2.06, vegasSpread: 3.5, spreadDiff: -1.44, vegasOU: 160.5, record: "26-8" },
  { seed: 2, team: "Iowa St", region: "Midwest", kenpom: 6, adjO: 123.8, adjD: 91.4, offPct: 125.69, possPerGame: 66.5, projPts: 87.18, calcedTotal: 150.5, calcedSpread: -23.86, vegasSpread: -25.0, spreadDiff: 1.14, vegasOU: 149.0, record: "27-7" },
  { seed: 15, team: "Tennessee St", region: "Midwest", kenpom: 187, adjO: 109.1, adjD: 110.9, offPct: 91.29, possPerGame: 70.2, projPts: 63.32, calcedTotal: 150.5, calcedSpread: 23.86, vegasSpread: 25.0, spreadDiff: -1.14, vegasOU: 149.0, record: "23-9" },

  // ── FIRST FOUR ──
  { seed: 16, team: "UMBC", region: "Midwest", kenpom: 185, adjO: 108.2, adjD: 109.9, offPct: 105.3, possPerGame: 66.2, projPts: 71.46, calcedTotal: 141.86, calcedSpread: -1.06, vegasSpread: -1.0, spreadDiff: -0.06, vegasOU: 140.0, record: "24-8", firstFour: true, ffOpponent: "Howard", ffSlot: "Midwest 16" },
  { seed: 16, team: "Howard", region: "Midwest", kenpom: 207, adjO: 103.1, adjD: 106.3, offPct: 103.73, possPerGame: 69.0, projPts: 70.4, calcedTotal: 141.86, calcedSpread: 1.06, vegasSpread: 1.0, spreadDiff: 0.06, vegasOU: 140.0, record: "23-10", firstFour: true, ffOpponent: "UMBC", ffSlot: "Midwest 16" },
  { seed: 11, team: "Texas", region: "West", kenpom: 37, adjO: 125.0, adjD: 105.9, offPct: 119.59, possPerGame: 66.9, projPts: 82.13, calcedTotal: 164.77, calcedSpread: -0.5, vegasSpread: 0.0, spreadDiff: 0.5, vegasOU: 159.0, record: "18-14", firstFour: true, ffOpponent: "NC State", ffSlot: "West 11" },
  { seed: 11, team: "NC State", region: "West", kenpom: 34, adjO: 124.1, adjD: 104.5, offPct: 120.32, possPerGame: 69.1, projPts: 82.64, calcedTotal: 164.77, calcedSpread: 0.5, vegasSpread: 0.0, spreadDiff: -0.5, vegasOU: 159.0, record: "20-13", firstFour: true, ffOpponent: "Texas", ffSlot: "West 11" },
  { seed: 16, team: "Prairie View A&M", region: "South", kenpom: 288, adjO: 101.2, adjD: 111.9, offPct: 104.79, possPerGame: 70.9, projPts: 73.84, calcedTotal: 147.99, calcedSpread: -0.3, vegasSpread: -3.5, spreadDiff: -3.2, vegasOU: 143.0, record: "18-17", firstFour: true, ffOpponent: "Lehigh", ffSlot: "South 16" },
  { seed: 16, team: "Lehigh", region: "South", kenpom: 284, adjO: 102.7, adjD: 113.1, offPct: 105.21, possPerGame: 66.9, projPts: 74.14, calcedTotal: 147.99, calcedSpread: 0.3, vegasSpread: 3.5, spreadDiff: 3.2, vegasOU: 143.0, record: "18-16", firstFour: true, ffOpponent: "Prairie View A&M", ffSlot: "South 16" },
  { seed: 11, team: "SMU", region: "Midwest", kenpom: 42, adjO: 122.9, adjD: 104.8, offPct: 122.08, possPerGame: 68.5, projPts: 86.84, calcedTotal: 166.56, calcedSpread: -7.12, vegasSpread: -7.0, spreadDiff: -0.12, vegasOU: 164.0, record: "20-13", firstFour: true, ffOpponent: "Miami OH", ffSlot: "Midwest 11" },
  { seed: 11, team: "Miami OH", region: "Midwest", kenpom: 93, adjO: 116.8, adjD: 108.5, offPct: 112.06, possPerGame: 69.9, projPts: 79.72, calcedTotal: 166.56, calcedSpread: 7.12, vegasSpread: 7.0, spreadDiff: 0.12, vegasOU: 164.0, record: "31-1", firstFour: true, ffOpponent: "SMU", ffSlot: "Midwest 11" },
];

// 32 first-round matchups (favorites listed first by seed)
const MATCHUPS = [
  // EAST
  { region: "East", topSeed: 1, botSeed: 16, topTeam: "Duke", botTeam: "Siena" },
  { region: "East", topSeed: 8, botSeed: 9, topTeam: "Ohio St", botTeam: "TCU" },
  { region: "East", topSeed: 5, botSeed: 12, topTeam: "St. John's", botTeam: "Northern Iowa" },
  { region: "East", topSeed: 4, botSeed: 13, topTeam: "Kansas", botTeam: "Cal Baptist" },
  { region: "East", topSeed: 6, botSeed: 11, topTeam: "Louisville", botTeam: "South Florida" },
  { region: "East", topSeed: 3, botSeed: 14, topTeam: "Michigan St", botTeam: "North Dakota St" },
  { region: "East", topSeed: 7, botSeed: 10, topTeam: "UCLA", botTeam: "UCF" },
  { region: "East", topSeed: 2, botSeed: 15, topTeam: "Connecticut", botTeam: "Furman" },
  // SOUTH
  { region: "South", topSeed: 1, botSeed: 16, topTeam: "Florida", botTeam: "Lehigh/Prairie View A&M", firstFour: true },
  { region: "South", topSeed: 8, botSeed: 9, topTeam: "Clemson", botTeam: "Iowa" },
  { region: "South", topSeed: 5, botSeed: 12, topTeam: "Vanderbilt", botTeam: "McNeese" },
  { region: "South", topSeed: 4, botSeed: 13, topTeam: "Nebraska", botTeam: "Troy" },
  { region: "South", topSeed: 6, botSeed: 11, topTeam: "North Carolina", botTeam: "VCU" },
  { region: "South", topSeed: 3, botSeed: 14, topTeam: "Illinois", botTeam: "Penn" },
  { region: "South", topSeed: 7, botSeed: 10, topTeam: "Saint Mary's", botTeam: "Texas A&M" },
  { region: "South", topSeed: 2, botSeed: 15, topTeam: "Houston", botTeam: "Idaho" },
  // WEST
  { region: "West", topSeed: 1, botSeed: 16, topTeam: "Arizona", botTeam: "Long Island" },
  { region: "West", topSeed: 8, botSeed: 9, topTeam: "Villanova", botTeam: "Utah St" },
  { region: "West", topSeed: 5, botSeed: 12, topTeam: "Wisconsin", botTeam: "High Point" },
  { region: "West", topSeed: 4, botSeed: 13, topTeam: "Arkansas", botTeam: "Hawaii" },
  { region: "West", topSeed: 6, botSeed: 11, topTeam: "BYU", botTeam: "Texas/NC State", firstFour: true },
  { region: "West", topSeed: 3, botSeed: 14, topTeam: "Gonzaga", botTeam: "Kennesaw St" },
  { region: "West", topSeed: 7, botSeed: 10, topTeam: "Miami FL", botTeam: "Missouri" },
  { region: "West", topSeed: 2, botSeed: 15, topTeam: "Purdue", botTeam: "Queens" },
  // MIDWEST
  { region: "Midwest", topSeed: 1, botSeed: 16, topTeam: "Michigan", botTeam: "UMBC/Howard", firstFour: true },
  { region: "Midwest", topSeed: 8, botSeed: 9, topTeam: "Georgia", botTeam: "Saint Louis" },
  { region: "Midwest", topSeed: 5, botSeed: 12, topTeam: "Texas Tech", botTeam: "Akron" },
  { region: "Midwest", topSeed: 4, botSeed: 13, topTeam: "Alabama", botTeam: "Hofstra" },
  { region: "Midwest", topSeed: 6, botSeed: 11, topTeam: "Tennessee", botTeam: "SMU/Miami OH", firstFour: true },
  { region: "Midwest", topSeed: 3, botSeed: 14, topTeam: "Virginia", botTeam: "Wright St" },
  { region: "Midwest", topSeed: 7, botSeed: 10, topTeam: "Kentucky", botTeam: "Santa Clara" },
  { region: "Midwest", topSeed: 2, botSeed: 15, topTeam: "Iowa St", botTeam: "Tennessee St" },
];

const FIRST_FOUR = [
  { team1: "UMBC", team2: "Howard", seed: 16, region: "Midwest", playsInto: "Michigan" },
  { team1: "Lehigh", team2: "Prairie View A&M", seed: 16, region: "South", playsInto: "Florida" },
  { team1: "Texas", team2: "NC State", seed: 11, region: "West", playsInto: "BYU" },
  { team1: "SMU", team2: "Miami OH", seed: 11, region: "Midwest", playsInto: "Tennessee" },
];

const REGIONS = ["East", "South", "West", "Midwest"];
const REGION_COLORS = { East: "#4ecca3", South: "#ff6b35", West: "#7b68ee", Midwest: "#ffd700" };

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function getTeam(name) {
  return TEAMS.find(t => t.team === name);
}

function getMatchupColor(m) {
  const top = getTeam(m.topTeam);
  const bot = getTeam(m.botTeam?.split("/")[0]);
  if (!top || !bot || top.calcedSpread == null) return "border-gray-600";
  const absSpread = Math.abs(top.calcedSpread);
  const diff = bot.spreadDiff || 0;
  if (top.calcedSpread > 0) return "border-red-500"; // model favors underdog
  if (diff >= 3 || absSpread < 10) return "border-yellow-500";
  if (absSpread > 15) return "border-green-500";
  return "border-yellow-500";
}

function getMatchupBorderColor(m) {
  const top = getTeam(m.topTeam);
  const bot = getTeam(m.botTeam?.split("/")[0]);
  if (!top || !bot || top.calcedSpread == null) return "#6b7280";
  const absSpread = Math.abs(top.calcedSpread);
  const diff = bot.spreadDiff || 0;
  if (top.calcedSpread > 0) return "#ef4444";
  if (diff >= 3 || absSpread < 10) return "#eab308";
  if (absSpread > 15) return "#4ecca3";
  return "#eab308";
}

function isUpset(m) {
  const top = getTeam(m.topTeam);
  const bot = getTeam(m.botTeam?.split("/")[0]);
  if (!top || !bot || top.calcedSpread == null) return false;
  const absSpread = Math.abs(top.calcedSpread);
  const kenpomGap = Math.abs(top.kenpom - bot.kenpom);
  const diff = bot.spreadDiff || 0;
  return diff >= 3 || kenpomGap < 40 || absSpread < 10;
}

function upsetScore(m) {
  const top = getTeam(m.topTeam);
  const bot = getTeam(m.botTeam?.split("/")[0]);
  if (!top || !bot || top.calcedSpread == null) return 999;
  return Math.abs(top.calcedSpread);
}

function normalize(val, min, max) {
  if (val == null) return 0;
  return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
}

function generateSummary(t1, t2) {
  if (!t1 || !t2) return "";
  const parts = [];
  const better = (stat, a, b, inv = false) => {
    const aB = inv ? a < b : a > b;
    return aB ? t1.team : t2.team;
  };
  const offWinner = better("AdjO", t1.adjO, t2.adjO);
  const defWinner = better("AdjD", t1.adjD, t2.adjD, true);
  parts.push(`${offWinner} has the offensive edge (${offWinner === t1.team ? t1.adjO : t2.adjO} AdjO vs ${offWinner === t1.team ? t2.adjO : t1.adjO}).`);
  parts.push(`${defWinner} holds the defensive advantage (${defWinner === t1.team ? t1.adjD : t2.adjD} AdjD vs ${defWinner === t1.team ? t2.adjD : t1.adjD}).`);
  if (t1.kenpom < t2.kenpom) {
    parts.push(`${t1.team} is ranked #${t1.kenpom} in KenPom vs #${t2.kenpom} for ${t2.team}.`);
  } else {
    parts.push(`${t2.team} is ranked #${t2.kenpom} in KenPom vs #${t1.kenpom} for ${t1.team}.`);
  }
  if (t1.calcedSpread != null && t2.calcedSpread != null) {
    const favored = t1.calcedSpread < 0 ? t1 : t2;
    const spread = Math.abs(t1.calcedSpread < 0 ? t1.calcedSpread : t2.calcedSpread);
    parts.push(`Model favors ${favored.team} by ${spread.toFixed(1)} points.`);
    if (favored.vegasSpread != null) {
      const vegasAbs = Math.abs(favored.vegasSpread);
      const diff = Math.abs(spread - vegasAbs).toFixed(1);
      if (spread < vegasAbs) {
        parts.push(`Vegas has a wider spread (${vegasAbs}) — the ${diff}-point gap suggests Vegas may be overvaluing ${favored.team} slightly.`);
      } else if (spread > vegasAbs) {
        parts.push(`The model's spread is wider than Vegas (${vegasAbs}) by ${diff} points — the model sees ${favored.team} as even stronger.`);
      }
    }
  }
  return parts.join(" ");
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function MarchMadness2026({ sharedBracketId }) {
  const [tab, setTab] = useState("dashboard");
  const [compare1, setCompare1] = useState("");
  const [compare2, setCompare2] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    picks, setPicks, makePick, isReadOnly, ownerName, bracketId,
    isSaving, lastSaved, displayName, setDisplayName, isLoading,
  } = useBracket(sharedBracketId);

  const allTeamNames = TEAMS.filter(t => !t.firstFour).map(t => t.team).sort();
  const ffTeamNames = TEAMS.filter(t => t.firstFour).map(t => t.team);
  const allNames = [...allTeamNames, ...ffTeamNames].sort();

  // ── Bracket helpers ──
  const regionSeeds = [
    [1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]
  ];

  function getBracketKey(region, round, slot) {
    return `${region}-R${round}-S${slot}`;
  }

  function getR1Teams(region, idx) {
    const m = MATCHUPS.filter(x => x.region === region)[idx];
    if (!m) return [null, null];
    if (m.firstFour) return [m.topTeam, m.botTeam];
    return [m.topTeam, m.botTeam];
  }

  const totalPicks = Object.keys(picks).length;

  function shareBracket() {
    if (!bracketId) return;
    const url = `${window.location.origin}/bracket/${bracketId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function exportPicks() {
    let text = "March Madness 2026 — My Bracket Picks\n";
    text += "=".repeat(45) + "\n\n";
    REGIONS.forEach(region => {
      text += `── ${region.toUpperCase()} ──\n`;
      for (let r = 1; r <= 4; r++) {
        const roundName = r === 1 ? "Round of 64" : r === 2 ? "Round of 32" : r === 3 ? "Sweet 16" : "Elite Eight";
        const slots = Math.pow(2, 4 - r);
        let anyPick = false;
        for (let s = 0; s < slots; s++) {
          const k = getBracketKey(region, r, s);
          if (picks[k]) {
            if (!anyPick) { text += `  ${roundName}:\n`; anyPick = true; }
            text += `    ${picks[k]}\n`;
          }
        }
      }
      text += "\n";
    });
    // Final Four
    ["FF-R5-S0", "FF-R5-S1", "FF-R6-S0", "FF-R7-S0"].forEach(k => {
      if (picks[k]) {
        const round = k.includes("R5") ? "Final Four" : k.includes("R6") ? "Championship" : "Champion";
        text += `${round}: ${picks[k]}\n`;
      }
    });
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MarchMadness2026_Picks.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function openCompare(t1, t2) {
    setCompare1(t1);
    setCompare2(t2);
    setTab("compare");
  }

  // ── TAB: Dashboard ──
  function renderDashboard() {
    const filteredMatchups = selectedRegion === "All"
      ? MATCHUPS
      : MATCHUPS.filter(m => m.region === selectedRegion);

    const filtered = search
      ? filteredMatchups.filter(m =>
          m.topTeam.toLowerCase().includes(search.toLowerCase()) ||
          m.botTeam.toLowerCase().includes(search.toLowerCase())
        )
      : filteredMatchups;

    const grouped = {};
    filtered.forEach(m => {
      if (!grouped[m.region]) grouped[m.region] = [];
      grouped[m.region].push(m);
    });

    return (
      <div>
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#16213e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b35]"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", ...REGIONS].map(r => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRegion === r
                    ? "bg-[#ff6b35] text-white"
                    : "bg-[#16213e] text-gray-300 hover:bg-[#1f2b47]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Safe Favorite (spread &gt; 15)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> Potential Upset</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Model Favors Underdog</span>
        </div>

        {Object.entries(grouped).map(([region, games]) => (
          <div key={region} className="mb-8">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: REGION_COLORS[region] }} />
              {region}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {games.map((m, i) => {
                const top = getTeam(m.topTeam);
                const botName = m.botTeam?.split("/")[0];
                const bot = getTeam(botName);
                const borderColor = getMatchupBorderColor(m);

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (top && bot) openCompare(m.topTeam, botName);
                    }}
                    className="rounded-xl p-4 bg-[#16213e] cursor-pointer hover:bg-[#1f2b47] transition-colors border-l-4"
                    style={{ borderLeftColor: borderColor }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: REGION_COLORS[region], color: "#1a1a2e" }}>{region}</span>
                      {m.firstFour && <span className="text-xs text-yellow-400">First Four TBD</span>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-[#ff6b35] font-bold mr-1">{m.topSeed}</span>
                          <span className="font-semibold">{m.topTeam}</span>
                        </div>
                        <span className="text-xs text-gray-400">{top?.record || ""}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-[#ff6b35] font-bold mr-1">{m.botSeed}</span>
                          <span className="font-semibold">{m.botTeam}</span>
                        </div>
                        <span className="text-xs text-gray-400">{bot?.record || ""}</span>
                      </div>
                    </div>
                    {top && bot && top.calcedSpread != null && (
                      <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-3 gap-1 text-center text-xs">
                        <div>
                          <div className="text-gray-400">KenPom</div>
                          <div className="font-medium">#{top.kenpom} / #{bot.kenpom}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Model</div>
                          <div className="font-medium">{top.calcedSpread > 0 ? "+" : ""}{top.calcedSpread?.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Vegas</div>
                          <div className="font-medium">{top.vegasSpread > 0 ? "+" : ""}{top.vegasSpread}</div>
                        </div>
                      </div>
                    )}
                    {top && bot && top.spreadDiff != null && Math.abs(top.spreadDiff) >= 3 && (
                      <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Spread diff: {top.spreadDiff > 0 ? "+" : ""}{top.spreadDiff.toFixed(1)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── TAB: Upset Finder ──
  function renderUpsetFinder() {
    const upsets = MATCHUPS.filter(isUpset).sort((a, b) => upsetScore(a) - upsetScore(b));

    // Bar chart data — all matchups with valid spreads
    const barData = MATCHUPS
      .filter(m => {
        const t = getTeam(m.topTeam);
        return t && t.calcedSpread != null;
      })
      .map(m => {
        const t = getTeam(m.topTeam);
        return {
          name: `(${m.topSeed})${m.topTeam} v (${m.botSeed})${m.botTeam?.split("/")[0]?.substring(0, 8)}`,
          model: Math.abs(t.calcedSpread),
          vegas: Math.abs(t.vegasSpread),
        };
      })
      .sort((a, b) => a.model - b.model);

    // Scatter data — seed vs KenPom
    const scatterData = TEAMS.filter(t => !t.firstFour).map(t => ({
      seed: t.seed,
      kenpom: t.kenpom,
      team: t.team,
      region: t.region,
    }));

    return (
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Potential Upsets ({upsets.length} flagged)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {upsets.map((m, i) => {
            const top = getTeam(m.topTeam);
            const botName = m.botTeam?.split("/")[0];
            const bot = getTeam(botName);
            if (!top || !bot) return null;
            const reasons = [];
            if (bot.spreadDiff >= 3) reasons.push(`Spread diff ${bot.spreadDiff?.toFixed(1)} favors underdog`);
            if (Math.abs(top.kenpom - bot.kenpom) < 40) reasons.push(`KenPom gap only ${Math.abs(top.kenpom - bot.kenpom)}`);
            if (top.calcedSpread != null && Math.abs(top.calcedSpread) < 10) reasons.push(`Model spread only ${Math.abs(top.calcedSpread).toFixed(1)}`);

            return (
              <div key={i} className="rounded-xl p-4 bg-[#16213e] border-l-4 border-yellow-500 cursor-pointer hover:bg-[#1f2b47]" onClick={() => openCompare(m.topTeam, botName)}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">
                    <span className="text-[#ff6b35]">{m.topSeed}</span> {m.topTeam} vs <span className="text-[#ff6b35]">{m.botSeed}</span> {botName}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: REGION_COLORS[m.region], color: "#1a1a2e" }}>{m.region}</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Model: <span className="text-white font-medium">{top.calcedSpread?.toFixed(1)}</span> | Vegas: <span className="text-white font-medium">{top.vegasSpread}</span> | KenPom: #{top.kenpom} vs #{bot.kenpom}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {reasons.map((r, j) => (
                      <span key={j} className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-lg font-bold mb-3">Model Spread vs Vegas Spread — All Games</h3>
        <div className="bg-[#16213e] rounded-xl p-4 mb-8" style={{ height: 600 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 140, right: 20, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis type="number" stroke="#888" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" stroke="#888" tick={{ fontSize: 10 }} width={130} />
              <Tooltip contentStyle={{ background: "#16213e", border: "1px solid #333", borderRadius: 8, color: "#fff" }} />
              <Legend />
              <Bar dataKey="model" name="Model Spread" fill="#ff6b35" barSize={8} />
              <Bar dataKey="vegas" name="Vegas Spread" fill="#4ecca3" barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="text-lg font-bold mb-3">Seed vs KenPom Ranking</h3>
        <p className="text-xs text-gray-400 mb-2">Teams in the bottom-right are underseeded (low seed, high KenPom). Top-left are overseeded.</p>
        <div className="bg-[#16213e] rounded-xl p-4" style={{ height: 450 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis type="number" dataKey="seed" name="Seed" domain={[1, 16]} stroke="#888" label={{ value: "Seed", position: "bottom", fill: "#888" }} />
              <YAxis type="number" dataKey="kenpom" name="KenPom" reversed stroke="#888" label={{ value: "KenPom Rank", angle: -90, position: "insideLeft", fill: "#888" }} />
              <Tooltip
                contentStyle={{ background: "#16213e", border: "1px solid #333", borderRadius: 8, color: "#fff" }}
                formatter={(val, name, props) => {
                  if (name === "KenPom") return [`#${val}`, "KenPom"];
                  return [val, name];
                }}
                labelFormatter={() => ""}
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="bg-[#16213e] border border-gray-600 rounded-lg p-2 text-xs text-white">
                      <div className="font-bold">{d?.team}</div>
                      <div>Seed: {d?.seed} | KenPom: #{d?.kenpom}</div>
                      <div style={{ color: REGION_COLORS[d?.region] }}>{d?.region}</div>
                    </div>
                  );
                }}
              />
              <Legend />
              {REGIONS.map(region => (
                <Scatter key={region} name={region} data={scatterData.filter(d => d.region === region)} fill={REGION_COLORS[region]}>
                  {scatterData.filter(d => d.region === region).map((d, idx) => (
                    <Cell key={idx} fill={REGION_COLORS[region]} />
                  ))}
                </Scatter>
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // ── TAB: Compare ──
  function renderCompare() {
    const t1 = getTeam(compare1);
    const t2 = getTeam(compare2);

    const stats = [
      { label: "KenPom Rank", key: "kenpom", inv: true },
      { label: "Adj. Offense", key: "adjO", inv: false },
      { label: "Adj. Defense", key: "adjD", inv: true },
      { label: "Offensive %", key: "offPct", inv: false },
      { label: "Poss/Game", key: "possPerGame", inv: false },
      { label: "Proj. Points", key: "projPts", inv: false },
      { label: "Model Spread", key: "calcedSpread", inv: true },
      { label: "Vegas Spread", key: "vegasSpread", inv: true },
    ];

    // Radar data
    const radarData = t1 && t2 ? [
      { stat: "Offense", A: normalize(t1.adjO, 100, 135), B: normalize(t2.adjO, 100, 135) },
      { stat: "Defense", A: normalize(120 - t1.adjD, 0, 35), B: normalize(120 - t2.adjD, 0, 35) },
      { stat: "Tempo", A: normalize(t1.possPerGame, 60, 75), B: normalize(t2.possPerGame, 60, 75) },
      { stat: "KenPom", A: normalize(300 - t1.kenpom, 0, 300), B: normalize(300 - t2.kenpom, 0, 300) },
      { stat: "Off%", A: normalize(t1.offPct || 100, 80, 145), B: normalize(t2.offPct || 100, 80, 145) },
    ] : [];

    return (
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-[#ff6b35]" />
          Head-to-Head Comparison
        </h2>

        <div className="flex gap-4 mb-6 flex-wrap">
          <select
            value={compare1}
            onChange={e => setCompare1(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-[#16213e] border border-gray-700 text-white focus:outline-none focus:border-[#ff6b35]"
          >
            <option value="">Select Team 1...</option>
            {allNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select
            value={compare2}
            onChange={e => setCompare2(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-[#16213e] border border-gray-700 text-white focus:outline-none focus:border-[#ff6b35]"
          >
            <option value="">Select Team 2...</option>
            {allNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {t1 && t2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#16213e] rounded-xl p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-400">Stat</th>
                    <th className="text-center py-2">
                      <span className="text-[#ff6b35] font-bold">{t1.seed}</span> {t1.team}
                      <div className="text-xs text-gray-400">{t1.record}</div>
                    </th>
                    <th className="text-center py-2">
                      <span className="text-[#ff6b35] font-bold">{t2.seed}</span> {t2.team}
                      <div className="text-xs text-gray-400">{t2.record}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map(s => {
                    const v1 = t1[s.key];
                    const v2 = t2[s.key];
                    if (v1 == null && v2 == null) return null;
                    const w1 = s.inv ? (v1 != null && v2 != null && v1 < v2) : (v1 != null && v2 != null && v1 > v2);
                    const w2 = s.inv ? (v1 != null && v2 != null && v2 < v1) : (v1 != null && v2 != null && v2 > v1);
                    return (
                      <tr key={s.key} className="border-b border-gray-800">
                        <td className="py-2 text-gray-400">{s.label}</td>
                        <td className={`text-center py-2 ${w1 ? "text-[#4ecca3] font-bold" : ""}`}>
                          {v1 != null ? (typeof v1 === "number" ? v1.toFixed(1) : v1) : "N/A"}
                        </td>
                        <td className={`text-center py-2 ${w2 ? "text-[#4ecca3] font-bold" : ""}`}>
                          {v2 != null ? (typeof v2 === "number" ? v2.toFixed(1) : v2) : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-[#16213e] rounded-xl p-4" style={{ height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2a2a4a" />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: "#ccc", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name={t1.team} dataKey="A" stroke="#ff6b35" fill="#ff6b35" fillOpacity={0.3} />
                  <Radar name={t2.team} dataKey="B" stroke="#4ecca3" fill="#4ecca3" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip contentStyle={{ background: "#16213e", border: "1px solid #333", borderRadius: 8, color: "#fff" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-2 bg-[#16213e] rounded-xl p-4">
              <h3 className="font-bold mb-2 text-[#ff6b35]">Matchup Summary</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{generateSummary(t1, t2)}</p>
            </div>
          </div>
        )}

        {(!t1 || !t2) && (
          <div className="text-center py-16 text-gray-500">
            <GitCompare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select two teams above to compare them head-to-head.</p>
          </div>
        )}
      </div>
    );
  }

  // ── TAB: My Bracket ──
  function renderBracket() {
    // Build bracket per region: 4 rounds (R1=8 games, R2=4, R3=2, R4=1=regional champ)
    // Then Final Four: R5=2 semis, R6=championship, R7=champion
    function RegionBracket({ region }) {
      const matchups = MATCHUPS.filter(m => m.region === region);
      const rounds = [8, 4, 2, 1];
      const roundNames = ["Round of 64", "Round of 32", "Sweet 16", "Elite Eight"];

      function getSlotTeams(round, slot) {
        if (round === 1) {
          const m = matchups[slot];
          if (!m) return [null, null];
          return [m.topTeam, m.botTeam];
        }
        const k1 = getBracketKey(region, round - 1, slot * 2);
        const k2 = getBracketKey(region, round - 1, slot * 2 + 1);
        return [picks[k1] || null, picks[k2] || null];
      }

      return (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: REGION_COLORS[region] }} />
            {region}
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-6 min-w-[700px]">
              {rounds.map((numGames, rIdx) => {
                const round = rIdx + 1;
                return (
                  <div key={round} className="flex-1">
                    <div className="text-xs text-gray-400 mb-2 text-center">{roundNames[rIdx]}</div>
                    <div className="space-y-2" style={{ paddingTop: rIdx > 0 ? `${Math.pow(2, rIdx) * 12 - 12}px` : 0 }}>
                      {Array.from({ length: numGames }).map((_, slot) => {
                        const [team1, team2] = getSlotTeams(round, slot);
                        const key = getBracketKey(region, round, slot);
                        const picked = picks[key];
                        const isFF = team1?.includes("/") || team2?.includes("/");

                        return (
                          <div key={slot} className="bg-[#0f1629] rounded-lg overflow-hidden" style={{ marginBottom: rIdx > 0 ? `${Math.pow(2, rIdx) * 24 - 24}px` : 0 }}>
                            {[team1, team2].map((t, tIdx) => {
                              if (!t) return (
                                <div key={tIdx} className="px-3 py-1.5 text-xs text-gray-600 border-b border-gray-800 last:border-b-0">TBD</div>
                              );
                              const isSlash = t.includes("/");
                              const teamObj = !isSlash ? getTeam(t) : null;
                              const isPicked = picked === t;
                              return (
                                <button
                                  key={tIdx}
                                  onClick={() => !isSlash && t && !isReadOnly && makePick(key, t, region, round, slot)}
                                  disabled={isSlash || !t || isReadOnly}
                                  className={`w-full text-left px-3 py-1.5 text-xs border-b border-gray-800 last:border-b-0 transition-colors flex justify-between items-center ${
                                    isPicked
                                      ? "bg-[#ff6b35] text-white font-bold"
                                      : isSlash || isReadOnly
                                        ? "text-gray-500 cursor-default"
                                        : "text-gray-300 hover:bg-[#1a2340] cursor-pointer"
                                  }`}
                                >
                                  <span className="truncate">
                                    {teamObj && <span className="text-[#ff6b35] mr-1" style={isPicked ? { color: "#fff" } : {}}>{teamObj.seed}</span>}
                                    {t}
                                  </span>
                                  {isPicked && <Trophy className="w-3 h-3 flex-shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Final Four
    function FinalFour() {
      const regionChamps = REGIONS.map((r, i) => {
        const k = getBracketKey(r, 4, 0);
        return picks[k] || null;
      });

      const semis = [
        { slot: 0, t1: regionChamps[0], t2: regionChamps[1], label: "East vs South" },
        { slot: 1, t1: regionChamps[2], t2: regionChamps[3], label: "West vs Midwest" },
      ];

      const sem0 = picks["FF-R5-S0"];
      const sem1 = picks["FF-R5-S1"];
      const champ = picks["FF-R6-S0"];

      return (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffd700]" />
            Final Four &amp; Championship
          </h3>
          <div className="flex gap-6 flex-wrap justify-center">
            {/* Semis */}
            {semis.map((s, i) => (
              <div key={i} className="bg-[#16213e] rounded-xl p-4 min-w-[200px]">
                <div className="text-xs text-gray-400 mb-2">{s.label}</div>
                <div className="bg-[#0f1629] rounded-lg overflow-hidden">
                  {[s.t1, s.t2].map((t, tIdx) => {
                    const key = `FF-R5-S${i}`;
                    const isPicked = picks[key] === t;
                    return (
                      <button
                        key={tIdx}
                        onClick={() => t && !isReadOnly && makePick(key, t, "FF", 5, i)}
                        disabled={!t || isReadOnly}
                        className={`w-full text-left px-3 py-2 text-sm border-b border-gray-800 last:border-b-0 transition-colors ${
                          isPicked
                            ? "bg-[#ff6b35] text-white font-bold"
                            : !t || isReadOnly
                              ? "text-gray-600 cursor-default"
                              : "text-gray-300 hover:bg-[#1a2340] cursor-pointer"
                        }`}
                      >
                        {t || "TBD"}
                        {isPicked && <Trophy className="w-3 h-3 inline ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Championship */}
            <div className="bg-[#16213e] rounded-xl p-4 min-w-[200px] border-2 border-[#ffd700]">
              <div className="text-xs text-[#ffd700] mb-2 font-bold">Championship</div>
              <div className="bg-[#0f1629] rounded-lg overflow-hidden">
                {[sem0, sem1].map((t, tIdx) => {
                  const key = "FF-R6-S0";
                  const isPicked = picks[key] === t;
                  return (
                    <button
                      key={tIdx}
                      onClick={() => t && !isReadOnly && makePick(key, t, "FF", 6, 0)}
                      disabled={!t || isReadOnly}
                      className={`w-full text-left px-3 py-2 text-sm border-b border-gray-800 last:border-b-0 transition-colors ${
                        isPicked
                          ? "bg-[#ffd700] text-[#1a1a2e] font-bold"
                          : !t || isReadOnly
                            ? "text-gray-600 cursor-default"
                            : "text-gray-300 hover:bg-[#1a2340] cursor-pointer"
                      }`}
                    >
                      {t || "TBD"}
                      {isPicked && <Trophy className="w-3 h-3 inline ml-2" />}
                    </button>
                  );
                })}
              </div>
              {champ && (
                <div className="mt-3 text-center">
                  <Trophy className="w-6 h-6 text-[#ffd700] mx-auto mb-1" />
                  <div className="text-[#ffd700] font-bold text-lg">{champ}</div>
                  <div className="text-xs text-gray-400">Champion</div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {isReadOnly && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-[#7b68ee]/20 border border-[#7b68ee] text-sm flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#7b68ee]" />
            You're viewing <span className="font-bold text-white">{ownerName}</span>'s bracket (read-only)
          </div>
        )}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#ffd700]" />
              {isReadOnly ? `${ownerName}'s Bracket` : "My Bracket"}
            </h2>
            {!isReadOnly && (
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="px-3 py-1 rounded-lg bg-[#16213e] border border-gray-700 text-white text-sm focus:outline-none focus:border-[#ff6b35] w-36"
              />
            )}
            {!isReadOnly && (
              <span className="text-xs text-gray-500">
                {isSaving ? (
                  <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>
                ) : lastSaved ? (
                  <span className="flex items-center gap-1 text-[#4ecca3]"><Check className="w-3 h-3" /> Saved</span>
                ) : null}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              Picks made: <span className="text-white font-bold">{totalPicks}</span> / 63
            </span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-[#4ecca3] rounded-full transition-all" style={{ width: `${(totalPicks / 63) * 100}%` }} />
            </div>
            {!isReadOnly && (
              <button
                onClick={shareBracket}
                className="px-4 py-2 bg-[#7b68ee] text-white rounded-lg text-sm font-medium hover:bg-[#6a58dd] transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "Copied!" : "Share"}
              </button>
            )}
            {!isReadOnly && (
              <button
                onClick={exportPicks}
                className="px-4 py-2 bg-[#4ecca3] text-[#1a1a2e] rounded-lg text-sm font-medium hover:bg-[#3dbb92] transition-colors"
              >
                Export Picks
              </button>
            )}
            {!isReadOnly && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowResetConfirm(false)}>
            <div className="bg-[#16213e] rounded-xl p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-2">Reset Bracket?</h3>
              <p className="text-gray-400 text-sm mb-4">This will clear all your picks. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => { setPicks({}); setShowResetConfirm(false); }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Reset All
                </button>
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {REGIONS.map(r => <RegionBracket key={r} region={r} />)}
        <FinalFour />
      </div>
    );
  }

  // ── MAIN RENDER ──
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "upsets", label: "Upset Finder", icon: AlertTriangle },
    { id: "compare", label: "Compare", icon: GitCompare },
    { id: "bracket", label: "My Bracket", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Header */}
      <div className="bg-[#16213e] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#ff6b35]" />
              <div>
                <h1 className="text-2xl font-bold">March Madness 2026</h1>
                <p className="text-xs text-gray-400">Bracket Analyzer</p>
              </div>
            </div>
            <nav className="flex gap-1">
              {tabs.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tab === t.id
                        ? "bg-[#ff6b35] text-white"
                        : "text-gray-400 hover:text-white hover:bg-[#1f2b47]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p>Loading bracket...</p>
          </div>
        ) : (
          <>
            {tab === "dashboard" && renderDashboard()}
            {tab === "upsets" && renderUpsetFinder()}
            {tab === "compare" && renderCompare()}
            {tab === "bracket" && renderBracket()}
          </>
        )}
      </div>
    </div>
  );
}
