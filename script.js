function poissonRandom(lambda) {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}

function simulateMetric(baseValue, variance = 2.5) {
    let randomOffset = (Math.random() * (variance * 2)) - variance;
    let simulated = Math.round(baseValue + randomOffset);
    return Math.max(0, simulated);
}

function runSimulation() {
    // 1. Lectura de inputs del Local
    const homeName = document.getElementById('home-name').value;
    const homeXg = parseFloat(document.getElementById('home-xg').value);
    const homeXga = parseFloat(document.getElementById('home-xga').value);
    const homeScored = parseFloat(document.getElementById('home-scored').value);
    const homeConceded = parseFloat(document.getElementById('home-conceded').value);
    const homeShotsInput = parseFloat(document.getElementById('home-shots').value);
    const homeSotInput = parseFloat(document.getElementById('home-sot').value);
    const homeCornersWon = parseFloat(document.getElementById('home-corners-won').value);
    const homeCornersLost = parseFloat(document.getElementById('home-corners-lost').value);
    let homePoss = parseFloat(document.getElementById('home-poss').value);
    const homeFouls = parseFloat(document.getElementById('home-fouls').value);

    // 2. Lectura de inputs del Visitante
    const awayName = document.getElementById('away-name').value;
    const awayXg = parseFloat(document.getElementById('away-xg').value);
    const awayXga = parseFloat(document.getElementById('away-xga').value);
    const awayScored = parseFloat(document.getElementById('away-scored').value);
    const awayConceded = parseFloat(document.getElementById('away-conceded').value);
    const awayShotsInput = parseFloat(document.getElementById('away-shots').value);
    const awaySotInput = parseFloat(document.getElementById('away-sot').value);
    const awayCornersWon = parseFloat(document.getElementById('away-corners-won').value);
    const awayCornersLost = parseFloat(document.getElementById('away-corners-lost').value);
    let awayPoss = parseFloat(document.getElementById('away-poss').value);
    const awayFouls = parseFloat(document.getElementById('away-fouls').value);

    // 3. Normalizar Posesión Conjunta
    const totalPoss = homePoss + awayPoss;
    if (totalPoss > 0) {
        homePoss = Math.round((homePoss / totalPoss) * 100);
        awayPoss = 100 - homePoss;
    } else {
        homePoss = 50;
        awayPoss = 50;
    }

    // 4. MOTOR CONJUNTO DE GOLES (Cruzando xG Ofensivo/Defensivo y Promedios Reales)
    let finalHomeXg = ((homeXg + awayXga + homeScored + awayConceded) / 4);
    let finalAwayXg = ((awayXg + homeXga + awayScored + homeConceded) / 4);

    const homeGoals = poissonRandom(finalHomeXg);
    const awayGoals = poissonRandom(finalAwayXg);

    // 5. MOTOR CONJUNTO DE CÓRNERS (Cruzando ganados y perdidos del rival)
    let finalHomeCorners = (homeCornersWon + awayCornersLost) / 2;
    let finalAwayCorners = (awayCornersWon + homeCornersLost) / 2;
    const simHomeCorners = simulateMetric(finalHomeCorners, 1.8);
    const simAwayCorners = simulateMetric(finalAwayCorners, 1.8);

    // 6. SIMULACIÓN DE REMATES CON PROPORCIÓN DE PUNTERÍA REAL
    const simHomeShots = simulateMetric(homeShotsInput, 3.0);
    const simAwayShots = simulateMetric(awayShotsInput, 3.0);

    let homeSotRatio = homeSotInput / Math.max(1, homeShotsInput);
    let awaySotRatio = awaySotInput / Math.max(1, awayShotsInput);

    const simHomeSot = Math.min(simHomeShots, Math.max(0, Math.round(simHomeShots * homeSotRatio + (Math.random() * 2 - 1))));
    const simAwaySot = Math.min(simAwayShots, Math.max(0, Math.round(simAwayShots * awaySotRatio + (Math.random() * 2 - 1))));

    // 7. ESTIMACIÓN DE FALTAS Y TARJETAS CONJUNTAS
    const simHomeFouls = simulateMetric(homeFouls, 2.0);
    const simAwayFouls = simulateMetric(awayFouls, 2.0);
    const totalEstimatedCards = ((simHomeFouls + simAwayFouls) / 7.5).toFixed(1);

    // 8. PINTAR RESULTADOS EN LA INTERFAZ
    document.getElementById('res-home-name').innerText = homeName;
    document.getElementById('res-away-name').innerText = awayName;
    document.getElementById('res-score').innerText = `${homeGoals} - ${awayGoals}`;

    document.getElementById('th-home').innerText = homeName;
    document.getElementById('th-away').innerText = awayName;

    const statsBody = document.getElementById('stats-body');
    statsBody.innerHTML = `
        <tr><td><strong>Goles Esperados (xG Cruzado)</strong></td><td>${finalHomeXg.toFixed(2)}</td><td>${finalAwayXg.toFixed(2)}</td></tr>
        <tr><td><strong>Posesión de Balón</strong></td><td>${homePoss}%</td><td>${awayPoss}%</td></tr>
        <tr><td><strong>Remates Totales</strong></td><td>${simHomeShots}</td><td>${simAwayShots}</td></tr>
        <tr><td><strong>Tiros a Puerta</strong></td><td>${simHomeSot}</td><td>${simAwaySot}</td></tr>
        <tr><td><strong>Córners Simulados</strong></td><td>${simHomeCorners}</td><td>${simAwayCorners}</td></tr>
        <tr><td><strong>Faltas Cometidas</strong></td><td>${simHomeFouls}</td><td>${simAwayFouls}</td></tr>
        <tr><td><strong>Tarjetas Totales Estimadas</strong></td><td colspan="2" style="text-align: center; color: #facc15; font-weight: bold;">~ ${totalEstimatedCards} Tarjetas</td></tr>
    `;

    document.getElementById('results').classList.remove('hidden');
}
