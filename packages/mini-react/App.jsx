/**@jsx CReact.createElement */
import CReact, { update } from "./core/react.js";

const Child = () => {
  return (
    <div>
      child
      <p>child1</p>
      <p>child2</p>
      <p>child3</p>
    </div>
  );
};

let showBar = true;
const bar = <div>bar</div>;
const foo = (
  <div>
    foo
    <p>child1</p>
    <p>child2</p>
    <p>child3</p>
  </div>
);
const Counter = ({ num }) => {
  return <div>{showBar && bar}</div>;
};

const App = () => (
  <div className="red">
    <h1>mini-react</h1>
    <input placeholder="mini-react" />
    {showBar && bar}
    <button
      onClick={() => {
        console.log("leo");
        showBar = !showBar;
        update();
      }}
    >
      add
    </button>
  </div>
);

export default App;
