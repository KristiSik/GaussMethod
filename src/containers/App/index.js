import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as DataActions from "../../actions/DataActions";
import "./styles.css";
import EqualityRow from "../../components/App/EqualityRow";

class App extends Component {
  handleAddEquality = () => {
    this.props.addEquality();
  };

  handleEqualityChange = (id, value) => {
    this.props.updateEquality(id, value);
  };

  handleEqualityDelete = id => {
    this.props.deleteEquality(id);
  };

  handleSolveClick = () => {
    this.props.solve();
  };

  render() {
    const { equalities, error } = this.props;
    return (
      <div className="equality-rows">
        {equalities.map(e => (
          <EqualityRow
            key={e.id}
            value={e.value}
            id={e.id}
            inputChange={this.handleEqualityChange}
            deleteEquality={this.handleEqualityDelete}
          />
        ))}
        <div>
          {error}
        </div>
        <div className="action-btns">
          <button onClick={this.handleAddEquality}>Додати рівняння</button>
          <button onClick={this.handleSolveClick}>Розв'язати</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { equalities, error } = state.data;
  return {
    equalities,
    error
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...DataActions
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
