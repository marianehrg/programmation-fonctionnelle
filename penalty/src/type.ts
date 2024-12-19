
export type Shoot = {
    team: "A" | "B";
    result: "scored" | "missed";
}


export type Score = { A: number; B: number };

export type History = {
    turn: number;
    score: Score;
    shoot: Shoot;
}[];

export type State = {
    score: Score;
    history: History;
};