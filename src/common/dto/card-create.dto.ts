import { IsNotEmpty } from 'class-validator';
import {CardSymbolsEnum} from "../enums/card-symbols.enum";
import {CardTypesEnum} from "../enums/card-types.enum";

export class CardCreateDto {
    @IsNotEmpty()
    symbol: CardSymbolsEnum;

    @IsNotEmpty()
    type: CardTypesEnum;
}
