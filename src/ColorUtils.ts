import * as Color from "./Color";


const boxToSwitchColor = (boxColor: number) => {
    switch (boxColor) {
        case Color.BOX_ORANGE:
        case Color.Big.ORANGE_WIDE_1:
        case Color.Big.ORANGE_WIDE_2:
        case Color.Big.ORANGE_TALL_1:
        case Color.Big.ORANGE_TALL_2:
            return Color.SWITCH_ORANGE;
        case Color.BOX_RED:
        case Color.Big.RED_WIDE_1:
        case Color.Big.RED_WIDE_2:
        case Color.Big.RED_TALL_1:
        case Color.Big.RED_TALL_2:
            return Color.SWITCH_RED;
        case Color.BOX_BLUE:
        case Color.Big.BLUE_WIDE_1:
        case Color.Big.BLUE_WIDE_2:
        case Color.Big.BLUE_TALL_1:
        case Color.Big.BLUE_TALL_2:
            return Color.SWITCH_BLUE;
        case Color.BOX_GREEN:
        case Color.Big.GREEN_WIDE_1:
        case Color.Big.GREEN_WIDE_2:
        case Color.Big.GREEN_TALL_1:
        case Color.Big.GREEN_TALL_2:
            return Color.SWITCH_GREEN;
        case Color.BOX_GREY:
        case Color.Big.GREY_WIDE_1:
        case Color.Big.GREY_WIDE_2:
        case Color.Big.GREY_TALL_1:
        case Color.Big.GREY_TALL_2:
            return Color.SWITCH_GREY;
        default: // could cause a bug
            return Color.SWITCH_WHITE;
    }
};


const switchToBoxColor = (switchColor: number) => {
    // Convert to Big box?
    switch (switchColor) {
        default:
        case Color.SWITCH_ORANGE:
            return [Color.BOX_ORANGE, 
                    Color.Big.ORANGE_WIDE_1, Color.Big.ORANGE_WIDE_2,
                    Color.Big.ORANGE_TALL_1, Color.Big.ORANGE_TALL_2];
        case Color.SWITCH_RED:
            return [Color.BOX_RED,
                    Color.Big.RED_WIDE_1, Color.Big.RED_WIDE_2,
                    Color.Big.RED_TALL_1, Color.Big.RED_TALL_2];
        case Color.SWITCH_BLUE:
            return [Color.BOX_BLUE,
                    Color.Big.BLUE_WIDE_1, Color.Big.BLUE_WIDE_2,
                    Color.Big.BLUE_TALL_1, Color.Big.BLUE_TALL_2];
        case Color.SWITCH_GREEN:
            return [Color.BOX_GREEN,
                    Color.Big.GREEN_WIDE_1, Color.Big.GREEN_WIDE_2,
                    Color.Big.GREEN_TALL_1, Color.Big.GREEN_TALL_2];
        case Color.SWITCH_GREY:
            return [Color.BOX_GREY,
                    Color.Big.GREY_WIDE_1, Color.Big.GREY_WIDE_2,
                    Color.Big.GREY_TALL_1, Color.Big.GREY_TALL_2];
        // case Color.SWITCH_WHITE (return all boxes) ??
    }
};


const bigBoxPartner = (boxColor: number) => {
    switch (boxColor) {
        
        case Color.Big.ORANGE_WIDE_1:
            return Color.Big.ORANGE_WIDE_2;
        case Color.Big.ORANGE_WIDE_2:
            return Color.Big.ORANGE_WIDE_1;
        case Color.Big.ORANGE_TALL_1:
            return Color.Big.ORANGE_TALL_2;
        case Color.Big.ORANGE_TALL_2:
            return Color.Big.ORANGE_TALL_1;
        
        case Color.Big.RED_WIDE_1:
            return Color.Big.RED_WIDE_2;
        case Color.Big.RED_WIDE_2:
            return Color.Big.RED_WIDE_1;
        case Color.Big.RED_TALL_1:
            return Color.Big.RED_TALL_2;
        case Color.Big.RED_TALL_2:
            return Color.Big.RED_TALL_1;
        
        case Color.Big.BLUE_WIDE_1:
            return Color.Big.BLUE_WIDE_2;
        case Color.Big.BLUE_WIDE_2:
            return Color.Big.BLUE_WIDE_1;
        case Color.Big.BLUE_TALL_1:
            return Color.Big.BLUE_TALL_2;
        case Color.Big.BLUE_TALL_2:
            return Color.Big.BLUE_TALL_1;
        
        case Color.Big.GREEN_WIDE_1:
            return Color.Big.GREEN_WIDE_2;
        case Color.Big.GREEN_WIDE_2:
            return Color.Big.GREEN_WIDE_1;
        case Color.Big.GREEN_TALL_1:
            return Color.Big.GREEN_TALL_2;
        case Color.Big.GREEN_TALL_2:
            return Color.Big.GREEN_TALL_1;
    
        case Color.Big.GREY_WIDE_1:
            return Color.Big.GREY_WIDE_2;
        case Color.Big.GREY_WIDE_2:
            return Color.Big.GREY_WIDE_1;
        case Color.Big.GREY_TALL_1:
            return Color.Big.GREY_TALL_2;
        case Color.Big.GREY_TALL_2:
            return Color.Big.GREY_TALL_1;
        
        default: // boxColor isn't a wide or tall box...
            return -1;
    }
};


export {
    boxToSwitchColor, switchToBoxColor, bigBoxPartner
};