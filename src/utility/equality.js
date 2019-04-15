import updateObject from "./updateObject";
import { OK_MATRIX, INDEFINITE_MATRIX, INCOMPATIBLE_MATRIX } from "../constants/matrixTypes";

export default class GaussMethod {

    isPartOfVariable = c => !Number.isNaN(Number(c))

    // returns array of variables within equalities; 
    getVariables = equalities => {
        const variables = [];
        equalities.forEach(e => {
            const equalityString = e.value;
            const eqArray = equalityString.split(' ');
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

    // clears the equalities and adds whitespaces between elements to be splitted out
    normalizeEqualities = equalities =>
        equalities.map(e => {
            return updateObject(e, {
                value: e.value.replace(/\s+/g, '').replace(/\+/g, " ").replace(/-/g, " -").replace("=", " ")
            })
        })

    // returns array of constants for specified equality
    getConstants = (equalityArray, variables) => {
        const constants = []
        variables.forEach(v => {
            const equalityElement = equalityArray.find(el => el.indexOf(v) !== -1);
            if (equalityElement) {
                if (equalityElement.indexOf(v) === 0) {
                    constants.push(1)
                } else
                    if (equalityElement.indexOf(v) === 1 && equalityElement[0] === "-") {
                        constants.push(-1)
                    } else {
                        constants.push(parseInt(equalityElement.substr(0, equalityElement.indexOf('x'))))
                    }
            } else {
                constants.push(0)
            }
        })
        constants.push(parseInt(equalityArray[equalityArray.length - 1]));
        return constants
    }

    // returns extended matrix of system of linear algebraic equations
    getMatrix = (equalities, variables) => {
        const matrix = [];
        equalities.forEach(e => {
            const equalityString = e.value;
            var eqArray = equalityString.split(' ');
            matrix.push(this.getConstants(eqArray, variables));
        });

        return matrix;
    }

    // transforms matrix to step matrix
    transformToStepMatrix = matrix => {
        this.sortMatrix(matrix);
        for (var i = 0; i < matrix.length - 1; i++) {
            if (matrix[i][i] !== 0) {
                for (var j = i + 1; j < matrix.length; j++) {
                    if (matrix[j][i] !== 0) {
                        const coef = matrix[j][i] / matrix[i][i];
                        for (var k = i; k < matrix[j].length; k++) {
                            matrix[j][k] = matrix[j][k] - matrix[i][k] * coef;
                        }
                    }
                }
                this.sortMatrix(matrix);
            }
        }
    }

    // orders matrix rows by number of zero elements in each row
    sortMatrix = matrix => {
        const arraysValues = [];
        matrix.forEach((m, index) => {
            arraysValues[index] = this.numberOfZeros(m);
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

    // returns number of zero elements in row (those, going in a row from begin of an array)
    numberOfZeros = array => {
        var v = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] !== 0) {
                break;
            }
            v += 1;
        }
        return v;
    }

    matrixRang = matrix => {
        var rang = 0;
        matrix.forEach(a => {
            if (this.numberOfZeros(a) < a.length - 1) {
                rang += 1;
            }
        })
        return rang;
    }

    extendedMatrixRang = matrix => {
        var rang = 0;
        matrix.forEach(a => {
            if (this.numberOfZeros(a) < a.length) {
                rang += 1;
            }
        })
        return rang;
    }

    // returns matrix type
    checkMatrix = matrix => {
        const mRang = this.matrixRang(matrix)
        const mExtRang = this.extendedMatrixRang(matrix)
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

    // deletes all rows in which all elements are zero
    deleteZeroArrays = matrix => {
        for (var i = 0; i < matrix.length - 1; i++) {
            if (this.numberOfZeros(matrix[i]) === matrix[i].length) {
                matrix.splice(i, 1)
                i -= 1;
            }
        }
    }

    // solves system of linear algebraic equations, represented as matrix;
    // returns array of { variable, value } objects
    solveMatrix = (matrix, variables) => {
        this.sortMatrix(matrix);
        this.deleteZeroArrays(matrix);
        const results = variables.map(v => ({
            variable: v,
            value: 0,
        }))
        for (var i = matrix.length - 1; i >= 0; i--) {
            const matrixArray = matrix[i];
            for (var j = i + 1; j < matrixArray.length - 1; j++) {
                matrixArray[matrixArray.length - 1] -= matrixArray[j] * results[j].value;
            }
            const val = matrixArray[matrixArray.length - 1] / matrixArray[i];
            results[i].value = val;
        }
        return results
    }
}
