import updateObject from "./updateObject";
import { OK_MATRIX, INDEFINITE_MATRIX, INCOMPATIBLE_MATRIX } from "../constants/matrixTypes";
import { constants } from "zlib";

export const isPartOfVariable = c => !Number.isNaN(Number(c))

// returns array of variables within equalities; 
export const getVariables = equalities => {
    const variables = [];
    equalities.forEach(e => {
        const equalityString = e.value;
        const eqArray = equalityString.split('-').join(',').split('+').join(',').split('=').join(',').split(',');
        eqArray.forEach(el => {
            if (el.indexOf('x') >= 0) {
                const variable = el.substr(el.indexOf('x'));
                if (!variables.some(v => v === variable)) {
                    variables.push(variable);
                }
            }
        })
    })
    return variables.sort();
}

export const normalizeEqualities = equalities =>
    equalities.map(e => {
        return updateObject(e, {
            value: e.value.replace(/\s+/g, '')
        })
    })

export const getConstants = (equalityArray, variables) => {
    const constants = []
    variables.forEach(v => {
        const equalityElement = equalityArray.find(el => el.indexOf(v) !== -1);
        if (equalityElement) {
            constants.push(parseInt(equalityElement.substr(0, equalityElement.indexOf('x'))))
        } else {
            constants.push(0)
        }
    })
    constants.push(parseInt(equalityArray[equalityArray.length - 1]));
    return constants
}

export const getMatrix = (equalities, variables) => {
    equalities = normalizeEqualities(equalities)
    const matrix = [];
    equalities.forEach(e => {
        const equalityString = e.value;
        const eqArray = equalityString.split('-').join(';').split('+').join(';').split('=').join(';').split(';');
        matrix.push(getConstants(eqArray, variables));
    });

    return matrix;
}

export const transformToStepMatrix = matrix => {
    sortMatrix(matrix);
    for (var i = 0; i < matrix.length - 1; i++) {
        if (matrix[i][i] !== 0) {
            for (var j = i + 1; j < matrix.length; j++) {
                if (matrix[j][i] !== 0) {
                    const coef = matrix[j][i] / matrix[i][i];
                    for (var k = 0; k < matrix[j].length; k++) {
                        matrix[j][k] -= matrix[i][k] * coef;
                    }
                }
            }
            sortMatrix(matrix);
        }
    }
}

export const sortMatrix = matrix => {
    const arraysValues = [];
    matrix.forEach((m, index) => {
        arraysValues[index] = numberOfZeros(m);
    })
    for (var i = 0; i < matrix.length - 1; i++) {
        for (var j = i + 1; j < matrix.length; j++) {
            if (arraysValues[i] > arraysValues[j]) {
                const bufArray = matrix[i];
                matrix[i] = matrix[j];
                matrix[j] = bufArray;
            }
        }
    }
}

export const numberOfZeros = array => {
    var v = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] !== 0) {
            break;
        }
        v += 1;
    }
    return v;
}

export const matrixRang = matrix => {
    var rang = 0;
    matrix.forEach(a => {
        if (numberOfZeros(a) < a.length - 1) {
            rang += 1;
        }
    })
    return rang;
}

export const extendedMatrixRang = matrix => {
    var rang = 0;
    matrix.forEach(a => {
        if (numberOfZeros(a) < a.length) {
            rang += 1;
        }
    })
    return rang;
}

export const checkMatrix = matrix => {
    const mRang = matrixRang(matrix)
    const mExtRang = extendedMatrixRang(matrix)
    if (mRang === mExtRang) {
        return OK_MATRIX;
    }
    if (mRang < mExtRang) {
        return INCOMPATIBLE_MATRIX;
    }
    if (mRang > mExtRang) {
        return INDEFINITE_MATRIX;
    }
}

export const solveMatrix = matrix => {
    
}