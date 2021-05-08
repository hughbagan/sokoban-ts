import * as Color from "../consts/Color";

const boxToSwitchColor = (boxColor: number) => {
    switch (boxColor) {
        default: // could cause a bug
        case Color.BOX_ORANGE:
            return Color.SWITCH_ORANGE;
        case Color.BOX_RED:
            return Color.SWITCH_RED;
        case Color.BOX_BLUE:
            return Color.SWITCH_BLUE;
        case Color.BOX_GREEN:
            return Color.SWITCH_GREEN;
        case Color.BOX_GREY:
            return Color.SWITCH_GREY;
    }
};

const switchToBoxColor = (switchColor: number) => {
    switch (switchColor) {
        default:
        case Color.SWITCH_ORANGE:
            return Color.BOX_ORANGE;
        case Color.SWITCH_RED:
            return Color.BOX_RED;
        case Color.SWITCH_BLUE:
            return Color.BOX_BLUE;
        case Color.SWITCH_GREEN:
            return Color.BOX_GREEN;
        case Color.SWITCH_GREY:
            return Color.BOX_GREY;
    }
};

export {
    boxToSwitchColor, switchToBoxColor
}