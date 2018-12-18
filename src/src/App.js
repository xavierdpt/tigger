import React, { Component } from 'react';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { put, all, call, takeLatest} from 'redux-saga/effects'
import './App.css';

const getData = () => fetch("https://xavierdpt.github.io/data/data.js").then(
  response => response.json().then(
    data => data
  )
).catch(
  error => { throw error; }
);

function* fetchData(action) {
   try {
      const data = yield call(getData)
      yield put({type: "DATA", data})
   } catch (error) {
      yield put({type: "DATA_FAILED", error})
   }
}

function* watchFetchData() {
  yield takeLatest('DATA_REQUESTED', fetchData)
}

function* rootSaga() {
  yield all([
	watchFetchData()
  ])
}

function reducer(state = null, action) {
  switch (action.type) {
    case 'DATA':
      return action.data;
    default:
      return state
  }
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
   reducer,
   applyMiddleware(sagaMiddleware),
);


sagaMiddleware.run(rootSaga);

const action = type => store.dispatch({type})

class App extends Component {
	constructor(props) {
		super(props);
		this.foo = ()=>{
			
		}
	}
  render() {
	const {data, onFoo} = this.props;
    return (
      <div>
		<div>Tigger</div>
		<div><button onClick={onFoo}>Get Data</button></div>
		{data?<div>{Object.keys(data.books).length} books</div>:<div>No data</div>}
	</div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state
})

const mapDispatchToProps = dispatch => {
  return {
    onFoo: () => action('DATA_REQUESTED')
  }
}

const AppC = connect(mapStateToProps,mapDispatchToProps)(App)

class AppR extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppC />
      </Provider>
    );
  }
}

export default AppR;
