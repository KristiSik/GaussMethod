import * as actions from "../actions/DataActions";
import { emptyEquality } from "../utility/emptyModels";
import updateObject from "../utility/updateObject";
import { getMatrix, transformToStepMatrix, checkMatrix, getVariables } from "../utility/equality";
import { INCOMPATIBLE_MATRIX, INDEFINITE_MATRIX } from "../constants/matrixTypes";

const initialState = {
  equalities: [{ ...emptyEquality(1) }],
  nextId: 2,
  result: [],
  variables: [],
};

const addEquality = (state, action) => {
  const { equalities, nextId } = state;
  const updatedEqualities = [...equalities, emptyEquality(nextId)];
  return updateObject(state, {
    equalities: updatedEqualities,
    nextId: nextId + 1
  });
};

const updateEquality = (state, action) => {
  const { equalities } = state;
  const { equalityId, value } = action;
  const updatedEqualities = equalities.map(e => {
    if (e.id === equalityId) {
      return updateObject(e, { value });
    }
    return { ...e };
  });
  return updateObject(state, { equalities: updatedEqualities });
};

const deleteEquality = (state, action) => {
  const { equalities } = state;
  const { equalityId } = action;
  const updatedEqualities = equalities.filter(e => e.id !== equalityId);
  return updateObject(state, { equalities: updatedEqualities });
};

const solve = (state, action) => {
  const { equalities } = state

  const variables = getVariables(equalities)
  const matrix = getMatrix(equalities, variables)

  transformToStepMatrix(matrix)

  const matrixType = checkMatrix(matrix)
  if (matrixType === INCOMPATIBLE_MATRIX) {
    return updateObject(state, { error: "Matrix is incompatible" })
  }
  if (matrixType === INDEFINITE_MATRIX) {
    return updateObject(state, { error: "Matrix is indefinite" })
  }

  const results = solveMatrix(matrix)
}

function dataReducer(state = initialState, action) {
  switch (action.type) {
    case actions.ADD_EQUALITY:
      return addEquality(state, action);
    case actions.UPDATE_EQUALITY:
      return updateEquality(state, action);
    case actions.DELETE_EQUALITY:
      return deleteEquality(state, action);
    case actions.SOLVE:
      return solve(state, action)
    default:
      return state;
  }
}

export default dataReducer;
