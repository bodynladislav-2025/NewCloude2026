export function computePlayerStats(players, matches) {
  return players.map((player) => {
    const playerMatches = matches.filter(
      (m) => m.player1Id === player.id || m.player2Id === player.id
    );

    // Metrika A: vyhraných zápasů (sesí)
    let wins = 0;
    let losses = 0;
    // Metrika B: vyhraných her (individuálních bodů/gamů)
    let gamesWon = 0;
    let gamesLost = 0;

    playerMatches.forEach((m) => {
      const myScore = m.player1Id === player.id ? m.score1 : m.score2;
      const oppScore = m.player1Id === player.id ? m.score2 : m.score1;

      if (myScore > oppScore) wins++;
      else if (myScore < oppScore) losses++;

      gamesWon += myScore;
      gamesLost += oppScore;
    });

    const total = playerMatches.length;
    const totalGames = gamesWon + gamesLost;

    // % vyhraných zápasů (sesí)
    const pct = total > 0 ? Math.round((wins / total) * 100) : null;
    // % vyhraných her
    const gamePct = totalGames > 0 ? Math.round((gamesWon / totalGames) * 100) : null;

    return { ...player, wins, losses, total, pct, gamesWon, gamesLost, totalGames, gamePct };
  });
}

export function computeHeadToHead(players, matches) {
  // Returns a map: { [attackerId]: { [opponentId]: { wins, total, pct } } }
  const matrix = {};
  players.forEach((p) => {
    matrix[p.id] = {};
    players.forEach((opp) => {
      if (opp.id !== p.id) {
        matrix[p.id][opp.id] = { wins: 0, total: 0, pct: null };
      }
    });
  });

  matches.forEach((m) => {
    const { player1Id, player2Id, score1, score2 } = m;
    if (!matrix[player1Id] || !matrix[player2Id]) return;

    matrix[player1Id][player2Id].total++;
    matrix[player2Id][player1Id].total++;

    if (score1 > score2) {
      matrix[player1Id][player2Id].wins++;
    } else if (score2 > score1) {
      matrix[player2Id][player1Id].wins++;
    }
  });

  // Compute pct
  players.forEach((p) => {
    players.forEach((opp) => {
      if (opp.id !== p.id) {
        const cell = matrix[p.id][opp.id];
        cell.pct = cell.total > 0 ? Math.round((cell.wins / cell.total) * 100) : null;
      }
    });
  });

  return matrix;
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}
