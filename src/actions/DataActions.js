export const ADD_EQUALITY = "ADD_EQUALITY";
export const UPDATE_EQUALITY = "UPDATE_EQUALITY";
export const DELETE_EQUALITY = "DELETE_EQUALITY";
export const SOLVE = "SOLVE";
export const CLEAR_ALL = "CLEAR_ALL";

export const addEquality = () => ({
  type: ADD_EQUALITY
});

export const updateEquality = (equalityId, value) => ({
  type: UPDATE_EQUALITY,
  equalityId,
  value
});

export const deleteEquality = equalityId => ({
  type: DELETE_EQUALITY,
  equalityId
});

export const solve = () => ({
  type: SOLVE,
})

export const clearAll = () => ({
  type: CLEAR_ALL,
})