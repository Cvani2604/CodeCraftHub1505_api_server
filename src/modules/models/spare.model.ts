import { SpareBuilder } from './spare.builder';

export class Spare {
    public readonly id: string;
    public readonly modelName: string;
    public readonly name: string;
    public readonly starCount: string;
    public readonly noOfReview: string;
    public readonly cost: string;

    constructor(builder: SpareBuilder) {
        this.id = builder.getId();
        this.modelName = builder.getModelName();
        this.name = builder.getName();
        this.starCount = builder.getStarCount();
        this.noOfReview = builder.getNoOfReview();
        this.cost = builder.getCost();

    }
}