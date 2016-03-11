import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import todoApp from './reducers'

const store = createStore(todoApp);
 

/* it's not clear from the lesson 
** as to why FilterLink was defined as a function and not a React Component.
** Dan describes this as a "Functional Component" in his lesson.
** In later lessons, some components will become 
** Presentational, i.e fall under components folder , 
** and others will be more 
** Behavioral , i.e fall under containers folder. 
** Bahavioral containers will be more responsible for dispatching 
** actions, etc where as Presentational are more for the UI and 
** are just given the information they need to render.
** https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.g3wkr5d0b
**
** Filter -> 
** Also, Note the filter and children are passed in using the 
** destructuring syntax in javascript. More on that here -
** https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
** 
** Hence from the UI, the filter value gets passed in almost like 
** how props are passed, but we don't specify proptypes or anything in the 
** FilterLink
** 
** Children -> 
** These are the text that's passed in
*/
const FilterLink = ({
  filter, 
  currentFilter,
  children
}) => {
  if(filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        });
      }}
    >
    {children}
    </a>
  )
}

/*
** NOTE: the following is just a utility function, 
** versus a functional component such as FilterLink
** I am stating the obvious here but this is so 
** as to just bring your attention to the little details 
** because with similarities in syntax, the difference 
** in purpose is sometimes not obvious.
*/

const getVisibleTodos = (
  todos, 
  filter
  ) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_COMPLETED':
        return todos.filter( t => t.completed);
      case 'SHOW_ACTIVE':
        return todos.filter( t => !t.completed);
      default:
        return todos;
    }
}

/*
** Note that below, there is no constructor call 
** from within the component. 
*/

let nextTodoId = 0;
class TodoApp extends Component {
  render() {
    /*
    ** Destructure the todos and visibility filter from the props
    ** to it can be used directly as todos and visibility filter
    ** instead ot this.props.todos and this.props.visibilityFilter
    */
    const {
      todos, 
      visibilityFilter
    } = this.props;

    const visibleTodos = getVisibleTodos(
      todos,
      visibilityFilter
    );

    return (
      <div>
      	<input ref={node => {
      		this.input = node;
      	}} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          }); 
          this.input.value = '';
        }}>
        Add Todo 
        </button>
        <ul>
        	{visibleTodos.map(todo => 
        		<li key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                });
                }} 
                style={{ 
                  textDecoration:
                    todo.completed ?
                      'line-through':
                      'none'
                }}>
        			{todo.text}
        		</li>
        	)}
        </ul>
        <p>
          Show:
          {' '}
          <FilterLink
            filter='SHOW_ALL'
            currentFilter = {visibilityFilter}
          >
          All 
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_ACTIVE'
            currentFilter = {visibilityFilter}
          >
          Active
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_COMPLETED'
            currentFilter = {visibilityFilter}
          >
          Completed
          </FilterLink>
          </p>
      </div>
    );
  }
}

/*
** the todos could have been passed as a prop and 
** same for filter, but its easier to
** the state as a spread over all the state fields
** Every state field is passed as a prop to the TodoApp component
*/ 
const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()}/>,
    document.getElementById('root')
  );
}

render()
store.subscribe(render)
