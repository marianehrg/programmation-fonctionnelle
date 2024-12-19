import { playPenaltyfromASpecificShoot, initialState, updateScore, display, hasWinner, penaltyShootout} from "../src/index"; 
import type { Shoot, State } from "../src/type";

test('updateScore should correctly update the score and history', () => {
    const state = initialState;
    const shoot : Shoot = { team: "A", result: "scored" };

    const newState = updateScore(state, shoot);

    // Vérification que le score de l’équipe A a bien augmenté
    expect(newState.score.A).toBe(1);
    expect(newState.score.B).toBe(0);

    // Vérification de l’ajout dans l’historique
    expect(newState.history).toHaveLength(1);
    expect(newState.history[0].turn).toBe(1);
    expect(newState.history[0].shoot).toEqual(shoot);
});

test('display should return the correct formatted result', () => {
    const state : State = {
        score: { A: 2, B: 1 },
        history: [
            { turn: 1, score: { A: 1, B: 0 }, shoot: { team: "A", result: "scored" } },
            { turn: 2, score: { A: 1, B: 1 }, shoot: { team: "B", result: "scored" } },
            { turn: 3, score: { A: 2, B: 1 }, shoot: { team: "A", result: "scored" } },
        ]
    };

    const result = display(state);

    expect(result).toContain("Tir 1 : Score : 1/0 (Équipe A : +1 | Équipe B :  0)");
    expect(result).toContain("Tir 2 : Score : 1/1 (Équipe A :  0 | Équipe B : +1)");
    expect(result).toContain("Tir 3 : Score : 2/1 (Équipe A : +1 | Équipe B :  0)");
    expect(result).toContain("Victoire : Équipe A (Score : 2/1)");
});

test('hasWinner should correctly detect a winner', () => {
    const stateWithWinner : State = {
        score: { A: 5, B: 2 },
        history: [
            { turn: 1, score: { A: 1, B: 0 }, shoot: { team: "A", result: "scored" } },
            { turn: 2, score: { A: 2, B: 0 }, shoot: { team: "A", result: "scored" } },
            { turn: 3, score: { A: 3, B: 0 }, shoot: { team: "A", result: "scored" } },
            { turn: 4, score: { A: 4, B: 1 }, shoot: { team: "B", result: "scored" } },
            { turn: 5, score: { A: 5, B: 2 }, shoot: { team: "A", result: "scored" } },
        ]
    };

    expect(hasWinner(stateWithWinner)).toBe(true);

    const stateWithoutWinner : State = {
        score: { A: 3, B: 2 },
        history: [
            { turn: 1, score: { A: 1, B: 0 }, shoot: { team: "A", result: "scored" } },
            { turn: 2, score: { A: 2, B: 1 }, shoot: { team: "B", result: "scored" } },
            { turn: 3, score: { A: 3, B: 2 }, shoot: { team: "A", result: "scored" } },
        ]
    };

    expect(hasWinner(stateWithoutWinner)).toBe(false);
});

test('playPenaltyfromASpecificShoot should correctly replay from a specific turn', () => {
    const state : State= {
        score: { A: 2, B: 1 },
        history: [
            { turn: 1, score: { A: 1, B: 0 }, shoot: { team: "A", result: "scored" } },
            { turn: 2, score: { A: 1, B: 1 }, shoot: { team: "B", result: "scored" } },
            { turn: 3, score: { A: 2, B: 1 }, shoot: { team: "A", result: "scored" } },
        ]
    };

    const replayState = playPenaltyfromASpecificShoot(state, 2);

    expect(replayState.history.length).toBeGreaterThanOrEqual(2);
    expect(replayState.history[0].turn).toBe(1);
    expect(replayState.history[1].turn).toBe(2);
});


