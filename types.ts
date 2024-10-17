import type {IWidget} from "@protorians/widgets";
import {IAssets, VisualKitException} from "@visualkit/core";

export type ICoverageAssets = IAssets

export type ICoverage<P> = {
  children: (parameter: P) => IWidget<any, any>;
  fallback: IWidget<any, any>;
  error?: (er: VisualKitException | Error | ErrorEvent | Event) => IWidget<any, any>;
  assets?: ICoverageAssets;
  timeout?: number;
}

export interface ICoverageEvents {
  seeking: number;
}