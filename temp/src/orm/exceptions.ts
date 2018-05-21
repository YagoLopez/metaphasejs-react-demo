import {Model} from "./model";

export class NotSavedModelError extends Error {

  constructor(public model: Model, public relatedModel: Model) {
    super();
    let relatedModelName: string;
    if (relatedModel.constructor.name === "Function") {
      relatedModelName = relatedModel.prototype.constructor.name;
    } else {
      relatedModelName = relatedModel.constructor.name;
    }
    const msg = `(${model.constructor.name}) = ${JSON.stringify(model)}` +
      ` must be saved to establish a relation with (${relatedModelName})`;
    throw new Error(msg);
  }
}

export class InvalidPropTypeError extends Error {
  constructor(jsType?: string) {
    super();
    const msg = `Invalid model property type: "${jsType}". Allowed values: ["string, number"]`;
    throw new Error(msg);
  }
}

export class InvalidColumnData extends Error {
  constructor(columnData: string | undefined) {
    super();
    const msg = `Invalid column data value: "${columnData}"`;
    throw new Error(msg);
  }
}