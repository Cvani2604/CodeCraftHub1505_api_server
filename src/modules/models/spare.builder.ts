import { Spare } from './spare.model';

export class SpareBuilder {



    private id: string = '';
    private modelName: string = '';
    private name: string = '';
    private starCount: string = '';
    private noOfReview: string = '';
    private cost: string = '';

    constructor(src?: Spare) {

        if (src) {
            this.setId(src.id);
            this.setModelName(src.modelName);
            this.setName(src.name);
            this.setStarCount(src.starCount);
            this.setNoOfReview(src.noOfReview);
            this.setCost(src.cost);
        }
    }

    public setId(id: string): SpareBuilder {
        this.id = id;
        return this;
    }

    public getId(): string {
        return this.id;
    }
    public setModelName(modelName: string): SpareBuilder {
        this.modelName = modelName;
        return this;
    }

    public getModelName(): string {
        return this.modelName;
    }

    public setName(name: string): SpareBuilder {
        this.name = name;
        return this;
    }

    public getName(): string {
        return this.name;
    }

    public setStarCount(starCount: string): SpareBuilder {
        this.starCount = starCount;
        return this;
    }

    public getStarCount(): string {
        return this.starCount;
    }

    public setNoOfReview(noOfReview: string): SpareBuilder {
        this.noOfReview = noOfReview;
        return this;
    }


    public getNoOfReview(): string {
        return this.noOfReview;
    }

    public setCost(cost: string): SpareBuilder {
        this.cost = cost;
        return this;
    }

    public getCost(): string {
        return this.cost;
    }
    public build(): Spare {
        return new Spare(this);
    }
}