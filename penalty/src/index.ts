import type { Shoot, State } from "./type";

export const initialState: State = { score: { A: 0, B: 0 }, history: [] };

export const randomShoot = (): "scored" | "missed" => (Math.random() < 0.75 ? "scored" : "missed");

export const updateScore = (state: State, shoot: Shoot): State => {
    const newScore = shoot.result === "scored"
        ? { ...state.score, [shoot.team]: state.score[shoot.team] + 1 }
        : state.score;

    return {
        score: newScore,
        history: [...state.history, { turn: state.history.length + 1, score: newScore, shoot }]
    };
};

export const display = (state: State): string[] => {
    const result: string[] = state.history.map((entry) => {
        const { turn, score, shoot } = entry;
        const { team, result } = shoot;
        const pointsA = team === "A" && result === "scored" ? "+1" : " 0";
        const pointsB = team === "B" && result === "scored" ? "+1" : " 0";
        return `Tir ${turn} : Score : ${score.A}/${score.B} (Équipe A : ${pointsA} | Équipe B : ${pointsB})`;
    });

    const finalScore = state.history[state.history.length - 1]?.score;
    if (finalScore) {
        if (finalScore.A > finalScore.B) {
            result.push(`Victoire : Équipe A (Score : ${finalScore.A}/${finalScore.B})`);
        } else if (finalScore.B > finalScore.A) {
            result.push(`Victoire : Équipe B (Score : ${finalScore.A}/${finalScore.B})`);
        }
    }

    return result;
};

export const hasWinner = (state: State): boolean => {
    const { score, history } = state;
    const scoreA = score.A;
    const scoreB = score.B;
    const turn = history.length;

    if (Math.abs(scoreA - scoreB) >= 3) {
        return true;
    }

    if (turn >= 10 && scoreA !== scoreB) {
        return true;
    }

    if(turn == 9  && (scoreA + 1 < scoreB || scoreB + 1 < scoreA)){
        return true
    }

    return false;
};

export const penaltyShootout = (state: State): State => {
    const currentTeam = state.history.length % 2 === 0 ? "A" : "B";
    const shoot: Shoot = { team: currentTeam, result: randomShoot() };
    const updatedState = updateScore(state, shoot);

    return hasWinner(updatedState) ? updatedState : penaltyShootout(updatedState);
};

export const playPenaltyfromASpecificShoot = (state: State, startTurn: number): State => {
    const validHistory = state.history.slice(0, startTurn);
    const lastEntry = validHistory[validHistory.length - 1];
    if (!lastEntry) {
        return penaltyShootout(initialState);
    }
    return penaltyShootout({ score: lastEntry.score, history: validHistory });
};

// Main
const state = penaltyShootout(initialState);
const displayResult = display(state);
displayResult.forEach(line => console.log(line));

// Rejouer à partir du tir X
// const replayState = playPenaltyfromASpecificShoot(state, 2); //Remplace le 2e argument par le numéro de tir désiré
// const replayResult = display(replayState);
// replayResult.forEach(line => console.log(line));