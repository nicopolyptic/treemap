/**
    _   ___                        __            __  _
   / | / (_)________  ____  ____  / /_  ______  / /_(_)____
  /  |/ / / ___/ __ \/ __ \/ __ \/ / / / / __ \/ __/ / ___/
 / /|  / / /__/ /_/ / /_/ / /_/ / / /_/ / /_/ / /_/ / /__
/_/ |_/_/\___/\____/ .___/\____/_/\__, / .___/\__/_/\___/
                  /_/            /____/_/
**/

module treemap {

    export class Size {
        width: number;
        height:number;
    }

    export function maxFontSize(size : Size) {
        return 0.1 * (size.width + size.height);
    }

    export function minFontSize(size: Size) : number {
        return 8;
    }

    export function fontSize(canvasSize : Size, tileSize: Size) : number {
        var min = this.minFontSize(canvasSize);
        var max = this.maxFontSize(canvasSize);
        return Math.max(min, ((tileSize.width + tileSize.height) / (canvasSize.width + canvasSize.height)) * max);
    }

    export function tileMarginPercentage() : number {
        return 0.05;
    }

    export function xMargin(tileSize : Size) : number {
        return tileMarginPercentage() * tileSize.width;
    }

    export function yMargin(tileSize : Size) : number {
        return 0;//tileMarginPercentage() * tileSize.height;
    }
}
