abstract class Entity {
	public x: number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public abstract update(game: Game, delta: number): void;
	public abstract render(game: Game, ctx: CanvasRenderingContext2D): void;
}